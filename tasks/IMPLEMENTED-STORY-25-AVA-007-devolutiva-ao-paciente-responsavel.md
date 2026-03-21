# AVA-007: Devolutiva ao Paciente/Responsável

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como profissional, quero enviar a devolutiva da avaliação ao paciente ou responsável com uma versão simplificada do relatório e uma mensagem personalizada, para comunicar os resultados de forma acessível.

**Critérios de Aceite:**
- [ ] Botão "Enviar Devolutiva" na tela de avaliação finalizada
- [ ] Editor de mensagem personalizada com variáveis automáticas: {nome_paciente}, {data_avaliacao}, {consideracao_geral}
- [ ] Preview da devolutiva antes de enviar
- [ ] Envio por: Email (Resend) e/ou WhatsApp (Evolution API)
- [ ] Devolutiva inclui versão PDF simplificada (sem scores brutos, apenas faixas e considerações em linguagem acessível)
- [ ] Registro de envio com timestamp e canal usado
- [ ] Paciente logado no portal vê suas devolutivas recebidas

**Refinamento Técnico:**
- **DB:** Tabela `AssessmentFeedback` (id, assessment_id, sent_at, channel: EMAIL|WHATSAPP, recipient_email/phone, message, simplified_pdf_url)
- **PDF simplificado:** Template separado do relatório completo — sem scores numéricos, apenas linguagem clínica acessível ao leigo; gerado on-demand
- **WhatsApp:** Integração Evolution API com template de mensagem pré-aprovado; PDF enviado como documento

---

# EPIC-REL — MÓDULO DE RELATÓRIOS

> Relatórios gerenciais, clínicos e financeiros interligados aos demais módulos. Foco em exportação PDF/XLSX e visualizações com gráficos.

---
