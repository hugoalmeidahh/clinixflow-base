-- Script de importação de Pacientes
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
  (
    gen_random_uuid(),
    'Efigênia Machado Guimaraes',
    'efigênia.machado.guimaraes@paciente.com',
    'PAC0001',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2048-06-04',
    'Eduardo - filho',
    'Não informado',
    'Eduardo - filho',
    '(12) 00000-0000',
    'Eduardo - filho', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    1,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Matheus De Almeida',
    'matheus.de.almeida@paciente.com',
    'PAC0002',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'outros',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    2,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Marina Deusa De Almeida',
    'marina.deusa.de.almeida@paciente.com',
    'PAC0003',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Filha Simone e Sandra ',
    'Não informado',
    'Filha Simone e Sandra ',
    '(12) 00000-0000',
    'Filha Simone e Sandra ', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    3,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Enzo Saiki',
    'enzo.saiki@paciente.com',
    'PAC0004',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    4,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Akio Baba',
    'akio.baba@paciente.com',
    'PAC0005',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    5,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Esther Ribeiro De Paula',
    'esther.ribeiro.de.paula@paciente.com',
    'PAC0006',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2018-02-28',
    'Mãe Priscila, Pai Jefferson ',
    'Não informado',
    'Mãe Priscila, Pai Jefferson ',
    '(12) 00000-0000',
    'Mãe Priscila, Pai Jefferson ', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    6,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Benjämim Serrito',
    'benjämim.serrito@paciente.com',
    'PAC0007',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'outros',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    7,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Nathan Ferreira Pereira',
    'nathan.ferreira.pereira@paciente.com',
    'PAC0008',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    8,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Maria Clara P Carvalho',
    'maria.clara.p.carvalho@paciente.com',
    'PAC0009',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    9,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Rael Muniz Soterio',
    'Ksoterio@hotmail.com',
    'PAC0010',
    '12 974056506',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2019-07-08',
    'Kátia Roberta Muniz Soteiro ',
    'Não informado',
    'Kátia Roberta Muniz Soteiro ',
    '12 974056506',
    'Kátia Roberta Muniz Soteiro ', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'particular',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    10,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Eather Ribeiro',
    'eather.ribeiro@paciente.com',
    'PAC0011',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    11,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Aparecida Argona Pozzo',
    'aparecida.argona.pozzo@paciente.com',
    'PAC0012',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2056-07-04',
    'Sr Osnei',
    'Não informado',
    'Sr Osnei',
    '(12) 00000-0000',
    'Sr Osnei', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    12,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Pedro De Oliveira Toledo',
    'pedro.de.oliveira.toledo@paciente.com',
    'PAC0013',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'outros',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    13,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Arthur Perri De Sa Nobre',
    'arthur.perri.de.sa.nobre@paciente.com',
    'PAC0014',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    14,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Natham Ferreira',
    'natham.ferreira@paciente.com',
    'PAC0015',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    15,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Eugenia Guimaraes',
    'eugenia.guimaraes@paciente.com',
    'PAC0016',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    16,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Gael Matins Teixeira',
    'gael.matins.teixeira@paciente.com',
    'PAC0017',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    17,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Miguel Reis Ballesteros',
    'miguel.reis.ballesteros@paciente.com',
    'PAC0018',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    18,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Victor Nogueira De Aguiar',
    'victor.nogueira.de.aguiar@paciente.com',
    'PAC0019',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2022-05-17',
    'Shirlei',
    'Não informado',
    'Shirlei',
    '(12) 00000-0000',
    'Shirlei', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'particular',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    19,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Ana Clara Meireles Santana',
    'ana.clara.meireles.santana@paciente.com',
    'PAC0020',
    '12 98142-0920',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2006-02-22',
    'Vanessa (porem veio desacompanhada)',
    'Não informado',
    'Vanessa (porem veio desacompanhada)',
    '12 98142-0920',
    'Vanessa (porem veio desacompanhada)', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '45707385835',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    20,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Leo Castilho Prado',
    'leo.castilho.prado@paciente.com',
    'PAC0021',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    21,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Livia Vieria De Freitas',
    'livia.vieria.de.freitas@paciente.com',
    'PAC0022',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Aline ',
    'Não informado',
    'Aline ',
    '(12) 00000-0000',
    'Aline ', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'particular',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    22,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Andréia',
    'andréia@paciente.com',
    'PAC0023',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'particular',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    23,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Benjamin P. S. B. Santos',
    'benjamin.p..s..b..santos@paciente.com',
    'PAC0024',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    24,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Jorge Luiz Fonseca',
    'jorge.luiz.fonseca@paciente.com',
    'PAC0025',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    25,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Heitor Paiva Rios Ae',
    'heitor.paiva.rios.ae@paciente.com',
    'PAC0026',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    26,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Erick Rodrigues Anjos Da Silva',
    'erick.rodrigues.anjos.da.silva@paciente.com',
    'PAC0027',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    27,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Pietra Jimenez Benjamin Almeida',
    'pietra.jimenez.benjamin.almeida@paciente.com',
    'PAC0028',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'particular',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    28,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Levi Martes Felix Costa',
    'levi.martes.felix.costa@paciente.com',
    'PAC0029',
    '12982806948',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2025-04-10',
    'Tainara e Matheus ',
    'Não informado',
    'Tainara e Matheus ',
    '12982806948',
    'Tainara e Matheus ', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    29,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'João Henrique Barbosa Costa',
    'joão.henrique.barbosa.costa@paciente.com',
    'PAC0030',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    30,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Samuel Savio',
    'samuel.savio@paciente.com',
    'PAC0031',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    31,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Henrique Silva Moreira',
    'henrique.silva.moreira@paciente.com',
    'PAC0032',
    '12996359637 -- 12 996591181',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2024-07-22',
    'Jessica e Rafael. ',
    'Não informado',
    'Jessica e Rafael. ',
    '12996359637 -- 12 996591181',
    'Jessica e Rafael. ', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    32,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Joaquim Ferreira Honorato Araujo',
    'joaquim.ferreira.honorato.araujo@paciente.com',
    'PAC0033',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    33,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Heloisa Luiza L B Sousa',
    'heloisa.luiza.l.b.sousa@paciente.com',
    'PAC0034',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    34,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Valentina Maria Pinheiro Carvalho',
    'valentina.maria.pinheiro.carvalho@paciente.com',
    'PAC0035',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2014-09-29',
    'Sônia Pinheiro Carvalho ',
    'Não informado',
    'Sônia Pinheiro Carvalho ',
    '(12) 00000-0000',
    'Sônia Pinheiro Carvalho ', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    35,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Benjamim Serrito',
    'benjamim.serrito@paciente.com',
    'PAC0036',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'outros',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    36,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Apsarecida Argona',
    'apsarecida.argona@paciente.com',
    'PAC0037',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    37,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Hugo Almeida',
    'hugo.almeida@paciente.com',
    'PAC0038',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'particular',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    38,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Efigencia Guimaraes',
    'efigencia.guimaraes@paciente.com',
    'PAC0039',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    39,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Michele Jimenez Benjamim',
    'michele.jimenez.benjamim@paciente.com',
    'PAC0040',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    40,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Efigeia Guimaraes',
    'efigeia.guimaraes@paciente.com',
    'PAC0041',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    41,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Vinicios Gabriel Dal Bello De Souza',
    'vinicios.gabriel.dal.bello.de.souza@paciente.com',
    'PAC0042',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'outros',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    42,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Vinicius Gabriel Dal Belo De Souza',
    'vinicius.gabriel.dal.belo.de.souza@paciente.com',
    'PAC0043',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    43,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Priscila Holanda De Lima Silva',
    'neiarpm@hotmail.com',
    'PAC0044',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '1999-10-19',
    'Maria Cecília Holanda de Lima Silva ',
    'Não informado',
    'Maria Cecília Holanda de Lima Silva ',
    '(12) 00000-0000',
    'Maria Cecília Holanda de Lima Silva ', -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'particular',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    44,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Alan Gabriel Do Carmo / Magna Kelly Oliveira Da Silva Do Carmo',
    'neiarpm@hotmail.com',
    'PAC0045',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'particular',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    45,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Magda Kelly Oliveira Da Silva Do Carmo',
    'neiarpm@hotmail.com',
    'PAC0046',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'particular',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    46,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Bejamin Pereira',
    'bejamin.pereira@paciente.com',
    'PAC0047',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    47,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Bemjamin Pereira',
    'bemjamin.pereira@paciente.com',
    'PAC0048',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    48,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Manuela V. G. Araujo Da Silva',
    'manuela.v..g..araujo.da.silva@paciente.com',
    'PAC0049',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'bradesco_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    49,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Alxandro Ribeiro',
    'alxandro.ribeiro@paciente.com',
    'PAC0050',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    50,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Alexandro Ribeiro',
    'alexandro.ribeiro@paciente.com',
    'PAC0051',
    '(12) 00000-0000',
    true,
    'male', -- Assumindo masculino, ajustar se necessário
    '2000-01-01',
    'Não informado',
    'Não informado',
    'Não informado',
    '(12) 00000-0000',
    NULL, -- Nome do acompanhante
    NULL, -- Grau de parentesco (preencher manualmente se necessário)
    'santa_casa_saude',
    '000000', -- Número do convênio padrão
    '000000000', -- RG padrão
    '00000000000',
    '00000-000', -- CEP padrão
    'Endereço não informado',
    '0',
    NULL,
    'Centro',
    'São José dos Campos',
    'SP',
    true,
    51,
    'CLINIC_ID_AQUI',
    'USER_ID_AQUI',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;
