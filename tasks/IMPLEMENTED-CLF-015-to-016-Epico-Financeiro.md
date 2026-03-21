> **[IMPLEMENTED]** - Esta task já foi implementada/substituída.

# TICKET-015 e TICKET-016: Épico Financeiro e KPI Avançado

## TICKET-015: Fluxo de Caixa e Transações Financeiro Base
**User Story**: Como gestor de caixa e sócio da clínica, quero enxergar um livro caixa dinâmico, registrando recebimentos (Income), deduzindo meu Custo Lote (Expense) e Comissões médicas, para obter saldo no app sem apelar pro Excel.
**Critérios de Aceite:**
- Listagem tabelada com Data, Categoria, Histórico e Valor em Cores (Verde +, Vermelho -). Filtros de Range (01 Fev ao 28 Fev).
- As transações originárias do sistema (Aplicações de Vacinas, Consultas atendidas) caem e marcam estado de `REALIZADA`.
**Refinamento Técnico:** 
A tabela base postgres `transactions` terá Amount sempre inteiros (centavos: R$ 34,00 => `3400`) para não quebrar Floats de IEEE754. Se "Aplicaram Vacina X" (Custo 30, Cobrada 150), Database Trigger ou Front dispara registro Gasto (-30) SubCategoria Estoque e Venda (+150) SubCategoria Consulta-Vacinal. Isso amarra todas as linhas aos módulos superiores (Consultas/Lotes).

## TICKET-016: Relatórios de Desempenho e Comparativos
**User Story**: Como investidor/diretor da clínica de vacinas, anseio extrair gráficos comparando quais fabricantes e vacinas dão maior yield, observando lucros versus trimestres antigos.
**Critérios de Aceite:**
- Tela "Analytics" ou Dashboard gerencial plotando "Gráficos de Linha (Fat. no Tempo)" e "Pizza (Share de Vendas)".
- Indicadores de Delta (% de crescimento versus mês anterior).
**Refinamento Técnico:** 
No Supabase, crie POSTGRESQL VIEWS ou Matviews dedicadas a estatísticas (`CREATE VIEW v_profit_by_vaccine AS SELECT vac.name, sum(t.amount)...`). O front buscará do banco agregados pesados de milhões de transações numa query extremamente enxuta. Components Lovable via Recharts/VisX montam o plot em O(1) sem arrastar o navegador.
