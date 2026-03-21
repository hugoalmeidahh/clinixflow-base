> **[IMPLEMENTED]** - Esta task já foi implementada/substituída.

# TICKET-008 ao TICKET-014: Épico Módulo de Vacinas (Core)

> **Contexto Exclusivo de Vacinas:** Diferente de uma consulta comum, a vacinação lida com histórico progressivo (ex: Dose 1, Dose 2, Reforço), cálculo de intervalos em dias baseados em idade e regras oficiais (ex: PNI), e requisições governamentais (RNDS).

## TICKET-008: Gestão de Pacientes, Histórico de Atendimentos e "Pacotes de Vacinas"
**User Story**: Como profissional da clínica, quero registrar rapidamente as informações dos pacientes, acompanhar o histórico cronológico de doses vinculadas ao perfil dele e adicionar pacotes fechados de imunização (ex: "Pacote 2 Meses"), para ter um acompanhamento preciso sem cliques excessivos.
**Critérios de Aceite:**
- O perfil do paciente terá uma visão de "Carteirinha Digital" (Timeline vertical) que exibe as Doses Aplicadas, Atrasadas e Agendadas.
- Deve possuir uma modal para "Lançamento em Lote/Pacote": O profissional seleciona "Pacote RN" e o sistema agenda de uma só vez as doses sugeridas (Ex: BCG + Pólio).
- Upload rápido de receitas/pedidos médicos restritos às regras do Supabase Storage.
**Refinamento Técnico:** 
O banco `vaccine_applications` cruzará com listas estáticas de `vaccine_packages`. Ao acionar o pacote, a aplicação insere múltiplos registros de aplicações futuras via bulk insert com o status genérico `SCHEDULED` ou `SUGGESTED`. A timeline UI irá varrer as datas dessas Rows e interpolar bolinhas coloridas (Verde = Aplicado, Cinza = Futuro, Vermelho = Atrasado).

## TICKET-009: Rule Engine: Sugestão Automática de Doses e Calendário PNI
**User Story**: Como profissional de saúde, quero que o sistema recomende automaticamente as próximas doses logo após cada aplicação confirmada de uma vacina serial (ex: HPV, Hepatite), para facilitar o acompanhamento do paciente.
**Critérios de Aceite:**
- Ao clicar em "Dose 1 Aplicada", caso o schema da vacina exija a Dose 2 em 60 dias, o app insere discretamente um card de D2 projetado para `Now() + 60d`.
- As sugestões ficam numa cor distinta na tela, convidando a recepcionista a transformá-la em "Agendada Oficialmente" num clique.
**Refinamento Técnico:** 
No Supabase, crie uma Edge Function chamada `calculate-next-dose` acionada por **Database Webhook Trigger** em `INSERT/UPDATE on vaccine_applications` onde `status = ATTENDED`. A função carrega os metadados da Vacina (ex: `doses_required: 3, interval_days: 60`), calcula a data ideal caindo em dia útil, e insere uma nova application como tipo `SUGGESTION` (ou Status "Sugerido").

## TICKET-010: Controle de Estoque de Lotes em Tempo Real
**User Story**: Como administrador da sala de vacinas, quero monitorar os frascos/lotes em tempo real para evitar perdas por validade e rupturas de estoque.
**Critérios de Aceite:**
- Dashboard de "Lotes Críticos" exibindo: Vacinas abaixo da quantidade mínima ou lotes que vencem nos próximos 45 dias.
- O ato de marcar uma dose como "Aplicada" na carteirinha do paciente reduz instantâneamente "1x" no inventário do Lote especificado pela enfermeira.
**Refinamento Técnico:** 
A dedução automática OCORRE NO BANCO: Criar função/Trigger PostgreSQL no evento AFTER INSERT/UPDATE na tabela `vaccine_applications` onde validou a picada: `UPDATE vaccine_batches SET quantity_remaining = quantity_remaining - 1 WHERE id = NEW.batch_id;`. O dashboard do frontend (Lovable) assina WebSockets (Supabase Realtime) no card de Alerta Crítico, piscando vermelho caso o saldo fique <= `min_threshold` sem refresh da tela.

## TICKET-011: Lembretes Automáticos de Doses via Mensageria (WhatsApp)
**User Story**: Como clínica, quero enviar automaticamente lembretes das próximas doses agendadas/sugeridas pelo WhatsApp dos responsáveis, para aumentar a taxa de retorno (adesão).
**Critérios de Aceite:**
- Job diário que varre pacientes com doses agendadas com a data limite daqui a 3 dias ou amanhã, e dispara uma mensagem template pelo Whatsapp ("Olá Mariana, a 2ª Dose do Pedro está próxima...").
- Disparo 100% invisível na interface humana (Zero touch).
**Refinamento Técnico:** 
O Supabase provê `pg_cron` (extensão) ou **Edge Functions agendadas (Cron)**. Crie uma edge function `daily-reminders` que rode todo dia às 08h. Ela puxa `vaccine_applications` com dueDate prox e dispara via pacote POST (fetch) para a Evolution API ou Z-API / Twilio. Para resiliência, logue no evento `msg_status: SENT` para não reenviar duplicado na falha de rede.

## TICKET-012: Sincronização Governamental (RNDS/SIPNI)
**User Story**: Como responsável técnico, quero transmitir as doses aplicadas para a base nacional de saúde (SIPNI/RNDS) visando cumprimento de normas, sem sair do sistema.
**Critérios de Aceite:**
- Ao registrar a dose, o sistema enfileira o envio para a Rede Nacional de Dados em Saúde.
- Card/Tabela "Transmissão SUS" em tela separada contendo os Reprovados/Pendentes.
**Refinamento Técnico:** 
A RNDS usa certificados FHIR e instabilidade é comum. Crie um Supabase Webhook que jogue o Payload da aplicação recém efetuada para uma fila externa ou Edge Function com **Retry Pattern**. Em caso de falha de Handshake SUS (503 Service Unavailable), uma tabela de contorno `rnds_sync_queue` registra a dose com status `PENDING` para ser repescada na próxima hora pelo Job cron.

## TICKET-013: Módulo de NFSe Agrupada e Simplificada
**User Story**: Como faturista, quero faturar várias vacinas do mesmo paciente englobando num único recibo e botão para enviar a Nota Fiscal para a prefeitura e cliente final.
**Critérios de Aceite:**
- Multiselect Tool (Checkboxes) listando aplicações "Sem Faturamento". O Faturista marca 3 aplicações, e aperta um CTA "Gerar Fatura Única".
- Emissão aciona a API de Notas Eletrônicas invisivelmente.
**Refinamento Técnico:** 
Ação no React aglutina IDs em array. Mutação React Query aciona a Supabase Edge Function `issue-invoice`. A Edge chama um provider nacional (ex: Focus Nfe, eNotas) repassando o total em centavos e descritivo das vacinas. A tabela `invoices` armazena a chave da nota. Retorno do webhook assina no banco que a rota e link PDF estão prontos, exibindo link nativo.

## TICKET-014: Campanhas Extramuros e Importação em Massa (CSV)
**User Story**: Como equipe de implantação/campanha corporativa num banco, vou vacinar 300 pessoas da mesma empresa, desejo então fazer upload do Excel com CPFs e Lotes aplicados para registrar 300 de uma vez em vez de 1 a 1.
**Critérios de Aceite:**
- Drag-and-drop de Planilhas XLSx/CSV nos Padrões do App Lovable.
- O sistema valida no FrontEnd quem é Inexistente e já avisa antes de salvar. Botão "Prosseguir" salva tudo de uma vez.
**Refinamento Técnico:** 
Parser nativo leve no Client-Side via `papaparse` ou `xlsx` lendo as colunas. A Pipeline transforma o JSON montado pela planilha e dispara para o Supabase RPC API contendo Padrão `Bulk Insert`. O POSTGRES inserirá mil rows sem travamentos (`INSERT INTO vaccine_applications (...) SELECT * FROM json_populate_recordset...`). O Supabase lidará magnificamente bem em <1 segundo se não sobrecarregar com milhares de requisições web.
