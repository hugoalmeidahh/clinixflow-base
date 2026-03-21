# VAC-005: Agendamento de Vacinas

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como recepcionista, quero agendar a aplicação de vacinas aos pacientes integrando com a agenda principal da clínica, para organizar o fluxo de vacinação.

**Critérios de Aceite:**
- [ ] Agendamento de vacina usa o mesmo sistema de agenda da base (tipo de atendimento = VACINA)
- [ ] Ao agendar, selecionar: vacina(s), dose, profissional aplicador
- [ ] Se há sugestão ativa para o paciente + vacina, vincular automaticamente ao agendamento
- [ ] Lembretes automáticos 48h e 24h antes do agendamento via WhatsApp/Email (Evolution API + Resend)
- [ ] Na tela de aplicação, agenda mostra pacientes agendados para vacinas com botão de acesso rápido ao formulário de aplicação

**Refinamento Técnico:**
- **DB:** Campo `appointment_type` enum em `Appointment` recebe novo valor `VACCINE`; tabela `AppointmentVaccine` (appointment_id, vaccine_id, dose_number, suggestion_id nullable) para múltiplas vacinas por agendamento
- **Lembretes:** Job rodando a cada hora verificando agendamentos em 24h/48h e disparando mensagens via Evolution API (WhatsApp) e Resend (email)

---
