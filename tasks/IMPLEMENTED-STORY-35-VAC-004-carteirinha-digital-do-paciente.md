# VAC-004: Carteirinha Digital do Paciente

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como paciente, quero acessar minha carteirinha de vacinação digital no portal do paciente, para visualizar todas as vacinas recebidas, próximas doses sugeridas e compartilhar com outras clínicas.

**Critérios de Aceite:**
- [ ] Portal do paciente exibe aba "Carteirinha de Vacinação" (visível sem necessidade de acesso admin)
- [ ] Lista cronológica de vacinas aplicadas: nome, dose, data, lote, profissional aplicador
- [ ] Seção "Próximas doses sugeridas" com vacinas pendentes e datas recomendadas
- [ ] Seção "Doses em atraso" destacada em vermelho
- [ ] QR Code único por paciente que abre a carteirinha em versão pública (sem login) para apresentar em outras clínicas
- [ ] Download da carteirinha em PDF formatado
- [ ] Carteirinha sincronizada com dados do RNDS (quando disponível)

**Refinamento Técnico:**
- **Portal:** Rota `/portal/vacinacao` protegida por sessão do paciente (role PATIENT)
- **QR Code:** Gerar URL assinada com token JWT de curta validade (24h) linkando para `/public/carteirinha/{token}`; rota pública renderiza carteirinha sem autenticação
- **PDF:** Template de carteirinha em formato A5, gerado sob demanda via Puppeteer; cachear por 1h no Supabase Storage

---
