# VAC-010: Aplicativo de Vacinação Domiciliar (Mobile)

**Tipo:** Story | **Prioridade:** Baixa | **Sprint:** 5 (fase futura)

**User Story:**  
Como enfermeira, quero usar um app mobile para registrar aplicações domiciliares no ato do atendimento, sem precisar de acesso ao sistema web.

**Critérios de Aceite:**
- [ ] App lista agenda domiciliar do profissional logado para o dia
- [ ] Formulário de aplicação com as mesmas validações do sistema web
- [ ] Funcionamento offline com sync posterior (PWA ou React Native)
- [ ] Registro de geolocalização opcional
- [ ] Cobrança e pagamento via integração com gateway (Pagar.me)

**Refinamento Técnico:**
- **Tecnologia:** React Native (Expo) consumindo API REST do ClinixFlow
- **Offline:** AsyncStorage local + sync queue; ao reconectar, processar fila de aplicações pendentes
- **API:** Novos endpoints REST (além dos Server Actions) para consumo mobile: `POST /api/mobile/vaccine-applications`

---
