import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface CSVRow {
  timestamp: string;
  emailAddress: string;
  nomeCompletoPaciente: string;
  particularOuConvenio: string;
  presenca: string;
  dataAtendimento: string;
  nomeMaeOuAcompanhante: string;
  cpf: string;
  email: string;
  contato: string;
  dataAniversario: string;
  valorAtendimento: string;
  atendimentoNumero: string;
  profissional: string;
  horaAtendimento: string;
  tempoAtendimento: string;
  avaliacaoPaciente: string;
  evolucaoPaciente: string;
  dispensacao: string;
  houveIntercorrencia: string;
  intercorrencia: string;
  score: string;
}

// Função para parsear CSV (simplificada)
function parseCSV(content: string): CSVRow[] {
  const lines = content.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parsear CSV considerando campos com vírgulas dentro de aspas
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length >= headers.length) {
      rows.push({
        timestamp: values[0] || "",
        emailAddress: values[1] || "",
        nomeCompletoPaciente: values[2] || "",
        particularOuConvenio: values[3] || "",
        presenca: values[4] || "",
        dataAtendimento: values[5] || "",
        nomeMaeOuAcompanhante: values[6] || "",
        cpf: values[7] || "",
        email: values[8] || "",
        contato: values[9] || "",
        dataAniversario: values[10] || "",
        valorAtendimento: values[11] || "",
        atendimentoNumero: values[12] || "",
        profissional: values[13] || "",
        horaAtendimento: values[14] || "",
        tempoAtendimento: values[15] || "",
        avaliacaoPaciente: values[16] || "",
        evolucaoPaciente: values[17] || "",
        dispensacao: values[18] || "",
        houveIntercorrencia: values[19] || "",
        intercorrencia: values[20] || "",
        score: values[21] || "",
      });
    }
  }

  return rows;
}

// Função para normalizar nomes (remover espaços extras, capitalizar)
function normalizeName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Função para converter data do formato brasileiro para ISO
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  
  // Formato: 2/17/0025 ou 2/17/2025
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  
  let month = parseInt(parts[0], 10);
  let day = parseInt(parts[1], 10);
  let year = parseInt(parts[2], 10);
  
  // Corrigir ano se for 0025 (provavelmente 2025)
  if (year < 100) {
    year = 2000 + year;
  }
  
  // Validar
  if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Função para converter hora do formato 12h para 24h
function parseTime(timeStr: string): string | null {
  if (!timeStr) return null;
  
  // Formato: "3:00:00 PM" ou "11:00 AM"
  const match = timeStr.match(/(\d+):(\d+)(?::(\d+))?\s*(AM|PM)/i);
  if (!match) return null;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = match[3] ? parseInt(match[3], 10) : 0;
  const ampm = match[4].toUpperCase();
  
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Função para converter tempo de atendimento para minutos
function parseDuration(durationStr: string): number {
  if (!durationStr) return 30; // Default
  
  // Formato: "2 horas", "1 hora", "1hora e 30 minutos"
  const hourMatch = durationStr.match(/(\d+)\s*hora/i);
  const minuteMatch = durationStr.match(/(\d+)\s*minuto/i);
  
  let hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  let minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  
  // Se não encontrou, tentar formato "1h30min"
  if (!hourMatch && !minuteMatch) {
    const simpleMatch = durationStr.match(/(\d+)/);
    if (simpleMatch) {
      const num = parseInt(simpleMatch[1], 10);
      if (durationStr.toLowerCase().includes("hora")) {
        hours = num;
      } else {
        minutes = num;
      }
    }
  }
  
  return hours * 60 + minutes || 30;
}

// Função para converter valor de "100,00" para centavos
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  
  // Remover espaços e converter vírgula para ponto
  const cleaned = priceStr.replace(/\s/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  
  return isNaN(value) ? 0 : Math.round(value * 100);
}

// Função para mapear convênio
function mapInsurance(convenio: string): string {
  const normalized = convenio.trim().toLowerCase();
  
  if (normalized.includes("santa casa")) return "santa_casa_saude";
  if (normalized.includes("maternar")) return "outros"; // Maternar não está no enum
  if (normalized.includes("particular")) return "particular";
  
  return "outros";
}

// Função para mapear presença
function mapPresence(presenca: string): { attended: boolean; justification: string | null } {
  const normalized = presenca.trim().toUpperCase();
  
  if (normalized === "SIM") {
    return { attended: true, justification: null };
  } else if (normalized === "JUSTIFICADO" || normalized.includes("JUSTIFIC")) {
    return { attended: false, justification: "Falta justificada" };
  } else {
    return { attended: false, justification: null };
  }

}

// Função para gerar código único
function generateCode(prefix: string, index: number): string {
  return `${prefix}${String(index).padStart(4, "0")}`;
}

// Função para escapar strings SQL
function escapeSQL(str: string | null | undefined): string {
  if (!str) return "NULL";
  return `'${str.replace(/'/g, "''")}'`;
}

async function generateScripts() {
  const csvPath = "/Users/hugo/Downloads/Hugo of Plenoser Terapias - Evolução (Responses) - Form Responses 1.csv";
  const content = readFileSync(csvPath, "utf-8");
  const rows = parseCSV(content);

  console.log(`📊 Processando ${rows.length} registros...`);

  // Extrair profissionais únicos
  const profissionaisUnicos = new Map<string, { nome: string; email: string }>();
  rows.forEach((row) => {
    if (row.profissional && !profissionaisUnicos.has(row.profissional.trim())) {
      profissionaisUnicos.set(row.profissional.trim(), {
        nome: normalizeName(row.profissional.trim()),
        email: row.emailAddress || "",
      });
    }
  });

  // Extrair pacientes únicos
  const pacientesUnicos = new Map<string, CSVRow>();
  rows.forEach((row) => {
    const nomeNormalizado = normalizeName(row.nomeCompletoPaciente.trim());
    if (nomeNormalizado && !pacientesUnicos.has(nomeNormalizado)) {
      pacientesUnicos.set(nomeNormalizado, row);
    }
  });

  console.log(`👨‍⚕️ Profissionais únicos: ${profissionaisUnicos.size}`);
  console.log(`👤 Pacientes únicos: ${pacientesUnicos.size}`);
  console.log(`📅 Agendamentos: ${rows.length}`);

  // Variáveis para IDs (serão substituídos manualmente ou via query)
  const CLINIC_ID = "'CLINIC_ID_AQUI'"; // Substituir pelo ID real da clínica
  const USER_ID = "'USER_ID_AQUI'"; // Substituir pelo ID do usuário que está importando

  // ========== SCRIPT 1: PROFISSIONAIS ==========
  let doctorsSQL = `-- Script de importação de Profissionais
-- IMPORTANTE: Substituir CLINIC_ID_AQUI pelo UUID real da clínica
-- IMPORTANTE: Substituir USER_ID_AQUI pelo ID do usuário que está importando

-- Inserir profissionais únicos
`;

  const doctorMap = new Map<string, string>(); // nome -> uuid
  let doctorIndex = 1;

  profissionaisUnicos.forEach((prof, nomeOriginal) => {
    const doctorId = `gen_random_uuid()`;
    const doctorCode = generateCode("DOC", doctorIndex);
    const specialty = "Terapia Ocupacional"; // Assumindo que todos são TO baseado nos dados
    
    doctorsSQL += `INSERT INTO "doctors" (
  "id",
  "name",
  "specialty",
  "phone_number",
  "email",
  "doctor_code",
  "class_number_register",
  "class_number_type",
  "available_from_week_day",
  "available_to_week_day",
  "available_from_time",
  "available_to_time",
  "compensation_type",
  "clinic_id",
  "created_by",
  "created_at",
  "updated_at"
) VALUES (
  ${doctorId},
  ${escapeSQL(prof.nome)},
  ${escapeSQL(specialty)},
  ${escapeSQL("(12) 00000-0000")}, -- Telefone padrão, atualizar depois
  ${escapeSQL(prof.email || `${prof.nome.toLowerCase().replace(/\s+/g, ".")}@clinixflow.com.br`)},
  ${escapeSQL(doctorCode)},
  ${escapeSQL("000000")}, -- CRFa padrão, atualizar depois
  ${escapeSQL("CRFa")},
  1, -- Segunda-feira
  5, -- Sexta-feira
  '07:00:00',
  '18:00:00',
  'percentage',
  ${CLINIC_ID},
  ${USER_ID},
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

`;

    doctorMap.set(nomeOriginal, doctorId);
    doctorIndex++;
  });

  // ========== SCRIPT 2: PACIENTES ==========
  let patientsSQL = `-- Script de importação de Pacientes
-- IMPORTANTE: Substituir CLINIC_ID_AQUI pelo UUID real da clínica
-- IMPORTANTE: Substituir USER_ID_AQUI pelo ID do usuário que está importando
-- IMPORTANTE: Este script deve ser executado DEPOIS do script de profissionais

-- Inserir pacientes únicos
`;

  const patientMap = new Map<string, string>(); // nome -> uuid
  let patientIndex = 1;
  let patientRecordNumber = 1;

  pacientesUnicos.forEach((row, nomeNormalizado) => {
    const patientId = `gen_random_uuid()`;
    const patientCode = generateCode("PAC", patientIndex);
    const insurance = mapInsurance(row.particularOuConvenio || "outros");
    const birthDate = parseDate(row.dataAniversario) || "2000-01-01";
    
    patientsSQL += `INSERT INTO "patients" (
  "id",
  "name",
  "email",
  "patient_code",
  "phone_number",
  "is_whatsapp",
  "sex",
  "birth_date",
  "mother_name",
  "father_name",
  "responsible_name",
  "responsible_contact",
  "insurance",
  "insurance_card",
  "rg",
  "cpf",
  "zip_code",
  "address",
  "number",
  "complement",
  "neighborhood",
  "city",
  "state",
  "is_active",
  "patient_record_number",
  "clinic_id",
  "created_by",
  "created_at",
  "updated_at"
) VALUES (
  ${patientId},
  ${escapeSQL(nomeNormalizado)},
  ${escapeSQL(row.email || `${nomeNormalizado.toLowerCase().replace(/\s+/g, ".")}@paciente.com`)},
  ${escapeSQL(patientCode)},
  ${escapeSQL(row.contato || "(12) 00000-0000")},
  true,
  'male', -- Assumindo masculino, ajustar se necessário
  ${escapeSQL(birthDate)},
  ${escapeSQL(row.nomeMaeOuAcompanhante || "Não informado")},
  ${escapeSQL("Não informado")},
  ${escapeSQL(row.nomeMaeOuAcompanhante || "Não informado")},
  ${escapeSQL(row.contato || "(12) 00000-0000")},
  ${escapeSQL(insurance)},
  ${escapeSQL("000000")}, -- Número do convênio padrão
  ${escapeSQL("000000000")}, -- RG padrão
  ${escapeSQL(row.cpf || "00000000000")},
  ${escapeSQL("00000-000")}, -- CEP padrão
  ${escapeSQL("Endereço não informado")},
  ${escapeSQL("0")},
  ${escapeSQL("")},
  ${escapeSQL("Centro")},
  ${escapeSQL("São José dos Campos")},
  ${escapeSQL("SP")},
  true,
  ${patientRecordNumber},
  ${CLINIC_ID},
  ${USER_ID},
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

`;

    patientMap.set(nomeNormalizado, patientId);
    patientIndex++;
    patientRecordNumber++;
  });

  // ========== SCRIPT 3: AGENDAMENTOS ==========
  let appointmentsSQL = `-- Script de importação de Agendamentos
-- IMPORTANTE: Substituir CLINIC_ID_AQUI pelo UUID real da clínica
-- IMPORTANTE: Substituir USER_ID_AQUI pelo ID do usuário que está importando
-- IMPORTANTE: Este script deve ser executado DEPOIS dos scripts de profissionais e pacientes
-- NOTA: Os IDs de profissionais e pacientes serão resolvidos via subquery baseado no nome

-- Inserir agendamentos
`;

  rows.forEach((row, index) => {
    const nomePaciente = normalizeName(row.nomeCompletoPaciente.trim());
    const nomeProfissional = row.profissional.trim();
    const dataAtendimento = parseDate(row.dataAtendimento);
    const horaAtendimento = parseTime(row.horaAtendimento);
    
    if (!dataAtendimento || !nomePaciente || !nomeProfissional) {
      console.warn(`⚠️ Linha ${index + 2} ignorada: dados incompletos`);
      return;
    }

    const appointmentDateTime = horaAtendimento 
      ? `${dataAtendimento} ${horaAtendimento}`
      : `${dataAtendimento} 08:00:00`;
    
    const duration = parseDuration(row.tempoAtendimento);
    const price = parsePrice(row.valorAtendimento);
    const { attended, justification } = mapPresence(row.presenca);
    
    appointmentsSQL += `INSERT INTO "appointments" (
  "id",
  "appointment_price_in_cents",
  "patient_id",
  "doctor_id",
  "clinic_id",
  "date",
  "duration_in_minutes",
  "confirmed",
  "attended",
  "attendance_justification",
  "created_by",
  "created_at",
  "updated_at"
) VALUES (
  gen_random_uuid(),
  ${price},
  (SELECT "id" FROM "patients" WHERE "name" = ${escapeSQL(nomePaciente)} AND "clinic_id" = ${CLINIC_ID} LIMIT 1),
  (SELECT "id" FROM "doctors" WHERE "name" = ${escapeSQL(nomeProfissional)} AND "clinic_id" = ${CLINIC_ID} LIMIT 1),
  ${CLINIC_ID},
  ${escapeSQL(appointmentDateTime)}::timestamp,
  ${duration},
  ${attended},
  ${attended},
  ${escapeSQL(justification)},
  ${USER_ID},
  ${escapeSQL(appointmentDateTime)}::timestamp,
  ${escapeSQL(appointmentDateTime)}::timestamp
);

`;
  });

  // ========== SCRIPT 4: EVOLUÇÕES ==========
  let evolutionsSQL = `-- Script de importação de Evoluções (Patient Records)
-- IMPORTANTE: Substituir CLINIC_ID_AQUI pelo UUID real da clínica
-- IMPORTANTE: Substituir USER_ID_AQUI pelo ID do usuário que está importando
-- IMPORTANTE: Este script deve ser executado DEPOIS dos scripts anteriores
-- NOTA: Os IDs serão resolvidos via subquery baseado no nome e data

-- Inserir evoluções
`;

  rows.forEach((row, index) => {
    const nomePaciente = normalizeName(row.nomeCompletoPaciente.trim());
    const nomeProfissional = row.profissional.trim();
    const dataAtendimento = parseDate(row.dataAtendimento);
    
    if (!dataAtendimento || !nomePaciente || !nomeProfissional) {
      return;
    }

    const { attended } = mapPresence(row.presenca);
    
    // Só criar evolução se o paciente compareceu (attended = true)
    if (!attended) {
      return;
    }

    const avaliacao = row.avaliacaoPaciente || "";
    const evolucao = row.evolucaoPaciente || "";
    const content = evolucao || avaliacao || "Evolução registrada";
    
    // Determinar se é primeira consulta (verificar se há evolução anterior)
    const isFirstConsultation = index === 0 || !rows.slice(0, index).some(
      (r) => normalizeName(r.nomeCompletoPaciente.trim()) === nomePaciente
    );

    evolutionsSQL += `INSERT INTO "patient_records" (
  "patient_id",
  "doctor_id",
  "clinic_id",
  "appointment_id",
  "first_consultation",
  "avaliation_content",
  "content",
  "created_by",
  "created_at",
  "updated_at"
) VALUES (
  (SELECT "id" FROM "patients" WHERE "name" = ${escapeSQL(nomePaciente)} AND "clinic_id" = ${CLINIC_ID} LIMIT 1),
  (SELECT "id" FROM "doctors" WHERE "name" = ${escapeSQL(nomeProfissional)} AND "clinic_id" = ${CLINIC_ID} LIMIT 1),
  ${CLINIC_ID},
  (
    SELECT "id" FROM "appointments" 
    WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = ${escapeSQL(nomePaciente)} AND "clinic_id" = ${CLINIC_ID} LIMIT 1)
      AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = ${escapeSQL(nomeProfissional)} AND "clinic_id" = ${CLINIC_ID} LIMIT 1)
      AND DATE("date") = ${escapeSQL(dataAtendimento)}::date
    LIMIT 1
  ),
  ${isFirstConsultation},
  ${escapeSQL(avaliacao)},
  ${escapeSQL(content)},
  ${USER_ID},
  NOW(),
  NOW()
);

`;
  });

  // Salvar scripts
  const scriptsDir = join(process.cwd(), "scripts", "import-data");
  
  writeFileSync(join(scriptsDir, "01_import_doctors.sql"), doctorsSQL);
  writeFileSync(join(scriptsDir, "02_import_patients.sql"), patientsSQL);
  writeFileSync(join(scriptsDir, "03_import_appointments.sql"), appointmentsSQL);
  writeFileSync(join(scriptsDir, "04_import_patient_records.sql"), evolutionsSQL);

  console.log("\n✅ Scripts SQL gerados com sucesso!");
  console.log(`📁 Localização: ${scriptsDir}`);
  console.log("\n📋 Ordem de execução:");
  console.log("   1. 01_import_doctors.sql");
  console.log("   2. 02_import_patients.sql");
  console.log("   3. 03_import_appointments.sql");
  console.log("   4. 04_import_patient_records.sql");
  console.log("\n⚠️  IMPORTANTE: Substituir CLINIC_ID_AQUI e USER_ID_AQUI nos scripts antes de executar!");
}

generateScripts().catch(console.error);
