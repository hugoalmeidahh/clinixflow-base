> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-07: Guias de Convênio e Preparação TISS

## Descrição
Como Recepcionista, preciso registrar as guias autorizadas pelos convênios, vinculá-las aos agendamentos e garantir que o número de sessões seja abatido automaticamente, preparando os dados para o faturamento TISS.

## Acceptance Criteria
- [ ] CRUD funcional de Guias de Autorização (Paciente, Convênio, Número da Guia, Senha, Sessões Autorizadas, Validade).
- [ ] Ao criar um agendamento para paciente de convênio, o sistema deve sugerir vínculo com uma Guia Ativa.
- [ ] Ao confirmar a presença de uma sessão vinculada, o saldo restante de sessões da guia (`sessions_remaining`) deve ser decrementado.
- [ ] Impedir agendamentos via guia se o saldo de sessões for zero ou a guia estiver vencida.
- [ ] Tabelas básicas preparadas para XML TISS (campos `ans_code`, `tuss_code`, `cid10_code`).

## Sub-tasks
1. **Endpoints de CRUD Guias**: Implementar server actions / mutations para salvar e ler guias de autorização reais.
2. **Integração no Modal de Agendamento**: Fetch e dropdown de guias no formulário de inclusão.
3. **Trigger de Abatimento**: Função no banco subtraindo a contagem das guias quando o atendimento finaliza.
4. **Alerta de Inconsistência**: Incluir no dashboard o tracking de "Guias prestes a vencer".

## Refinamento Técnico
- Todo o código de frontend da UI atual das "Guias" está desacoplado do servidor. Precisamos criar e ligar as procedures.
- Utilizar triggers para manter o integrity (não permitir abater session number abaixo de zero).
