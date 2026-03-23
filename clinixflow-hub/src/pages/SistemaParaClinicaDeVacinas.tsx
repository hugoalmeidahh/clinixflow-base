import { Syringe, CalendarDays, Users, ClipboardList, BarChart3, Shield } from "lucide-react";
import SEOPageLayout from "@/components/seo/SEOPageLayout";

const SistemaParaClinicaDeVacinas = () => (
  <SEOPageLayout
    title="Sistema para Clínica de Vacinas | ClinixFlow"
    metaDescription="Sistema completo para gestão de clínicas de vacinas. Controle de imunização, carteira de vacinação digital, agendamentos e relatórios. Teste grátis."
    canonicalPath="/sistema-para-clinica-de-vacinas"
    heroTitle="Sistema Completo para"
    heroHighlight="Clínicas de Vacinas."
    heroSubtitle="Controle de imunização, carteira de vacinação digital, agendamento de doses e relatórios — tudo em um único sistema feito para clínicas de vacinação."
    problemsTitle="Desafios que clínicas de vacinas enfrentam todos os dias"
    problems={[
      {
        title: "Controle manual de doses e lotes",
        description: "Planilhas e cadernos geram erros no registro de aplicações, lotes e validades. O risco de falhas é alto.",
      },
      {
        title: "Falta de histórico do paciente",
        description: "Sem um sistema centralizado, é difícil saber quais vacinas o paciente já tomou e quais estão pendentes.",
      },
      {
        title: "Agendamento desorganizado",
        description: "Retornos e doses de reforço se perdem, causando atrasos no calendário vacinal dos pacientes.",
      },
      {
        title: "Relatórios para vigilância sanitária",
        description: "Gerar relatórios de doses aplicadas e controle de estoque para órgãos reguladores consome tempo e esforço.",
      },
    ]}
    featuresTitle="Funcionalidades para"
    featuresHighlight="gestão de vacinas."
    features={[
      {
        icon: Syringe,
        title: "Controle de Imunização",
        description: "Registre cada aplicação com lote, validade, fabricante e profissional responsável.",
      },
      {
        icon: Users,
        title: "Carteira de Vacinação Digital",
        description: "Histórico completo de vacinação do paciente, acessível a qualquer momento.",
      },
      {
        icon: CalendarDays,
        title: "Agendamento de Doses",
        description: "Agende retornos e doses de reforço automaticamente com base no calendário vacinal.",
      },
      {
        icon: ClipboardList,
        title: "Registro de Avaliações",
        description: "Formulários de triagem pré-vacinação integrados ao prontuário do paciente.",
      },
      {
        icon: BarChart3,
        title: "Relatórios Detalhados",
        description: "Relatórios de doses aplicadas, cobertura vacinal e indicadores operacionais.",
      },
      {
        icon: Shield,
        title: "Segurança e Conformidade",
        description: "Dados protegidos com criptografia e backups automáticos. Conformidade com LGPD.",
      },
    ]}
    benefits={[
      { text: "Reduza erros no registro de vacinas em até 90%" },
      { text: "Histórico completo do paciente em segundos" },
      { text: "Agendamento automático de doses de reforço" },
      { text: "Relatórios prontos para vigilância sanitária" },
      { text: "Acesso seguro de qualquer dispositivo" },
    ]}
    ctaTitle="Modernize sua"
    ctaHighlight="clínica de vacinas."
    ctaDescription="Comece a usar o ClinixFlow gratuitamente e transforme a gestão da sua clínica de vacinação."
  />
);

export default SistemaParaClinicaDeVacinas;
