# FIN-004: Contas a Pagar e a Receber

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como financeiro, quero visualizar separadamente as contas a pagar e a receber com seus respectivos vencimentos e status, para priorizar cobranças e pagamentos.

**Critérios de Aceite:**
- [ ] Painel "A Receber": lista de lançamentos de receita com status PENDENTE, ordenados por data de vencimento
- [ ] Painel "A Pagar": lista de lançamentos de despesa com status PENDENTE, ordenados por data de vencimento
- [ ] Alertas visuais: vencido (vermelho), vence hoje (âmbar), vence em até 7 dias (amarelo)
- [ ] Ação de "Baixar" lançamento (marcar como PAGO) diretamente na listagem com confirmação de data/valor recebido
- [ ] Filtros: por categoria, centro de custo, período, paciente
- [ ] Totalizador: Valor total a receber / a pagar no período filtrado

**Refinamento Técnico:**
- **DB:** Nenhuma tabela nova — usar `FinancialEntry` com filtro de status PENDENTE e tipo
- **Backend:** Server Actions `getPendingReceivables()` e `getPendingPayables()` com filtros dinâmicos
- **Frontend:** Dois tabs ou páginas separadas; badge de contagem no menu lateral; botão "Baixar" abre modal com data e valor real recebido (pode diferir do valor original)

---
