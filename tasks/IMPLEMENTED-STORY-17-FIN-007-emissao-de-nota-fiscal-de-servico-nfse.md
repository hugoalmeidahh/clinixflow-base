# FIN-007: Emissão de Nota Fiscal de Serviço (NFSe)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como faturista, quero emitir notas fiscais de serviço diretamente da plataforma a partir dos atendimentos realizados, e enviá-las automaticamente por e-mail ao paciente ou responsável financeiro.

**Critérios de Aceite:**
- [ ] Configuração da integração NFSe por tenant: API Key do provedor (Focus NFe ou eNotas), dados fiscais da clínica (CNPJ, IM, regime tributário, código de serviço LC116)
- [ ] Seleção múltipla de lançamentos/atendimentos para agrupar em uma NFSe
- [ ] Preview da nota antes de emitir com todos os dados do tomador e prestador
- [ ] Emissão com retorno do número da nota, PDF e XML
- [ ] Envio automático do PDF por e-mail via Resend ao e-mail do responsável financeiro do paciente
- [ ] Status da nota: PENDENTE_AUTORIZACAO / AUTORIZADA / CANCELADA / ERRO
- [ ] Cancelamento de nota dentro do prazo legal com motivo obrigatório
- [ ] Histórico de notas emitidas com filtros por período e paciente

**Refinamento Técnico:**
- **DB:** Tabela `Invoice` (id, tenant_id, nfse_number, status, pdf_url, xml_url, patient_id, amount, service_code, issued_at, cancelled_at, cancel_reason, external_id do provedor)
- **Integração:** HTTP client para Focus NFe / eNotas; Webhook receiver para atualização assíncrona de status de autorização da prefeitura
- **Backend:** `emitNFSe()` como Server Action; webhook handler em `/api/webhooks/nfse`; retry automático com backoff exponencial para erros de comunicação
- **Email:** Template Resend com PDF anexo; fallback para link de download se PDF > 10MB

---
