> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-03: CRM Base - Profissionais e Pacientes

## Descrição
Como Recepcionista ou Administrador, desejo ter um cadastro completo de Pacientes e Profissionais de Saúde, incluindo prontuários, para realizar o controle de atendimentos da clínica.

## Acceptance Criteria
- [ ] Cadastro de Profissionais com agenda (dias de atendimento, horário, intervalo de consulta 15/30/45/60m).
- [ ] Profissionais podem ter regras de exceção de agenda (férias, feriados).
- [ ] O "Dono (Owner)" da clínica poderá ser listado como Profissional através de uma flag `is_owner_user`, sem duplicar o usuário.
- [ ] Cadastro de Pacientes com opção de Responsável Legal (menores de 18 anos).
- [ ] O Paciente deve ganhar um Número de Prontuário sequencial automático (ex. #0001, #0002) específico daquele tenant (não UUID).
- [ ] Emissão de Contrato de Tratamento (pdf) com assinatura digital se o tipo de cuidado for "Tratamento Prolongado".

## Sub-tasks
1. **CRUD Profissionais**: Abas de dados, disponibilidades e exceções. Vinculação à tabela `users` do Supabase.
2. **CRUD Pacientes**: Validação de CPF único por tenant; cadastro de convênio e carteirinha.
3. **Gerador de Número Sequencial**: Implementar function RPC/Trigger no Postgres para autoincremento seguro por tenant.
4. **Contratos de Tratamento**: Gerador de HTML -> PDF com assinatura (pad canvas).

## Refinamento Técnico
- Utilizar `JSONB` no Supabase para a matriz de disponibilidade do profissional.
- O campo Patient Record Number requer uma sequence atrelada ao `tenant_id` rodando transacionalmente no banco, blindando race conditions em alta concorrência.
