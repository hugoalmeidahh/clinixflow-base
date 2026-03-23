import { motion } from "framer-motion";
import { FolderSync, Zap, BarChart3, Heart } from "lucide-react";

const benefits = [
  {
    icon: FolderSync,
    title: "Mais Organização",
    description: "Centralize todos os dados da clínica em um único sistema.",
  },
  {
    icon: Zap,
    title: "Mais Eficiência",
    description: "Automatize processos e reduza erros operacionais.",
  },
  {
    icon: BarChart3,
    title: "Mais Controle",
    description: "Tenha acesso a relatórios e indicadores da clínica.",
  },
  {
    icon: Heart,
    title: "Melhor Experiência",
    description: "Atendimentos organizados e histórico completo para pacientes.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Benefícios
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            Por que escolher o{" "}
            <span className="text-gradient-primary">ClinixFlow?</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
                <benefit.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-foreground">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
