# BIL-011: Histórico de Faturas e Itens de Cobrança

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 3  
**Dependências:** BIL-004

**User Story:**  
Como owner, quero visualizar o histórico completo de faturas com todos os itens discriminados e fazer download do PDF de cada fatura, para fins de controle financeiro e prestação de contas.

**Critérios de Aceite:**
- [ ] Listagem de todas as faturas com: mês de referência, data de vencimento, data de pagamento, valor total, status (badge colorido)
- [ ] Clique na fatura expande detalhamento de itens: plano base, cada add-on, descontos de cupom, acréscimo PIX (se houver)
- [ ] Download de PDF de cada fatura com: logo da clínica, dados do prestador (ClinixFlow), dados do tomador (clínica), itens discriminados, valor total, forma de pagamento
- [ ] Fatura com status FAILED exibe botão "Regularizar pagamento" que leva para a tela de bloqueio/regularização
- [ ] Filtro por ano e status
- [ ] Exportação da listagem em XLSX (útil para contabilidade do cliente)

**Refinamento Técnico:**
- **PDF da fatura:** Gerado server-side com `@react-pdf/renderer`; armazenado em Supabase Storage com URL assinada de acesso (expiração de 1h para download); regenerado se não existir
- **Backend:** `getInvoiceHistory(tenant_id, filters)` com paginação por cursor; `getInvoiceItems(invoice_id)` retorna `InvoiceItem[]` com types discriminados
- **XLSX:** `xlsx` (SheetJS) gerando planilha com colunas: Mês, Vencimento, Pagamento, Plano, Add-ons, Desconto, Total, Status

---
