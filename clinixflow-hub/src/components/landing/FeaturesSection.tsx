import { motion } from "framer-motion";
import {
  Users, CalendarDays, FileText, Brain,
  BarChart3, Syringe, Briefcase, ClipboardList,
  Heart, Clock, Shield, Stethoscope,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestão de Pacientes",
    description: "Cadastro completo, histórico de atendimentos, registro de avaliações e prontuário centralizado.",
    available: true,
  },
  {
    icon: CalendarDays,
    title: "Agendamentos Inteligentes",
    description: "Agenda por profissional, controle de horários, organização de consultas e visão completa.",
    available: true,
  },
  {
    icon: Stethoscope,
    title: "Gestão da Equipe",
    description: "Cadastro de profissionais, organização de especialidades e controle de atendimentos.",
    available: true,
  },
  {
    icon: FileText,
    title: "Prontuário Eletrônico",
    description: "Evoluções, anamneses e documentos do paciente protegidos e organizados.",
    available: true,
  },
  {
    icon: Brain,
    title: "Terapias e TEA",
    description: "Controle de sessões terapêuticas, registro de evolução e histórico completo de atendimentos.",
    available: true,
  },
  {
    icon: Syringe,
    title: "Gestão de Vacinas",
    description: "Controle de imunização, registro de aplicações e histórico completo de vacinação.",
    available: true,
  },
  {
    icon: ClipboardList,
    title: "Consultas e Avaliações",
    description: "Formulários personalizados para avaliações clínicas completas e registro detalhado.",
    available: true,
  },
  {
    icon: BarChart3,
    title: "Relatórios e Indicadores",
    description: "Relatórios detalhados, indicadores operacionais e visão estratégica da clínica.",
    available: true,
    badge: "WIP",
  },
  {
    icon: Shield,
    title: "Perfis de Acesso",
    description: "Controle quem vê o quê. Recepção, médicos, gestores — cada um com sua visão.",
    available: true,
  },
  {
    icon: Briefcase,
    title: "Medicina do Trabalho",
    description: "Gestão de exames ocupacionais, acompanhamento de colaboradores e avaliações.",
    available: false,
    badge: "Em Breve",
  },
  {
    icon: Heart,
    title: "Veterinária",
    description: "Módulo completo para gestão de clínicas veterinárias e petshops.",
    available: false,
    badge: "Em Breve",
  },
  {
    icon: Clock,
    title: "Backups Automáticos",
    description: "Backups a cada hora, diários e semanais. Seus dados nunca se perdem.",
    available: true,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Funcionalidades
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            Gestão completa da clínica.{" "}
            <span className="text-gradient-primary">Em um só sistema.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Do agendamento ao relatório, o ClinixFlow centraliza todas as informações 
            importantes em uma única plataforma.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-elevated hover:-translate-y-1"
            >
              {feature.badge && (
                <span className={`absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  feature.badge === "Em Breve"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-accent/20 text-accent-foreground"
                }`}>
                  {feature.badge}
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
