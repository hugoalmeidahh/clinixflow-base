-- Script de importação de Evoluções (Patient Records)
-- IMPORTANTE: Substituir CLINIC_ID_AQUI pelo UUID real da clínica
-- IMPORTANTE: Substituir USER_ID_AQUI pelo ID do usuário que está importando
-- IMPORTANTE: Este script deve ser executado DEPOIS dos scripts anteriores
-- NOTA: Os IDs serão resolvidos via subquery baseado no nome e data

-- Inserir evoluções
INSERT INTO "patient_records" (
  "patient_id", "doctor_id", "clinic_id", "appointment_id", "first_consultation",
  "avaliation_content", "content", "created_by", "created_at", "updated_at"
) VALUES
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-17'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos motricidade fina , amplitude e força muscular dos MMSS, maior dificuldade maior no MSD',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina , escrita e cognição , relata sono devido a medicação anticonvulsivante, precisa de ajuda verbal e prática em alguns momentos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-07'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Avaliação com genitora Fábia',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-10'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos calendário , alfabeto ,  lógica com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-10'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos memória com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-12'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos integração sensorial e estimulaçao tátil com sucesso , precisou de ajuda verbal e prática',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Dificuldade no raciocínio abstrato , dificuldade na escrita e leitura , dificuldade com calendário e diálogo e socialização 
Trabalhamos calendário, escrita , pensamento lógico',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjämim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjämim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Solicitante , rigidez cognitiva , dificuldade em sustentar concentração , sorridente , imita algumas palavras , gosta de música e atende a algumas só licitações verbais . Recusa lycra .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-20'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos agilidade cognitiva e motricidade fina com
Sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos escrita , demonstra dificuldade, precisa de tempo para conseguir realizar a atividade, sugiro aumentar o tempo da sessão',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjämim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjämim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Insegurança gravitacional? Recusa balanço, fala algumas palavras , fez coco na fralda , afetivo s sorridente , trabalho coordenação motora global',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chegou 11h30 . Dificuldade de foco e atenção, oscila entre os estímulos , hiperfoco em interruptores',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-21'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos motricidade e reconhecimento de figuras e letras',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-21'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos reconhecimento de letras , motricidade fina , espera , diálogo , equilíbrio , encaixes com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Fizemos a roda da vida , Nathan mostra compreensão sobre a maioria das áreas da vida , verbaliza que sua família não quer que ele namore pois não trabalha, compartilha preocupações sobre estágio do curso técnico , realizou a atividade com apoio o verbal',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo, colaborativo, realizou bem atividade de competição porém
Com dificuldades na escrita, leitura , socialização e matemática , retomamos cálculos básicos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-26'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Mais agitado , dificuldade para concentrar se, busca sensorial . Dificuldade na atividade cognitiva precisando de ajuda verbal e prática',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos cognição, formação de palavras , demi sarou dificuldade ao soletrar e jogar forca , regere estar cansado e cumprindo sua rotina e continuaremos na próxima sessão',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Eather Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Eather Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-02'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos estimulação sensorial : tátil, vestibular e auditiva. Trabalhamos acham-se cognição , reconhecimento tátil',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Mãe relata resistência para tomar banho . Trabalho na sessão. Maria afirma que toma banho tidos os dias, não assume e não dialoga sobre s dificuldade, trabalhamos estimação tátil e reformadores positivos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina e escrita , relata sono excessivo , dificuldade na agilidade do raciocínio',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos raciocínio e competição, entendeu bem as regras do jogo',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo, pouca fala, refere gostar de fazer quebra cabeça, trabalhamos subjetividade, criatividade, invenção',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Falante , mais impaciente , dificuldade jogar foco , busca sensorial, trabalhamos IS, foco e atenção',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos cognição, formação de palavras , demi sarou dificuldade ao soletrar e jogar forca , regere estar cansado e cumprindo sua rotina',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Reposição. Atividades cognitivas e numéricas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos pinça e motricidade fina . Relata sonolência e aparência dificuldade visual, falanos sobre reavaliação oftalmologica',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Eather Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Eather Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco, atenção, encaixes e criatividade com massinha , tem se curtição em.machucados , oriento pais sobre busca sensorial - observar',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividades voltadas a estimulação tátil, reconhecimento de texturas , formas e tamanhos, trabalhamos estimular auditiva, foco e atenção',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sonolenta , dificuldade no raciocínio lógico e para formar palavras com as letras , dificuldade na motricidade fina , lentidão global',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-07'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Chorosa , fala sobre as discussões dos filhos , trabalhamos sua percepção de si mesma e da sua vida , falamos de autoresponsabilidade, trabalhamos motricidade fina e forca muscular MMSS',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos logica , quebra cabeça e números: tabuada com.sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-07'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos letras , FOCO , Atencao suatentada , IS',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Queixa se de que não dorme bem a 2 noites e não sabe o motivo, queixa se das cobranças sa esposa , refere estar fazendo a rotina em casa , trabalhamos memoria e raciocínio lógico com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos jogo competitivo de raciocínio lógico',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos logica, formar palavras , memória e raciocínio',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memória, raciocínio abstrato e lógico, contagem , encaixes',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Converso com.filho aobre piora do quadro global e humor deprimido .
Sugestão:

- avaliação médica humor deprimido , apatia , sono constante e aumento de dificuldade motora 
- avaliação ds necessidade de suplementação 
- avaliação da possibilidade de psicoterapia
- uso de óleos essenciais para ajudar no ânimo 
- restabelecer rotina de atividades em casa : pintura , escrita , jogos , diálogos 
- reavaliação oftalmológica',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'I.S, estimulação tátil',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos uso de banheiro , fez coco , conseguiu limparam com ajuda verbal e prática. Trabalhamos logica e raciocínio com dificuldade, prolixa .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos estimulação tátil, IS, estimulação auditiva com grãos de feijão',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina , filho infoema que geriatra diminuiu a medicação devido ao sono excessivo',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa, deprimida, faço acolhimento , sugiro psicoterapia e aumento das sessões de TO . Evolução na perda de movimento e motricidade fina',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos temporalidade: meses, semanas , ontem , hoje e amanhã e memória com agilidade motora e visual',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Dificuldade de foco e atenção, aceitou IS, rigidez cognitiva',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Memória, encaixes lógicos, desafios',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou com genitora perfil sensorial e parte do portage online',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo, falamos sobre seus avanços, relata que sua mãe não reconhece seus avanços, falamos sobre expectativas, usamos jogos competitivos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco, atenção, raciocínio lógico., conce tração e habilidades intelectuais, trabalhamos tempos presente, passado e futuro',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos IS, foco e atenção com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos  reconhecimento de figuras , esterognosia , raciocínio lógico com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calma , algo sonolenta, trabalhamos percepção, organização, nomear objetos e encontrar objetos- nota se rigidez cognitiva com as regras',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memória e afeto diante de memórias passadas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo, alho apático, trabalhamos antes e depois , presente , passado e futuro , raciocínio lógico',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Mãe relata que nesse feriado ele a agrediu dr forma violenta e inesperada , na sessão esteve calmo e colaborativo , trabalhamos foco, atenção, habilidades básicas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memória com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos forca muscular MMSS, coordenação e escrita',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos estimulação auditiva, IS e tátil com.sucesso - fez atividade.para presentar a mãe devido a seu aniversário',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos avd - foi ao banheiro sozinha, serviu café sozinha , ansiosa, realizou atividade reconhce alfabeto , conseguiu fazer até o fim com suporte verbal',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Reposição do feriado- trabalhamos temporalidade, escrita e leitura , logica',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chegou de andador , caminho com lentidão, precisando ainda de suporte para sentar e levantar se . Realizamos atividades voltadas a pinça, formação muscular MMSS, coordenação motora fina',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa, deprimida , aumento salivação, dificuldade motora significativa aumentada nos MMSS, acolho, realizamos atividades voltadas ao bem estar e centramento',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos logica , temporalidade, raciocínio lógico e interpretação',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos agilidade pensamento - ação 
Memória, temporalidade com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Mais disperso e com pouca escuta, trabalhamos IS, foco, atenção, nomeação, esperar e atender a solicitações (com mais dificuldade hoje)',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memória, jogos cognitivos para formação de palavras',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos logica , demos continuidade ao trabalho de memória da semana passada com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pai solicitou diálogo por 20mn compartilhou situações do lar e do Matheus com seu Irmão Davi, falamos sobre a ansiedade e dificuldade de foco e atenção. No atendimento Matheus mostra instabilidade de humor : hora afetivo , hora indiferente e sem escuta . Dificuldade de foco e atenção. Oscila entre as atividades sem tempo de concentração efetivo para concluir as propostas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos autonomia e independência para a vida , organização doméstica, autocuidado, organização financeira',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos pinça, cognição e coordenação motora MMSS',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Reposição 
Trabalhamos foco e atenção + IS com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina e amplitude de movimento MMSS',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos raciocínio lógico, estratégia, trabalhamos subjetividade e lembranças , gostos e preferências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco e concentração fez um cartão para a mae de dia das maes , entregou a lembrança da plenoser a mãe. Baixa tolerância a frustração. Trabalhamos sistema vestibular .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memória afetiva , lembranças, histórias passadas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina , amplitude de movimento , estimulação tátil, formar palavras (cognicao)',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos cognição , formar palavras . Motricidade e coordenação motora MMSS, discurso deprimido , faço acolhimento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chegou atrasada , trabalhamos foco, atenção e equilíbrio, lateralidade, eu X outro , regras sociais',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos raciocínio lógico e encaixes com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos estimulação tátil, discriminação de formas , IS',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Fez coco durante a sessão e pediu para chamar a mãe para limpar , trabalhamos AVDs, limpou se sozinha , queixou de dor no joelho. Trabalhamos foco, atenção, dialogo (com dificuldade), logica',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Avisou no horário que não ia conseguir traze_la',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo, trabalhamos agilidade cognitiva e diálogos, introspectivo com dificuldade de manter diálogos abertos .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos temporalidade , noção espacial , formação de palavras',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Colaborativo , conseguiu fazer combinamos, ainda não forma palavras  com as letras , reconhece as letras , realizamos estimulação sensorial, sem intercorrencias',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Relata dificuldade em dormir e cansaço, pergunto da nova co sultão médica não sabe responder. Trabalhamos agilidade cognitiva e demonstrou alta cobrança sobre seu desempenho , alguma dificuldade na memorização de sequências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Falta',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos cognição, memória, queixa se de cansaço, falamos sobre bisneto , fala coerente',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco, atenção, IS, motricidade fina , raciocínio lógico (com dificuldade).',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Veio de andador , caminha lentamente e ainda algo insegura, realizou atividades para motricidade fina e agilidade manual porém queixou se e não conseguiu trabalhar escrita',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Mais controlada emocionalmente porém ainda trás questões familiares relacionada a dinheiro, refete cansaço de tudo , aumento do tremor, dificuldade na fala , melhor postura corporal da cabeça, responsivo, ativa dentro da sua possibilidade. Trabalhamos coordenação motora e ansiedade',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos logica , agilidade cognitiva , velocidade do pensamento com sucesso . Mãe pede para libera lo mais cedo devido a consulta médica de rotina , oriento a falar com o médico a respeito da coriza permanente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Afetivo, relata medo para dormir , queixou se de.sono, realizou a atividade , conseguiu concentrar se . Trabalhamos também IS.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Não fez a atividade deixada para casa , disse que esqueceu , relata estar dormindo melhor e está animado para a viagem com a filha para ver baleias em Ilha Bela . Queixa se de cansaço, realizou a atividade com pouco ajuda para memória',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Natham Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Natham Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-21'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Fala que pensa em fazer outro curso técnico ou faculdade, pesquisamos escolas e possibilidades, trabalhamos agilidade visomotora',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memória, escrita e cognição com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco, atenção , reconhecimento de figuras e agilidade viso motora com logica',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Queixa de dor de garganta e resfriado , trabalhamos agilidade visomotora com sucesso , competicao logica com estratégia',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina , reconhecimento  tátil, IS, pular, coordenação motora',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos formação de palavras com letras , motricidade fina e coordenação viso motora',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos pinça e escrita',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos agilidade viso motora , logica e raciocínio, competitividade',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos competitividade , trabalhamos rigidez cognitiva e IS',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos agilidade visomotora, raciocínio lógico, não soube dizer porque faltou nas últimas 2 sessões',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos forca muscular , motricidade via, coordenação visomotora, foco, atenção e cognição, além de escrita',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos encaixes lógicos, IS, foco e atenção',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco, atenção, organização na execução de uma tarefa , atenção sustentada e motricidade fina com.sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos logica , raciocínio, organização, montagem , contas , foco, atenção e auto expressão',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Afetivo, trabalhamos foco, atenção, competitividade nas atividades, rigidez cognitiva e estimulação tátil e vestibular . Sem intercorrencia',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos logica , organização, sequencias e memória',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Eugenia Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Eugenia Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-12'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos pinça, motricidade, coordenação visomotora, coordenação moroso fina e grossa , preensão e escrita',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chega atrasada , mãe afastou se do trabalho por questões emocionais , Esther chega sonolenta, mãe relata que queria dormir mais . Permaneceu lenta durante toda sessão, conseguiu realizar apenas 2 atividades de estimulação tátil e auditiva com ajuda , lançou bolachas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-03'::date
      LIMIT 1
    ),
    False,
    'Feita',
    'Realizamos estimulaçao multissensorial , demonstra evolução na sensibilidade auditiva , aceita bem estímulos vestibulares e proprioceptivos. Verbaliza medo de planta . Estamos trabalhando estimulaçao tátil , sem intercorrências, calma , sorridente',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-03'::date
      LIMIT 1
    ),
    True,
    'TOD , TDah em investigação com comportamento agressivo',
    'Avaliação com Carol Sexta - 07/02 11h
Realizei avaliação para santa casa - Carolina assumirá',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-03'::date
      LIMIT 1
    ),
    False,
    'Feita',
    'Chega atrasada pois estava fazendo tomografia , relata diminuição da sensibilidade dos dedos , diminuição da motricidade fina . Preocupada devido a osteoporose . Em cadeira de rodas , verbal , consciente , trabalhamos motricidade fina sem intercorrências- precisou de ajuda prática e verbal',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-03'::date
      LIMIT 1
    ),
    False,
    '-',
    'Atividades competitivas (reage mal ao perder ), rigidez cognitiva presente , realizo estimulaçao vestibular e proprioceptivo com sucesso , não demonstra dificuldade motor , recusa em alguns momentos diante das atividades, dificuldade de foco e atenção sustenta, sem intercorrência .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-03'::date
      LIMIT 1
    ),
    False,
    'Transtorno cognitivo leve - solicitação da Santa Casa',
    'Ansioso, queixa da esposa , refere sentir mal com as cobranças excessivas , deixou o trabalho . Trabalhamos cognição , tangran, precisou de ajuda prática para encerrar a atividade a tempo. Refere estar cumprindo a rotina que desenhamos .Sem intercorrências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sonolenta , pai relata que foi difícil acorda lá para vir a terapia , dispersa , demorou para concentrar na atividade, realizou as atividades de estimulaçao tátil  com ajuda prática e verbal',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sonolenta , algo apática , lentidão motora segundo seu filho Eduardo devido a medicação para convulsão , em cadeira de rodas , diminuição força muscular MMSS, trabalhamos motricidade fina',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos cognição, foco e atenção , competição com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo, sorridente , trabalhamos motricidade fina , primeiras contas com ajuda verbal , disperso
Em alguns momentos , responsivo e colaborativo',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calma , sorridente , queixa de dor no ombro esquerdo , conseguiu realizar atividade cognitiva com suporte verbal , usamos óleo essencial de bergamota , conta sobre sua infância sorrindo , faço estimulaçao auditiva',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-07'::date
      LIMIT 1
    ),
    False,
    'Investigação de uma possível hipótese diagnóstico de TEA e TDAH.',
    'Foi realizado o acolhimento, escuta ativa  das demandas apresentadas pela mãe ( responsável) do paciente, foi iniciado o preenchimento da anamnese com a finalidade de um prognóstico para o manejo do processo terapêutico de forma assertiva e efetiva.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-07'::date
      LIMIT 1
    ),
    False,
    'Gael veio acompanhado da mãe. Mãe refere que o mesmo é muito agressivo, não gosta de ser contrariado, tem queixas na escola antiga. Iniciou uma nova escola ontem, hoje será o primeiro dia sem a mãe.
Faz uso de estabilizadr de humor, aripriprazol e Atense.
Com HD: tod e tdah.
Mora com pai, mãe e irmã de 10 anos. A convivência com a irmã não é boa. Provoca-a, é agressivo.
Na rotina, acorda as 8h30, brinca, vai a escola, se alimenta bem. 
Mãe refere que Gael tem "preguiça" de fazer as atividades sozinho. 
No atendimento: respeitou a maioria das regras (onde poderia mexer e onde não poderia), baixa permanência nas atividades (desenhar, jogar, mexer no celular quando permitido).
Participou da avaliação respondendo a perguntas de forma adequada. Mostrou-se colaborativo na organização do espaço.
Propos-se para a mãe: avaliarmos e trabalharmos  a questão da atenção e regras.',
    'Primeira avaliação',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-07'::date
      LIMIT 1
    ),
    True,
    'Somente os pais comparecem na primeira avaliação País relatam histórico do paciente, sua infância e adolescência. Miguel mora com pai, mãe e irmão de 9 anos
Relatam que Miguel não gosta de ser contrariado, não aceita seguir regras, é independente parcialmente nas AVDs (independente no auto cuidado diario, dependente dos pais para atividades que exigem socialização)
Interesse por 1a e 2a guerra mundial, música, armas e meios de transporte. Sabe detalhes sobre eles, autodidata.
Segundo os pais, veste-se de maneira não usual para a idade, bem como seus interesses também. 
Na rotina: dorme as 4h da manhã, acorda as 14h. Toma café (às vezes preparado por ele mesmo), fica no computador, com amigos, jogando.
Sai para mercado que fica na frente de casa sozinho e leva o lixo para fora. Tem preferência por atividades em casa. Viajaram recentemente, mas Miguel quis voltar antes do planejado.
Pais referem mudança de rotina e hábitos após Miguel apresentar comportamentos diferentes. Deixaram de sair de casa, conviver com amigos.
Faz uso de medicações: Divalcon, Melatonina, Atentah e Sertralina.
Segundo os pais,  deseja terminar a escola, está no 1o ano do ensino médio, quer trabalhar, talvez morar em outro pais
 Paisntem expectativa de que Miguel fique mais independente e aprenda a controlar melhor suas emoções',
    'Primeira sessão com os pais',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-08'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Humor irritado e impaciente , mãe precisou entrar junto no atendimento, inseguro, arremata rigidez cognitiva, hiperfoco em carrinho , pouco diálogo , dificuldade no controle inibitório, pouco colaborativo, não aceitou tirar o calçado e buscou a mãe quando a mesma saia do seu campo visual',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Impaciente, dificuldade no controle inibitório, dificuldade cognitiva , busca pela repetição , realizou as ATIVIDADES com ajuda verbal e física , aceitou IS, apresenta lesão na sola do dedão por cutucar , treinamos AVD (calçar sapatos) , sem intercorrências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calma , alegre , afetiva , trabalhamos motricidade fina , lógica , contas com ajuda verbal e física em alguns momentos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Rigidez cognitiva, menos colaborativo, recusa e fuga das atividades propostas , aparentemente com sono , aceitou IS, busca proprioceptiva, brincadeiras bruscas em alguns momentos de forma inesperada como jogar objetos , boa comunicação verbal , tento trabalhar foco e atenção sem sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Treinamos mentoria e cognição com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Ana Clara Meireles Santana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Ana Clara Meireles Santana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-13'::date
      LIMIT 1
    ),
    True,
    '18 anos, veio sozinha para a avaliação. Tem diagnóstico pela Neuro (online) de Autismo nível 2 de suporte, depressão, ansiedade e esquizofrenia. Em uso de olanzapina e sertralina.
Trabalha na Embraer vaga PDC, CLT. Estuda Senai -logística
Boa compreensão de quadro, diagnóstico,  expressa-se bem verbalmente, organizada, orientada.
Histórico prévio de Tentativas de autoextermino, sendo a última em 2023. Sem ideacao ou planejamento no momento.
Mora com pai, mãe, avó materna e irmã (11 anos- mesmo diagnóstico)
Morava em Piracununga, mudou-se para SjC aos 14 anos - mais oportunidades e melhor tratamento após TS
É dependente para diversas atividades, como colocar comida no prato, cortar alimentos (refere tremedeiras), "esquece de beber água, tomar banho, escovar os dentes" - mãe tem que lembra-la
É escoteira, quer fazer faculdade, interessa-se por música, come bem, dorme bem.
Tem amigos, sai com eles para festas.
Refere ouvir vozes (comando e depreciativas) e visão de vultos que ficam parados.
Propoe-se trabalhar coordenação motora e autonomia.
Mãe virá na próxima consulta.
Sugiro uso de aplicativo para criar rotinas.',
    'Sessão de avaliação',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-14'::date
      LIMIT 1
    ),
    True,
    'Veio com os avós, colaborativos. Entraram junto na sessao, Leo fica com eles dia sim,dia nao. Chega da escola, faz as refeicoes, toma banho e dorme antes da mae chegar. Experimentamos instrumentos musicais. Interessa-se por musica, carrinhos, animais. utiliza ambas as mãos para realizar as atividades. Utiliza md para apoio para levantar. Utiliza bastante o "nao", as vezes sem contexto aparente, apenas como modo de iniciar a comunicação. Utilizou o espaço todo da sala, explorando possibilidades, solicitou ajuda da terapeuta quando não conseguia realizar alguma atividade. 
Mae vira na próxima sessão. Avalio a necessidade de terapia 2x por semana até por conta do processo de vinculação pela idade. Conversarei isso com a mãe semana que vem',
    '1a vez',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Gael entra na sala sozinho, aceita a proposta de desenhar, pede para colocar o desenho no celular para usar como referência.
Mãos trêmulas porém desenha de acordo com a idade, sabe escrever o próprio nome, utiliza cores. Permanece em pé e cerca de 15 minutos na atividade.
Propõe-se um jogo Tapa Certo.
O mesmo aceita jogar, escolhe as cartas com atenção, nomeia os animais, permanece colaborativo. Escuta as regras e aceita jogar com as mesmas.
Após cerca de 15 minutos, demonstra- se inquieto, pede para sair pois diz que está com a barriga doendo e com muita fome.
Tento convence-lo a ficar mais um pouco na sessão, porém o mesmo demonstra-se preocupado se a mae está mesmo lá fora. Sugiro irmos a recepção, a mae espera-o com um pastel.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Primeiro atendimento com Miguel após avaliação anterior com os pais.
Miguel apresenta-se colaborativo, calmo, conta-me sobre ele, rotina, relação com os pais, seus interesses. Define-se como objetivo conjunto melhorar sua rotina.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-14'::date
      LIMIT 1
    ),
    True,
    'Mae refere que Livia tem resistência a escola desde muito pequena, 3a.
Sempre chorou muito para entrar, principalmente em escolas novas, pos férias e finais de semana. Mas sempre apresentou bom rendimento escolar.
Aos 7 recebeu o diagnostico pela neuro de ansiedade, iniciou setralina.
Atualmente em uso de desvenlafaxina
Fez teste com neuropsicologa - Diagnostico de Tea nível 1 de suporte. Em processo de aceitação do diagnostico 
Até ano passado, ia na escola presencialmente, ainda que com muitas faltas.
Este ano não conseguiu ir mais (1o ano EM)
Tem feito em casa.
Mae percebe piora na socialização, não consegue sair para comprar pão, pegar alimentos de entregador de ifood. 
Em janeiro conseguiu ir a um churrasco com amigos e gostou.
Mae refere muita rigidez com alterações de rotina.
Restrição a alguns alimentos, porém come bem outros.
Dorme bem
Mora com mãe, pai e irmão de 28 anos que se revezam no cuidado.
Faz aula de música, gosta de atividades artísticas e de expressão.
Mae restringe uso de celular.
Realiza tarefas de casa como guardar loucas, dobrar roupas, é independente para atividades de auto cuidado.
Volta a escola no começo de abril.
Semana que vem virá para a sessão.
Propoe-se para mãe processo inicial de vinculação e posteriormente trabalharmos rigidez nas rotinas.',
    '1a avaliacao com a mãe',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Rigidez cognitiva, baixa tolerância a frustração, dificuldade de foco e atenção , genitora permaneceu na sala junto , sem intercorrências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjämim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjämim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-15'::date
      LIMIT 1
    ),
    False,
    'Calmo, sorridente , dificuldade na atenção sustentada , faz imitações e tenta comunicar se verbalmente',
    'Calmo, colaborativo, trabalhamos imitação e tempo de espera sem intercorrências- orientação a genitora quando a foco',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calma , afetiva , humor estável
Trabalhamos motricidade fina , massagem , AVD sem intercorrências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos estimulaçao tátil , auditiva e vestibular sem intercorrências- chegou atrasada 20mn.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo, discurso de histórias pesadas , dificuldade em cumprir rotina estabelecida , refere estar vendo séries , bom desempenho nas atividades cognitivas propostas , boa concentração , dificuldade na estratégia em
Jogos , desenvolve bem ao ser orientado .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos estimulava tátil , atenção e foco, reconhecimento de sons , estimulava o auditiva e estimula o sensorial',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina , iniciamos trabalho voltada às AvD, fechaduras , alinhavo',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo , falamos sobre rotina e seu comprometimento, atividades voltadas a cognição e memória (com dificuldade em reter informação)',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos raciocínio lógico e estratégica com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Dificuldade evocação memória , boas estratégicas em Jogos competitivos , bom em quebra cabeça e jogo da velha , envio atividade pra casa',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo, excelente concentração hoje , dificuldade na motricidade fina',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Bom humor , trabalhamos motricidade fina , encaixes e AVD ( alimentou sozinha , noções de higiene preserva das ) sem intercorrências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-21'::date
      LIMIT 1
    ),
    False,
    'Investigação da hipótese diagnóstico de TEA suporte 1, com possível comodidade de TDAH possível quadro misto da condição segundo cid 11, onde há prevalência nas duas condições desatenção e hiperatividade.',
    'Realizado acolhimento das demandas trazidas pela mãe ( crise na escola) e também a entrega do protocolo de anamnese. 
Logo em seguida T. , iniciou o atendimento a criança, que ao longo da sessão no setting terapêutico apresentou alguns episódios de desatenção e hiperatividade, foi trabalhado o vínculo terapêutico de forma lúdico, com jogos e brincadeiras, trabalhando a troca de turno, atenção, memória, coordenação motora, percepção, desenolvimento do raciocínio lógico, da capacidade de planejamento, entre outras habilidades, através do quebra cabeça, jogo da memória, bolinha magica e jogo da memória.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Leo entra na sala, lembra da referencia de brincadeira com os carrinhos e instrumentos musicais. Vem acompanhado da mãe, mais aberto a interação.
Percebe-se que ao deparar-se com uma brincadeira nova (brinquedo aramado), não utiliza a ms direito de forma tão espontânea. Mae diz que as vezes precisa lembra-lo de usar. Mas usa sem resistência. 
Faz desenhos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Gael entrou animado, aceitou a atividade proposta: Quebra-cabeças de dinossauro, 100 peças.
Ficou atento a atividade, compatível com a idade.
Aceitou ficar a sessão toda na mesma atividade, demonstrando satisfação quando a atividade foi concluída. Quis chamar a mãe para mostrar.
Realizou a atividade a maior parte do tempo em pé, porém no meio da sessão disse para si mesmo: agora vou sentar.
Ótimo aproveitamento',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Miguel na recepção interagiu com familiares de outros pacientes, conversando sobre comida, receitas.
Diz ter tido uma boa semana,  porém ontem teve uma crise de pânico. Não se alimentou direito.
Atividade proposta de hoje foi desenho, escolheu desenhar um navio. Interagiu bem com a terapeuta falando sobre projetos futuros, dificuldades e questões familiares.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia entra sem a mãe, colaborativa, aceita que faça perguntas para conhece-la melhor. Fala sobre interesses, Grécia antiga, desenhar, pintar, dançar músicas de kpop.
Jogamos uno. Com cerca de 30 minutos de sessão Livia diz que é muito difícil sair de casa e interagir com outras pessoas e pede para chamar a mãe.
Chamamos a mãe, elogiamos a iniciativa de Livia de sair de casa, de enfrentar o desafio de ir a um local diferente e sua colaboraçãona sessão. Mae diz que Livia apresenta muito sofrimento para sair de casa e interagir com outras pessoas. Livia chora, perguntamos se quer que a mãe se aproxime para consola-la. A mesma recusa. A mãe permanece na sala no restante da sessão. Mãe diz que hoje a tarde Livia tem retorno na médica Psiquiatra, que sera dada a devolutiva em relacao a medicacao introduzida e a escola. Esclareço para Livia que, independente de ela voltar para a escola, a Terapia pode auxilia-la em outras questões.
Combinamos semana que vem Livia trazer os desenhos que faz em casa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Solicitante , dificuldade de foco e atenção , crítica feriada na mão esquerda , reconhece letras e faz encaixes , trabalhamos IS : tátil, vestibular e propriocepcao , planejamento motor e equilíbrio',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calma , trabalhamos motricidade fina e encaixes , queixa se de dor no MSD na região do ombro , usamos óleo de eucalipto, responsiva , ativa , lanchou com independência',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos IS, conta sobre sua cadela Mel, estimulaçao tátil e auditiva com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Andréia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Andréia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-24'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos crenças limitantes , rotina , sonhos futuros',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calmo, pouco diálogo , dificuldade em se posicionar , realizou atividade cognitiva para encaixe com sucesso e ajuda prática , realizou atividade voltada a lógica e raciocínio concreto com ajuda verbal',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Rigidez cognitiva, trabalhamos foco e atenção , compartilha que seu irmão ganhou presente e ele não (acolho e oriento - compartilho com genitora ), ativo, responsivo, conseguiu realizar as atividades de integração sensorial e cognitivas com ajuda verbal - dificuldade em competir',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-25'::date
      LIMIT 1
    ),
    False,
    'Investigação de hipóteses diagnóstico de TEA e TDAH.',
    'Paciente demonstra alguns episódios de desatenção e inquietação, foi iniciado o trabalho com o caderno de altas emoções com o objetivo de desenvolver a saúde emocional, de forma que aprendem a identificar e expressar as suas emoções compreendem melhor a si mesmas e aos outros.Desenvolvem estratégias para lidar com sentimentos difíceis, como raiva ou tristeza, promovendo a qualidade de vida. Também foi trabalhado com o caderno da empatia com a finalidade de contribuir com o desenvolvimento socioemocional da criança de forma  a ajudar a criar laços de confiança com outras pessoas, trazendo contribuições também para a saúde mental e física
Controla a impulsividade, auxilia a pensar no coletivo antes de agir, ou seja pensar nas consequências de suas ações. Desenvolve a tolerância, a inclusão e a cooperação, capacita para lidar com os desafios da vida
Foi trabalhado alguns jogos como foi mencionado a cima com o objetivo de desenvolver a atenção, raciocínio lógico, memória, coordenador motora, planejamento, vínculo terapêutico, troca de turno.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'RealiAmos atividades para estimulaçao tátil e auditiva , comemoramos seu aniversário com bolo e parabéns',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos pré requisitos para avd’s, motricidade fina , identificação de figuras , nomear e escrever palavras , com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calma , disposta , realizou atividade cognitiva e para memória com ajuda verbal , lanchou com autonomia e independência',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Conseguiu sustentar atenção com estímulo verbal constante , aceitou estimulaçao sensorial e auditiva , sem intercorrências . Uso óleo essencial lavanda',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Ana Clara Meireles Santana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Ana Clara Meireles Santana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Ana apresenta-se bem, indica aumento de sono com alteração da medicação. Fala sobre os planos do Carnaval, receios, pois vai viajar sem os pais para Campinas. Encontro de jovens da igreja.  Fala sobre relação com os pais. Traz novamente a questão de dificuldade em organizar a rotina. Proponho criarmos instrumentos em sessão visuais que a ajudem em casa. Aceita a proposta.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Leo vem acompanhado da avó. Entra na sessão e encontra objetos que brincamos na sessão anterior.  Parece reconhecer e brinca com eles. Explora um pouco mais o uso membro direito durante a brincadeira. Desenha restringindo-se ao espaço  do papel, explorando cores diferentes e traços.
Não aceita brincar de massinha neste momento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Quando chego para buscar Gael na recepção, sua mãe informa que havia tido uma "crise" por causa de restrição de celular. Porém, quando o chamo para a sessão, entra colaborando. Percebe que alteramos a sala de atendimento mas aceita atividade proposta sem intercorrencias. Desenha o Godzila e o King Kong. Ambos com muitas garras, espinhos e dentes. Terminado o desenho, aceita trocarmos de atividade para quebra-cabeças. Aceita os limites impostos: não é hora de ir embora, objetos nos quais não pode mexer, hora de encerrar e guardar o brinquedo. Disse que gosta da professora pois ela brinca com ele.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Miguel aceitou retomar a proposta da sessão anterior, jogar Uno. Utilizo o recurso para dialogarmos sobre as diferentes regras possíveis. É colaborativo em sessão, aceita e até propõe o diálogo. Demonstra interesse em jogos variados como damas, xadrez, outros jogos de cartas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia entrou na sala sem responder ao bom dia, foi proposta atividade de relaxamento livre, no local da sala onde se sentisse mais confortável. Escolheu a cadeira.
Foi utilizado o principio de ISO - musicoterapia  - para regulação emocional e modulação do humor e exploração de sons de sua preferência.
Foi proposta utilização de óleo de lavanda mas a mesma recusou.
Opta-se por respeitar as respostas da paciente para que o ambiente seja acolhedor neste principio e a mesma não se sinta pressionada.
Também foi oferecido material para expressão, como papéis e lápis e colocado que Livia ficasse a vontade para explora-los. Mas Livia não quis.
Após meia hora de sessão solicitou ir embora, foi oferecido mudança de atividade mas Livia recusou.  Converso com a mãe para explicar que, neste primeiro momento, talvez Livia sustente apenas meia hora de sessão. Livia abre a porta enquanto converso com a mãe, mas não chora ao final da sessão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-07'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Benjamin entrou com a mae, interagiu bem atende comando quando solitacitado a terapia de hoje foi adaptação e connhecer o paciente e suas demanda. Saiu antes por motivo de tosse e fazendo uso de antibiótico.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Ansiosa , solicitante , dificuldade de foco e atenção , curica feridas do corpo e não se limpa sozinha ao ir ao banheiro , trabalhamos estimulaçao sensorial , foco e atenção e motricidade fina',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chegou atrasada , trabalhamos IS e estimulaçao tátil sem intercorrências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Mais agitado , busca priopectiva, IS e encaixes , reconhecimento de letras',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina , letras e escrita',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa , deprimida , dificuldade na fala e na coordenação global . Trabalhamos CM MMSS,  falamos sobre adaptações',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-11'::date
      LIMIT 1
    ),
    False,
    'Investigação de hipótese diagnóstico de TEA e TDAH...',
    'Paciente demonstra interesse e engajamento nas atividades propostas pelo T., o mesmo também apresenta episódios de desatenção, uma certa agitação (inquietação, impulsividade), em alguns momentos fala muito alto, importante investigar TPAC, foi trabalhado alguns materiais impressos como altas emoções, com o objetivo de trabalhar as emoções e o caderno empatia, também foi trabalhado a atenção, memória visual e percepção, coordenador motora, linguagem, troca de turno entre outras habilidades.  O paciente permaneceu bem e foi entregue para seus responsáveis.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos rotina , higiene. Pessoal , fizemos quadro de rotina , chamei a ame na sessão para alinharmos como dar continuidade em casa - entrego quadro de rotinas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pouco diálogo , trabalhamos foco e atenção , raciocínio lógico com sucesso , conta sobre sua segurança ao dirigir e conta sobre seu curso técnico',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Conta sobre sua ida a neurologista e se indigna pois a mesma refere que ele não pode mais dirigir sozinho , refere que discutiu com a filha a respeito e sente se tolido . Conversamos a respeito e fazemos atividade voltada a nomeação de figuras , foco , atenção e procura de objetos em meio aos demais com sucesso . Refere que a neurologista disse que ele está evoluindo bem no quadro cognitivo .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-13'::date
      LIMIT 1
    ),
    False,
    'Mae é fono, refere que Victor tem sensibilidade tátil, não gosta de colocar roupas após o banho porém o faz após ir ao banheiro. Desfralde diurno, vai sozinho. Só utiliza fralda durante a noite. Come sozinho, após cirurgia auditiva não aceita mais frutas e legumes mas no geral se alimenta bem. Na escola não aceita sopa. Escola desde os 9m, refere que prefere brincar sozinho, é agressivo, não permanece sentado em roda com os colegas. Tem uma amiga fora do ambiente escolar e brinca com a mesma. Na escola participa de atividades variadas, futebol, capoeira, música, inglês, sem queixas. Faz fonoterapia, atraso de fala. Gosta de brincar de carrinho, caminhão. Arruma os brinquedos após brincar, todos estacionados para o mesmo lado.
Em sessão, aceita as ordens e comandos da mãe, pula bastante, explora a sala, apresenta orientação corporal e espacial compatíveis com a idade. Canta, faz gestos, fala as vezes incompreensível mas com intenção de se comunicar. Não tem questões com barulhos. Pouco contato visual com a terapeuta mas ao final manda beijo, fala tchau.',
    'Sessao de Avaliação',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Mae veio para conversa. Estabelecemos os objetivos iniciais de terapia que são vinculação e confiança no espaço. Explico que a resistência de Livia é esperada tanto pelas questões da adolescência quanto pelas questões da resistência a ideia de um tratamento para ela "sair de casa". Que acreditamos ser o entendimento dela dos objetivos.
Oriento a mãe sobre dúvidas, falo sobre como a TO pode contribuir nas questões de sofrimento psíquico de Livia.  Proponho troca de horário para tarde.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Atividades de coordenação motora fina. Dificuldade na preensão, movimento de pinça.
Falamos sobre possíveis adaptações no lar para que possa realizar atividade de cozinhar.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Liga pedindo atendimento pois quer se divorciar da esposa , agendo atendimento , acolho , queixa se da cobrança e da pressão diante do cumprimento da rotina , falamos sobre a rotina , sobre buscar o equilíbrio nas ações da vida . Diz que fará faculdade de astronomia ( ajudo a avaliar ), falamos sobre a congruência entre fazer este curso com o desejo de aposentar , de ter liberdade . Queixa se da proibição de dirigir . Avaliamos juntos os últimos fatos e ressalto a importância do bem estar e do equilíbrio no dia a dia e nas escolhas .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Andréia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Andréia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Fala sobre o emprego que deixou , está supervisionando estágio agora , relata insegurança e não saber o que quer da vida , fala sobre o relacionamento com marido .trabalhamos roda da vida , lembro dos exercícios passados para avaliar suas crenças , e discorremos sobre empreendedorismo .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Genitor o trouxe , chegou atrasado , verbaliza preocupação com a mãe . Matheus mostra dificuldade da fala, dificuldade de foco e atenção e alguma rigidez cognitiva, afetivo em alguns momentos , em
Outros ignora as orientações verbais',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina , queixou se de dor no ombro direito (filha ciente ), aprenstacao lapsos de memória e descarrilamento do pensamento enquanto narra um acontecimento ou lembrança . Uso óleo essencial limão . Estimulaçao tátil.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina , estimulaçao tátil , letras , equilíbrio . Sem intercorrências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Leo entra sem a mãe, permanece a sessão toda, voltando a recepção apenas uma vez para "verificar"  presença da mãe, mas retornando a sala depois.
Sobe e desce de objetos com facilidade, fala "ja" na contagem até três, reconhece brincadeiras que já fizemos anteriormente.
Mae relata que escola tem queixas de agressividade com outras crianças. Porém na sessão de hoje compartilha a sala com Benjamin, cópia brincadeiras e interessa-se pela atividade do outro sem aproximar-se.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin 
atividades proposta: Jogo de Boliche e Massinha de Modelar
  Objetivo: Desenvolver a coordenação motora fina, a força muscular nas mãos e dedos, além de estimular a criatividade e a percepção sensorial. 
 Benjamin participou de atividades de modelagem, amassando, apertando e moldando a massinha de modelar. Foram utilizadas forminhas de plástico para cortar a massinha em diferentes formatos.
  Boliche: objetivo:  Trabalhar a coordenação motora grossa, o equilíbrio, a coordenação visomotora, a força e o controle dos movimentos, além de promover a atenção e a concentração.
Benjamin participou de atividades de modelagem, amassando, apertando e moldando a massinha de modelar. Foram forminhas de plástico para cortar a massinha.  participou de um jogo de boliche, lançando a bola e tentando derrubar os pinos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Gael entra colaborativo, diz que gostaria de desenhar.  O fazer sentado por cerca de 20 minutos. Depois passamos a jogar quebra cabeça e permanece na atividade até o final da sessão. Concentrado e sentado na cadeira.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa , deprimida , falamos sobre rotina e suas atividades, dificuldade para falar e coordenação motora global , trabalhamos aceitação e resiliência',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos meses do ano, dias da semana , alfabeto , memória e estratégias cognitivas com sucesso 
Empresto quebra cabeça para montar em casa no feriado',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chega mais calmo, refere estar bem em casa , está cuidando dos cães da filha também
Por 1 semana . Aparência cansada, realizamos atividades para memória , atenção e foco com sucesso 
Sem intercorrências',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Devido a troca de sala e o paciente não conhecer a sala e por ocasião da sala ter muitos estímulos, que favoreceram a exploração do ambiente e a distração, paciente também demonstrou uma certa inquietação e agitação.  O mesmo enganjou nas atividades, apresentando em vários momentos estar desatento, foi desenvolve habilidades importantes, como atenção, socialização, percepção visual, coordenação motora e competição saudável, também foi trabalhado o caderno trabalhando as emoções a fim de promover no paciente o conhecimento das emoções e desenvolver estratégias para que a criança possa lidar melhor com suas emoções.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente demonstra uma certa agitação ( impulsividade) e vários episódios de desatenção, dificuldade em manter a atenção, foi trabalhado as emoções de maneira lúdico, através de atividades impressa do filme divertida mente, também foi dado continuidade à atividade de empatia, R., pediu para jogar também o pula pirata e no final da sessão esqueceu seu brinquedo da coleção do mecdonald''s, R., também se irritou quando T., pediu para colocar os sapatos dizendo que não consegue, T., disse que o ajudaria e R., ficou bem.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Refere estar cansado , fala sobre discussões com a esposa sobre rotina , menciona estar fazendo a rotina , realiza atividade cognitiva com apoio verbal',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia foi bastante colaborativa nesta sessão, contou bastante de si. Diz se sentir incompreendida na família e que a tratam como criança. Falou sobre desejo de viajar, conhecer pessoas, dificuldade em socializar e muitas críticas à sociedade. Falou bastante sobre sexualidade, muitas dúvidas e anseios.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Exercícios de coordenação motora fina e pinça. Sessão de Reposição',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Ana Clara Meireles Santana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Ana Clara Meireles Santana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Ana traz questões sobre a viagem, socialização e principalmente com relação a psiquiatra não ter fechado/ter questionado diagnóstico de esquizofrenia. Discutimos sobre importância do uso da medicação, responsabilização das escolhas. Diz que neuro diagnóstico Tdah. Conversamos sobre atividades substitutivas a audição de vozes (diz sentir falta). Optamos por iniciar projeto de produção  de material visual para organização da rotina.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Exercícios de coordenação motora fina e preensão mao esquerda e direita.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin respondeu bem atividade proposta circuito com bola é uma ferramenta excelente para o desenvolvimento psicomotor, pois combina diferentes habilidades, como coordenação motora, equilíbrio, força e percepção espacial, Benjamin respondeu bem aos estimulos psicomotor.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Entra sem a mãe, trocamos de sala. Leo percebe mas aceita a troca. Passa quase metade da sessão brincando com a massinha. Não gosta de ser contrariado.
Mae na recepção refere que Leo tem mordido as outras crianças na escola. Recorrente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Miguel diz que não veio semana passada pois os pais estão se separando e havia acabado de saber. Isso o desestabilizou.
Reclama sobre dores nos ombros, conversamos sobre a possibilidade de tensão e falta de alongamento. Sugiro exercícios e técnicas de relaxamento. 
Fala sobre a escola, está pouco estimulante estudar em casa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Na sessão de hoje apresenta-se mais calmo. Aceitou a proposta de brincar com carrinhos, interagindo pouco com terapeuta e aceitando apenas pequenas intervenções. Quando a mãe interage, aceita melhor, copia as brincadeiras. Certa rigidez na forma de brincar não aceitando muitas alterações. Pouca interação verbal, porém boa compreensão.
Procura onde a mãe está a sessão toda.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos IS, estimulaçao verbal , foco e atenção , reconhecimento de letras e encaixes com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Cristiano' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente apresentou alguns episódios de desatenção em alguns momentos da sessão e também uma certa agitação e inquietação, T., percebeu que nesta sessão teve uma diminuição da agitação, T., continuou trabalhando com os cadernos da emoções com o objetivo de desenvolver o autoconhecimento, estratégias para lidar melhor com suas emoções, T., também continuou trabalhando com o caderno da empatia com o objetivo de promover e transformar o pensamentos e falas de auto julgamento em palavras de auto compaixão, na perspectiva da Comunicação Não Violenta.
Também foi trabalhado através dos jogos equilibrista maluco e balança divertida:
Desenvolve a coordenação motora e a destreza
Estimula o pensamento crítico
Desenvolve a concentração e a atenção
Desenvolve o raciocínio lógico e estratégico
Desenvolve a noção de equilíbrio de peças
Estimula a coordenação motora e o raciocínio lógico
Desenvolve o pensamento e a concentração
Desenvolve o pensamento crítico, a concentração e a coordenação motora
Ajuda a trabalhar em equipe',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Verbaliza cansado e dificuldade no convívio com esposa e filha . Realizou atividade cognitiva precisando de ajuda verbal para “reconhecer a palavra com letras faltantes “ e memorizar .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Victor entra sozinho pelos primeiros 10 minutos, após isso começa a chamar pela mãe. Chamo a mãe na recepção para que possamos continuar a sessão com a presença dela. Solicito sutilmente que evite interagir para que Victor possa vincular com a terapeuta. Victor retoma brincadeiras da sessão passada, realizando os mesmos gestos e sons. Aceita novos tipos de interação mas apenas se a mãe os apresentar.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Não estava tão receptiva a terapia quanto na sessão passada. Questionei se havia acontecido algo na semana ou em relação a terapia mas não quis responder. Tentativa de estabelecer vínculo e entender junto com Livia os objetivos terapêuticos. Falou sobre o desejo de ir no show de uma de suas bandas preferidas e interesses em geral.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Ana Clara Meireles Santana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Ana Clara Meireles Santana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Estratégias de estabelecer uma rotina, organização do cotidiano e ampliação de atividades.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-28'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Técnicas e uso da música com o objetivo de utilizar a mesma como canal de comunicação',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Exercícios de alinhavo. Jorge refere melhora na preensão nas atividades cotidianas de escrita. Não realizou atividades sugeridas para casa',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Bejamin manipulou a bolinha com ajuda para fortalecer os músculos das mãos e dedos, além de melhorar a precisão dos movimentos.
Coordenação motora ampla, Jogar, pegar ou rolar a bolinha trabalha movimentos mais amplos dos braços e do corpo.
As texturas da bolinha ativam diferentes sensações táteis, contribuindo para o desenvolvimento da percepção sensorial.
Sem intercorrências.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Gael aceita bem a troca de brincadeira, jogamos Uno. Boa aceitação das regras (cor, número), consegue focar na atividade, ficando contente em ganhar. Permanece a sessão toda nesta atividade e desenhando.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin, em sua primeira sessão, estranha a terapeuta. A mãe o traz dormindo/acaba de acordar na recepção. Benjamin entra sozinho, nos primeiros vinte minutos de sessão aceita as interações, após isso começa a chamar pela mãe. Mesmo com as tentativas de leva-lo para outras atividades, chora.
Levo-o na recepção para mostrar que a mãe não está lá e trago-o para a sala novamente. Aceita mais algumas atividades e volta a chorar. Quando o levo novamente para a recepção para que veja que a mae ainda nao voltou, a terapeuta Angela está entrando e auxilia no processo de vinculação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Proponho junto a mãe utilizarmos atividades de música para estabelecimento de vínculo e para trabalharmos a comunicação com o Heitor. Heitor tem a estratégia de sorrir quando gosta de algo e virar o rosto quando não está gostando da interação. Utilizo-me destes marcadores para basear nossa interação. Reconhece músicas infantis e prefere sons graves a agudos, com ritmo mais acelerado.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-03-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Miguel diz e aparenta estar muito tenso com a situação em casa, dos pais estarem se separando. Diz sentir-se responsável de certa forma, diz também que os pais colocam a culpa nele.
Falamos sobre estratégias de alivar a tensão, como outras técnicas de relaxamento, atividades físicas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Entra novamente somente junto com a mãe. Aceita as atividades propostas mas após cerca de 30 minutos de sessão sinaliza querer ir embora, balbuciando uma música com essa intenção. Sinalizo para a mãe que aparentemente Victor parece estar cansado neste horário. Combinamos de testar para semana que vem um horário mais cedo. Apenas disso, consegue permanecer até o final da sessão. Pouca interação com a terapeuta, tendo preferência por brincar sozinho, explorando os objetos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia estava animada pois irá no show dia 06 de uma de suas bandas preferidas. Quem a levará é o irmão, é no Morumbi em SP, irão de Van e chegarão 7h antes. 
Após explicar um pouco sobre essa organização para ida ao show, diz que gostaria de falar sobre a escola, me contar sobre o por que não gostar de ir a escola. Diz ter sofrido exclusão e comentários maldosos da turma na 8a série, que não era algo isolado mas coletivo. Que faltou muito neste ano e no ano seguinte. Que neste ano de 2025 não qier voltar a escola, não ve sentido no espaço, que não conhece ninguém e "não é boa em fazer novas amizades". Permanece a sessão toda contando sobre isso e outros pensamentos/ideias.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Melhora na interação, tentativa de falar algumas palavras: girafa, vaca, gato.
Utilização dos dois membros para manipular objetos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Aceitou apenas entrar junto com a mãe, mas não aceitou nenhuma atividade oferecida nem mesmo estando no colo da mãe. Mãe desconfia que a escassez de sono está prejudicando, que teve queixas na escola de que ele quer ficar apenas no colo das professoras. Passará na endócrino na semana que vem e espera que haja ajuste medicamentoso.
Fica cerca de 30 minutos na sessão e mãe decide leva-lo',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Proposta atividade de massinha.Gael apresenta pouca tolerancia a frustracao quando as figuras nao saem do jeito que deseja. Encontra na sala um desenho de outro paciente e pede se poderia fazer um igual. Permanece sentado a atividade toda, atenção aos detalhes do outro desenho, cria narrativa para o mesmo, acrescenta detalhes próprios. ( o desenho é um navio - desenho do Gael entra um navio pirata, com caveira e nome de pirata, bau de tesouros e armadura).
Ao término da sessão demonstrou bastante ansiedade para mostrar o desenho para a mãe.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Miguel refere sentir-se cansado, que não consegue dormir a noite, isso tem o deixado irritado e menos tolerante. 
Diz que as brigas entre os pais diminuiu mas mesmo assim não sente esperança de alguma mudança.
Optamos por fazer atividade de desenho, o mesmo menciona que em casa não está conseguindo ter ânimo para desenhar.
Falamos sobre barcos/navios e as possibilidades que esse interesse poderia trazer em um futuro profissional',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos percepção de si , do corpo , logica, coordenação global , diálogo',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-09'::date
      LIMIT 1
    ),
    False,
    '150,00',
    'Trabalhamos IS, foco e atenção',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão dupla de reposição. Leo já entra sozinho na sala, aceita propostas de brincadeira. Comunica-se de forma pouco verbal. Utiliza o mse para atividades, com preferência para o msd. Mostra-se frustrado e irritando quando não consegue realizar as tarefas sozinho. Mae queixa-se que na escola tem mordido colegas. Trabalhamos a questão de pedir ajuda e brincar de maneira não agressiva.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Heitor demonstra menos interesse em interação em comparação com a sessão anterior. Preferência por instrumentos musicais do tipo chocalho. Aceita manipulação dos mss com certa desconfiança. Prefere interação quando ouve a voz da mãe. Estamos em processo de encontra interações em que Heitor sinalize o sim e o não.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Terapeuta Michele entra junto para auxiliar na resistência de Benjamin com a nova terapeuta. Aos poucos o mesmo aceita as tentativas de interação.  Percebe-se grande interesse por música, aceita manipular os instrumentos musicais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Gael vem trazidos pelo pai, que queixa-se que está irritado pois não pode usar o celular. Percebe-se que na sessão demontra-se mais agitado, porém realiza as atividades propostas, querendo ir embora mais cedo, mas permanece até o fim. Quando encontramos na recepção, logo pede o celular. O pai nega e Gael demonstra irritação. Falo sobre reposição mas o pai diz que a mãe está doente e depois irá conversar comigo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Miguel Reis Ballesteros' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Miguel queixa-se foi ambiente em casa. Diz existirem muitas brigas e que não consegue se regular em meio ao ambiente. Conversamos sobre outras possibilidades, sobre projetos futuros e meio de realiza-los. Percebe-se que Miguel tem estado mais irritado e menos disposto.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Jorge demonstra-se preocupado. Filho está trabalhando como menor aprendiz e tem ficado menos tempo em casa para auxilia-lo nas tarefas domésticas. Exercício com os cones que executa de maneira tranquila. Exercício de escrita. Percebe-se que realiza poucas atividades no cotidiano. Conversamos sobre.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Leo está bem receptivo, percebe preferência pr repetição nas brincadeiras do atendimento anterior.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-11'::date
      LIMIT 1
    ),
    True,
    NULL,
    'A proposta: Estimular o desenvolvimento motor, Pietra de maneira dinâmica e divertida. Na atividade de motricidade grossa, foi utilizado uma prancha de equilíbrio, onde precisou virar os cones com os pés. Embora tenha enfrentado algumas dificuldades em determinados momentos, demonstrou esforço e determinação. 
Além disso, foram realizadas atividades de motricidade fina, como um jogo de tênis diferenciado, em que as bolas grudavam na prancheta, proporcionando uma experiência interativa e desafiadora. Pietra se saiu muito bem ao realizar as propostas, mostrando entusiasmo e progresso ao longo das atividades.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'A proposta em estimular o desenvolvimento motor e a percepção corporal das crianças por meio de atividades práticas e lúdicas. Benjamin, demonstrou grande autonomia, retirando as fitas dos brinquedos, exercitando a motricidade fina. Durante o processo, ele também nomeou as partes do corpo envolvidas, enriquecendo sua expressão corporal e percepção visual. 
Além disso, foi criado um circuito interativo, no qual Benjamin rastejou e passou por baixo de obstáculos, promovendo a motricidade grossa, e uma maior consciência corporal. Essas atividades colaboraram para o desenvolvimento integral.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Victor vem trazidos do pai e da mãe. Pai o acompanha até a sala e consegue deixa-lo sozinho. Bom aproveitamento. Permanece a sessão toda, realiza as atividades propostas ainda que não busque interação com a terapeuta.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atividades de pinça e coordenação motora fina. Conversamos sobre o ato de evitar atividades que pensa não ser capaz de realizar e o quanto não realiza-las cotidanamente acaba por reduzir a capacidade de realiza-las.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Leo vem acompanhando de pai e mãe. Entra sozinho. Demonstra aceitação para atividades que não tínhamos realizado anteriormente. Percebe-se melhora na comunicação e contato visual.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia conta que não está se sentindo bem, que conversou com a mãe que quer ir a consulta do psiquiatra. Diz achar estar com depressão. Falamos sobre formas de se colocar no mundo e sobre livros. Digo que preocupo-me com os conteúdos acessados na Internet e como esse recorte é bolhas podem afetar percepção no mundo. Falo da importância de vir a sessão ainda que não se sinta bem, que podemos alternar atividades caso não queria conversar mas que aquele espaço pode ser uma possibilidade para organizar pensamentos. Falo com a mãe que irei conversar com a psiquiatra para trocas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Contou histórias passadas (já contadas algumas vezez); queixa se.de ter sido proibido de dirigir , trabalhamos logica , agilidade e estratégia cognitiva',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Levi Martes Felix Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Levi Martes Felix Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-25'::date
      LIMIT 1
    ),
    True,
    'Paciente apresenta como HD Mielomeningocele sendo realizada cirurgia reparadora intra-uterino com 27 semanas de gestão. SIC pela mãe foi realizado parto normal sem intercorrências. Apresenta Apgar sufienciente. Como rotina realiza US transfontanela semanalmente para acompanhamento de Hidrocefalia e necessidade de colocação de DVP. O mesmo não apresenta marcos motores devido a baixa natalidade, encontra-se com 15 dias de vida. Apresenta padrão flexor e oposição da cabeça para lado esquerdo, discreta imobilidade de região lombo-sacral devido a lesão em processo de cicatrização. Encontra-se com gesso em MMII devido a pé torto equino. Encontra-se presente ainda reflexos de imaturidade neurologicas como MORO, Galant, Preensão palmar e plantar, reflexo de busca e de sucção.',
    'Paciente acordado, alerta, reativo a manipulação, com discreta ictericia residual ( 1/4+). Hidratado, corado e em BEG. Encontra-se com gesso em MMII. Ap MV + em AHTX sem RA.
CD: Avaliação Motora e Respiratória. Movimentação assistida de cinturas escapulares e pelvicas, trabalho balance de báscula do quadril para todas amplitudes, movimentação reduzida porém ritmica de quadril e lombar, alongamento de MMSS e MMII e pescoço. 
Oriento mãe sobre etapas do desenvolvimento motor típico, oriento a mesma a acompanhar marcos motores em casa junto com uma Ficha de Acompanhamento de desenvolvimento fornecidas no ato da consulta.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessões de reposição referente ao feriado do dia 18 e sessão do dia 25.
Trabalhamos emoções, mãe refere que Gael agride os colegas de escola.
Escolhe como personagem preferido de Divertidamente "o Raiva"',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos logica das ordens: números, sequencia , encaixes, vestimenta com.sucesso , demonstrou dificuldade quanto a contagem numeração acima de 70',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-04-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessões de reposição referente a Guia Março e dia 25/04.
Leo tem feito bastante uso de MSD nas atividades propostas. Ainda em processo de interação, preferindo as vezes brincar sozinho, porém aceita intervenções.
Demonstra bastante frustração ao não conseguir realizar uma atividade sozinho',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia diz que a semana foi muito boa, que voltou a fazer atividades que gosta como desenhar e assistir a pessoas jogando jogos de videogame. Falamos sobre objetivos futuros: morar sozinha, profissões possíveis e quais os caminhos para chegar até lá. Fizemos sessao dupla para reposição do dia 25/04 e feriado do dia 01/05',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atividades de coordenação motora fina e escrita. Sugiro adaptações cotidianas mas Jorge é resistente a intervenções e diz não querer ficar dependente das pessoas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin participou explorou diferentes movimentos e ritmos. Conforme a música tocava, ele acompanhava o ritmo com gestos e pequenos, aprimorando sua coordenação motora fina e grossa ao executar os movimentos de forma sincronizada.
Durante a dança, precisou manter o equilíbrio e postura, ajustando o corpo conforme a música se intensificava ou suavizava. A cada movimento, a consciência corporal foi sendo fortalecida, permitindo que encontrasse estabilidade mesmo em momentos de dificuldades.
Benjamin demonstrou uma percepção de noção espacial, deslocando-se pelo ambiente de acordo com o ritmo da melodia. Conseguiu calculando a distâncias, evitar obstáculos 
Ao seguir o ritmo e a temporalidade da música, precisou ajustar os movimentos para acompanhar o compasso corretamente. Essa habilidade a ajudou a antecipar mudanças na melodia e adaptar sua resposta motora de maneira fluida e natural.
Musicas: o cachorro faz au, au... jacare..a boca do jacare.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra, participou de um circuito motor dinâmico e envolvente. Durante a atividade, demonstrou grande empenho ao executar os movimentos exigidos. Ao correr, saltar e desviar dos obstáculos, trabalhou sua coordenação motora global, ajustando os deslocamentos com agilidade e precisão. Cada desafio do circuito estimulou também seu equilíbrio, exigindo ajustes corporais para manter a estabilidade, enquanto a orientação espacial foi aprimorada ao calcular trajetórias e reconhecer os limites do espaço.
Na etapa da prancha de equilíbrio, a criança concentrou-se intensamente para manter a postura adequada. A cada pequeno ajuste corporal, fortaleceu os músculos responsáveis pelo controle postural e aperfeiçoou sua consciência corporal, aprendendo a perceber e reagir aos pequenos desequilíbrios. Essa atividade exigiu foco e autocontrole, ajudando-a a melhorar a capacidade de concentração.
Por fim, ao praticar o basquete de bexiga, a criança demonstrou precisão tentar acertar a bexiga no alvo. Com golpes bem calculados, trabalhou sua coordenação motora fina e grossa, reagindo rapidamente às variações na trajetória da bexiga. Além disso promovendo momentos de interação e colaboração. Finalizamos com o uno o jogo trouxe descontração, risadas e desafios, enriquecendo ainda mais a experiência motora e social.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina , memória, logica , encaixes, posicionamento na cadeira de rodas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos IS, letras e números, encaixes , motricidade fina , formar palavras simples, logica e espera. Ansiosa e melhora no tempo de execução da atividade',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atendido na recepção. Chorou antes de entrar na sala, preferência por estabelecer um vínculo prazeroso associado a sessão. Após certo tempo, começou a interagir com a Terapeuta de forma espontânea. Bastante comunicativo, tentativa de fala, uso de entoação e preferência por músicas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'João Henrique Barbosa Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'João Henrique Barbosa Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-02'::date
      LIMIT 1
    ),
    True,
    'João tem 4 meses, nasceu de 28 semanas, ficou 70 dias na UTI. 
Faz fisio 2 vezes por semana, sessoes de estimulação. Apresenta desvio de pescoço a direita, pouco controle cervical. Estava dormindo em sessão.
Mae diz que dorme pouco, cerca de 30 minutos por vez.
Mae acredita que não apresenta interação de sorriso social. Moram avô, João, mãe e irma de 10 anos. Mãe trabalha o dia todo mas o leva junto. 
Tem estimulado João colocando-o em decúbito ventral algumas vezes por dia.
Não se interessa por brinquedos, proponho que nosso processo terapêutico se inicie na experimentação. Mãe aceita.
Solicito que traga manta/lençol para coloca-lo no colchonete.',
    'Avaliação do paciente junto a mãe.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Victor está bem ativo na recepção, solicita que a mãe entre junto. Bom aproveitamento da sessão. Explico a mãe que estamos trabalhando a questão da comunicação, incluindo alguns conceitos e principalmente o "pedir ajuda"',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia trazer caderno de desenho que tem desde 2023 para mostrar. Desenhos característicos estilo "anime", lágrimas, personagens em pedaços, um auto retrato e recentemente um croqui. Diz se interessar por moda. Elogio pois os desenhos são realmente bons.
Conversamos sobre a importância de ter espaços onde possa ser "ela mesma". Diz reconhecer o espaço da terapia como um deles, que gosta de vir e se sente bem',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Entra sem a mãe, retomamos as brincadeiras do dia anterior. Melhor interação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atendo Rafael seu filho que compartilhou dificuldades familiares',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia vem toda arrumada, social, de salto. Elogio.
Conta que foi a casa de um amigo neste final de semana, ficou um tempo conversando com o mesmo, achou legal.
Fala sobre interesses diversos, principalmente questões de relações internacionais. Digo que esses interesses são relacionados à geografia e história.
Temos trabalhado questões de auto aceitação e como conseguir se colocar no mundo.
Livia traz muitas questões de nao conseguir ser "ela mesma" junto a outras pessoas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Victor se dirige a sala sozinho, porém após cerca de 15 minutos de atividade demonstra desconforto, desconfio que deseja usar o banheiro, mas nega ao ser perguntado. Após isso, dirige-se para fora da sala. Solicito a mãe que acompanhe o restante da sessão. Victor demonstra desconforto e mae leva-o ao banheiro.
Victor demonstra-se cansado, preferindo realizar as brincadeiras deitado. Temos feito atividades onde pode ser incluído pedidos de ajuda, para aumentar a interação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-15'::date
      LIMIT 1
    ),
    True,
    'Paciente com encaminhamento médico de leve atraso de DNPM devido ao mesmo possuir 9 meses de vida e não estar engatinhando/ saindo da postura de prona. O mesmo não apresenta reflexos primitivos presentes, sem alteração tonica e ou assimetrias aparentes. Apresenta discreta fraqueza de MMSS e MMII cujo não consegue sustentar por longo tempo o corpo para engatinhar. O mesmo não gosta da postura e apresenta choro, negação e estresse quando colocado nessa postura. Sustenta sentar mas não realiza troca postural.',
    'Avaliação. Oriento familiar a dar continuidade a estímulos em movimentos cruzados, postura de engatinhar, forçar o uso de MMSS e MMII, sentar sobre a perna.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Descrição da Atividade:
Pietra participou de uma proposta lúdica envolvendo diferentes jogos que estimularam habilidades motoras, coordenação e percepção:
Jogo com raquete e bexiga: Trabalhou coordenação motora ampla, atenção e tempo de reação ao manter a bexiga no ar usando a raquete.
Pescaria: Atividade de motricidade fina, exigindo precisão e controle manual ao pegar os peixinhos com a varinha.
Jogos de percepção: Foram realizados jogos voltados à atenção visual, identificação de cores, formas e estímulos sensoriais.
Desempenho e Interação:
Pietra aceitou bem a proposta, mostrou engajamento nas atividades e participou com interesse.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Objetivos e Benefícios da Atividade: Bola Suíça 

Fortalecimento Muscular: Ao manter-se sentado na bola, Benjamin ativou músculos do tronco e das pernas para manter o equilíbrio, promovendo o fortalecimento da musculatura postural.

Coordenação Motora: A necessidade de realizar pequenos ajustes posturais para permanecer estável contribuiu para o desenvolvimento da coordenação entre os segmentos do corpo.
Equilíbrio e Propriocepção: A instabilidade natural da bola exigiu maior percepção corporal, estimulando o equilíbrio e a consciência do próprio corpo no espaço.
Estímulo Sensorial: O contato tátil com a superfície da bola e os movimentos de empurrar, proporcionaram uma experiência sensorial que pode ser ao mesmo tempo relaxante e estimulante.

Motricidade Fina Pescaria: Durante a atividade, Benjamin foi incentivado a realizar uma pescaria com varinha e peixinhos, que exigiu movimentos e interações das mãos e dos dedos, promovendo o desenvolvimento da coordenação motora fina, atenção visual e controle muscular.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuação de montagem de quebras cabeças- ajuste fino da coordenação motora',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Entra sozinho, explora a sala. Interessa-se por contar até 10. Gosta de explorar objetos diferentes. Reforço para utilização de msd nas atividades. Aceita.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Entra somente com a mãe, chora, mas menos tempo que da sessão anterior. Após um tempo de sessão mãe consegue se retirar. 
Exploramos animais, formas e cores. Interessa-se bastante por nomear as coisas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Gael Matins Teixeira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Mae solicita trocar para uma clínica mais próxima ao local de moradia, Jacarei. Sessao de fechamento com Gael e devolutiva para a mãe',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'João Henrique Barbosa Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'João Henrique Barbosa Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Joao apresenta sorriso social em alguns momentos, segue com o olhar os movimentos da terapeuta. Apresenta intencionalidade em levar as mãos a boca. Sugiro que a mãe estimule com brinquedos.
Interessa-se bastante por estímulos luminosos. Percebe-se incômodo ao virar a cabeça para o lado esquerdo, chega a chorar. Oriento mãe quanto a brinquedos para estímulo, laváveis, que possam ser levados a boca. Apenas um de sua escolha luminoso e com som ao apertar para estímulo e estilo chocalho para estimulamos o movimento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão de reposição do feriado. Bom aproveitamento, retoma as brincadeiras que brincamos ontem e consegue acrescentar novos elementos(trocar o carrinho comigo). Interesse por instrumentos musicais',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuação da atividade anterior. Coordenação motora fina, movimento de pinça',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Leo bastante colaborativo. Uso funcional de MS na brincadeira, gosta de realizar as atividades sozinho. Melhora na interação, verbalizar bastante sons.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Permaneceu alguns momentos sozinho sem a mãe na sessão. Utilização do recurso de musicoterapia',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Bom aproveitamento. Utilização de elementos da musicoterapia para recursos de comunicação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-23'::date
      LIMIT 1
    ),
    False,
    'Descrição da Atividade:
Pietra participou de uma proposta que integrou coordenação motora, equilíbrio e estímulos cognitivos:
Prancha de equilíbrio com argolas: sobre a prancha de equilíbrio segurando uma bola e, ao final, realizou o encaixe de argolas nos cones, trabalhando equilíbrio, coordenação motora ampla e fina, além de atenção.
Arremesso de bolas grandes e pequenas: Estimulou força, coordenação visomotora e noção espacial ao lançar bolas em diferentes direções.
Jogos de percepção e matemática: Participou de atividades lúdicas envolvendo contagem, reconhecimento 
 formas e associação de quantidades, promovendo atenção e raciocínio lógico.
Desempenho e Interação:
Pietra participou com interesse, interagiu bem com os desafios propostos e manteve-se concentrada durante toda a atividade.',
    'Descrição da Atividade:
Pietra participou de uma proposta que integrou coordenação motora, equilíbrio e estímulos cognitivos:
Prancha de equilíbrio com argolas: sobre a prancha de equilíbrio segurando uma bola e, ao final, realizou o encaixe de argolas nos cones, trabalhando equilíbrio, coordenação motora ampla e fina, além de atenção.
Arremesso de bolas grandes e pequenas: Estimulou força, coordenação visomotora e noção espacial ao lançar bolas em diferentes direções.
Jogos de percepção e matemática: Participou de atividades lúdicas envolvendo contagem, reconhecimento 
 formas e associação de quantidades, promovendo atenção e raciocínio lógico.
Desempenho e Interação:
Pietra participou com interesse, interagiu bem com os desafios propostos e manteve-se concentrada durante toda a atividade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-23'::date
      LIMIT 1
    ),
    False,
    'Descrição da proposta: circuito motor 
Benjamin participou de um circuito motor com foco em coordenação, equilíbrio e motricidade fina:
Subida e descida em elevado: Trabalhou força e coordenação motora ampla.
Prancha de equilíbrio: Estimulou o controle postural e equilíbrio.
Pareamento de argolas nos cones coloridos: Desenvolveu atenção, percepção visual e motricidade fina.
Tanque de areia com pinça: Usou pinça para encontrar mini dinossauros, exercitando coordenação fina, força dos dedos e percepção tátil.
Desempenho e Interação:
Benjamin interagiu bem com a proposta, mostrou interesse e participou ativamente de todas as atividades proposta.',
    'Descrição da Atividade: circuito motor 
Benjamin participou de um circuito motor com foco em coordenação, equilíbrio e motricidade fina:
Subida e descida em elevado: Trabalhou força e coordenação motora ampla.
Prancha de equilíbrio: Estimulou o controle postural e equilíbrio.
Pareamento de argolas nos cones coloridos: Desenvolveu atenção, percepção visual e motricidade fina.
Tanque de areia com pinça: Usou pinça para encontrar mini dinossauros, exercitando coordenação fina, força dos dedos e percepção tátil.
Desempenho e Interação:
Benjamin interagiu bem com a proposta, mostrou interesse e participou ativamente de todas as atividades proposta.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Akio não compareceu. Comparece sua esposa Eliana queixou-se da postura irredutível de  Akio em alguns momentos . Falamos sobre as queixas constantes de cansaço, e aparentemente desmotivação. Sugiro conversar com a médica do caso sobre suplementação para ajuda lo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia conta que foi a casa de um amigo. Passou o dia la, foram ao shopping.  Sentiu-se bem. Conta sobre dificuldade em se alimentar, alteração na percepção corporal. Falamos sobre família. Este assunto a deixa emocionalmente instável. Mostra-me frases que selecionou de livros. Falamos sobre.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Termino da montagem do quebra-cabecas. Conversamos sobre a importância de realizar atividades no dia a dia. Oriento exercícios para a mao e reforço orientações ja passadas anteriormente sobre a importância da postura, principalmente em repouso.jorge diz que nao costuma realizar os exercícios orientados em casa. Conversamos sobre.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atendimento em sala diferente da habitual. Victor estranhou um pouco mas foi colaborativo. Brincou com recursos diferentes. Ao final da sessão, buscou espontaneamente interação com a terapeuta.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente acordado, alerta, contactuante e colaborativo. Ativo, chegou ao setor ao colo da avó , corado, hidratado e em beg. Foi realizado como conduta estimulação da posição de prona com baixa aceitação pelo paciente, adoto postura de quatro apoios e estimulação anterior, apoio em pés para induzir a movimentação de mmii, “carrinho de mão” estimulando descarga de peso de membros superiores, balance latero lateral e anterior posterior, movimento ritmos trocados de mmss e mmii estimulando movimento de marcha. Estimulação em postura alta com apoio em joelhos. Estimulação de balanço  e avanço para engatinhar.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente acordado, alerta, ativo em beg, acompanhado da avó e da mãe. Foi realizado estimulação de postura em quatro apoio, fortalecimento de membros superiores com “carrinho de mão “ e apoio abdominal , estimulação a posturas altas e manipulações de brinquedos ativando dupla tarefa, apoio podal para engatinhar . Porém paciente resistente a postura de prona. Estimulação de mmii com apoio de joelhos e controle de tronco.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-05'::date
      LIMIT 1
    ),
    True,
    'Mae vem acompanhada do paciente. Explora bem a sala, dificuldade em manter-se em uma atividade so. Pede para desenhar, atento ao que a mãe fala, fazendo intervenções quando nao concorda.
Mas diz que tem diagnostico de Tdah, apresenta tiques involuntários em certas ocasiões. Realiza outras atividades fora a escola (frequentar pela manha), jiu-jitsu, robótica, reforço escolar e psicoterapia.
Mae refere manter rotina rígida quanto ao horário de refeicoes e sono. Dorme bem e come bem.
Agitado desde bebe, mae refere atraso para andar (2a) e fala.
Neuro investigar TEA por conta de referênciada rigidez cognitiva. Mae nao concorda totalmente, em investigação com neuropsicologa, termina em julho.
Joaquim apresenta dificuldade em seguir regras da sala, mesmo após combinado de guardar os brinquedos após o uso.
Combinamos manter esse horário da sessão.
Em uso de Comcerta pela manha.
Mae refere perceber certa melancolia após término do efeito, mais ou menos 8h.
Escola sem queixas no momento, realiza atividades adaptadas.
Expectativa da mãe esta em melhorar a concentração.',
    'Avaliação primeira vez',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia trouxe como proposta fazermos uma linha do tempo de sua vida escolar. Traz elementos de memória dela mesma e elementos que são relatos da mãe. Ao final, diz nao querer retornar a escola, principalmente em uma escola nova.
Seleciona frases para que conversamos sobre. Retornamos ao assunto familia ideal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra participou com entusiasmo das atividades propostas, Iniciou com o jogo “pula-pula”, integrando a brincadeira de basquete com bexiga, o que favoreceu a coordenação motora global, o equilíbrio e a noção espacial. Em seguida, realizou atividade na prancha de equilíbrio, utilizando prendedores de roupa fixados na vestimenta, estimulando a coordenação motora fina, o tônus e a lateralidade. Posteriormente, participou de um jogo de cores, promovendo a atenção, percepção visual e associação de estímulos. Finalizou a sessão com massinha de modelar, atividade que trabalhou a motricidade fina, a criatividade e a exploração sensorial. Pietra demonstrou boa participação e envolvimento ao longo de toda a sessão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin participou ativamente da sessão de psicomotricidade, realizando diferentes propostas com boa aceitação. Iniciou o circuito motor utilizando a prancha de equilíbrio, demonstrando coordenação e atenção ao percorrer o trajeto. Em seguida, realizou atividade de boliche, que exigiu organização motora, força e direcionamento do movimento. Por fim, participou de uma atividade de linguagem, realizando a nomeação de imagens de animais, o que favoreceu a ampliação do vocabulário e a estimulação da linguagem expressiva. Durante toda a sessão, mostrou-se engajado e cooperativo, respondendo bem aos estímulos propostos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    True,
    'Mae diz que tem HD de TDah nao confirmada. Percebe dificuldade na atenção nas tarefas cotidianas. Sem atraso no desenvolvimento neuropiscomotor. Aprendeu a escrever o nome com 3a e ler letra cursiva aos 5.
Mae refere so ter aparentado agora essa falta de atenção. Em investigação para tea tambem. Sem questoes relevantes quanto ao comportamento.
Mae refere que escola diz que tem dificuldade na coordenação motora fina mas Mae não percebe nas tarefas cotidianas apenas na escrita.',
    'Primeira avaliação',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'João Henrique Barbosa Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'João Henrique Barbosa Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sorriso social mais presente, levando mao e objetos a boca. Preferência pela mao esquerda.
Procura a mãe ao ouvir a voz,',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chegou atrasado pois fiz ter pedido a hora e veio com carro próprio.  Estava de andador.  Exercícios de coordenação motora fina.  Não realizou exercícios em casa,  mas diz que irá. Sugiro aumentarmos número de sessões.  Diz que para 5a feira que vem não consegue agendar o carro e não gostou de vir com o carro próprio. Combinamos aumentar após o feriado',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Leo entra espontaneamente sozinho, aceita brincadeiras propostas. Na mesma sala, Benjamin estava em atendimento,  se interessando bastante pela atividade que o outro fazia.
Permaneceu bastante tempo na atividade de desenho, identificando formas e tentando falar seus nomes. Reforçado o uso das duas maos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorou por 3 vezes chamando a mãe, mas logo parou. Gosta de música e gestos combinando. Tenta verbalizar a música que quer, boa comunicação',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Victor apresenta melhora na interação ao final da sessão, verbalizando algumas palavras como cores e números.
Duas vezes faz contato ocular para garantir que o estou entendendo.
Aceita explorar alguns instrumentos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin participou de um circuito motor com prancha de equilíbrio.
Ele começou caminhando sobre a prancha com apoio das mãos de um adulto, para manter o equilíbrio. Demonstrou esforço e atenção ao se manter em pé. Após a prancha, pulou com ajuda dentro e fora de aros no chão. Em seguida, engatinhou por um túnel baixo, e finalizou passando por cima de colchonetes macios.
Benjamin participou com interesse e aceitou os comandos com apoio. A atividade trabalhou o equilíbrio, a coordenação motora, a força e a confiança nos movimentos. Teve bom envolvimento e respondeu bem aos estímulos motores propostos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou uma atividade com prancha de equilíbrio e raquete de tênis.
Ela caminhou sobre a prancha com cuidado, segurando uma raquete. Durante o percurso, precisou rebater uma bexiga no ar, mantendo o foco e o equilíbrio ao mesmo tempo.
Pietra demonstrou boa coordenação e atenção. Em alguns momentos perdeu o equilíbrio, mas se reorganizou com apoio leve. A atividade trabalhou o equilíbrio, a coordenação motora, o controle postural e a atenção dividida.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-11'::date
      LIMIT 1
    ),
    False,
    'Acordado, alerta, corado e ativo.',
    'Realizado estimulação de postura quatro apoios. Com descarga de peso em membros superiores e dupla tarefa com brinquedos a frente, descarga de peso em quadril e coluna lombar com sentar de joelhos, realizando movimentos de impulso para elevar a postura movimentos associados a dupla tarefa com brinquedos atrativos , realizo estimulação de cadeia extensora de tronco , coo contração de postura quatro apoios, estimulação rítmica de movimentos de membros inferiores com e sem residência.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-11'::date
      LIMIT 1
    ),
    True,
    NULL,
    '1. Identificação e Queixa Principal

Valentina, 10 anos, estudante do 5º ano do Ensino Fundamental, é a filha mais nova de três irmãos. Reside com os pais e a irmã de 18 anos, portadora da Síndrome de Down. O irmão mais velho cursa faculdade e mora na cidade de Campinas (SP).

A mãe procurou atendimento psicológico relatando dificuldades de convivência com Valentina, especialmente diante da resistência da criança em aceitar limites, com comportamentos de enfrentamento e oposição. Relata que a filha demonstra incômodo com a atenção dada à irmã, que exige cuidados especiais devido à sua condição. 

2. Histórico Familiar e Desenvolvimento:

Valentina é a filha caçula de três irmãos. O irmão mais velho reside em Campinas (SP). A paciente não apresenta histórico de atrasos no desenvolvimento e tem bom rendimento escolar. Relata boa convivência com amigos, pai, irmão e avó materna  que, segundo ela, a considera a neta favorita.

3. Observações Clínicas:

Durante o atendimento, Valentina mostrou-se comunicativa, com bom vínculo e expressão emocional compatível com a idade. Apresentou vínculo adequado com a terapeuta e boa capacidade de expressão emocional.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos alfabeto , escrita, calendário com sucesso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco; atenção e raciocínio lógico, reconhecimento de letras e fomeacao de.palavras . Hoje estava mais disperso. Porém colaborativo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Refere não ter dormido bem . Trabalhamos memória. Dificuldade na memorização de curto prazo , realizamos desafios de padrões matemáticos para raciocínio cognitivo .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Primeiro atendimento. Joaquim tem dificuldade em manter os combinados e testa-os por diversas vezes. Dificuldade em aceitar opiniões diferentes porém é colaborativo e realiza interação. É bastante agitado, explora a sala, monta um circuito. Ao final, pergunta se pode desenhar. Explico que temos somente 5 minutos e se consegue cumprir esse combinado de terminar no tempo.
Nao termina o desenho e demonstra frustração mas sai da sala no horário combinado. Trazido pelo pai',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia elabora sobre dia dos namorados e sobre relações (amorosas ou nao). Falamos sobre terapia e sobre amizade.
Sessão da semana que vem mae nao sabe se conseguirá traze-la mas dará a devolutiva na 2a feira.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Leo então animado. Peço que a mãe entre junto para devolutiva e para explicar que nao poderei mais atende-lo neste horário. Mae aceita trocar pela 3a feira as 17h30. Seguiremos neste dia e horário a partir da outra semana entao.
Leo explora o ambiente, converso com a mãe sobre evolução e independência do mesmo
 Mae diz que a escola tem se queixado bastante da agressividade dele. Peço que solicite um relatório a escola para tentarmos entender essa atitude.
No decorrer na terapia, Leo simboliza um animal de brinquedo batendo em outro. Sinalizo que esta atitude nao é correta e Leo parece compreender e faz uma "careta". Ao final colabora guardando os brinquedos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin entra sem chorar, escolhe brinquedos e brincadeiras. Pergunta pela mãe menos vezes na sessão. Brincamos de massinha, fazendo animais e cantando suas músicas. Benjamin imita bem os gestos e parece bem sorridente hoje.
Explico para a mãe que nao conseguirei mais atende-lo neste horário habitual e ofereço outros horários disponíveis porém mãe nao consegue traze-lo nos horários oferecidos.
Combinamos encerramento da terapia para semana que vem e digo que irei entregar relatório de acompanhamento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Victor Nogueira De Aguiar' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Victor entra espontaneamente. Melhora na interação, busca a terapeuta, pede um brinquedo que nao encontra (caminhão de lixo), pede ajuda conforme nossos combinados. Ao final da sessão, explico para a mãe que este horário de 6a feira nao conseguirei mais atender na Clinica. Ofereço outros horários na 3a e na 4a porém mãe diz que prefere que seja pela manha, nao sendo possivel entao continuar com esta terapeuta. Realizamos o encerramento, coloco-me a disposição para qualquer esclarecimento, digo que entregarei relatório de encerramento. Mae questiona se eu acho que Victor deveria continuar fazendo Terapia Ocupacional, uma vez que ja nao tem mais tanta sensibilidade a roupas e sapatos. Explico que acredito que sim, que na minha avaliação Victor nao teria alta e deveria continuar a terapia. 
Mae diz que irá viajar semana que vem no feriado e nao consegue traze-lo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atendimento online , solicitado pela filha 
Apresnta olho direito mais fechado que o esquerdo. Boca virada para a direita , pergunto sobre sensibilidade informa que diminuída e derrama líquido ao.beber.
Atendo , está lúcida, responsivo e sorridente .

Orientação: 
1. Procurem um serviço de emergência
 (preferencialmente com neurologista).
2. Observe e anote os sinais e o horário exato dos sintomas
Isso é crucial para a equipe médica decidir sobre tratamentos como o uso de trombolíticos (em casos de AVC isquêmico, apos avaliacao medica , claro !).
3. Evite dar alimentos ou líquidos
A alteração de sensibilidade e assimetria facial pode indicar risco de aspiração (engasgo).
4. Acalma la e mantenha-o em repouso, ela eata bem , resistiva e lúcida, e um bom sinal geral 
Peco que a filha Fique por perto observando ,  não aconselho esperar em casa para ver se melhora.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin participou de uma atividade de psicomotricidade com jogos de encaixe das vogais.
Ele utilizou os dedos em movimento de pinça (polegar e indicador) para segurar as letras A, E, I, O, U e encaixá-las nos espaços correspondentes. Demonstrou atenção ao explorar o formato das peças e usou a coordenação motora fina para ajustar cada letra no lugar certo.

A atividade trabalhou a coordenação visomotora, o fortalecimento da musculatura dos dedos, a preensão em pinça e o início do reconhecimento das letras. Benjamin participou com interesse e foi estimulado com apoio verbal e incentivo positivo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente apresenta melhora da dor. Apresentou se no consultório sem auxílio de dispositivo de marcha apresentando aumento na velocidade da marcha . Durante a terapia foi realizado agulhamento em coluna lombar com elétro ( tens burst sendo frequência de 50hz , au de 250 us , por 15 minutos com intensidade superior a 10). Liberação mio facial lombar e região, mobilização articular maitland 2/3 ap em lombar , séries de exercícios para mobilidade toracolombar, fortalecimento de músculos dorsais, membros inferiores e superiores. Finalizo com alongamento global.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-14'::date
      LIMIT 1
    ),
    False,
    'Sonolento em despertar, em momento de negação a terapia. Hidratado, corado e em bom estado geral.',
    'Estimulação de postura quatro apoios, estimulação de movimentos rítmicos com música de membros superiores e inferiores, posicionamento de postura de quatro apoios com sustentação abdominal, atividades altas de sentar e levantar, estímulo postura alta e controle postural.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos estimulação tátil, auditiva , vestibular , proprioceptiva, encaminho para psicomotrucidade pois tem demonstrado bastante dificuldade motora e fragilidade muscular',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Responsivo, demonstrar melhora na motricidade fina , voltou a escrever melhor motricidade.que lentamente , mais desperta e ativa',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Triste , verbaliza preocupação com depressão, evasiva ao olhar olho no olho , relata estar tudo bem , queixa se pois está sem rotina e está perdida no dia a dia . Trabalhamos coordenação bianual e visomotora , trabalhamos sentimentos diante dos fatos da sua vida , falo sobre a importância das terapias e da rotina',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos cognição e logica sem intercorrencias',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memórias de longo prazo , demonstrou dificuldade e alguns nomes familiares relata esquecimento',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Defecou 3 vezes , trabalhamos AVDs
Humor oscilando , quebrou uma peça do quebra cabeça propositadamente, realizou as atividades propostas de foco, atenção, enfatize que hoje não teria surpresa ao fim da sessão devido ao seu comportamento, se desculpa demonstrando entendimento . Faço estimulação multissensorial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina, demonstra melhora nos movimentos dos MMSS, escrita, melhora na coordenação motora fina global, menos tremores, responsiva, ativa, falante, teabalhamos tambem cognição e memoria.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Exercícios de estimulação em quatro apoios, apoio anterior com dupla tarefa de pegar objetos e jogar. Estimulação de postura de transição de sentado para quatro apoio e vice e versa, estimulação rítmica de mmii elevado com apoio de mmss em ccf. Estimulação de uso de mmii em ortostatismo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esposa queixa se de hipoativvidade em casa , falta iniciativa, por ser uma wueixa recorrente sugiro aumentar número de sessoes .
Trabalhamos memória de longo prazo : demonstrou dificuldade em lembrar de nome de daniliares proximos , por um momento esqueceu o nome da filha .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chegou mais agitado, demorou para conseguir se concentrar, trabalhmos estimulação multissensocial, foco, atenção, tempo de espera e troca de turno com sucesso.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Alinhamos expectativas frente a terapia. Peço a Nathan que traga suas dificuldades da rotina pratica , enfatizo que estamos trabalhando sua pré alta pois as demandas foram trabalhadas e ele segue estavel e tem condições de seguir. Iniciamos atividade voltada a elaboração de um projeto do inicio ao fim para trabalhar as habilidades praticas de organização, elaboração de trabalho, etapas, execução e apresentação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atendimento online, familia refere que carro quebrou e nao podera vir. Realizo atendimento online a pedido da familia. Aparecida se manteve mais distante, menos entrega e conteudo pessoal na versao online. Trabalhamos cognição, raciciocinio, identificação de figuras e memoria.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Segundo a genitora tem tido episódios de rigidez, pouca negociação, nao acolhe as orientações verbais e se irrita. Na sessao Maria demonstra a inflexibilidade cognitiva , de dificil negociação e nao aceita ajuda, se cobra pelos erros das atividades, dificuldade significativa na fala, algo sonolenta e cansada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'reposição do dia 19/06. Chegou animada, falante, feliz pois tambem fara psicomotricidade, tranalhamos estimulação tatil, iniciamos alinhavos. Sem intercorrencia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'A paciente Valentina compareceu pontualmente à sessão. Iniciou compartilhando espontaneamente sobre sua semana, trazendo relatos positivos relacionados ao ambiente familiar e escolar. Descreveu boa convivência com os colegas e professores, assim como em casa, demonstrando vínculos afetivos estáveis. Mencionou sentir, em alguns momentos, ciúmes da irmã, embora tenha afirmado gostar muito dela, demonstrando ambivalência emocional típica da fase do desenvolvimento.

Intervenção Realizada:
No segundo momento da sessão, foi proposta a atividade lúdica dos “objetos ocultos”, com o intuito de favorecer a observação, atenção, linguagem e expressão emocional da paciente de forma simbólica. Valentina demonstrou engajamento e boa participação durante a atividade, mantendo-se interessada e colaborativa ao longo do processo.

Observações:
A paciente apresentou-se tranquila, com comportamento compatível à faixa etária, comunicativa e cooperativa durante todo o atendimento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Estimulação de busca, incentivando a busca de objetos coloridos e com som.Exercícios de estimulação em quatro apoios, apoio anterior com dupla tarefa de pegar objetos e jogar. Estimulação de postura de transição de sentado para quatro apoio e vice e versa, estimulação de reação de lateralidade , correção e troca de postura em rotação, estimulação rítmica de mmii elevado com apoio de mmss em ccf em arco elevado, cocontracao de mmii. Estimulação de uso de mmii em ortostatismo. Estímulo alto com apoio em joelhos, auxílio de troca de passos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente solicita aumento de sessões semanais, passara também as quintas feiras 14h, passando a realizar atendimento de TO 3 vezes na semana de 50 mn. Continuamos atividade de memoria de longo prazo iniciada na ultima sessão, Sr Akio demonstra dificuldade em se recordar nome de familiares. Esposa ciente e de acordo com o aumento das sessoes.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chega animado para a sessao, ativo, dificuldade de foco e atenção, precisamos negociar para realizar as atividades propostas, recomhece letras e ja forma nome dos familiares com as letras. Estimulação multissensorial com sucesso.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'falta por febre',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Calma, algo sonolenta, responsiva, conta que foi para sua casa de praia no feriado. Trabalhamos motricidade fina com sucesso, memoria, alinhavos e encaixes com sucesso
Nota que se confunde em alguns momentos para formas palavras com letras',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chegou atrasada 20 mn, solicitante por fazer colagem com papeis, trabalhamos encaixe das letras, compreensão de "encima, abaixo, do lado direito e esquerdo", algo ansiosa o que atrapalha seu desempenho. Trabalhamos estimulação multissensorial com sucesso,',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Relata estar com sonhos referentes de quando dava aula, falamos sobre propósito de vida , sentido da vida , reconhece que está bem de saúde, relata fazer as atividades em casa e diz que o clima no lar está mais ameno. Realizamos atividades lógicas, estimulo ao pensamento e estratégias. Sen intercorrencia',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos Foco, atenção, negociação verbal e acordos , calmo, responsivo, conta que ganhou presentes dos pais hoje cedo e está feliz . Tende a realizar o que deseja mas sob orientação respondeu bem cedendo as suas vontades em prol da atividade proposta . Quando seninteressa pela atividade consegue focar e concentrar . Sem dificuldades motoras .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos operações matemáticas, jogos competitivos ( foi muito bem ), pouco dialogo, refere estar melhor da gripe , ainda com respiração dificultoso pelo nariz , consegue desncokver estratégias nos jogos competitivos. Evolução no raciocínio lógico.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Faal sobre férias de julho e expectativa de viagem em família, relata mão ter trabalhado na atividade proposta pois está em semana dr provas , trará na próxima semana . Realizo jogos competitivos , sem intercorrencia. Aceita perder , não demonstrar rigidez cognitiva',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Aplicamos portage parcialmente',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sonolenta , trás uma lembrança, falamos sobre seu aniversário, trabalhamos atividades para flexibilidade cognitiva, ainda com muita dificuldade, organização material a seu modo e se desagrada quando mudo a ordem , responsivo, mas aparentemente cansada. Usamos atividades que envolvem temática banho , o que usamos para banho , porque o banho faz bem .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Valentina compareceu ao atendimento apresentando-se tranquila e receptiva. Compartilhou vivências recentes, incluindo sua participação na festa junina, descrevendo a experiência com entusiasmo. Relatou que mantém uma boa convivência com os amigos e familiares, sem trazer queixas relevantes nesse momento.

Intervenção Realizada:
Na segunda parte da sessão, foi realizada a atividade lúdica do jogo da memória, com o objetivo de estimular habilidades cognitivas como atenção, concentração, memória visual e raciocínio lógico, além de promover o fortalecimento do vínculo terapêutico e a socialização. Valentina participou de forma ativa, demonstrando interesse e boa interação com a profissional durante a atividade.

Observações:
A paciente mostrou-se colaborativa e com comportamento compatível à faixa etária, mantendo um bom engajamento durante toda a sessão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Joaquim reagiu a sala diferente. Tem reações de recusa as atividades propostas e dificuldades em cumprir combinados, buscando frequentemente quebrar as regras, porém sempre de maneira respeitosa, mais explorando as reações as suas atitudes. 
Jogou lince de forma a se concentrar a procurar as figuras e realizando a atividade de modo satisfatório e adequado. Em determinado momento espalhou todas as peças inviabilizando continuar a atividade. Logo depois me ajudou a guardar e organizar a sala tranquilamente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Demonstra melhora significativa na preensão, na escrita , na coordenação viao motora, responsiva, colaborativo, reconhece sua evolução',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-26'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos estimulação sensorial com foco na estimulação tátil e auditiva , coloca objetos na boca várias vezes. Tempo de atenção sustentada é curto , nota se alguma rigidez cognitiva e solicitação por previsibilidade. Realizou as atividades propostas porém nao conseguiu sustentar o foco e atenção.Trabalhamos equilíbrio, lateralidade, pular .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia chegou parecendo contrariada. Nao quis realizar a atividade proposta de conversarmos sobre as frases escolhidas durante a semana. Após alguns momentos de dialogo se fechou e nao quis mais conversar.
Encerramos a sessao 15 minutos mais cedo',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Veio trazido pelo pai. Fizemos um circuito para atividades. Realizamos combinados e Joaquim pareceu mais acessível a respeita-los.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther colocou a mão dentro de uma caixa com vários objetos de texturas diferentes, como algodão, esponja, lixa, tampa de garrafa e tecidos.
Ela explorou os objetos usando as mãos. Quando pegou o algodão, disse que era macio. Ao tocar a lixa, falou que era áspera. A esponja ela apertou e achou mole. A tampa de garrafa sentiu que era dura.
Durante a atividade, a criança falou ou ouviu os nomes das texturas. Também encontrou um objeto igual fora da caixa usando só o tato.
Ela participou bem, mostrou curiosidade e prestou atenção. A atividade ajudou a desenvolver a percepção tátil e linguagem.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Hoje Benjamin participou de um circuito motor sobre elevado almofadado.
Ele caminhou sobre uma superfície elevada feita com colchonetes e almofadas grandes, precisando manter o equilíbrio. Em seguida, pulou de um ponto para outro, ainda sobre as partes macias. Depois, de andar por cima dos acolchoados até o final do percurso andou sobre a prancha de equilibrio.
Benjamin se divertiu, participou com interesse e precisou de apoio pra andar sobre os  trechos. A atividade ajudou a trabalhar o equilíbrio, a coordenação motora, a força e a percepção do corpo em movimento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Hoje iniciamos o primeiro atendimento fizemos a atividade "Caixa dos Sentidos".
Esther colocou a mão dentro de uma caixa com vários objetos de texturas diferentes, como algodão, esponja, lixa, tampa de garrafa e tecidos.
Ela explorou os objetos usando as mãos. Quando pegou o algodão, disse que era macio. Ao tocar a lixa, falou que era áspera. A esponja ela apertou e achou mole. A tampa de garrafa sentiu que era dura.
Durante a atividade, a criança falou ou ouviu os nomes das texturas. Também encontrou um objeto igual fora da caixa usando só o tato.
Ela participou bem, mostrou curiosidade e prestou atenção. A atividade ajudou a desenvolver a percepção tátil e a linguagem.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Henrique Silva Moreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Lucas Ferreira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Estimulação de equilíbrio em tenda , arco e no solo em posturas de quarto apoio, ortostatismo, estimulação de busca em objetos coloridos e de interesse do mesmo. Estímulo movimentação de mmii com mudança de passos com as mãos,  estímulo com bolas e arcos. Estimulação de postura alta e transição para posturas baixar. Estimulação com cocontracao em bola.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco, atenção, competição e estimulaçao sensorial',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos cognição, foco,raciocionio matematico',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Apsarecida Argona' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Apsarecida Argona' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-30'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos motricidade fina, acolho luto e frustrações durante as atividades.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'trabalhamos motricidade fina, significativa melhora na escrita e na pinça',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos estimulação tatil, auditiva e locomoção na sala identificando obstaculos. Trabalhamos higiene pessoal ao uso do banheiro, lavagem das maos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-06-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou a atividade na prancha de equilíbrio, mantendo-se em pé e trabalhando a coordenação motora global, o equilíbrio corporal e a noção de eixo corporal. Em seguida, participou da brincadeira de “tênis com bexiga”, utilizando uma raquete para rebater a bexiga no ar. Essa proposta estimulou a coordenação óculo-manual, a atenção, a percepção espacial e o tempo de reação. A atividade também favoreceu o controle postural e o ajuste de movimentos finos e amplos, sendo importante para o desenvolvimento da organização motora e da lateralidade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trazido pelos avos. Expressa desconforto ao reconhecer que esta sendo atendido em sala diferente. Demonstra cansaço/sono no atendimento mas realiza as atividades propostas. Foi proposto atendimento dobrado porém conseguimos realizar apenas meia hora de atendimento a mais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Nesta semana, Valentina apresentou um estado emocional tranquilo e trouxe questões relacionadas à família, que já se encontra de férias. Durante o atendimento, falou de forma espontânea e serena sobre essas situações, demonstrando boa organização do pensamento e afetividade adequada.

No segundo momento da sessão, foi realizada uma atividade lúdica com o quebra-cabeça. Valentina aderiu bem à proposta, demonstrando interesse, atenção e boa participação ao longo da atividade.

Em geral, manteve-se colaborativa e engajada durante toda a sessão, evidenciando bom vínculo terapêutico e disposição para as atividades propostas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Primeiro atendimento. Adequada as atividades propostas, permanece a sessao sentada, gosta de jogos. Nao tem objeções por perder, respeita as regras, tolerância a frustrações.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'João Henrique Barbosa Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'João Henrique Barbosa Costa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Joao estava animado, acordado, intenção de pegar o brinquedo e leva-lo a boca, ficando irritado quando isso nao acontece. Permanece bastante tempo nesta atividade. Mae pede para encerrar a sessao antes pois diz estar com sono.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizando atendimento psicológico individual. Durante atendimento, a paciente apresentou-se tranquilo e comunicativa. Relatou que passará alguns dias na casa da avó, junto com o primo, mostrando-se animado com a experiência.

No segundo momento da sessão, foi realizada a atividade lúdica com o jogo da memória. A paciente participou ativamente, demonstrando interesse, atenção e boa disposição para a realização da atividade, mantendo-se engajado e colaborativo.

Em geral, a paciente apresentou bom vínculo e participação ao longo da sessão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos estimulação tátil, foco, concentração, encaixes , percepção de direita e esquerda',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos motricidade fina, escrita e traços Retos com sucesso . Significativa melhoria, menos tremor nos MMSS',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco, atenção, estimulação sensorial, atenção sustentada . Aceitou balanço pela primeira vez , consegue seguir pequenas ordens simples por período curto .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atendimento com a mãe. Conversamos sobre evolução de Livia, objetivos terapêuticos potencialidades e perspectivas. Mae tem boa escuta. Combinamos reposicao de sessao com alguns minutos por dia e oriento mae a deixar Livia mais independente e responsável pela terapia, deixando para a mesma as negociações.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Dificuldade em aceitar combinados propostos e regras da sala. Resiste as atividades propostas. Sinalizo isto ao mesmo e Joaquim nega. Porém permanece a sessao toda na mesma atividade e ao final me auxiliar na organização da sala. Mae diz que foi diagnosticado como Tea suporte 1.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Vem trazido pelo pai e pela mãe. Realiza as atividades propostas. Demonstra interesse em se comunicar, atende pedidos simples como selecionar animal e entregar para a terapeuta, imita gestos (lavar a mao) e demonstra interrsse por música.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Recursos de musicoterapia para verificar os recursos de comunicação de Heitor. Dançou ao som de Mundo de Bita e demonstrou desconforto com Galinha Pintadinha. Mae diz que irmãs ouvem muito as músicas da galinha.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra foi incentivada a subir e descer degraus de forma alternada. Subiu com segurança, demonstrando boa coordenação motora e atenção ao posicionar os pés. Ao descer, apresentou movimentos com os joelhos flexionados e passos abertos, lembrando o andar de um pato. Essa postura indica uma tentativa de manter o equilíbrio, utilizando estratégias próprias para se sentir mais segura. Apesar do padrão atípico de marcha na descida, realizou a atividade com interesse e envolvimento, ajustando os movimentos de acordo com suas possibilidades motoras.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra subiu com autonomia sobre a prancha de equilíbrio, posicionando os dois pés dentro de um bambolê fixado no chão. Durante a atividade, demonstrou atenção e envolvimento. Em seguida, segurou outro bambolê com as mãos e tentou passá-lo ao redor do corpo. Manteve o equilíbrio com leve oscilação, mas sem apoio externo. Apresentou boa coordenação motora global e controle postural. Executou a tarefa com interesse, explorando os movimentos de forma espontânea e organizada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Hugo Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Haabe Viana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Hugo Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Haabe Viana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-15'::date
      LIMIT 1
    ),
    True,
    NULL,
    'XPTO',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trahamos memoria evocada com sucesso. Sem intercorrencias.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'trabalhamos rigidez cognitiva, competitividade e regras -  precisou de ajuda.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos racicionio logico, contas matematicas, entendimentos de regras com sucesso. Sem intercorrencias.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigencia Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigencia Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-07'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Trabalhamos cognição, as vezes se confunde ao formas palavras. Trabalhamos motricidade fina : bom desempenho e melhora do quadro. Sem intercorrencias.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos alinhavo, estimulação tatil, percepção do contexto e sons. Equilibrio, propriocepção e estimulação vestibular com sucesso.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Michele Jimenez Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Michele Jimenez Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-10'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Conduta mantida, vem apresentando melhora no desempenho das atribuições dos MMSS',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamim Serrito' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos habilidades básicas, atender a solicitações simples, trabalhamos também estimulação multissensorial, apresenta dificuldade de pular com os 2 pes precisando de apoio, sem intercorrencias.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Fizemos uma retrospectiva do tempo de terapia , ressaltando os ganhos de Nathan na autonomia e independencia, visao de sua vida, Nathan entrou na faculdade de fisica online, esta no curso de mecanica de aeronaves e vai prestar prova no SENAI para um curso de mecanica, queixa-se de que a vida estara corrida, falamos sobre previsao de alta.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Jorge passa a ser atendido por mim por mudança de horarios da outra TO da unidade. Iniciamos trabalho de conscientização da sua condição e das necessidades decorrentes do seu quadro. Trabalhamos fortalecimento dos MMSS, motricidade fina.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Focamos nosso atendimento nas AVD´s (uso do banheiro, lavar as maoes, manter o local limpo), precisou de ajuda para urinar e defecar, demonstra falta de percepção da limpeza do local onde está inserida. Ansiosa, repetitiva, solicitante. Trabalhamos pre requisitos para vestimenta, equilibrio e foco e atenção. Sem intercorrencias.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atendimento online a pedido da filha Simone. Trabalhamos recordações de nomes de familiares, lembranças historicas, fatos familiares, nome de toda cadeia familiar. Demonstra confusao para nomear algumas pessoas da familia. Ativa, falante, BEG, sorridente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Matheus De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'veio acompanhado pelos irmaoes e mae, ansioso, pergunta se o irmao mais novo vai entrar na terapia tambem, solicitante, significativa dificuldade no foco, atenção e seguir regras, desperça facilmente, recusa algumas atividades propostas, impaciente. Trabalhamos foco, atenção sustentada, tentativas de responder a comandos simples, dificuldade em compreender regras do jogo, se irritando facilmente. Sem intercorrencias.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Relata que esta hipertenso. Afiro P.A 16X10, em consulta agendada para hoje apos a sessao de TO. Relata nao estar se sentindo mal. Realizou a atividade. Queixa se de sentir-se ansioso pela cobranda da esposa constante. Sem intercorrencias.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Relata ter ido a cosulta medida e agora estar em uso de medicação para hipertensao (nao sabe o nome da medicação),relata que a pressao esta controlada e estar sentindo-se bem. Realizou a atividade voltada a racicionio logico e atençao com sucesso.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos alinhavo, encaixes, percepção de objetos a sua mao, locomoção dentro da sala com e sem guia, Estimulação multisensorial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa, recebe que tem notado que esta perdendo a voz, queixa-se que as pessoas nao tem paciencia para ouvi-la, apresenta tremores nos MMSS,  bastante salivação, trabalhamos motricidade dos MMSS, reconhecimento de figuras, reflexao sobre luto, sobre a vida e como lida com a sua condição. Aparecida refere nao ter rotina estabelecida em casa, refere nao ter atividades em casa, refere que esta cada vez mais dificil vir a terapia devido a locomoção. Acolho, oriento e realizamos as atividades.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigeia Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigeia Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-14'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Paciente vem apresentando melhor desempenho nas sessoes, mais motivada, relata que fara um viagem para a cidade dos familiares e nao vira na proxima sessao. Realizamos atividades com alinhavo, formação de palavras, encaixes , pinça e escrita.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente ansioso, dificuldade na escuta ativa, refere nao ter rotina bem estabelecida, dorme a manha toda, nao cozinha,, compra marmita (sic). Refere que consegue realizar as atividades de auto cuidado com apoio. Aparentemente a relação com filho é distante. Filha mora com a mae. Refere ser feliz sozinho mas demonstra ressentimento ao falar do seu divorcio. Realizamos atividades voltadas a reflexao sobre sua rotina e perspectiva de vida, deixo atividade para fazer em casa. Relata que em setembro fara infusao da sua medicação e precisara ficar internado. Realizou a atividade sem ajuda para motricidade fina.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'trabalhamos jogos competitivos, conseguiu compreender as regras e levou algum tempo para iniciar estrategias para vencer, mas conseguiu tentar. Conseguiu manter a concentração. Faz reflexoes sobre a familia , vida e casamento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Dificuldade de foco e atenção sustentada, perde a concentração facilmente, busca movimentar-se durante as atividades de concentração, conseguiu realiza-las sob estimulação e ajuda verbal e pratica.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Nathan Ferreira Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'ALTA DA TERAPIA OCUPACIONAL - ENVIO MENSAGEM A GENITORA MARCIA POIS A MESMA NAO TEM ESPERANDO NA SALA DE ESPERA, FIZEMOS O FECHAMENTO DO SEU HISTORICO NA TERAPIA. NATHAMN FARA FACULDADE DE FISICA, CURSO DE MANUTENÇÃO DE AERONAVAS E MECANICA NO SENAI E REFERE NAO TER TEMPO, POR OUTRO LADO EU NAO TENHO HORARIO PELA MANHA , NO CONTRA TURNO DOS SEUS ESTUDOS.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'trabalhamos rigidez cognitiva, Maria CLara tem difiuldade em aceitar orientações meio a execução das suas atividades, mantém uma ordem de execução e segue ate o fim, nao gosta de intermediações. Dificuldade em aceitar sugestoes. Bom foco e atenção, caprichosa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Raabë Viana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heitor Paiva Rios Ae' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Raabë Viana' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-10'::date
      LIMIT 1
    ),
    False,
    'Paciente PC - Dupla hemiparesia com padrão espástico.
Avaliação visual e palmatória: Luxação bilateral de quadril acentuada em lado (E). E versão de pés (D) e (E). Padrão flexor de punhos e cotovelos.
Clônus: Negativo / Babinski: Positivo
Reflexos: Hiper-reflexia de MMSS e MMII
Kendall (força): MMSS 3 / MMII 2
Não possui controle de tronco porém esboça um leve controle cervical.',
    'Realizada avaliação inicial + Estímulo cervical',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memória através de recordações familiares, lembrou de boa parte mas precisou de ajuda',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Reposição do feriado : chegou animado , trouxe o brinquedo da cobra pra mostrar , ativo , trabalhamos foco e atenção com movimentos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trazido pelos avós. Está mais comunicativo e independente nas brincadeiras. Percebo maior utilização dos dois mmss nas atividades. Falando algumas palavras como tchau, mao, pe',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Vem trazidos pela mãe. Atendido em outra sala. Demonstra controle na atividade porém ainda reativo a cumprir regras.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trazido pelo pai. Aparentemente mais calmo. Aceitou atividade proposta, uno. Conversamos sobre regras, tentou burlar algumas, conseguimos dialogar sobre isso. Demonstrou desconforto e pediu para ir embora. Depois mudamos a atividade, aceitou bem. Proposta é conseguirmos confeccionar uma história em quadrinhos. Em sessao ou em casa. Com o sonic como personagem principal mas acrescentando outros elementos aos desenhos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicios Gabriel Dal Bello De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicios Gabriel Dal Bello De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-17'::date
      LIMIT 1
    ),
    True,
    'Mae conta histórico de Vinicios, refere agitação, agressividade, questoes sensoriais. Leva muitos objetos a boca. Percebe piora com a pre adolescência. 
Sem TO ha 2 anos. Vai a escola, esta no 5o ano porém este ano esta sem AT e por esse motivo nao permanece o período todo na escola.
Mae diz que é ansioso e nao consegue esperar.
Em uso de risperidona, depakene e sertralina. Faz acompanhamento com Fono, Psico e psiquiatra. 
Com HD de TEA nível 2 de suporte.
Questões relacionadas a motricidade fina, adolescência. Verbal. Independente nas atividades diárias, com apoio.',
    'Avaliação com a mãe',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos foco, atenção; reconhecimento e nomeação de nome de animais , coordenação motora e equilíbrio',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Marina Deusa De Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Online - trabalhamos memória: histórico familiar , casamento , nome dos filhos com ajuda',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trazido pelo pai. Menos presenca no atendimento, sinalizando querer ir embora antes do término. Porém aceita sessao toda. Melhora na comunicação',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Leo Castilho Prado' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trazido pelos avós. Interesse por brinquedos que acendem luzes e retorno ao interesse por música e nomear partes do corpo. 
Avos dizem que voltou as aulas.
Leo tem utilizado bastante os dois mmss para realizar atividades, segurar objetos, tirar tampa de caneta, por exemplo. 
Esta sendo incentivado maneiras de comunicação para melhora na independência. Percebe-se que Leo fica incomodado quando nao é compreendido, tendo comportamentos um pouco mais "agressivos"',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Ótimo aproveitamento. Livia expõe sobre dificuldades, conversamos sobre auto conhecimento e possibilidades',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memória com.jogo de perguntas e respostas, bom conhecimentos gerais , ganhou o jogo com facilidade. Sem intercorrencias',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pedro De Oliveira Toledo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chega aparentemente sonolento, ativo, com rigidez cognitiva, dificuldade em competir e perder. Queixa se quando acaba a sessão, recusa a ir embora inicialmente, conversamos e aceita sair .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chega calado, pouco dialogo, realiza todas as atividades propostas com facilidade , com foco, atenção e organização. 
Sem intercorrencias',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Faltou',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-31'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Estava tranquila,  sem queixas porém apareceu na sessao de máscara. Explicou que era por causa do cheiro do perfume da mãe. Que a incomoda.
Proponho que pensemos sobre como superar dificuldades que a mesma atribui ao diagnóstico de TEA.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-31'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Joaquim vem trazidos pelo pai. Calmo, optamos por realizar uma atividade sentado a mesa. Produz um "combo de lanchonete" com batata frita, refrigerante e hambúrguer a partir de desenhos e recortes de papel. Percebe-se nao ter muita familiaridade com o uso de tesoura, quando questionado diz que a mae "nao deixa".',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Descrição da atividade:
Pietra segurou um copo cheio de água com cuidado, subiu os degraus devagar, mantendo o tronco firme para não derramar. Chegando ao topo, virou-se com cautela e começou a descer, olhando para os degraus e mantendo as mãos estáveis. Conseguiu completar o percurso com o copo cheio, demonstrando controle corporal e atenção.
Trabalha: 
Equilíbrio 
Coordenação Motora 
Atenção e concentração 
Noções espaciais',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-07-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Descrição da atividade:
Pietra ficou em pé diante de um bambolê no chão. Ao ouvir o comando “dentro”, deu um passo para o centro do bambolê; ao ouvir “fora”, pulou ou pisou para fora. Quando o comando foi “direita” ou “esquerda”, deslocou-se para o lado correspondente. Repetiu várias vezes, alternando os movimentos, trabalhando atenção, coordenação e noção corporal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin segurou um pesinho com as mãos e iniciou o percurso do circuito. Caminhou sobre o trajeto determinado, desviando de obstáculos e mantendo o tronco ereto para equilibrar o peso. Passou por diferentes superfícies e mudanças de direção, completando o trajeto com controle e força, sem deixar o pesinho cair.
Trabalha
Coordenação global 
Força musculat 
Equilibrio
Atenção e planejamento motor',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-08'::date
      LIMIT 1
    ),
    True,
    'Benjamin segurou um pesinho com as mãos e iniciou o percurso do circuito. Caminhou sobre o trajeto determinado, desviando de obstáculos e mantendo o tronco ereto para equilibrar o peso. Passou por diferentes superfícies e mudanças de direção, completando o trajeto com controle e força, sem deixar o pesinho cair.
Equilibrio
Força musculat',
    'Benjamin segurou um pesinho com as mãos e iniciou o percurso do circuito. Caminhou sobre o trajeto determinado, desviando de obstáculos e mantendo o tronco ereto para equilibrar o peso. Passou por diferentes superfícies e mudanças de direção, completando o trajeto com controle e força, sem deixar o pesinho cair.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra posicionou-se na frente da escada de agilidade, colocou primeiro o pé direito dentro do quadrado, depois o pé esquerdo, alternando as pernas até o final da fileira. Em seguida, realizou o movimento do “jogo da velha”: abriu os pés para fora da escada, voltou com os dois pés juntos dentro do próximo quadrado e repetiu a sequência até o final. Manteve os braços levemente abertos para auxiliar no equilíbrio, olhou para baixo para acertar o posicionamento e executou os movimentos de forma coordenada e ritmada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos cognição, números saltados, sequência e classificação com sucesso , não precisou de ajuda .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Disperso , resistente em.realizar as propostas terapêuticas, trouxe carrinhos para brincar , realizamos atividades para cognição e motricidade fina',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Treinamos leitura e interpretação de texto
Conseguiu ler enunciados de exercícios e realiza los sob estimulo verbal 
Algo inseguro 
Mas demonstra evolução',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther realizou um circuito seguindo as indicações de direita e esquerda. Ela caminhou pelo trajeto, virando para o lado solicitado, ultrapassando obstáculos e passando por pontos marcados, sempre identificando e executando o movimento de acordo com o comando dado.
Porém teve dificuldade no trajeto.
Essa atividade trabalha na 
Noção espacial (direita e esquerda).
Atenção e escuta ativa para seguir instruções.
Coordenação motora global durante o deslocamento.
Lateralidade, fundamental para organização corporal.
Orientação no espaço para se mover de forma segura e direcionada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin subiu cuidadosamente na prancha de equilíbrio, segurando firme a argola com as duas mãos. Com passos controlados, atravessou toda a prancha, mantendo o corpo estável, e ao final encaixou a argola no cone.
Essa atividade trabalha diversos aspectos da psicomotricidade, como:
Equilíbrio estático e dinâmico ao se manter e deslocar sobre a prancha.
Coordenação motora global, integrando movimentos de pernas, braços e tronco.
Coordenação óculo-manual, ao posicionar a argola no cone.
Força e controle postural, para evitar quedas.
Atenção e concentração, para cumprir todas as etapas da tarefa com precisão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'A sessão ocorreu de forma tranquila. A paciente apresentou comportamento adequado para a idade, respondendo a todas as perguntas com clareza e tranquilidade. Conversamos sobre o contexto familiar e escolar, trazendo questões consideradas dentro da normalidade.

Em um segundo momento, foi realizado atendimento lúdico com a atividade da forca. A paciente demonstrou interesse e habilidade na execução, alcançando os objetivos propostos pela atividade',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'A sessão ocorreu de maneira tranquila e adequada. A paciente respondeu a todas as perguntas com clareza e tranquilidade, havendo boa interação durante o processo.

Em um segundo momento, foi realizada atividade lúdica com quebra-cabeça. A paciente participou de forma adequada, demonstrando interesse e envolvimento. A atividade teve como objetivo estimular a atenção, concentração, raciocínio lógico, coordenação visomotora e a capacidade de resolução de problemas, aspectos importantes no desenvolvimento infantil.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou a atividade subindo e descendo as escadas com um copo de água, exigindo coordenação motora global, equilíbrio, atenção e noção de controle corporal, pois precisou manter o copo sem derramar. Em seguida, pulou dentro e fora da escadinha de chão, trabalhando noção espacial, lateralidade, organização temporal e ritmo, além de favorecer a força dos membros inferiores e a coordenação motora grossa.
Na sequência, fez o pareamento de cores e objetos, estimulando percepção visual, discriminação, raciocínio lógico, atenção, concentração e memória, além de integrar a psicomotricidade fina.
 Dessa forma, a atividade contribuiu para o desenvolvimento global da psicomotricidade, integrando corpo, movimento, percepção e cognição de maneira lúdica e funcional.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther fez um circuito trabalhando direita e esquerda, seguindo os comandos dados. Ela passou pela prancha de equilíbrio com atenção e controle.
A atividade desenvolve:
noção de lateralidade (direita/esquerda),
equilíbrio,
coordenação motora global,
atenção e consciência corporal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin realizou um circuito motor, onde passou por baixo de obstáculos com atenção e esforço físico.
A atividade desenvolve:
coordenação motora global,
noção espacial,
força e agilidade,
atenção e organização corporal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Priscila Holanda De Lima Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Priscila Holanda De Lima Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    True,
    'Participantes:

Priscila Holanda de Lima Silva – filha, nascida em 19/10/1999. Possui diagnóstico de Transtorno do Espectro Autista (TEA) leve, fechado em 2024.

Maria Cecília Holanda de Lima Silva – mãe, nascida em 14/10/1977.

Descrição da sessão:
Primeiro atendimento realizado com a presença da mãe, Maria Cecília, e da filha, Priscila. A filha relata que desde a infância percebe comportamento controlador da mãe em relação às suas escolhas pessoais, como forma de vestir, ciclo de amizades, preferências e escolhas acadêmicas. Refere sentir falta de apoio materno em relação à sua primeira graduação (Música) e afirma que essa postura persiste até o momento, mesmo estando atualmente em sua segunda faculdade. Relata ainda que o irmão de 21 anos apresenta queixas semelhantes, principalmente em relação à ausência de privacidade, como tentativas da mãe de ter acesso ao celular e conversas pessoais.

Maria Cecília, por sua vez, relata que suas atitudes são motivadas pelo desejo de que os filhos estudem, tenham compromisso e estejam preparados para lidar com as demandas da vida. Explica que suas orientações quanto às roupas da filha são justificadas pela preocupação com a imagem que os outros podem ter.

Durante a sessão, observou-se divergência de percepções entre mãe e filha: Priscila expressa necessidade de maior autonomia e reconhecimento de suas escolhas, enquanto Maria Cecília mantém postura de cuidadora e justificadora de suas ações. Ressalta-se que Maria Cecília referiu ser dona de casa, responsável pelo cuidado dos filhos, visto que o pai reside fora do país a trabalho, retornando apenas por curtos períodos.',
    'Primeiro atendimento familiar com Priscila e Maria Cecília. Priscila relatou controle materno desde a infância sobre roupas, amizades, gostos e escolhas acadêmicas, sentindo falta de autonomia e apoio. Relatou que o irmão de 21 anos também apresenta queixas de falta de privacidade. Maria Cecília justifica seu comportamento como cuidado e incentivo ao estudo, disciplina e boa imagem pessoal. Observou-se divergência entre mãe e filha: Priscila busca mais autonomia e respeito à privacidade; Maria Cecília mantém postura de controle e cuidadora central',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou a atividade de psicomotricidade subindo e descendo as escadas duas vezes, com auxílio verbal para manter o ritmo e a segurança. Em seguida, fez o movimento de “dentro e fora”, identificando e nomeando os lados direito e esquerdo durante a execução, favorecendo a noção espacial e lateralidade. Também trabalhou coordenação motora ao jogar a bola contra a parede e devolvê-la, utilizando o controle do movimento. Por fim, com uma das mãos, colocou argolas no cone, exercitando a coordenação óculo-manual, a motricidade fina e a atenção concentrada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia tem trazido questões elaborando suas características e sua relação com a mae. Bom aproveitamento',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Livia Vieria De Freitas' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Livia fala sobre dificuldade em socializar, que considera um dia voltar a escola e faz o desenho de um gato. Conversamos sobre a terapia e objetivos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Joaquim apresenta dificuldade em lidar com as frustrações, desistindo da atividade quando nao ocorre do jeito que espera, principalmente quando é relacionado a alguma dificuldade',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Dificuldade em cumprir os combinados na sessao mas observo melhora.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Joaquim Ferreira Honorato Araujo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Carolina' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Joaquim reflete melhora em conhecer os combinados e no vinculo. Solicita ajuda para realizar as atividades',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Vinicius participou da atividade de psicomotricidade jogando boliche, onde arremessou a bola em direção aos pinos, trabalhando coordenação motora ampla, força, controle de movimento e percepção espacial. Em seguida, explorou a massinha de modelar, amassando, enrolando e moldando com as mãos, o que estimula a motricidade fina, força dos dedos e criatividade. Por fim, utilizou a rede sensorial, movimentando-se sobre ela com equilíbrio e atenção, favorecendo o desenvolvimento do tônus muscular, coordenação e percepção corporal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra iniciou a atividade descendo e subindo as escadas, realizando o movimento com atenção e coordenação motora. Esse exercício trabalha força muscular, equilíbrio, noção espacial, lateralidade e ritmo do corpo. Em seguida, ela participou do jogo da balança divertida, onde foi estimulada a aprender adição de forma lúdica. Nessa etapa, Pietra manteve o foco para colocar os objetos de cada lado da balança, utilizando o raciocínio lógico-matemático, a coordenação motora fina e a atenção compartilhada.
Equilíbrio e coordenação global (ao subir e descer escadas).
Noção de espaço, tempo e lateralidade.
Raciocínio lógico e organização mental (na adição).
Coordenação motora fina e percepção visual (ao manipular os objetos na balança).
Atenção e concentração, integrando corpo e mente na execução da tarefa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    '“Benjamin se equilibrou na bola de propriocepção e colocou as argolas coloridas no cone. Durante a atividade, apresentou alguns momentos de gritos e risadas, além de jogar brinquedos no chão. A atividade trabalhou equilíbrio, coordenação motora global, atenção, organização espacial e reconhecimento de cores.”',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Descrição da atividade:
Esther participou de um circuito direcionado, contando os passos para auxiliar em sua deficiência visual. Durante o percurso, colocou argolas no pino, trabalhando atenção, coordenação motora e percepção espacial. Em seguida, rolou no tatame, sendo orientada a diferenciar os lados direito e esquerdo, favorecendo a consciência corporal e a lateralidade. Depois, interagiu com peças de lego em braille, montando o próprio nome, o que estimulou a coordenação motora fina, a percepção tátil e a autonomia.
Aspectos da psicomotricidade trabalhados:
Orientação espacial (contagem de passos, direção no circuito).
Coordenação motora global (rolar no tatame, colocar argolas).
Consciência corporal e lateralidade (direita e esquerda).
Coordenação motora fina e percepção tátil (montagem do nome no lego em braille).
Atenção, memória e autonomia nas atividades.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'A paciente relatou convivência tranquila em casa. Demonstrou grande satisfação com o retorno de uma amiga que estava em outro país, mencionando que foi muito bom reencontrá-la. Compartilhou que algumas colegas sentem ciúmes em relação à sua amizade, mas destacou que conseguem lidar de forma adequada com essas situações no contexto escolar.

Em um segundo momento, realizou-se atividade lúdica com quebra-cabeça, sendo a própria paciente quem escolheu trabalhar os temas de desculpa e acolhimento. A sessão foi finalizada de maneira positiva.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alan Gabriel Do Carmo / Magna Kelly Oliveira Da Silva Do Carmo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alan Gabriel Do Carmo / Magna Kelly Oliveira Da Silva Do Carmo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-27'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Relatório de Atendimento – Terapia Familiar
Pacientes:
	•	Alan Gabriel do Carmo – 09/06/1983
	•	Magna Kelly Oliveira da Silva do Carmo – 26/08/1987

Data do atendimento: 27/08/2025
Duração: 1h
Tipo de atendimento: Sessão inicial – Terapia Familiar

1. Orientações iniciais

Na abertura da sessão, foi explicado aos participantes sobre o sigilo profissional, a importância do respeito ao tempo de fala de cada um e sobre o espaço terapêutico como um ambiente seguro e livre para expressão.

2. Queixa/Demanda

O casal relatou que os conflitos conjugais se intensificaram após o esposo suspeitar de uma traição.
	•	O episódio desencadeador ocorreu quando um amigo da família, em situação de embriaguez, afirmou ter se relacionado com a esposa no passado.
	•	A esposa nega que tenha ocorrido traição nesse período, porém relata que já havia se envolvido com o marido enquanto ele ainda era casado, reconhecendo a situação como uma traição anterior.
	•	Após esse fato, o esposo tornou-se mais possessivo e controlador.
	•	Foram relatados episódios de violência psicológica e física (ameaças, amarração, tentativa de intimidação com álcool).
	•	O casal chegou a se separar, mas posteriormente reataram o relacionamento, inclusive decidindo pela gravidez.
	•	A esposa enfrentou problemas de saúde (diagnóstico de NIC2), realizou tratamentos e posteriormente engravidou.
	•	Persistem conflitos conjugais relacionados à possessividade do esposo, ciúmes, cobranças em relação ao estilo pessoal da esposa, tarefas domésticas e o histórico de uso de drogas (cocaína), que foi interrompido mediante acordo do casal.

3. Observações da sessão
	•	Nesta primeira sessão, apenas a esposa conseguiu expor sua versão da história.
	•	O esposo permaneceu em silêncio na maior parte do tempo e será ouvido de forma mais aprofundada na próxima sessão.

4. Conclusão parcial
	•	Trata-se de um casal com histórico de conflitos intensos, episódios de violência conjugal e uso de substâncias.
	•	Observa-se uma dinâmica relacional marcada por desconfiança, controle e tentativas de prova de fidelidade.
	•	Conclui-se a necessidade de continuidade do processo terapêutico, ouvindo igualmente o esposo, a fim de compreender melhor as percepções e demandas de ambos, e avaliar estratégias de manejo da relação, prevenção de novas situações de violência e fortalecimento de recursos internos e conjugais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Priscila Holanda De Lima Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Priscila Holanda De Lima Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-28'::date
      LIMIT 1
    ),
    False,
    'Observa-se presença de conflitos familiares significativos, envolvendo autonomia, identidade e aceitação da orientação sexual.',
    'Relatório de Atendimento Psicológico
Paciente: Priscila 
Sessão: 2º atendimento individual

Descrição da sessão:
A paciente relatou dificuldades significativas na relação com a mãe, descrevendo-a como uma pessoa controladora e de difícil convivência. Destacou que, apesar de ter 25 anos, sente-se limitada em sua autonomia, pois a mãe constantemente questiona suas escolhas, desejos, estilo de vida e modo de se vestir. Relatou que tais comportamentos têm se intensificado tanto em relação a ela quanto ao irmão.

Mencionou episódios relacionados ao ambiente doméstico, como a ausência de refeições prontas à noite e exigências excessivas da mãe em relação à limpeza, o que gera incômodos no convívio familiar.

A paciente referiu ainda que a mãe insiste que ela se vista de maneira diferente para não passar uma imagem negativa perante terceiros, sem respeitar seu estilo e identidade.

Durante o relato, trouxe também informações sobre sua orientação sexual. A paciente mantém um relacionamento com uma mulher há dois anos, embora não tenham se encontrado presencialmente até o momento. Ressaltou que a mãe não aceita sua orientação sexual, o que se configura como mais um ponto de conflito na relação entre ambas.

Próximo atendimento será realizado com a presença da mãe, visando favorecer o diálogo e o fortalecimento do vínculo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou a atividade de subir e descer a escada, trabalhando coordenação motora global, equilíbrio, noção espacial e força. Em seguida, participou de jogos voltados para leitura, que estimularam atenção, memória, percepção visual e linguagem.
No conjunto, essa atividade desenvolve na psicomotricidade a coordenação motora, organização espaço-temporal, concentração, lateralidade, percepção visual e integração entre corpo e mente, favorecendo também o aprendizado cognitivo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra subiu no tablado com cuidado, se agachou e colocou as argolas no cone. Ela usou o corpo todo para se equilibrar, mexeu bem as mãos para encaixar as argolas e prestou atenção no que estava fazendo.
Equilíbrio ao subir e se manter no tablado
Coordenação dos movimentos grandes (como agachar)
Coordenação das mãos e dedos ao colocar as argolas
Atenção e foco
Noção de espaço e posição do corpo',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'O atendimento ocorreu de maneira tranquila, sendo observado que a paciente mantém uma convivência harmoniosa tanto no ambiente familiar quanto no escolar.

No segundo momento da sessão, foi realizada a atividade lúdica do jogo da memória, favorecendo aspectos de atenção, concentração e estimulação cognitiva, além de promover interação positiva no setting terapêutico. Pacinete demonstrou interesse e habilidade. 

Realizei escuta e acolhimento',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin participou de uma atividade de psicomotricidade realizando um circuito com obstáculos de diferentes tamanhos. Ele se movimentou com atenção, subindo e descendo os obstáculos, trabalhando equilíbrio, coordenação motora e força. Durante o percurso, também foram incluídas atividades de musicalização, incentivando a percepção auditiva, o ritmo e a interação. Além disso, foram propostas situações que estimularam a consciência corporal, ajudando Benjamin a reconhecer e controlar melhor os movimentos do próprio corpo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther iniciou a atividade realizando um circuito em que precisava diferenciar os lados direito e esquerdo. Com atenção e foco, seguiu as orientações, nomeando e executando os movimentos corretamente. Em seguida, subiu no tablado de equilíbrio, mantendo concentração para sustentar o corpo e desenvolver a coordenação motora. Depois, participou de uma atividade de musicalização, explorando sons e ritmos, o que contribuiu para a percepção corporal, a organização motora e a consciência dos próprios movimentos, de forma lúdica e divertida.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-05'::date
      LIMIT 1
    ),
    False,
    'Vinícius iniciou a atividade subindo na prancha de equilíbrio, onde trabalhou sua coordenação e concentração ao colocar as argolas nos cones coloridos. Em seguida, realizou a brincadeira do chapéu, estimulando atenção e movimentos coordenados. Depois, montou um quebra-cabeça de 100 peças com ajuda, desenvolvendo raciocínio lógico, percepção visual e paciência. Para finalizar, fez atividades de grafomotricidade, fortalecendo a motricidade fina, e coloriu, trabalhando a coordenação motora, criatividade e atenção aos detalhes.',
    'Vinícius iniciou a atividade subindo na prancha de equilíbrio, onde trabalhou sua coordenação e concentração ao colocar as argolas nos cones coloridos. Em seguida, realizou a brincadeira do chapéu, estimulando atenção e movimentos coordenados. Depois, montou um quebra-cabeça de 100 peças com ajuda, desenvolvendo raciocínio lógico, percepção visual e paciência. Para finalizar, fez atividades de grafomotricidade, fortalecendo a motricidade fina, e coloriu, trabalhando a coordenação motora, criatividade e atenção aos detalhes.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Magda Kelly Oliveira Da Silva Do Carmo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Magda Kelly Oliveira Da Silva Do Carmo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-03'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Paciente: Magda
Tipo de Atendimento: Individual
Descrição do Atendimento:

Durante o atendimento, a paciente relatou que seu marido apresenta comportamentos muito agitados, dos quais ela não consegue identificar a causa. Informou que ele frequentemente sugere que ela se vista de acordo com suas preferências, manipulando situações a seu favor. Relatou episódios de violência sexual, mencionando que, durante discussões, o marido realizou relações sexuais sem o consentimento dela, mesmo quando ela pedia para que parasse.

A paciente descreve que o comportamento do marido é instável, alternando rapidamente entre estados de felicidade e agitação intensa. Destacou preocupação com o impacto desse comportamento no filho do casal, que vem apresentando condutas agitadas na escola, irritabilidade frequente e conflitos com colegas.

Magda mencionou suspeitar de alguma patologia no marido, considerando seu comportamento explosivo e a instabilidade emocional. Ressaltou que a filha do marido, de um relacionamento anterior, possui diagnóstico de transtorno de personalidade borderline, o que a leva a refletir sobre a possibilidade de um diagnóstico semelhante ou relacionado em seu marido.

Realizei escuta e acolhimento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther realizou um circuito motor, iniciando ao subir no tablado de equilíbrio, onde trabalhou coordenação, controle corporal e concentração. Em seguida, passou por uma superfície acolchoada, estimulando diferentes percepções táteis e a noção de segurança ao se mover. Para finalizar, pulou no jump, desenvolvendo força muscular, coordenação motora global e equilíbrio dinâmico, além de trabalhar o gasto de energia de forma lúdica.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin participou de um circuito iniciando no tablado de equilíbrio, trabalhando coordenação motora, concentração e controle corporal. Em seguida, realizou atividades sobre uma superfície acolchoada, estimulando a percepção tátil e o equilíbrio. Hoje ele demonstrou estar um pouco desanimado, relatando que estava cansado, então finalizamos a sessão com massinha de modelar, proporcionando um momento mais calmo, voltado para a motricidade fina e relaxamento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin participou de uma atividade de psicomotricidade que consistia em pular dentro dos quadradinhos. Durante a proposta, ele apresentou algumas dificuldades na execução, mas demonstrou empolgação e motivação para realizar os movimentos. Essa atividade trabalhou sua coordenação motora global, equilíbrio, noção espacial, atenção e força nas pernas, além de estimular sua confiança e autonomia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther iniciou a atividade passando pelo circuito sobre uma superfície instável, explorando o espaço com os pés e ajustando o equilíbrio a cada passo. Ela se concentrou nos movimentos, sentindo as diferentes texturas e alturas através do tato e da propriocepção, usando o corpo como guia. Durante o percurso, precisou fazer pequenos ajustes posturais, desenvolvendo confiança e segurança em sua locomoção.
Em seguida, Esther foi até a área dos pinos. Utilizando as mãos, explorou o espaço ao redor para localizar o pino por meio do toque. Com atenção e precisão, pegou as argolas e, uma a uma, foi encaixando, trabalhando coordenação motora fina, percepção tátil e noção espacial. Durante toda a atividade, manteve-se motivada e participativa, desenvolvendo suas habilidades motoras, integração sensorial e autonomia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou atividades voltadas para o desenvolvimento psicomotor. Ela subiu e desceu a escada duas vezes, trabalhando força, coordenação motora global e equilíbrio. Em seguida, participou da atividade “Cuca Legal”, voltada para discriminação visual e leitura, estimulando também a atenção e o raciocínio. Depois, realizou exercícios na prancha de equilíbrio, fortalecendo a coordenação e a estabilidade corporal. Finalizou com uma partida de tênis de bexiga, que trabalhou coordenação motora, agilidade, percepção visual e tempo de reação, além de promover interação e diversão durante a atividade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'A paciente compareceu ao atendimento e relatou estar vivenciando questões tranquilas, tanto no ambiente escolar quanto em casa. Compartilhou que assistiu a um filme e comeu pipoca com o irmão, descrevendo a experiência de forma positiva.

No segundo momento, foi realizada uma atividade de pintura com o tema Emidivic, na qual a paciente demonstrou interesse e envolvimento.

A sessão foi conduzida com escuta ativa e acolhimento, sendo finalizada com sucesso.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Valentina Maria Pinheiro Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'O paciente compareceu ao atendimento e respondeu todas as perguntas com tranquilidade e clareza, demonstrando serenidade em suas falas. Relatou que realizou  algumas provas, mas afirmou que está tudo bem. Compartilhou também sua expectativa em relação a um passeio escolar, no qual ela e as amigas decidiram participar vestidas com o tema das Meninas Superpoderosas, demonstrando alegria e entusiasmo com essa atividade.

No segundo momento, foi realizada a atividade do jogo de perguntas e respostas, que tem como objetivo, dentro da psicoterapia infantil, favorecer a expressão de pensamentos e sentimentos, estimular a comunicação, promover reflexões sobre situações do cotidiano e ampliar recursos de enfrentamento.

A sessão foi finalizada com escuta atenta e acolhimento, garantindo um espaço seguro para a paciente se expressar livremente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alan Gabriel Do Carmo / Magna Kelly Oliveira Da Silva Do Carmo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alan Gabriel Do Carmo / Magna Kelly Oliveira Da Silva Do Carmo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Adnéia' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Relatório de Atendimento – Terapia de Casal (3ª sessão)

Paciente: Alan (esposo)
Sessão: Individual dentro do processo de terapia de casal

Na presente sessão, o paciente trouxe questões relacionadas ao ambiente familiar e conjugal. Alan relatou alguns desejos em relação à esposa, destacando a vontade de que ela se vestisse de maneira mais elaborada em determinadas situações, utilizando roupas que considere bonitas.

O paciente também pontuou ser uma pessoa que valoriza a intimidade sexual, contudo percebe que a esposa não demonstra tanto interesse nesse aspecto, o que gera frustração. Além disso, referiu sentir que, em alguns momentos, sua parceira não valoriza pequenos gestos e detalhes que ele promove para agradá-la. Expressou o desejo de que a esposa atendesse a alguns de seus gostos pessoais.

Durante o atendimento, observou-se a insatisfação de Alan diante de certos comportamentos da parceira, assim como a dificuldade em compreender que, em determinadas situações, cada indivíduo necessita de seu próprio espaço, tempo e que as decisões pessoais devem ser respeitadas.

Objetivo da sessão:
	•	Explorar percepções e sentimentos de Alan em relação ao vínculo conjugal.
	•	Favorecer a reflexão sobre expectativas individuais e respeito às diferenças dentro da relação.
	•	Trabalhar a comunicação assertiva como meio de expressão das necessidades emocionais e conjugais.

Encaminhamentos:
	•	Estimular a escuta ativa e a empatia em relação à parceira.
	•	Refletir sobre a importância do respeito ao espaço individual dentro do relacionamento.
	•	Preparar o casal para posterior discussão conjunta, favorecendo equilíbrio nas trocas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Hoje, Benjamin realizou atividades voltadas para a motricidade fina, utilizando jogos de encaixe e massinha de modelar. Durante a proposta, demonstrou interesse e permaneceu engajado, trabalhando coordenação olho-mão, precisão nos movimentos, força e destreza dos dedos e mãos, além de atenção e concentração.
Ao ser convidado para participar do circuito motor, que tinha como objetivo estimular a motricidade global, equilíbrio, organização espacial e coordenação geral, Benjamin apresentou resistência, recusando-se a realizar a atividade, mesmo após estímulos e tentativas de mediação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther iniciou a sessão na prancha de equilíbrio, mantendo os braços abertos para se equilibrar e identificando o lado direito quando solicitado.
Depois, fez um circuito sobre extremidade elevada por sete vezes, começando com um pouco de insegurança, mas, aos poucos, ficou mais confiante e firme nos movimentos.
Em seguida, participou de jogos de encaixe, demonstrando atenção e coordenação motora fina.
Finalizou a sessão com massinha de modelar, trabalhando força nas mãos, criatividade e exploração sensorial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou um circuito de 6 vezes a prancha de equilíbrio, atividade que na psicomotricidade promove o desenvolvimento do equilíbrio, coordenação motora, concentração e controle corporal, estimulando o sistema vestibular e a percepção corporal. Em seguida, jogou os jogos "tapa certo" e "cuca legal", que são lúdicos e colaboram para a atenção, percepção visual, concentração e habilidades cognitivas, integrando também aspectos sociais e de diversão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Vinicius fez várias atividades importantes para seu desenvolvimento psicomotor:Na prancha de equilíbrio, ele treinou o controle do corpo e o equilíbrio, aprendendo a manter-se estável.Jogando o jogo da memória, ele trabalhou a atenção e a memória visual.Colorindo o desenho, ele usou a coordenação motora fina para segurar e controlar o lápis.Passando o lápis nas letras pontilhadas, ele aprimorou os movimentos precisos necessários para a escrita.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra subiu e desceu as escadas duas vezes com atenção e cuidado, demonstrando controle corporal e coordenação motora. Em seguida, ela realizou um jogo de cores que estimula a resolução de problemas, concentrando-se na identificação e correspondência correta das cores. Depois, fez exercícios de equilíbrio sobre a bola suíça, durante os quais encaixava os chapéus nos cones, mostrando habilidade para manter a estabilidade enquanto realizava a tarefa.Além disso, participou de um jogo da memória utilizando a palmatória, mantendo-se deitada no tatame, o que desafiou sua atenção e memória visual. Para finalizar, Pietra colocou argolas atrás da cabeça, desenvolvendo a coordenação motora fina e a consciência espacial com movimentos controlados e precisos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Vinicius fez a prancha de equilíbrio com concentração, removendo os prendedores da sua roupa e colocando-os nos cones conforme as cores correspondentes, demonstrando atenção e coordenação. Em seguida, completou um circuito, apoiando-se no pneu para manter o equilíbrio enquanto se movimentava. Depois, lançou as argolas no pino, praticando a mira e a coordenação motora.Para finalizar, Vinicius montou um quebra-cabeça de alfabeto pontilhado, passando a canetinha sobre as letras com cuidado, o que ajudou no reconhecimento das letras e no desenvolvimento da coordenação motora fina e da discriminação visual.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra subiu e desceu as escadas sem apoio das mãos, segurando um copo com água, demonstrando bom controle postural e coordenação motora. Em seguida, participou do jogo Soletrando, estimulando atenção, linguagem e reconhecimento das letras. Para finalizar, realizou a atividade de vôlei de bexiga, trabalhando coordenação visomotora, agilidade e interação durante a brincadeira.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin recusou realizar o circuito motor proposto. Solicitou massinha de modelar utilizando pedido funcional (FCT). Ao receber o material, manipulou a massinha dentro das forminhas e, em seguida, realizou movimentos de pinça com os dedinhos para remover a massinha das forminhas.
Habilidades observadas/trabalhadas:

Comunicação funcional: uso de pedido para obter reforçador desejado.
Motricidade fina: apreensão em pinça
Coordenação olho–mão: manipulação precisa para retirar a massinha das forminhas.
Atenção sustentada e engajamento em atividade lúdica.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther participou da sessão de psicomotricidade realizando a atividade de passar por dentro do círculo cinco vezes, trabalhando coordenação motora global e noção espacial. Em seguida, manuseou massinha de modelar e realizou encaixe de formas, estimulando a coordenação motora fina e a percepção visual.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou a atividade de subir e descer degraus por duas vezes, demonstrando bom equilíbrio e coordenação motora. Em seguida, participou do jogo “Cuca Legal”, favorecendo a atenção, concentração e o raciocínio lógico. Depois, executou atividades motoras que envolveram virar o pneu por cinco vezes, trabalhando força, coordenação global e noção de espaço. Finalizou correndo cerca de cinco metros e colocando a argola no pino, estimulando a coordenação motora ampla, a precisão e o controle do movimento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Vinícius chegou bem, demonstrando interesse pelo livro Chapeuzinho Vermelho. Apresentou breve desorganização, mas logo se acalmou. Em seguida, manipulou a massinha de modelar com as mãos, realizando movimentos de apertar e modelar. Depois, construiu uma torre empilhando as peças com cuidado e atenção. Finalizou a sessão participando do jogo Soletrando, identificando letras e formando palavras, demonstrando concentração e interesse nas atividades.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Heloísa realizou a avaliação de interpretação de texto do 5º ano demonstrando boa disposição e interesse. Durante a atividade, manteve atenção, concentração e engajamento, controlando movimentos corporais e expressões. Em seguida, participou do jogo das cores, trabalhando percepção visual, coordenação motora fina e atenção seletiva, mostrando entusiasmo e participação ativa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou a atividade de subir e descer as escadas, trabalhando o equilíbrio, a coordenação motora global e a noção espacial. Em seguida, participou das atividades “Cuca Legal” e “Tapa Certo”, que estimularam a atenção, a concentração, a coordenação visomotora e o tempo de reação. Durante todo o processo, demonstrou boa participação e envolvimento nas propostas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin realizou o circuito sobre o elevado de espuma com boa disposição, mantendo o equilíbrio durante o percurso. Em seguida, participou da atividade de corrida para levar os brinquedos até sua caixa, demonstrando coordenação, atenção e intenção na tarefa. A atividade trabalhou aspectos de equilíbrio, coordenação motora global, organização espacial e noção de direção.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou a atividade de subir e descer as escadas uma vez, demonstrando boa coordenação motora global. Em seguida, participou de uma corrida de aproximadamente 5 metros, tocando o cone e retornando ao ponto inicial, trabalhando velocidade, equilíbrio e atenção. Para finalizar, participou do jogo da forca, favorecendo o raciocínio, a concentração e o reconhecimento de letras de forma lúdica e participativa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou a atividade de subir e descer as escadas, demonstrando boa coordenação motora global e equilíbrio. Em seguida, participou do jogo da forca, mantendo atenção e interesse na proposta. A atividade favoreceu o desenvolvimento da coordenação motora, da concentração, do raciocínio lógico e da socialização durante a interação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Bejamin Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Bejamin Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-22'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Benjamin iniciou a sessão com a música do jacaré, trabalhando ritmo, coordenação motora global e expressão corporal, por meio de movimentos de bater palmas, imitar gestos e acompanhar o som com o corpo. Essa atividade favoreceu a atenção compartilhada, o seguimento de comandos simples e a consciência corporal.
Em seguida, realizou saltos no jump, estimulando o equilíbrio dinâmico, a coordenação bilateral, o tônus muscular e a organização espaço-temporal. Após isso, percorreu um circuito sobre superfície instável, que contribuiu para o ajuste postural, a segurança corporal e o controle motor.
Finalizou a sessão brincando com brinquedos sensoriais, atividade que promoveu a exploração tátil, a autorregulação emocional e o prazer na atividade lúdica, encerrando a sessão de forma tranquila e positiva.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra iniciou a sessão realizando a atividade de subir e descer escadas por duas vezes, estimulando o equilíbrio, a coordenação motora global e a noção espacial. Em seguida, participou de jogos de pareamento de cores, promovendo a atenção, a percepção visual e a discriminação cromática. Também realizou o jogo da forca, favorecendo o raciocínio, a memória e a associação entre letras e palavras. Finalizou a sessão com um circuito sobre superfície instável, trabalhando o equilíbrio dinâmico, a coordenação bilateral e a consciência corporal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Bemjamin Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Bemjamin Pereira' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-27'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Benjamin iniciou a sessão realizando um circuito sobre superfície elevada por três séries de dez repetições, trabalhando o equilíbrio, a coordenação motora global e a atenção ao percurso. Durante a atividade, inseriu argolas nos pinos, favorecendo a coordenação óculo-manual, a destreza e a concentração. Em seguida, utilizou massinha de modelar, estimulando a coordenação motora fina, a força dos dedos e a criatividade por meio de movimentos de amassar, enrolar e pressionar. A sessão proporcionou integração entre habilidades motoras globais e finas, promovendo organização corporal e engajamento nas tarefas propostas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra participou de um circuito motor intercalando saltos e atividades na prancha de equilíbrio, estimulando o equilíbrio dinâmico, coordenação motora global e controle postural. Durante o percurso, demonstrou envolvimento e atenção nas transições entre as tarefas. Em seguida, participou do jogo da forca, atividade que favoreceu a atenção, percepção visual, raciocínio lógico e reconhecimento de letras, promovendo também a integração entre o movimento e o pensamento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-31'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra iniciou a sessão subindo e descendo as escadas por 6 vezes, trabalhando coordenação motora global, força de membros inferiores e equilíbrio. Em seguida, realizou a proposta deitada, passando o chapéu de trás para o cone da frente, estimulando a coordenação motora fina, a orientação espacial e o controle postural. Depois, participou de atividades de jogo da forca, promovendo atenção, memória e linguagem. Finalizou a sessão montando um quebra-cabeça de 100 peças, demonstrando concentração, raciocínio lógico e persistência na tarefa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Descrição Psicomotora – Vinícius
Vinícius chegou bem para a sessão. Iniciou a proposta com circuito sobre superfície elevada e utilização da prancha de equilíbrio, demonstrando boa participação e engajamento durante aproximadamente 40 minutos. Após esse período, apresentou desregulação emocional. O pai relatou que, quando Vinícius não vai ao banheiro evacuar, costuma ficar agitado e até agressivo. Diante disso, o pai optou por encerrar a sessão e levá-lo embora.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-31'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Vinícius chegou bem para a sessão, demonstrando disposição inicial. Iniciou a atividade com massinha de modelar, utilizando a criatividade para construir uma casa, explorando a imaginação e fortalecendo a musculatura dos dedos e das mãos. Em seguida, participou do jogo “Lince”, trabalhando atenção, concentração e percepção visual. Após o jogo, relatou estar cansado, optando por não realizar o circuito motor. A decisão foi respeitada, considerando seus limites e promovendo um ambiente de acolhimento e autorregulação emocional.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Manuela V. G. Araujo Da Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Manuela V. G. Araujo Da Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-04'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Manuela participou da sessão demonstrando boa disposição e interesse pelas atividades propostas. Iniciou com o jogo do Boble, no qual observou atentamente as figuras e identificou rapidamente os pares iguais, mostrando boa atenção visual e agilidade perceptiva. Em alguns momentos precisou de ajuda para manter o foco, mas retomou a tarefa com entusiasmo.

Em seguida, realizou o jogo de tabuleiro de charadas, demonstrando criatividade e boa compreensão das regras. Conseguiu expressar-se por meio de gestos e palavras para representar as charadas, estimulando a linguagem, expressão oral e interação social. Mostrou-se engajada e participativa durante toda a atividade, respeitando os turnos e reagindo de forma positiva às interações.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Heloisa iniciou a sessão realizando a leitura de um livro, demonstrando atenção e interesse pela história. Durante a atividade de compreensão de texto, respondeu às perguntas propostas, expressando suas ideias de forma clara e coerente. Em seguida, participou do jogo Dobble, trabalhando a atenção, percepção visual e rapidez de raciocínio. Finalizou com um jogo de tabuleiro, no qual demonstrou capacidade de seguir regras, esperar sua vez e resolver situações de forma estratégica, promovendo o raciocínio lógico e a socialização.
Essas atividades favoreceram o desenvolvimento de habilidades cognitivas, linguagem e funções executivas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Descrição na Psicomotricidade:
Benjamin iniciou a sessão realizando equilíbrio na bola suíça, posicionando-se debruçado enquanto colocava as argolas no cone, atividade que favorece o controle postural, coordenação motora global e força de tronco. Em seguida, subiu e desceu sobre um elevado de espumas, estimulando o equilíbrio dinâmico, coordenação e noção espacial. Finalizou com massinha de modelar, trabalhando coordenação motora fina, força manual e criatividade. Durante toda a proposta, mostrou-se participativo e envolvido nas atividades.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Descrição na Psicomotricidade:
Pietra iniciou a sessão realizando o subir e descer 12 lances de escada por duas vezes, com intervalo de 15 minutos entre as repetições, atividade que estimulou a resistência física, coordenação motora global, força de membros inferiores e organização espacial. Em seguida, realizou exercícios na prancha de equilíbrio com suporte de elástico, promovendo o trabalho de equilíbrio, controle postural e concentração. Finalizou com o jogo da forca, favorecendo a atenção, raciocínio e coordenação visomotora. Manteve-se engajada e demonstrou bom desempenho nas propostas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin iniciou a sessão realizando circuito sobre superfície elevada, favorecendo o equilíbrio dinâmico, coordenação motora global e noção espacial. Em seguida, realizou a colocação de argolas no pino, estimulando a coordenação óculo-manual, precisão motora e atenção concentrada. Finalizou com jogos de encaixe, trabalhando coordenação motora fina, organização perceptiva e resolução de problemas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Na sessão de psicomotricidade, Pietra iniciou deitada no tatame e, utilizando a corda como apoio, realizou elevação de tronco até a posição sentada, trabalhando força abdominal e coordenação motora global (4×15). Em seguida, sobre a prancha de equilíbrio, realizou lançamentos de bola contra a parede (4×10), estimulando equilíbrio, ajuste postural e coordenação óculo-manual. Posteriormente, participou do jogo Tapa Certo, favorecendo atenção visual, rapidez de resposta, controle inibitório e coordenação motora fina. Finalizou com a atividade de tênis de bexiga, promovendo ritmo, tempo de reação, controle motor e organização espacial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Na sessão de psicomotricidade, Vinicius realizou atividade sobre a prancha de equilíbrio, encaixando as argolas no cone, trabalhando coordenação óculo-manual, organização espacial, dissociação de cinturas e ajuste postural. Em seguida, participou do jogo Tapa Certo, estimulando atenção visual, tempo de reação, coordenação motora fina e controle inibitório. Finalizou com o jogo Pingo de Letras, favorecendo discriminação visual, reconhecimento de letras, coordenação motora fina e atenção sustentada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Na sessão de psicopedagogia, Heloisa iniciou com o jogo Cuca Legal, favorecendo atenção, percepção visual, memória e estratégias de resolução de problemas. Em seguida, realizou atividade de leitura, trabalhando decodificação, fluência e compreensão textual. Finalizou produzindo um resumo do conteúdo lido, estimulando organização do pensamento, interpretação, expressão escrita e habilidade de síntese.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Manuela V. G. Araujo Da Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Manuela V. G. Araujo Da Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Manuela realizou a atividade Cuca Maluca, trabalhando atenção sustentada, percepção visual, organização espacial e planejamento para resolução de desafios. Em seguida, montou um quebra-cabeça de 200 peças, favorecendo raciocínio lógico, análise global-detalhe, coordenação visuomotora e persistência na tarefa. Também realizou um teste cognitivo de raciocínio lógico, explorando habilidades de classificação, sequência, comparação e solução de problemas. A aluna demonstrou envolvimento nas atividades e bom desempenho no que foi proposto.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Heloisa realizou um teste cognitivo, trabalhando habilidades de atenção, memória operacional, raciocínio lógico e resolução de problemas. Em seguida, montou um quebra-cabeça de 150 peças. No início apresentou leve desinteresse e necessidade de incentivo, porém conseguiu organizar as peças, manter-se na atividade e concluir a montagem com êxito. Demonstrou capacidade de persistência e autonomia ao longo da tarefa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin realizou a atividade de passar o aro no pé enquanto estava sentado no tatame. Durante a tarefa, ele demonstrou boa atenção e empenho para encaixar o aro, utilizando coordenação motora fina e global. A atividade também trabalhou esquema corporal, equilíbrio postural e planejamento motor, pois Benjamin precisou ajustar a posição das mãos, olhar, pé e tronco para completar o movimento. Mostrou iniciativa e capacidade de organizar a ação, realizando os movimentos com concentração e intencionalidade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra subiu e desceu a escada, realizando séries de  repetições, trabalhando força de membros inferiores, coordenação motora global e resistência.
Em seguida, deitou-se no tatame e realizou o exercício de puxar o elástico para sentar, também em 4 séries de 15 repetições, estimulando força de tronco, organização postural e coordenação.
Depois, manteve-se equilibrada na prancha, favorecendo controle corporal e estabilidade.
Na sequência, passou o bambolê pelo corpo, trabalhando esquema corporal e orientação espacial.
Finalizou a atividade ao se arrastar de um ponto a outro para colocar as argolas no cone, estimulando coordenação global, força, planejamento motor e atenção.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Heloisa realizou o teste MoCA, apresentando bom entendimento das tarefas propostas. Contudo, demonstrou dificuldade principalmente em duas áreas:
Cálculo seriado (100 – 7), onde conseguiu os primeiros passos, mas errou nas sequências seguintes;
Evocação espontânea de palavras, lembrando apenas parte delas sem pistas.
Apesar dessas dificuldades, manteve atenção adequada, boa nomeação, compreensão e orientação. O desempenho geral foi satisfatório, com necessidade de fortalecer memória e raciocínio lógico.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin realizou exercícios de equilíbrio na bola suíça, mantendo postura e controle corporal enquanto realizava movimentos coordenados. Durante a atividade, encaixou argolas no cone, estimulando coordenação óculo-manual, organização espacial e precisão motora.
A proposta trabalhou:
Equilíbrio estático e dinâmico
Tônus e ajuste postural
Coordenação motora global
Coordenação motora fina e óculo-manual
Atenção e controle inibitório
Planejamento motor
Orientação espacial',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou a atividade de subir e descer 6 lances de escada por 2 vezes, trabalhando força de membros inferiores, coordenação motora e resistência. Em seguida, realizou a prancha de equilíbrio, passando o bambolê pelo corpo, atividade voltada ao equilíbrio, consciência corporal e coordenação global.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Vinicius Gabriel Dal Belo De Souza' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Vinicius realizou atividades na psicomotricidade envolvendo prancha de equilíbrio, onde trabalhou controle postural e atenção. Em seguida, montou um quebra-cabeça, estimulando raciocínio lógico, organização visual e coordenação motora fina. Finalizou com o jogo da memória, que trabalhou atenção, concentração, percepção visual e turnos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Manuela V. G. Araujo Da Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Manuela V. G. Araujo Da Silva' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Manuela realizou atividades de nomeação de imagens e o jogo “Stop”. Essas propostas trabalharam habilidades de atenção, concentração, organização do pensamento e ampliação do vocabulário. Além disso, favoreceram a categorização, a rapidez de raciocínio e o acesso ao léxico, aspectos importantes no desenvolvimento psicopedagógico.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Heloísa realizou atividades de observação e descrição de imagens, nas quais primeiro olhava a figura e depois precisava descrevê-la sem apoio visual. A atividade trabalhou memória, atenção, organização do pensamento e linguagem oral. Também foi realizada nomeação de letras associadas a palavras, favorecendo reconhecimento alfabético, consciência fonológica e ampliação de vocabulário no contexto',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Benjamin P. S. B. Santos' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Benjamin realizou um circuito em superfície elevada almofadada, trabalhando equilíbrio dinâmico, coordenação global e ajuste postural. Em seguida, realizou atividades na prancha de equilíbrio, favorecendo controle corporal, estabilidade, consciência corporal e organização motora. Durante o circuito, foram estimuladas habilidades de planejamento motor, atenção e segurança na movimentação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther  participou de atividades de AVD com mediação tátil e verbal, realizando higiene das mãos com redução de ajuda física. Demonstrou melhor organização sequencial da tarefa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou treino de alimentação funcional utilizando pistas táteis para localização de utensílios, apresentando maior iniciativa e menor dependência.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de vestir e despir casaco , meia e tenis com orientação tátil, conseguindo identificar com ajuda frente e verso das roupas , treino de lateralidade e estimulação sensorial',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou treino de orientação espacial no ambiente terapêutico, demonstrando aumento da segurança e redução de comportamentos de evitação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de organização de objetos pessoais, utilizando categorização tátil, favorecendo autonomia na rotina diária.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou treino de mobilidade funcional em ambiente estruturado, com melhora na percepção corporal e planejamento motor.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividades de coordenação motora fina com materiais adaptados, apresentando maior controle e funcionalidade para AVDs.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou treino de uso funcional de utensílios domésticos com ajuda verbal e pratica, demonstrando maior independência na execução da tarefa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade :Realizou treino de uso funcional de utensílios domésticos com ajuda verbal e pratica, demonstrando maior independência na execução da tarefa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de reconhecimento tátil de objetos do cotidiano, ampliando repertório funcional e autonomia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'continuidade: Desenvolveu atividade de reconhecimento tátil de objetos do cotidiano, ampliando repertório funcional e autonomia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou treino de rotina de higiene pessoal com pistas verbais e táteis, apresentando redução significativa de ajuda física. Usar banheiro, vestir se, limpar se, lavar as maos, voltar a sala.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Contiuidade: Executou treino de rotina de higiene pessoal com pistas verbais e táteis, apresentando redução significativa de ajuda física. Usar banheiro, vestir se, limpar se, lavar as maos, voltar a sala.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de organização temporal da rotina, utilizando sequência verbal estruturada, com boa adesão e compreensão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de organização temporal da rotina, utilizando sequência verbal estruturada, com boa adesão e compreensão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade : Participou de atividade de organização temporal da rotina, utilizando sequência verbal estruturada, com boa adesão e compreensão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de deslocamento funcional com referência sonora, demonstrando melhora na orientação e segurança porem ainda com grande dependencia e riscos, se distrai facilmente se colocando em riscos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Conduta mantida. Realizou atividade de deslocamento funcional com referência sonora, demonstrando melhora na orientação e segurança ainda com dificuldade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizamos estimulação multissensorial, Esther demonstra dificuldade no foco e atenção, e demos continuidade ao trabalho ja iniciado. Realizou atividade de deslocamento funcional com referência sonora, demonstrando melhora na orientação e segurança com ajuda verbal e as veze pratica.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de escolha funcional entre opções de atividades, favorecendo autonomia decisória e comunicação de preferências.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Integração Sensorial + continuidade : Desenvolveu treino de escolha funcional entre opções de atividades, favorecendo autonomia decisória e comunicação de preferências.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de autocuidado envolvendo cuidados com pertences pessoais, perdeu a atenção e engajamento durante a tarefa varias vezes, solicitante por brincadeiras que ela sugere, dispersa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade Participou de atividade de autocuidado envolvendo cuidados com pertences pessoais, mantendo atenção e engajamento durante a tarefa por pouco tempo, precisando de ajuda verbal e pratica para concluir a proposta.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou treino de sentar, levantar e posicionar-se adequadamente em diferentes superfícies, com maior controle postural precisando de ajuda verbal e pratica + IS.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou treino de sentar, levantar e posicionar-se adequadamente em diferentes superfícies, com maior controle postural precisando de ajuda verbal e pratica + IS.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Conduta mantida: Executou treino de sentar, levantar e posicionar-se adequadamente em diferentes superfícies, com maior controle postural precisando de ajuda verbal e pratica + IS.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou treino de sentar, levantar e posicionar-se adequadamente em diferentes superfícies, com maior controle postural precisando de ajuda verbal e pratica + IS. AInda com bastante dificuldade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade sensório-motora com foco em autorregulação, favorecendo melhor participação nas tarefas funcionais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade sensório-motora com foco em autorregulação, favorecendo melhor participação nas tarefas funcionais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de organização do espaço individual, utilizando referências táteis fixas, com maior independência.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de organização do espaço individual, utilizando referências táteis fixas, com maior independência com ajuda verbal e pratica.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade funcional de guardar e localizar objetos pessoais, demonstrando compreensão da sequência da tarefa mas ainda precisando de ajuda pratica e verbal. Tambem realizo Estimulação multissensorial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade funcional de guardar e localizar objetos pessoais, demonstrando  dificuldade na sequência da tarefa e precisando de ajuda pratica e verbal. Tambem realizo Estimulação multissensorial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Contiuidade. Realizou atividade funcional de guardar e localizar objetos pessoais, demonstrando  dificuldade na sequência da tarefa e precisando de ajuda pratica e verbal. Tambem realizo Estimulação multissensorial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividades integradas de AVDs com foco em autonomia, apresentando alguma evolução na iniciativa e redução da dependência mas ainda precisa de treino.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther Ribeiro realizou atividades de equilíbrio na prancha, permanecendo em pé enquanto coordenava o movimento para colocar as argolas posicionadas ao lado direito, trabalhando lateralidade (direita e esquerda), coordenação motora global, controle postural e organização espacial. Em seguida, realizou exercícios na bola suíça para favorecer equilíbrio, dissociação de cinturas e ajuste tônico. Finalizou com um circuito motor, envolvendo deslocamento, mudanças de nível e orientação espacial, promovendo agilidade, coordenação global e organização motora.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Esther Ribeiro De Paula' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Esther iniciou a sessão realizando equilíbrio na prancha de equilíbrio, com apoio verbal e tátil para orientação espacial. Durante o exercício, manteve boa atenção às instruções auditivas e buscou ajustar o corpo para manter a estabilidade.
Em seguida, realizou a colocação das argolas no pino, atividade feita por meio de exploração tátil, reconhecendo o local de encaixe com as mãos e organizando o movimento de alcançar, segurar e posicionar as argolas corretamente. Essa tarefa estimulou coordenação motora fina, precisão tátil e planejamento motor.
Após essa etapa, Esther participou de uma atividade de percepção corporal em movimento, tocando diferentes partes do corpo conforme solicitado verbalmente (cabeça, ombros, joelhos, pés). O exercício favoreceu o esquema corporal, a consciência corporal por meio de pistas auditivas e a capacidade de responder aos comandos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Rael participou de atividade estruturada de atenção sustentada, mantendo foco por mais tempo com mediação verbal e pausas organizadas. Estimulação sensorial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade motora com estímulos proprioceptivos, apresentando melhora na organização corporal e redução da agitação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu tarefa de seguir comandos simples em sequência, necessitando de reforços positivos para manutenção do engajamento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu tarefa de seguir comandos simples em sequência, necessitando de reforços positivos para manutenção do engajamento. Apresentou muitas negativas diante de propostas de atividades.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de limite e espera, demonstrando resistência inicial, porém conseguiu finalizar a tarefa com suporte emocional.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de coordenação visomotora adaptada, com melhora gradual no controle motor e atenção à proposta.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Disperso, falante, humor mais oscilante, apresentou negativas diante das propostas. Executou atividade de coordenação visomotora adaptada, com melhora gradual no controle motor e atenção à proposta.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de tolerância à frustração, sendo orientado a reorganizar a tarefa após erro, com redução de comportamentos opositores.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Contiuidade : Desenvolveu atividade de tolerância à frustração, sendo orientado a reorganizar a tarefa após erro, com redução de comportamentos opositores.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Tem se mostrado mais impaciente, dá gritos repentinos no meio das atividades, dispersa facilmente, mais dificuldade de foco e atenção e muitas negativas. COmpartilho com a genitora que refere que a psicóloga tambem notou esse comportamento, levara ao medico responsável pois houve troca da medicação .',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de tolerância à frustração, sendo orientado a reorganizar a tarefa após erro, com redução de comportamentos opositores mediante negociação pois houve recusa em realizar a atividade prontamente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de circuito sensório-motor para autorregulação, apresentando melhora no nível de alerta e organização comportamental sob ajuda verbal e incentivo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de mesa com tempo estruturado, mantendo atenção por períodos curtos, com necessidade de redirecionamento verbal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade : Realizou atividade de mesa com tempo estruturado, mantendo atenção por períodos curtos, com necessidade de redirecionamento verbal, ainda dispersando facilmente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de planejamento motor e espacial, apresentando dificuldade inicial, porém evolução com pistas verbais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade : Desenvolveu atividade de planejamento motor e espacial, apresentando dificuldade inicial, porém evolução com pistas verbais. Realizamos estimulaçao sensorial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Genitora coloca que medicação foi revista e ja esta mudando a mesma. Participou de tarefa funcional com regras claras, aceitando melhor os limites impostos durante a sessão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade : Participou de tarefa funcional com regras claras, aceitando melhor os limites impostos durante a sessão com ajuda verbal e pratica.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Rael Muniz Soterio' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Rae,l participou de atividade estruturada de atenção sustentada, mantendo foco por maior tempo com mediação verbal e pausas organizadas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade estruturada de raciocínio lógico, apresentando bom desempenho e engajamento, favorecendo vínculo terapêutico.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de leitura funcional com palavras do cotidiano, demonstrando dificuldade, porém manteve atenção com mediação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade: Desenvolveu treino de leitura funcional com palavras do cotidiano, demonstrando dificuldade, porém manteve atenção com mediação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-27'::date
      LIMIT 1
    ),
    False,
    'Realizou atividade de escrita funcional (nome e dados simples), necessitando de apoio visual e verbal constante.',
    'Realizou atividade de escrita funcional (nome e dados simples), necessitando de apoio visual e verbal constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade : Realizou atividade de escrita funcional (nome e dados simples), necessitando de apoio visual e verbal constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de memória autobiográfica, apresentando dificuldade para recordar informações familiares básicas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Contiunuidade: Participou de treino de memória autobiográfica, apresentando dificuldade para recordar informações familiares básicas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Contiunuidade: Participou de treino de memória autobiográfica, apresentando dificuldade para recordar informações familiares básicas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de identificação e verbalização de fatos recentes, com necessidade de perguntas direcionadas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de identificação e verbalização de fatos recentes, com necessidade de perguntas direcionadas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de reconhecimento de horas em relógio analógico e digital, com dificuldade persistente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de reconhecimento de horas em relógio analógico e digital, com dificuldade persistente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de reconhecimento de horas em relógio analógico e digital, com dificuldade persistente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de reconhecimento de horas em relógio analógico e começa a compreender como ver as horas, embora ainda tenha muitas duvidas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Contiuidade no trabalho para Enzo aprender a ver as horas. Demonstra insegurança e medo de errar ao ver ashoras, foi encorajado e conseguiu ver as horas inteiras e horas e meia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Conseguindo ver as horas inteiras e horas e meias digitais, mas ainda com insegurança de errar. Iniciamos 3/4 de horas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de raciocínio matemático funcional (quantidades simples), necessitando de material concreto.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de raciocínio matemático funcional (quantidades simples), necessitando de material concreto.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de raciocínio matemático funcional (quantidades simples), necessitando de material concreto.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou treino de sequência lógica de tarefas diárias, apresentando melhor compreensão quando estruturadas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou treino de sequência lógica de tarefas diárias, apresentando melhor compreensão quando estruturadas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Contonuidade :Realizou treino de sequência lógica de tarefas diárias, apresentando melhor compreensão quando estruturadas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de comunicação funcional, com estímulo à iniciação de fala em ambiente seguro.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de comunicação funcional, com estímulo à iniciação de fala em ambiente seguro.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de habilidades sociais básicas, com simulação de interações simples.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de habilidades sociais básicas, com simulação de interações simples.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de associação entre números e quantidades, com apoio visual constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de associação entre números e quantidades, com apoio visual constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de associação entre números e quantidades, com apoio visual constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de leitura de símbolos e sinais do cotidiano, favorecendo funcionalidade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de leitura de símbolos e sinais do cotidiano, favorecendo funcionalidade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de memória funcional com repetição espaçada, apresentando baixa retenção inicial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de memória funcional com repetição espaçada, apresentando baixa retenção inicial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de identificação de endereço residencial com apoio visual e repetição guiada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de identificação de endereço residencial com apoio visual e repetição guiada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de associação entre números e quantidades, com apoio visual constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Enzo Saiki' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de associação entre números e quantidades, com apoio visual constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de estimulação cognitiva envolvendo atenção e memória recente, apresentando boa adesão e compreensão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de orientação temporal utilizando calendário e rotina diária, com entendimento na organização.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de memória funcional com evocação de fatos recentes, necessitando de pistas verbais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de memória funcional com evocação de fatos recentes, necessitando de pistas verbais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de planejamento de tarefas do cotidiano, mantendo atenção durante a execução.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de coordenação motora fina associada à função cognitiva, com bom desempenho.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de coordenação motora fina associada à função cognitiva, com bom desempenho.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou treino de memoria na evocação da sequência lógica de AVDs, apresentando leve dificuldade, porém conseguiu concluir a tarefa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    '7. Participou de atividade de reconhecimento e nomeação de objetos do cotidiano, trabalho, viagens com resposta adequada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de atenção sustentada em tarefa estruturada, com melhora do tempo de permanência.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de orientação espacial em ambiente terapêutico, com segurança.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de cálculo funcional simples, apresentando dificuldade moderada e necessidade de apoio.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de memória autobiográfica, recordando fatos antigos com maior facilidade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de resolução de problemas cotidianos, com apoio verbal mínimo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de resolução de problemas cotidianos, com apoio verbal mínimo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de uso de agenda e lembretes, favorecendo autonomia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de dupla tarefa (cognitiva e motora), com necessidade de ritmo reduzido.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de dupla tarefa (cognitiva e motora), com necessidade de ritmo reduzido.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de categorização e associação, apresentando boa organização cognitiva.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de atenção seletiva, com controle adequado de distrações.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de comunicação funcional e narrativa simples, com boa coerência.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de planejamento: viagem, Lar,  financeiro simples, com orientação verbal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Queixas constantes de cansaço. Cachorro estava doente, queixa-se das imposições da esposa. Participou de atividade de tomada de decisão em situações simuladas do cotidiano com dificuldade  em se colocar.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividades integradas de estimulação cognitiva e funcional, visando manutenção da independência.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de estimulação da memória de trabalho, apresentando dificuldade leve e boa colaboração.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    '22. Desenvolveu treino de reconhecimento de horários da rotina diária, com necessidade de reforço verbal para concluir e compreender a atividade. Tambem trabalhamos memoria.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de leitura funcional de informações simples, com compreensão adequada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de coordenação motora global associada à atenção, com bom desempenho.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    '25. Desenvolveu treino de raciocinio e orientação pessoal e situacional, mantendo-se concentrado durante a sessão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de associação entre imagens e funções, apresentando respostas coerentes.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos memoria de evocação com sucesso , em alguns momentos precisou de ajuda pratica para se recordar.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de atenção sustentada com estímulos visuais e verbais, mantendo bom nível de engajamento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-31'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de memória episódica com evocação guiada, apresentando melhora com pistas semânticas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de orientação temporal utilizando exercicio de  rotina estruturada, com necessidade de reforço verbal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de planejamento de tarefas domésticas simples, com execução organizada, preciso de ajudar verbal para escrever o passo a passo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade. Participou de atividade de planejamento de tarefas domésticas simples, com execução organizada, preciso de ajudar verbal para escrever o passo a passo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de coordenação motora fina associada à função cognitiva, com desempenho adequado.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou treino de atenção seletiva em ambiente controlado, com redução de distrações externas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de categorização de objetos por função, com boa compreensão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de reconhecimento de sinais e símbolos do cotidiano, com respostas adequadas em sua maioria.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de resolução de problemas funcionais, necessitando orientação mínima.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de dupla tarefa cognitivo-motora, com ritmo adaptado.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou atividade de comunicação funcional e narrativa simples, mantendo coerência.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de cálculo funcional relacionado a compras simuladas, com apoio visual.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de organização do tempo diário, utilizando agenda estruturada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de tomada de decisão em situações simuladas do cotidiano, com boa participação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Akio Baba' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de memória autobiográfica recente, com dificuldade leve.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente participou de atividade de posicionamento funcional em cadeira de rodas, visando alinhamento postural e conforto.
 Desenvolveu treino de controle cervical e tronco com apoio, apresentando leve melhora na estabilidade.
Chorosa, deprimida, com dificuldade na fala e no controle da salivação. Questiona o sentido da vida, sua situação, foi acolhida, conversamos a respeito da sua trajetoria na vida e suas conquistas. Fez treino de uso de colher no prato.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa, cuidadora pede para atende la online de ultima hora sem aviso previo, oriento a respeito, porem a sessao se tornou difcultosa devido a dificuldade de fala da paciente. Trabalhamos memoria, sequencias, associação de figuras.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de estimulação oromotora para controle de salivação, com necessidade de auxílio constante.
Participou de treino de preensão palmar com objetos adaptados, apresentando rigidez e lentificação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de preensão palmar com objetos adaptados, apresentando rigidez e lentificação.

Desenvolveu atividade de coordenação motora fina bilateral, com execução lenta e necessidade de facilitação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa, deprimida. Falamos sobre o luto do marido. Executou treino funcional de AVDs simuladas, mantendo participação ativa com assistência total.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa, verbaliza raiva do marido falecido, acolho. 
Executou treino funcional de AVDs simuladas, mantendo participação ativa com assistência total.
Participou de atividade de alcance funcional em plano frontal, respeitando limites motores.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou treino funcional de AVDs simuladas, mantendo participação ativa com assistência total.

Participou de atividade de alcance funcional em plano frontal, respeitando limites motores.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa, queixa de falta de afeto dos  filhos. Participou de atividade de alcance funcional em plano frontal, respeitando limites motores.
Desenvolveu treino de comunicação funcional com estímulo à vocalização e gestos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de comunicação funcional com estímulo à vocalização e gestos.

Realizou atividade de autorregulação respiratória associada à fala, com resposta limitada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de treino de ingesta de agua assistida com ajuda pratica e verbal, visando maior funcionalidade.

Desenvolveu atividade de mobilidade funcional em cadeira de rodas, com supervisão total.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-05'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de estimulação sensório-motora para redução de rigidez.
Desenvolveu treino de coordenação óculo-manual com materiais de grande preensão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Chorosa, questiona a vida atual, acolho, oriento. Enfatizo a importância da psicoterapia e da fono. 
Desenvolveu atividade de consciência corporal e esquema corporal com mediação total.
 Executou treino de uso de utensiolios para AVDs, com orientação ao cuidador.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Aparecida Argona Pozzo' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Executou treino de uso de utenciosilio para AVDs, com ajuda parcial e total.

Participou de atividade de estimulação cognitiva leve associada à função motora.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sonolenta, realizamos atividades cognitivas',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade estruturada de AVD, apresentando boa atenção e execução, com resistência inicial à mediação.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trouxe bolo para comemorar meu aniversario demonstrando afeto e lembrança. Comemoramos todos juntos. Desenvolveu treino de comunicação funcional, utilizando pistas visuais e gestuais para ampliar a expressão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizou atividade de flexibilização cognitiva, aceitando mudança de estratégia após negociação verbal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de tarefa sequencial com início, meio e fim definidos, mantendo concentração durante toda a execução.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu atividade de coordenação motora fina, executando com precisão e autonomia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    '6. Executou treino de tolerância à ajuda gradual, aceitando apoio mínimo após explicação prévia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de atividade de tomada de decisão guiada, demonstrando rigidez, porém engajamento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolveu treino de habilidades sociais em contexto simulado, com baixa iniciativa verbal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Participou de tarefa não preferida, mantendo atenção quando objetivos foram claros.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente atendida em sessão individual de Terapia Ocupacional. Apresenta-se colaborativa, porém com lentificação motora. Realizadas atividades de estimulação de motricidade fina com uso de encaixes e preensão palmar. Observa-se dificuldade em coordenação bilateral. Trabalhada orientação temporal com auxílio verbal. Paciente responde com leve melhora na atenção.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade: Paciente atendida em sessão individual de Terapia Ocupacional. Apresenta-se colaborativa, porém com lentificação motora. Realizadas atividades de estimulação de motricidade fina com uso de encaixes e preensão palmar. Observa-se dificuldade em coordenação bilateral. Trabalhada orientação temporal com auxílio verbal. Paciente responde com leve melhora na atenção.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão voltada à estimulação cognitiva e funcional. Utilizados exercícios de memória imediata por meio de associação de imagens. Paciente necessitou de pistas verbais frequentes. Mantém limitação de motricidade fina, com esforço aumentado para manipular objetos pequenos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade: Sessão voltada à estimulação cognitiva e funcional. Utilizados exercícios de memória imediata por meio de associação de imagens. Paciente necessitou de pistas verbais frequentes. Mantém limitação de motricidade fina, com esforço aumentado para manipular objetos pequenos',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizada atividade funcional simulando AVD (abrir e fechar recipientes). Paciente apresenta dificuldade de dissociação de dedos e força reduzida. Treinada memória de curto prazo com repetição de comandos simples, obtendo resposta parcial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade: Realizada atividade funcional simulando AVD (abrir e fechar recipientes). Paciente apresenta dificuldade de dissociação de dedos e força reduzida. Treinada memória de curto prazo com repetição de comandos simples, obtendo resposta parcial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente comparece orientada em pessoa, parcialmente em tempo. Trabalhada coordenação motora fina com uso de massa terapêutica. Observa-se melhora discreta na resistência muscular de mãos. Memória operacional ainda vem demonstrando se prejudicada em alguns momentos, com episódios de esquecimento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade: Paciente comparece orientada em pessoa, parcialmente em tempo. Trabalhada coordenação motora fina com uso de massa terapêutica. Observa-se melhora discreta na resistência muscular de mãos. Memória operacional ainda vem demonstrando se prejudicada em alguns momentos, com episódios de esquecimento.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão focada em estimulação sensório-motora. Utilizados estímulos táteis variados. Paciente demonstra interesse, porém apresenta dificuldade em recordar instruções após alguns minutos. Necessita supervisão constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atendida em ambiente tranquilo, favorecendo atenção. Realizadas atividades de pinça fina com pregadores adaptados. Paciente executa com lentidão, porém com maior precisão. Memória recente permanece comprometida.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade: Atendida em ambiente tranquilo, favorecendo atenção. Realizadas atividades de pinça fina com pregadores adaptados. Paciente executa com lentidão, porém com maior precisão. Memória recente permanece comprometida.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atendida em ambiente tranquilo, favorecendo atenção. Realizadas atividades de pinça fina com pregadores adaptados. Paciente executa com lentidão, porém com maior precisão. Memória recente   com episodios de esquecimento em meio a fala.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada estimulação cognitiva através de nomeação de objetos e cores. Paciente apresenta respostas lentas, com necessidade de reforço verbal. Motricidade fina limitada, porém mantém preensão funcional as vezes com ajuda.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada estimulação cognitiva através de nomeação de objetos e cores. Paciente apresenta respostas lentas, com necessidade de reforço verbal. Motricidade fina limitada, porém mantém preensão funcional as vezes com ajuda.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão direcionada à funcionalidade de membros superiores. Utilizados jogos simples de encaixe. Paciente demonstra cansaço ao final, mas mantém engajamento. Memória de evocação apresenta falhas frequentes.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão direcionada à funcionalidade de membros superiores. Utilizados jogos simples de encaixe. Paciente demonstra cansaço ao final, mas mantém engajamento. Memória de evocação apresenta falhas frequentes.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizado treino de AVD adaptada (simulação de higiene). Paciente necessita auxílio verbal contínuo para sequência de tarefas. Motricidade fina insuficiente para manipulação precisa, exigindo adaptações.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizado treino de AVD adaptada (simulação de higiene). Paciente necessita auxílio verbal contínuo para sequência de tarefas. Motricidade fina insuficiente para manipulação precisa, exigindo adaptações.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente apresenta-se estável clinicamente. Trabalhada atenção sustentada e memória imediata com repetição de palavras. Observa-se leve melhora na manutenção do foco. Coordenação fina ainda prejudicada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão com foco em fortalecimento intrínseco de mãos. Utilizados exercícios com bola terapêutica. Paciente tolera bem a atividade. Memória recente permanece com déficit, esquecendo orientações iniciais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão com foco em fortalecimento intrínseco de mãos. Utilizados exercícios com bola terapêutica. Paciente tolera bem a atividade. Memória recente permanece com déficit, esquecendo orientações iniciais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade. Sessão com foco em fortalecimento intrínseco de mãos. Utilizados exercícios com bola terapêutica. Paciente tolera bem a atividade. Memória recente permanece com déficit, esquecendo orientações iniciais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizada atividade lúdica com cartas grandes para estimulação cognitiva. Paciente demonstra dificuldade em recordar regras simples. Motricidade fina limitada, porém funcional com pequenas adaptações.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada coordenação olho-mão por meio de atividades de encaixe direcionado. Paciente apresenta melhora discreta na precisão. Memória operacional ainda instável, com necessidade de repetição constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada coordenação olho-mão por meio de atividades de encaixe direcionado. Paciente apresenta melhora discreta na precisão. Memória operacional ainda instável, com necessidade de repetição constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão voltada à estimulação global. Paciente apresenta flutuação de atenção. Motricidade fina comprometida, com dificuldade para manipular objetos pequenos. Mantém boa aceitação da intervenção.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão voltada à estimulação global. Paciente apresenta flutuação de atenção. Motricidade fina comprometida, com dificuldade para manipular objetos pequenos. Mantém boa aceitação da intervenção.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizado treino de sequenciamento de tarefas simples. Paciente necessita auxílio parcial para organização da atividade. Motricidade fina com baixo desempenho funcional em alguns momentos, relatando cansaço.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Efigênia Machado Guimaraes' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade. Realizado treino de sequenciamento de tarefas simples. Paciente necessita auxílio parcial para organização da atividade. Motricidade fina com baixo desempenho funcional em alguns momentos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-14'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Aplicação portage com genitora',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alexandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alexandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    True,
    NULL,
    'Em formação de vinculo, demonstra dificuldade na comunicação verbal, nao fala, faz alguns gestos, nao acolhe orientações verbais, deficit intelectual moderado. Nao tem percepção de higiente pessoal, riscos, horas, dialogo, pouca aderencia as propostas das atividades, aereo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-14'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente atendido em sessão individual. Apresenta-se não verbal, com contato visual breve. Demonstra comportamento repetitivo gestual e baixa adesão às propostas. Necessitou mediação constante para permanência na atividade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-21'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão iniciada com tentativa de vínculo terapêutico. Paciente mantém foco reduzido, abandona atividades propostas e retorna a gestos repetitivos. Responde parcialmente a estímulos sensoriais.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alexandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alexandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-28'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizadas tentativas de atividade estruturada de curta duração. Paciente apresenta recusa ativa, afastando materiais. Mantém solicitações gestuais repetitivas sem função comunicativa clara.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizadas tentativas de atividade estruturada de curta duração. Paciente apresenta recusa ativa, afastando materiais. Mantém solicitações gestuais repetitivas sem função comunicativa clara.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente apresenta dificuldade em sustentar atenção. Não verbaliza e utiliza gestos estereotipados. Necessita redirecionamentos frequentes. Baixa tolerância à frustração observada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente apresenta dificuldade em sustentar atenção. Não verbaliza e utiliza gestos estereotipados. Necessita redirecionamentos frequentes. Baixa tolerância à frustração observada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão voltada à estimulação sensorial regulatória. Paciente demonstra leve redução de agitação durante estímulos proprioceptivos. Adesão limitada às propostas dirigidas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-02'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão voltada à estimulação sensorial regulatória. Paciente demonstra leve redução de agitação durante estímulos proprioceptivos. Adesão limitada às propostas dirigidas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alexandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alexandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Tentativa de atividade funcional simples. Paciente não adere, apresentando comportamento de esquiva. Mantém padrão repetitivo gestual ao longo da sessão.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-23'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Observa-se dificuldade significativa de engajamento. Paciente permanece pouco tempo sentado. Atenção dispersa e ausência de iniciativa para atividades estruturadas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alexandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alexandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-30'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Observa-se dificuldade significativa de engajamento. Paciente permanece pouco tempo sentado. Atenção dispersa e ausência de iniciativa para atividades estruturadas.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada tentativa de imitação motora. Paciente não responde aos comandos visuais. Mantém comportamento repetitivo, necessitando mediação constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'ContiuidadeTrabalhada tentativa de imitação motora. Paciente não responde aos comandos visuais. Mantém comportamento repetitivo, necessitando mediação constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-04'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente apresenta recusa persistente às propostas terapêuticas. Mantém baixo nível de interação com materiais. Atenção sustentada ausente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-11'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade. Paciente apresenta recusa persistente às propostas terapêuticas. Mantém baixo nível de interação com materiais. Atenção sustentada ausente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Alxandro Ribeiro' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão com uso de estímulos visuais simples. Paciente demonstra interesse momentâneo, porém não sustenta foco. Retorna rapidamente aos gestos repetitivos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Maria  comparece à sessão acompanhada da mãe, apresentando dificuldade inicial de espera e pouca escuta, mae da comandos e Maria ignora e ri em alguns momentos. Realizadas atividades estruturadas de pareamento e escolha guiada, com mediação verbal e visual. Apresentou necessidade de redirecionamento frequente.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizadas atividades de motricidade grossa com foco em pular e coordenação bilateral. Criança apresentou dificuldade na execução, necessitando de modelagem corporal e auxílio físico parcial. Apos devolutiva com a mãe em julho foi passado tudo que vem sendo trabalho com Maria Beatriz assim como os resultados do portage e perfil sensorial.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão focada em treino de comandos simples (sentar, levantar, guardar). Observada dificuldade na compreensão e execução imediata, com melhor resposta após repetição e apoio visual.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-05-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada motricidade fina por meio de encaixes e rasgar papel. Apresentou dificuldade de preensão e coordenação, necessitando de incentivo constante e tempo ampliado.  Trabalhamos tambem AVD (Uso de banheiro) e higiente pessoal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Apresentou sinais de desregulação emocional frente à frustração durante atividade dirigida, sendo realizada intervenção com pausa sensorial e respiração guiada, obtendo reorganização parcial. Trabalhamos tambem Atividades de vida diaria, uso de colher.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-19'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Desenvolvidas atividades de AVDs simuladas (guardar materiais, abrir e fechar recipientes, usar talheres, copos e pratos, alem de guardanapos). Necessitou de auxílio físico e verbal, apresentando dificuldade de sequência e autonomia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão com foco em atenção compartilhada e espera por turnos através de jogos simples. Apresentou baixa tolerância à espera, com melhora leve após uso de contagem regressiva visual. Trabalhamos tambem estimulção multissensorial e AVDs.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada coordenação motora ampla por meio de circuito simples. Apresentou dificuldade em pular e manter equilíbrio, necessitando de apoio físico leve e encorajamento verbal.
Desenvolvidas atividades de AVDs simuladas (guardar materiais, abrir e fechar recipientes). Necessitou de auxílio físico e verbal, apresentando dificuldade de sequência e autonomia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada coordenação motora ampla por meio de circuito simples. Apresentou dificuldade em pular e manter equilíbrio, necessitando de apoio físico leve e encorajamento verbal.

Atividades de comunicação funcional realizadas por meio de escolhas e nomeação de objetos. Apresentou diálogo repetitivo, com tentativas de ampliação de respostas através de modelagem.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Atividades de comunicação funcional realizadas por meio de escolhas e nomeação de objetos. Apresentou diálogo repetitivo, com tentativas de ampliação de respostas através de modelagem.
Sessão tambem focada em organização sensorial, utilizando estímulos proprioceptivos. Observada melhora no engajamento após atividade sensorial preparatória.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-22'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizadas atividades de coordenação visomotora (traçados livres) e AVD´s. Apresentou dificuldade de controle motor fino, necessitando de ajuda e adaptação do material e tempo ampliado.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos comunicação interpessoal, espera. Trabalhada tolerância à frustração por meio de jogos com regras simples. Apresentou resistência inicial, com necessidade de reforço positivo para manutenção na atividade.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-02-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão voltada para cumprimento de pequenos comandos em sequência. Observada dificuldade em manter atenção, com melhor desempenho após redução de estímulos ambientais.

Desenvolvidas atividades lúdicas para ampliar repertório motor (arremessar, pular, agachar). Criança apresentou execução parcial, com necessidade de demonstração constante.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-12'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Falta. Mae relata que a mesma nao acordou para ir a terapia.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade. Sessão voltada para cumprimento de pequenos comandos em sequência. Observada dificuldade em manter atenção, com melhor desempenho após redução de estímulos ambientais.

Desenvolvidas atividades lúdicas para ampliar repertório motor (arremessar, pular, agachar). Criança apresentou execução parcial, com necessidade de demonstração constante.

Trabalhamos AVD´s : café da manha, uso de talheres e higiente pessoal, uso do banheiro.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Maria Clara P Carvalho' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-26'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Apresentou dificuldade de escuta e manutenção de diálogo funcional, com repetição de falas. Realizadas intervenções para ampliar troca comunicativa, com resposta limitada.

Sessão focada em AVDs básicas, como organizar o espaço, as atividades, calçar os sapatos e guardar brinquedos. Necessitou de auxílio verbal e físico, apresentando dificuldade de planejamento motor.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-18'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Paciente comparece à sessão em cadeira de rodas, consciente e colaborativo. Realizada avaliação funcional inicial, observando limitações de força muscular global e fadiga precoce. Orientado quanto à conservação de energia durante atividades diárias.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-08-25'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão focada em conversa a respeito de como realiza suas AVDs,  e organização do ambiente. Paciente apresentou necessidade de pausas frequentes devido à fadiga, com boa compreensão das orientações. Relata pedir marmitas e nao cozinhar.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-01'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão direcionada ao fortalecimento funcional residual de membros superiores, respeitando limites impostos pela condição progressiva, sem sinais de desconforto excessivo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-09'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada resistência funcional de membros superiores por meio de atividades leves e funcionais, respeitando pausas necessárias',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-15'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Treino de motricidade fina, com movimentos de pinça. Jorge tras muitas frustrações da relação com filhos e sua ex esposa.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-09-29'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade do trabalho com motricidade fina.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-06'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão focada em avaliação e treino de motricidade fina funcional, observando preensão, coordenação e fadiga. Paciente apresentou redução de força manual, necessitando de pausas frequentes. Reforço com JOrge que seu quadro exige mais do que 1 sessao semanal, porem o mesmo nao se mobiliza para o aumento das sessoes.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-13'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Realizadas atividades de pinça fina e preensão palmar com objetos de diferentes tamanhos e pesos. Paciente executou com dificuldade, mantendo boa adesão à proposta porem com dificuldade motora.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-20'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Treino funcional de manuseio de objetos  e jogos. Observada lentificação dos movimentos e necessidade de adaptação do ritmo.

Trabalhada coordenação óculo-manual por meio de encaixes simples. Paciente apresentou dificuldade de precisão, com melhora parcial após repetição.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-10-27'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade. Treino funcional de manuseio de objetos  e jogos. Observada lentificação dos movimentos e necessidade de adaptação do ritmo.

Trabalhada coordenação óculo-manual por meio de encaixes simples. Paciente apresentou dificuldade de precisão, com melhora parcial após repetição.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Continuidade. Treino funcional de manuseio de objetos  e jogos. Observada lentificação dos movimentos e necessidade de adaptação do ritmo.

Trabalhada coordenação óculo-manual por meio de encaixes simples. Paciente apresentou dificuldade de precisão, com melhora parcial após repetição. Trabalhamos alinhavo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-03'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhamos alinhavo, movimentos de pinça, encaixes, apresentou lentidao motora mas realizou a atividade com redução do tempo.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-10'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Sessão direcionada ao treino de abertura e fechamento de recipientes adaptados e peças de rosquear como parafusos. Paciente realizou com esforço moderado e supervisão.
Atividades de destreza manual com uso de massinha terapêutica de baixa resistência. Respeitados intervalos de descanso',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-17'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Treino de manipulação de alinavo, botões grandes e zíperes, visando autonomia em AVDs. Paciente apresentou execução parcial com auxílio verbal.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Jorge Luiz Fonseca' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Michele Benjamim' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-11-24'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Trabalhada coordenação bimanual em tarefas simples. Paciente apresentou dificuldade em manter força e precisão simultaneamente por tempo mais estendido.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Heloisa Luiza L B Sousa' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2025-12-16'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Heloísa realizou leitura de texto, com foco na decodificação, fluência leitora e compreensão textual. Em seguida, foi proposta a recontação oral do texto, favorecendo a organização do pensamento, sequenciação lógica, memória verbal e linguagem expressiva.
Na sequência, realizou atividade de ditado, visando o desenvolvimento da consciência fonológica, relação fonema-grafema, atenção auditiva, memória de trabalho e ortografia, conforme os objetivos psicopedagógicos estabelecidos.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2026-01-07'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou circuito psicomotor envolvendo prancha de equilíbrio, bambolê e puxar elásticos para elevação do corpo na posição deitado, com foco no reconhecimento do próprio corpo no espaço, controle postural, equilíbrio, força e coordenação motora ampla. A atividade de acertar o alvo com argolas favoreceu a percepção corporal, lateralidade e coordenação óculo-manual, finalizando com o jogo da velha para estímulo da atenção, organização espacial e planejamento motor.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1),
    'CLINIC_ID_AQUI',
    (
      SELECT "id" FROM "appointments" 
      WHERE "patient_id" = (SELECT "id" FROM "patients" WHERE "name" = 'Pietra Jimenez Benjamin Almeida' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND "doctor_id" = (SELECT "id" FROM "doctors" WHERE "name" = 'Angela' AND "clinic_id" = 'CLINIC_ID_AQUI' LIMIT 1)
        AND DATE("date") = '2026-01-08'::date
      LIMIT 1
    ),
    False,
    NULL,
    'Pietra realizou atividades de equilíbrio dinâmico e controle postural na prancha de equilíbrio, mantendo sustentação do tronco e alinhamento corporal. Executou saltos bipodais, apresentando força muscular e coordenação motora global, obtendo êxito em 5 de 10 tentativas. Posteriormente, realizou subida e descida de escadas, totalizando 6 lances, com organização motora adequada.',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  );
