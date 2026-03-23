import { ClipboardList, FileText, Brain, Users, BarChart3, Shield } from "lucide-react";
import SEOPageLayout from "@/components/seo/SEOPageLayout";

const AvaliacoesIntegradas = () => (
  <SEOPageLayout
    title="Sistema de Avaliações Integradas para Clínicas | ClinixFlow"
    metaDescription="Formulários personalizados para avaliações clínicas integradas ao prontuário. Anamneses, triagens e evoluções organizadas. Teste grátis."
    canonicalPath="/avaliacoes-integradas"
    heroTitle="Avaliações Clínicas"
    heroHighlight="Integradas ao Prontuário."
    heroSubtitle="Formulários personalizados, anamneses completas e registro de evoluções — tudo conectado ao histórico do paciente em tempo real."
    problemsTitle="Os desafios das avaliações clínicas tradicionais"
    problems={[
      {
        title: "Formulários em papel ou PDFs genéricos",
        description: "Avaliações feitas em papel se perdem, são difíceis de consultar e não se integram ao prontuário.",
      },
      {
        title: "Informações desconectadas",
        description: "A avaliação é feita por um profissional, mas os dados não ficam acessíveis para a equipe multidisciplinar.",
      },
      {
        title: "Dificuldade em acompanhar evolução",
        description: "Sem um sistema estruturado, comparar avaliações ao longo do tempo é praticamente impossível.",
      },
      {
        title: "Retrabalho na documentação",
        description: "Profissionais perdem tempo preenchendo dados repetidos que já existem no cadastro do paciente.",
      },
    ]}
    featuresTitle="Avaliações completas com"
    featuresHighlight="total integração."
    features={[
      {
        icon: ClipboardList,
        title: "Formulários Personalizados",
        description: "Crie formulários de avaliação específicos para cada especialidade ou tipo de atendimento.",
      },
      {
        icon: FileText,
        title: "Integração com Prontuário",
        description: "Cada avaliação fica vinculada ao prontuário eletrônico do paciente automaticamente.",
      },
      {
        icon: Brain,
        title: "Avaliações Especializadas",
        description: "Suporte para avaliações de TEA, desenvolvimento infantil, triagens e mais.",
      },
      {
        icon: Users,
        title: "Visão Multidisciplinar",
        description: "Toda a equipe acessa as avaliações do paciente com controle de permissões.",
      },
      {
        icon: BarChart3,
        title: "Comparativo de Evolução",
        description: "Compare avaliações ao longo do tempo e acompanhe a evolução do paciente.",
      },
      {
        icon: Shield,
        title: "Dados Protegidos",
        description: "Avaliações armazenadas com segurança, criptografia e conformidade com LGPD.",
      },
    ]}
    benefits={[
      { text: "Elimine formulários em papel e PDFs" },
      { text: "Avaliações integradas ao prontuário em tempo real" },
      { text: "Acompanhe a evolução do paciente visualmente" },
      { text: "Acesso multidisciplinar com controle de permissões" },
      { text: "Formulários adaptáveis a qualquer especialidade" },
    ]}
    ctaTitle="Avaliações organizadas,"
    ctaHighlight="resultados melhores."
    ctaDescription="Digitalize e integre suas avaliações clínicas com o ClinixFlow. Comece gratuitamente."
  />
);

export default AvaliacoesIntegradas;
