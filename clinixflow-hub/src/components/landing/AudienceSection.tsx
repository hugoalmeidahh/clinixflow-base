import { motion } from "framer-motion";
import {
  Building2, Syringe, Brain, Baby,
  Briefcase, Stethoscope, PawPrint,
} from "lucide-react";

const audiences = [
  { icon: Building2, label: "Clínicas Médicas" },
  { icon: Syringe, label: "Clínicas de Vacinação" },
  { icon: Brain, label: "Clínicas de Terapias" },
  { icon: Baby, label: "Centros de Desenvolvimento Infantil" },
  { icon: Stethoscope, label: "Clínicas de TEA" },
  { icon: Briefcase, label: "Medicina Ocupacional" },
  { icon: PawPrint, label: "Veterinárias e Petshops" },
];

const AudienceSection = () => {
  return (
    <section id="audience" className="relative py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Para Quem
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            Pensado para diferentes{" "}
            <span className="text-gradient-primary">tipos de atendimento.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            O ClinixFlow foi desenvolvido para atender diversos segmentos da saúde e bem-estar.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:shadow-elevated hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                <item.icon className="h-7 w-7" />
              </div>
              <span className="font-display text-sm font-bold text-foreground">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
