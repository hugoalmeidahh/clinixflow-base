> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-06: Módulo Financeiro Raiz

## Descrição
Como Administrador/Financeiro, necessito ter o controle transacional de todas as entradas e saídas da clínica, visualizando o status financeiro de consultas e gerenciando despesas, visando o fechamento correto do caixa.

## Acceptance Criteria
- [ ] Geração Automática de transação ao marcar consulta (Status: `PROJECTED`).
- [ ] Ao marcar presença/atendimento, transação vira `REALIZED`.
- [ ] Entrada Manual de Receitas e Despesas (Contas a Pagar/Receber).
- [ ] Livro Caixa com saldo atual, permitindo filtro por período, categoria, convênio ou profissional.
- [ ] Listagem de "Inadimplência / A Receber" (consultas atendidas `REALIZED` que não viraram `RECEIVED`).
- [ ] Regras de Preços (Prioridade: Preço Profissional > Preço Convênio > Preço Padrão Especialidade).

## Sub-tasks
1. **Configuração de Taxas/Preços**: UI para o gestor definir preços padrões e tabelas por convênio.
2. **Automatomização Transacional**: Criar Supabase Triggers atrelados à tabela `appointments` para inserir/atualizar rows na tabela `transactions`.
3. **Livro Caixa (UI)**: Tela listando fluxo de caixa com filtros avançados e cards de totalizadores.
4. **Fechamento de Caixa/Repasses**: Lógica (React Query + views) para cálculo do repasse aos profissionais.

## Refinamento Técnico
- **Modelo de Dados**: Tabela única `transactions` com tipo (INCOME|EXPENSE) e status (PROJECTED|REALIZED|RECEIVED).
- Não duplicar "Contas a Receber" x "Contas Recebidas" x "Previsões". Uma única row altera seu state.
