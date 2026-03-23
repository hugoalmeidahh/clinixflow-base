#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para gerar scripts SQL de importação de dados do CSV
Gera 4 arquivos separados:
1. 01_import_doctors.sql - Profissionais únicos
2. 02_import_patients.sql - Pacientes únicos
3. 03_import_appointments.sql - Agendamentos
4. 04_import_patient_records.sql - Evoluções

MELHORIAS:
- Usa INSERT com múltiplos VALUES (mais eficiente)
- Formatação melhorada (campos em uma linha, VALUES em outra)
- Merge automático de pacientes duplicados
"""

import csv
import re
from collections import OrderedDict, defaultdict
from datetime import datetime

CSV_PATH = "/Users/hugo/Downloads/Hugo of Plenoser Terapias - Evolução (Responses) - Form Responses 1.csv"
OUTPUT_DIR = "scripts/import-data"

def normalize_name(name):
    """Normaliza nome: remove espaços extras e capitaliza"""
    if not name:
        return ""
    return " ".join(word.capitalize() for word in name.strip().split())

def normalize_for_comparison(name):
    """Normaliza nome para comparação (remove acentos, lowercase)"""
    if not name:
        return ""
    name = name.lower().strip()
    name = " ".join(name.split())
    # Normalizar acentos básicos (simplificado)
    replacements = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a',
        'é': 'e', 'ê': 'e',
        'í': 'i',
        'ó': 'o', 'ô': 'o', 'õ': 'o',
        'ú': 'u',
        'ç': 'c'
    }
    for old, new in replacements.items():
        name = name.replace(old, new)
    return name

def extract_base_name(name):
    """Extrai nome base (primeiro nome + sobrenome)"""
    parts = name.split()
    if len(parts) >= 2:
        return f"{parts[0]} {parts[-1]}"
    return parts[0] if parts else ""

def choose_best_name(variations):
    """Escolhe o nome mais completo de uma lista de variações"""
    # Filtrar nomes com problemas (parênteses, textos estranhos)
    def is_valid_name(name):
        name_lower = name.lower()
        # Rejeitar nomes com parênteses, "sem nome", etc
        invalid_patterns = ['(', ')', 'sem nome', 'estou sem', 'não sei']
        return not any(pattern in name_lower for pattern in invalid_patterns)
    
    valid_variations = [v for v in variations if is_valid_name(v)]
    if not valid_variations:
        valid_variations = list(variations)
    
    # Ordenar por: mais completo (mais palavras) > mais capitalizado > alfabético
    def score(name):
        words = len(name.split())
        capitalized = sum(1 for c in name if c.isupper())
        # Penalizar nomes muito curtos (menos de 2 palavras)
        length_penalty = 0 if words >= 2 else -10
        return (length_penalty, words, capitalized, name)
    
    return max(valid_variations, key=score)

def parse_date(date_str):
    """Converte data do formato brasileiro para ISO"""
    if not date_str:
        return None
    
    try:
        parts = date_str.split("/")
        if len(parts) != 3:
            return None
        
        month = int(parts[0])
        day = int(parts[1])
        year = int(parts[2])
        
        if year < 100:
            year = 2000 + year
        
        return f"{year}-{month:02d}-{day:02d}"
    except:
        return None

def parse_time(time_str):
    """Converte hora do formato 12h para 24h"""
    if not time_str:
        return None
    
    match = re.match(r'(\d+):(\d+)(?::(\d+))?\s*(AM|PM)', time_str, re.IGNORECASE)
    if not match:
        return None
    
    hours = int(match.group(1))
    minutes = int(match.group(2))
    seconds = int(match.group(3)) if match.group(3) else 0
    ampm = match.group(4).upper()
    
    if ampm == "PM" and hours != 12:
        hours += 12
    if ampm == "AM" and hours == 12:
        hours = 0
    
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

def parse_duration(duration_str):
    """Converte tempo de atendimento para minutos"""
    if not duration_str:
        return 30
    
    hour_match = re.search(r'(\d+)\s*hora', duration_str, re.IGNORECASE)
    minute_match = re.search(r'(\d+)\s*minuto', duration_str, re.IGNORECASE)
    
    hours = int(hour_match.group(1)) if hour_match else 0
    minutes = int(minute_match.group(1)) if minute_match else 0
    
    if not hour_match and not minute_match:
        num_match = re.search(r'(\d+)', duration_str)
        if num_match:
            num = int(num_match.group(1))
            if "hora" in duration_str.lower():
                hours = num
            else:
                minutes = num
    
    return hours * 60 + minutes if (hours or minutes) else 30

def parse_price(price_str):
    """Converte valor de "100,00" para centavos"""
    if not price_str:
        return 0
    
    cleaned = price_str.replace(" ", "").replace(",", ".").replace("R$", "").strip()
    try:
        value = float(cleaned)
        return int(value * 100)
    except:
        return 0

def map_insurance(convenio):
    """Mapeia convênio para enum do banco"""
    if not convenio:
        return "outros"
    
    normalized = convenio.strip().lower()
    
    if "santa casa" in normalized:
        return "santa_casa_saude"
    if "maternar" in normalized:
        return "outros"
    if "particular" in normalized:
        return "particular"
    if "bradesco" in normalized:
        return "bradesco_saude"
    
    return "outros"

def map_presence(presenca):
    """Mapeia presença para attended e justification"""
    if not presenca:
        return (False, None)
    
    normalized = presenca.strip().upper()
    
    if normalized == "SIM":
        return (True, None)
    elif "JUSTIFICADO" in normalized or "JUSTIFIC" in normalized:
        return (False, "Falta justificada")
    else:
        return (False, None)

def escape_sql(value):
    """Escapa strings para SQL"""
    if value is None or value == "":
        return "NULL"
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"

def generate_code(prefix, index):
    """Gera código único"""
    return f"{prefix}{index:04d}"

# Ler CSV
print("📊 Lendo CSV...")
with open(CSV_PATH, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"✅ {len(rows)} registros lidos")

# ========== IDENTIFICAR E MERGER PACIENTES DUPLICADOS ==========
print("\n🔍 Identificando pacientes duplicados...")

# Agrupar por primeiro nome (mais flexível para detectar duplicatas)
pacientes_por_primeiro = defaultdict(set)
paciente_rows = {}

for row in rows:
    nome_original = row.get('Nome Completo Paciente', '').strip()
    if nome_original:
        nome_normalizado = normalize_name(nome_original)
        nome_comparacao = normalize_for_comparison(nome_original)
        
        # Extrair primeiro nome
        primeiro_nome = nome_comparacao.split()[0] if nome_comparacao.split() else ""
        
        if primeiro_nome:
            pacientes_por_primeiro[primeiro_nome].add(nome_normalizado)
            # Guardar a row mais completa para cada variação
            if nome_normalizado not in paciente_rows:
                paciente_rows[nome_normalizado] = row
            else:
                # Se a nova row tem mais dados, usar ela
                old_row = paciente_rows[nome_normalizado]
                new_has_data = bool(row.get('CPF') or row.get('Email') or row.get('Contato'))
                old_has_data = bool(old_row.get('CPF') or old_row.get('Email') or old_row.get('Contato'))
                if new_has_data and not old_has_data:
                    paciente_rows[nome_normalizado] = row

# Criar mapa de merge (nome original -> nome escolhido)
merge_map = {}
pacientes_finais = OrderedDict()

for primeiro_nome, variacoes in pacientes_por_primeiro.items():
    if len(variacoes) > 1:
        # Escolher o nome mais completo
        nome_escolhido = choose_best_name(variacoes)
        print(f"   🔗 Merge ({primeiro_nome}): {', '.join(sorted(variacoes))} → {nome_escolhido}")
        
        # Mapear todas as variações para o nome escolhido
        for var in variacoes:
            merge_map[var] = nome_escolhido
            if nome_escolhido not in pacientes_finais:
                pacientes_finais[nome_escolhido] = paciente_rows.get(nome_escolhido, {})
    else:
        # Sem duplicatas, usar o nome direto
        nome = list(variacoes)[0]
        pacientes_finais[nome] = paciente_rows.get(nome, {})

print(f"\n✅ {len(pacientes_finais)} pacientes únicos após merge (antes: {len(paciente_rows)})")

# Extrair profissionais únicos
profissionais = OrderedDict()
for row in rows:
    prof = row.get('Profissional', '').strip()
    if prof and prof not in profissionais:
        email = row.get('Email Address', '').strip()
        profissionais[prof] = {
            'nome': normalize_name(prof),
            'email': email if email else f"{normalize_name(prof).lower().replace(' ', '.')}@clinixflow.com.br"
        }

print(f"👨‍⚕️ Profissionais únicos: {len(profissionais)}")
print(f"👤 Pacientes únicos: {len(pacientes_finais)}")
print(f"📅 Agendamentos: {len(rows)}")

# Variáveis para IDs
CLINIC_ID = "'CLINIC_ID_AQUI'"
USER_ID = "'USER_ID_AQUI'"

# ========== SCRIPT 1: PROFISSIONAIS ==========
print("\n📝 Gerando script de profissionais...")
doctors_sql = """-- Script de importação de Profissionais
-- IMPORTANTE: Substituir CLINIC_ID_AQUI pelo UUID real da clínica
-- IMPORTANTE: Substituir USER_ID_AQUI pelo ID do usuário que está importando

-- Inserir profissionais únicos
INSERT INTO "doctors" (
  "id", "name", "specialty", "phone_number", "email", "doctor_code",
  "class_number_register", "class_number_type", "cpf", "cnpj", "rg",
  "available_from_week_day", "available_to_week_day", "available_from_time",
  "available_to_time", "compensation_type", "clinic_id", "created_by",
  "created_at", "updated_at"
) VALUES
"""

doctor_values = []
doctor_index = 1

for nome_original, prof_data in profissionais.items():
    doctor_code = generate_code("DOC", doctor_index)
    specialty = "Terapia Ocupacional"
    
    doctor_values.append(f"""  (
    gen_random_uuid(),
    {escape_sql(prof_data['nome'])},
    {escape_sql(specialty)},
    {escape_sql("(12) 00000-0000")}, -- Telefone padrão, atualizar depois
    {escape_sql(prof_data['email'])},
    {escape_sql(doctor_code)},
    {escape_sql("000000")}, -- CRFa padrão, atualizar depois
    {escape_sql("CRFa")},
    NULL, -- CPF (atualizar depois)
    NULL, -- CNPJ (atualizar depois)
    NULL, -- RG (atualizar depois)
    1, -- Segunda-feira
    5, -- Sexta-feira
    '07:00:00',
    '18:00:00',
    'percentage',
    {CLINIC_ID},
    {USER_ID},
    NOW(),
    NOW()
  )""")
    doctor_index += 1

doctors_sql += ",\n".join(doctor_values)
doctors_sql += "\nON CONFLICT DO NOTHING;\n"

# ========== SCRIPT 2: PACIENTES ==========
print("📝 Gerando script de pacientes...")
patients_sql = """-- Script de importação de Pacientes
-- IMPORTANTE: Substituir CLINIC_ID_AQUI pelo UUID real da clínica
-- IMPORTANTE: Substituir USER_ID_AQUI pelo ID do usuário que está importando
-- IMPORTANTE: Este script deve ser executado DEPOIS do script de profissionais

-- Inserir pacientes únicos (duplicatas já foram mescladas)
INSERT INTO "patients" (
  "id", "name", "email", "patient_code", "phone_number", "is_whatsapp", "sex",
  "birth_date", "mother_name", "father_name", "responsible_name", "responsible_contact",
  "accompaniant_name", "accompaniant_relationship", "insurance", "insurance_card",
  "rg", "cpf", "zip_code", "address", "number", "complement", "neighborhood",
  "city", "state", "is_active", "patient_record_number", "clinic_id", "created_by",
  "created_at", "updated_at"
) VALUES
"""

patient_values = []
patient_index = 1
patient_record_number = 1

for nome_normalizado, row in pacientes_finais.items():
    patient_code = generate_code("PAC", patient_index)
    insurance = map_insurance(row.get('Particular ou Convênio? ', 'outros'))
    birth_date = parse_date(row.get('Data Aniversário', '')) or "2000-01-01"
    
    patient_values.append(f"""  (
    gen_random_uuid(),
    {escape_sql(nome_normalizado)},
    {escape_sql(row.get('Email', '') or f"{nome_normalizado.lower().replace(' ', '.')}@paciente.com")},
    {escape_sql(patient_code)},
    {escape_sql(row.get('Contato', '') or "(12) 00000-0000")},
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    {escape_sql(birth_date)},
    {escape_sql(row.get('Nome da Mãe ou Acompanhante', '') or "Não informado")},
    {escape_sql("Não informado")},
    {escape_sql(row.get('Nome da Mãe ou Acompanhante', '') or "Não informado")},
    {escape_sql(row.get('Contato', '') or "(12) 00000-0000")},
    {escape_sql(row.get('Nome da Mãe ou Acompanhante', '') or None)}, -- Nome do acompanhante
    {escape_sql(None)}, -- Grau de parentesco (preencher manualmente se necessário)
    {escape_sql(insurance)},
    {escape_sql("000000")}, -- Número do convênio padrão
    {escape_sql("000000000")}, -- RG padrão
    {escape_sql(row.get('CPF', '') or "00000000000")},
    {escape_sql("00000-000")}, -- CEP padrão
    {escape_sql("Endereço não informado")},
    {escape_sql("0")},
    {escape_sql("")},
    {escape_sql("Centro")},
    {escape_sql("São José dos Campos")},
    {escape_sql("SP")},
    true,
    {patient_record_number},
    {CLINIC_ID},
    {USER_ID},
    NOW(),
    NOW()
  )""")
    patient_index += 1
    patient_record_number += 1

patients_sql += ",\n".join(patient_values)
patients_sql += "\nON CONFLICT DO NOTHING;\n"

# ========== SCRIPT 3: AGENDAMENTOS ==========
print("📝 Gerando script de agendamentos...")
appointments_sql = """-- Script de importação de Agendamentos
-- IMPORTANTE: Substituir CLINIC_ID_AQUI pelo UUID real da clínica
-- IMPORTANTE: Substituir USER_ID_AQUI pelo ID do usuário que está importando
-- IMPORTANTE: Este script deve ser executado DEPOIS dos scripts de profissionais e pacientes
-- NOTA: Os IDs de profissionais e pacientes serão resolvidos via subquery baseado no nome

-- Inserir agendamentos
INSERT INTO "appointments" (
  "id", "appointment_price_in_cents", "patient_id", "doctor_id", "clinic_id",
  "date", "duration_in_minutes", "confirmed", "attended", "attendance_justification",
  "created_by", "created_at", "updated_at"
) VALUES
"""

appointment_values = []
for row in rows:
    nome_paciente_original = row.get('Nome Completo Paciente', '').strip()
    nome_paciente_normalizado = normalize_name(nome_paciente_original)
    
    # Aplicar merge se necessário
    nome_paciente_final = merge_map.get(nome_paciente_normalizado, nome_paciente_normalizado)
    
    nome_profissional = row.get('Profissional', '').strip()
    data_atendimento = parse_date(row.get('DATA DO ATENDIMENTO', ''))
    hora_atendimento = parse_time(row.get('HORA DO ATENDIMENTO ( TEMPO )', ''))
    
    if not data_atendimento or not nome_paciente_final or not nome_profissional:
        continue
    
    appointment_datetime = f"{data_atendimento} {hora_atendimento or '08:00:00'}"
    
    duration = parse_duration(row.get('Tempo de atendimento', ''))
    price = parse_price(row.get('Valor Atendimento', ''))
    attended, justification = map_presence(row.get('Presença', ''))
    
    appointment_values.append(f"""  (
    gen_random_uuid(),
    {price},
    (SELECT "id" FROM "patients" WHERE "name" = {escape_sql(nome_paciente_final)} AND "clinic_id" = {CLINIC_ID} LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = {escape_sql(nome_profissional)} AND "clinic_id" = {CLINIC_ID} LIMIT 1),
    {CLINIC_ID},
    {escape_sql(appointment_datetime)}::timestamp,
    {duration},
    {attended},
    {attended},
    {escape_sql(justification)},
    {USER_ID},
    {escape_sql(appointment_datetime)}::timestamp,
    {escape_sql(appointment_datetime)}::timestamp
  )""")

appointments_sql += ",\n".join(appointment_values)
appointments_sql += ";\n"

# ========== SCRIPT 4: EVOLUÇÕES ==========
print("📝 Gerando script de evoluções...")
evolutions_sql = """-- Script de importação de Evoluções (Patient Records)
-- IMPORTANTE: Substituir CLINIC_ID_AQUI pelo UUID real da clínica
-- IMPORTANTE: Substituir USER_ID_AQUI pelo ID do usuário que está importando
-- IMPORTANTE: Este script deve ser executado DEPOIS dos scripts anteriores
-- NOTA: Os IDs serão resolvidos via subquery baseado no nome e data

-- Inserir evoluções
INSERT INTO "patient_records" (
  "patient_id", "doctor_id", "clinic_id", "appointment_id", "first_consultation",
  "avaliation_content", "content", "created_by", "created_at", "updated_at"
) VALUES
"""

# Rastrear primeira consulta por paciente
paciente_primeira_consulta = {}
evolution_values = []

for idx, row in enumerate(rows):
    nome_paciente_original = row.get('Nome Completo Paciente', '').strip()
    nome_paciente_normalizado = normalize_name(nome_paciente_original)
    
    # Aplicar merge se necessário
    nome_paciente_final = merge_map.get(nome_paciente_normalizado, nome_paciente_normalizado)
    
    nome_profissional = row.get('Profissional', '').strip()
    data_atendimento = parse_date(row.get('DATA DO ATENDIMENTO', ''))
    
    if not data_atendimento or not nome_paciente_final or not nome_profissional:
        continue
    
    attended, _ = map_presence(row.get('Presença', ''))
    
    # Só criar evolução se o paciente compareceu
    if not attended:
        continue
    
    # Verificar se é primeira consulta
    if nome_paciente_final not in paciente_primeira_consulta:
        paciente_primeira_consulta[nome_paciente_final] = True
        is_first = True
    else:
        is_first = False
        paciente_primeira_consulta[nome_paciente_final] = False
    
    avaliacao = row.get('Avaliação do paciente', '').strip()
    evolucao = row.get('Evolução do paciente', '').strip()
    content = evolucao or avaliacao or "Evolução registrada"
    
    evolution_values.append(f"""  (
    (SELECT "id" FROM "patients" WHERE "name" = {escape_sql(nome_paciente_final)} AND "clinic_id" = {CLINIC_ID} LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = {escape_sql(nome_profissional)} AND "clinic_id" = {CLINIC_ID} LIMIT 1),
    {CLINIC_ID},
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = {escape_sql(nome_paciente_final)} AND "clinic_id" = {CLINIC_ID} LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = {escape_sql(nome_profissional)} AND "clinic_id" = {CLINIC_ID} LIMIT 1)
        AND DATE("date") = {escape_sql(data_atendimento)}::date
      LIMIT 1
    ),
    {is_first},
    {escape_sql(avaliacao)},
    {escape_sql(content)},
    {USER_ID},
    NOW(),
    NOW()
  )""")

evolutions_sql += ",\n".join(evolution_values)
evolutions_sql += ";\n"

# Salvar scripts
import os
os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(f"{OUTPUT_DIR}/01_import_doctors.sql", "w", encoding="utf-8") as f:
    f.write(doctors_sql)

with open(f"{OUTPUT_DIR}/02_import_patients.sql", "w", encoding="utf-8") as f:
    f.write(patients_sql)

with open(f"{OUTPUT_DIR}/03_import_appointments.sql", "w", encoding="utf-8") as f:
    f.write(appointments_sql)

with open(f"{OUTPUT_DIR}/04_import_patient_records.sql", "w", encoding="utf-8") as f:
    f.write(evolutions_sql)

# Salvar lista de merges
with open(f"{OUTPUT_DIR}/MERGE_REPORT.md", "w", encoding="utf-8") as f:
    f.write("# Relatório de Merge de Pacientes Duplicados\n\n")
    f.write("## Pacientes Mesclados\n\n")
    
    for primeiro_nome, variacoes in sorted(pacientes_por_primeiro.items()):
        if len(variacoes) > 1:
            nome_escolhido = choose_best_name(variacoes)
            f.write(f"### {nome_escolhido}\n\n")
            f.write(f"**Primeiro nome:** `{primeiro_nome}`\n\n")
            f.write(f"**Variações encontradas:**\n")
            for var in sorted(variacoes):
                f.write(f"- {var}\n")
            f.write(f"\n**Nome escolhido:** `{nome_escolhido}`\n\n")
            f.write("---\n\n")

print(f"\n✅ Scripts SQL gerados com sucesso!")
print(f"📁 Localização: {OUTPUT_DIR}")
print(f"📄 Relatório de merges: {OUTPUT_DIR}/MERGE_REPORT.md")
print("\n📋 Ordem de execução:")
print("   1. 01_import_doctors.sql")
print("   2. 02_import_patients.sql")
print("   3. 03_import_appointments.sql")
print("   4. 04_import_patient_records.sql")
print("\n⚠️  IMPORTANTE: Substituir CLINIC_ID_AQUI e USER_ID_AQUI nos scripts antes de executar!")
