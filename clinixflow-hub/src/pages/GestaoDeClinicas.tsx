import { Users, CalendarDays, FileText, BarChart3, Shield, Stethoscope } from "lucide-react";
import SEOPageLayout from "@/components/seo/SEOPageLayout";

const GestaoDeClinicas = () => (
  <SEOPageLayout
    title="Sistema de Gestão de Clínicas | ClinixFlow"
    metaDescription="Sistema completo para gestão de clínicas médicas. Pacientes, agendamentos, prontuário eletrônico, equipe e relatórios em uma única plataforma. Teste grátis."
    canonicalPath="/gestao-de-clinicas"
    heroTitle="Gestão Completa para"
    heroHighlight="Clínicas Médicas."
    heroSubtitle="Centralize pacientes, agendamentos, prontuários, equipe e relatórios em um único sistema. Menos burocracia, mais eficiência na sua clínica."
    problemsTitle="Problemas comuns na gestão de clínicas"
    problems={[
      {
        title: "Informações espalhadas em vários sistemas",
        description: "Agenda em um lugar, prontuário em outro, financeiro em planilha. A desorganização gera retrabalho e erros.",
      },
      {
        title: "Dificuldade em acompanhar indicadores",
        description: "Sem dados consolidados, é impossível saber o desempenho real da clínica e tomar decisões estratégicas.",
      },
      {
        title: "Processos manuais e demorados",
        description: "Cadastros em papel, agendamentos por telefone e controles manuais consomem tempo da equipe.",
      },
      {
        title: "Falta de controle de acesso",
        description: "Recepcionistas, médicos e gestores acessam as mesmas informações sem distinção de permissões.",
      },
    ]}
    featuresTitle="Tudo que sua clínica precisa,"
    featuresHighlight="em um só lugar."
    features={[
      {
        icon: Users,
        title: "Gestão de Pacientes",
        description: "Cadastro completo, histórico de atendimentos e prontuário centralizado.",
      },
      {
        icon: CalendarDays,
        title: "Agendamentos Inteligentes",
        description: "Agenda por profissional, controle de horários e visão completa do dia.",
      },
      {
        icon: FileText,
        title: "Prontuário Eletrônico",
        description: "Evoluções, anamneses e documentos organizados e protegidos.",
      },
      {
        icon: Stethoscope,
        title: "Gestão da Equipe",
        description: "Cadastro de profissionais, especialidades e controle de atendimentos.",
      },
      {
        icon: BarChart3,
        title: "Relatórios e Indicadores",
        description: "Dados operacionais e estratégicos para tomada de decisão.",
      },
      {
        icon: Shield,
        title: "Perfis de Acesso",
        description: "Cada membro da equipe acessa apenas o que precisa. Segurança total.",
      },
    ]}
    benefits={[
      { text: "Centralize toda a operação em uma única plataforma" },
      { text: "Reduza o tempo de processos administrativos" },
      { text: "Acompanhe indicadores em tempo real" },
      { text: "Controle de acesso por perfil de usuário" },
      { text: "Dados seguros com backups automáticos" },
    ]}
    ctaTitle="Transforme a gestão da sua"
    ctaHighlight="clínica agora."
    ctaDescription="Teste o ClinixFlow gratuitamente e veja como é simples organizar toda a operação da sua clínica."
  />
);

export default GestaoDeClinicas;
