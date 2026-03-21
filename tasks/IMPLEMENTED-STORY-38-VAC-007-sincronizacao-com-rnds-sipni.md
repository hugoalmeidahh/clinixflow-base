# VAC-007: Sincronização com RNDS / SIPNI

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 4

**User Story:**  
Como responsável técnico da clínica, quero que as doses aplicadas sejam transmitidas automaticamente ao RNDS após o registro, para cumprir as obrigações legais sem digitação dupla.

**Critérios de Aceite:**
- [ ] Configuração RNDS por tenant: certificado digital (upload), CNES da clínica, credenciais de acesso
- [ ] Ao registrar aplicação: criar entrada na fila de sincronização com status PENDING
- [ ] Worker processa fila e envia para RNDS; atualiza `synced_to_rnds = true` e armazena ID da transmissão
- [ ] Em caso de falha: retry automático até 5x; após 5 falhas, status FAILED com alerta na interface
- [ ] Painel de monitoramento RNDS: transmissões do dia (pendentes, enviadas, com erro)
- [ ] Reprocessamento manual de transmissões com erro

**Refinamento Técnico:**
- **DB:** Tabela `RNDSQueue` (id, application_id, status: PENDING|SENT|FAILED, attempts, last_attempt_at, rnds_response_id, error_message)
- **Certificado:** Upload do .pfx/.p12 criptografado com AES-256; chave de decriptação no env server; nunca exposto ao frontend
- **Worker:** Pg-boss job rodando a cada 5 minutos; Dead Letter Queue para itens com 5+ falhas
- **Integração:** HTTP client com mutual TLS usando o certificado digital da clínica; mapear resposta FHIR R4 do RNDS

---
