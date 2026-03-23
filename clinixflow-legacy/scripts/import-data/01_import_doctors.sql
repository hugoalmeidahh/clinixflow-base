-- Script de importação de Profissionais
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
  (
    gen_random_uuid(),
    'Michele Benjamim',
    'Terapia Ocupacional',
    '(12) 00000-0000', -- Telefone padrão, atualizar depois
    'michelejimenezbenjamim@gmail.com',
    'DOC0001',
    '000000', -- CRFa padrão, atualizar depois
    'CRFa',
    NULL, -- CPF (atualizar depois)
    NULL, -- CNPJ (atualizar depois)
    NULL, -- RG (atualizar depois)
    1, -- Segunda-feira
    5, -- Sexta-feira
    '07:00:00',
    '18:00:00',
    'percentage',
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Cristiano',
    'Terapia Ocupacional',
    '(12) 00000-0000', -- Telefone padrão, atualizar depois
    'cristiangelispsi@gmail.com',
    'DOC0002',
    '000000', -- CRFa padrão, atualizar depois
    'CRFa',
    NULL, -- CPF (atualizar depois)
    NULL, -- CNPJ (atualizar depois)
    NULL, -- RG (atualizar depois)
    1, -- Segunda-feira
    5, -- Sexta-feira
    '07:00:00',
    '18:00:00',
    'percentage',
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Carolina',
    'Terapia Ocupacional',
    '(12) 00000-0000', -- Telefone padrão, atualizar depois
    'carollcrb@gmail.com',
    'DOC0003',
    '000000', -- CRFa padrão, atualizar depois
    'CRFa',
    NULL, -- CPF (atualizar depois)
    NULL, -- CNPJ (atualizar depois)
    NULL, -- RG (atualizar depois)
    1, -- Segunda-feira
    5, -- Sexta-feira
    '07:00:00',
    '18:00:00',
    'percentage',
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Angela',
    'Terapia Ocupacional',
    '(12) 00000-0000', -- Telefone padrão, atualizar depois
    'psicoangedesousa@gmail.com',
    'DOC0004',
    '000000', -- CRFa padrão, atualizar depois
    'CRFa',
    NULL, -- CPF (atualizar depois)
    NULL, -- CNPJ (atualizar depois)
    NULL, -- RG (atualizar depois)
    1, -- Segunda-feira
    5, -- Sexta-feira
    '07:00:00',
    '18:00:00',
    'percentage',
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Lucas Ferreira',
    'Terapia Ocupacional',
    '(12) 00000-0000', -- Telefone padrão, atualizar depois
    'lf.erreira.lf818@gmail.com',
    'DOC0005',
    '000000', -- CRFa padrão, atualizar depois
    'CRFa',
    NULL, -- CPF (atualizar depois)
    NULL, -- CNPJ (atualizar depois)
    NULL, -- RG (atualizar depois)
    1, -- Segunda-feira
    5, -- Sexta-feira
    '07:00:00',
    '18:00:00',
    'percentage',
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Adnéia',
    'Terapia Ocupacional',
    '(12) 00000-0000', -- Telefone padrão, atualizar depois
    'neiarpm192@gmail.com',
    'DOC0006',
    '000000', -- CRFa padrão, atualizar depois
    'CRFa',
    NULL, -- CPF (atualizar depois)
    NULL, -- CNPJ (atualizar depois)
    NULL, -- RG (atualizar depois)
    1, -- Segunda-feira
    5, -- Sexta-feira
    '07:00:00',
    '18:00:00',
    'percentage',
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Haabe Viana',
    'Terapia Ocupacional',
    '(12) 00000-0000', -- Telefone padrão, atualizar depois
    'plenoinovacao@gmail.com',
    'DOC0007',
    '000000', -- CRFa padrão, atualizar depois
    'CRFa',
    NULL, -- CPF (atualizar depois)
    NULL, -- CNPJ (atualizar depois)
    NULL, -- RG (atualizar depois)
    1, -- Segunda-feira
    5, -- Sexta-feira
    '07:00:00',
    '18:00:00',
    'percentage',
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Raabë Viana',
    'Terapia Ocupacional',
    '(12) 00000-0000', -- Telefone padrão, atualizar depois
    'raabefisiodermatofuncional@gmail.com',
    'DOC0008',
    '000000', -- CRFa padrão, atualizar depois
    'CRFa',
    NULL, -- CPF (atualizar depois)
    NULL, -- CNPJ (atualizar depois)
    NULL, -- RG (atualizar depois)
    1, -- Segunda-feira
    5, -- Sexta-feira
    '07:00:00',
    '18:00:00',
    'percentage',
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;
