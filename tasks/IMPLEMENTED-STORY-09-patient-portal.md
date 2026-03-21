> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-09: Portal do Paciente

## Descrição
Como Paciente da Clínica, gostaria de acessar um aplicativo web com meus dados para visualizar minhas próximas consultas, gerar atestados e ter um canal direto para solicitar marcações.

## Acceptance Criteria
- [ ] Fluxo de Login próprio para a role `PATIENT`.
- [ ] Lista de Consultas futuras e visualização de Histórico.
- [ ] Botão "Confirmar Presença" (ativo apenas nas 48h antes da consulta), refletindo o status na agenda da Recepcionista.
- [ ] Tela "Solicitar Agendamento" (envia intenção para caixa de entrada da Recepcionista com 3 opções de datas sugeridas).
- [ ] Aba "Meus Documentos" liberando download de atestados de presença de consultas passadas.
- [ ] Impedir veementemente qualquer acesso às evoluções clínicas dos profissionais (segurança de dados/LGPD).

## Sub-tasks
1. **Auth Scoping**: Configurar permissões para redirecionar o paciente direto para a rota de Portal (bloqueando o core administrativo).
2. **UI Portal**: Dashboard limpo para mobile, focado em agendamentos do paciente_id logado.
3. **Ações de Presença/Agendamento**: Implementar as integrações baseadas nos UUIDs dos agendamentos liberados.
4. **Gerador de PDF de Atestado**: Visualização e download dos documentos na aba Meus Documentos.

## Refinamento Técnico
- RLS é crucial. O policy `for all using (user_id = auth.uid())` ou similar para a auth de pacientes é a linha de defesa que assegura que nenhum paciente espie dados da clínica ou de outro colega.
