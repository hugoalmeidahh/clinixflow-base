import { Users, CalendarDays, Clock, FileText, BarChart3, Shield } from "lucide-react";
import SEOPageLayout from "@/components/seo/SEOPageLayout";

const GestaoDePacientesEAgendamentos = () => (
  <SEOPageLayout
    title="Sistema de Gestão de Pacientes e Agendamentos | ClinixFlow"
    metaDescription="Gerencie pacientes e agendamentos da sua clínica em um único sistema. Cadastro completo, agenda inteligente e histórico centralizado. Teste grátis."
    canonicalPath="/gestao-de-pacientes-e-agendamentos"
    heroTitle="Pacientes e Agendamentos"
    heroHighlight="em um Único Sistema."
    heroSubtitle="Cadastro completo de pacientes, agenda inteligente por profissional e histórico de atendimentos — tudo centralizado e acessível."
    problemsTitle="Problemas que travam a rotina da sua clínica"
    problems={[
      {
        title: "Agenda desorganizada",
        description: "Horários conflitantes, encaixes mal gerenciados e falta de visão geral dos agendamentos do dia.",
      },
      {
        title: "Dados de pacientes espalhados",
        description: "Informações em fichas de papel, planilhas e WhatsApp. Impossível ter um histórico confiável.",
      },
      {
        title: "Faltas e atrasos frequentes",
        description: "Sem lembretes e confirmações, pacientes esquecem das consultas, gerando ociosidade na agenda.",
      },
      {
        title: "Dificuldade em encontrar informações",
        description: "Buscar o histórico de um paciente leva minutos quando deveria levar segundos.",
      },
    ]}
    featuresTitle="Gestão inteligente de"
    featuresHighlight="pacientes e agenda."
    features={[
      {
        icon: Users,
        title: "Cadastro Completo",
        description: "Dados pessoais, contatos, convênio e informações clínicas em um cadastro organizado.",
      },
      {
        icon: CalendarDays,
        title: "Agenda por Profissional",
        description: "Cada profissional com sua agenda, horários configuráveis e visão diária/semanal.",
      },
      {
        icon: Clock,
        title: "Histórico de Atendimentos",
        description: "Consulte todas as consultas anteriores, procedimentos e observações do paciente.",
      },
      {
        icon: FileText,
        title: "Prontuário Integrado",
        description: "Do agendamento ao atendimento, tudo conectado ao prontuário eletrônico.",
      },
      {
        icon: BarChart3,
        title: "Indicadores de Agenda",
        description: "Taxa de ocupação, faltas, cancelamentos e produtividade por profissional.",
      },
      {
        icon: Shield,
        title: "Acesso Seguro",
        description: "Controle quem pode agendar, visualizar e editar informações de pacientes.",
      },
    ]}
    benefits={[
      { text: "Encontre qualquer informação do paciente em segundos" },
      { text: "Agenda organizada com visão completa do dia" },
      { text: "Histórico de atendimentos sempre acessível" },
      { text: "Reduza faltas com organização e controle" },
      { text: "Dados seguros e centralizados" },
    ]}
    ctaTitle="Organize seus pacientes e"
    ctaHighlight="agendamentos agora."
    ctaDescription="Comece a usar o ClinixFlow gratuitamente e tenha controle total da sua agenda e pacientes."
  />
);

export default GestaoDePacientesEAgendamentos;
