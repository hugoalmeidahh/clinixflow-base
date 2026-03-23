import { motion } from "framer-motion";
import { Syringe, Briefcase, FlaskConical, Search, Rocket, PawPrint } from "lucide-react";

const modules = [
  { icon: Syringe, label: "Módulo de Vacinas" },
  { icon: Briefcase, label: "Medicina do Trabalho" },
  { icon: PawPrint, label: "Veterinária e Petshop" },
  { icon: FlaskConical, label: "Laboratórios" },
  { icon: Search, label: "Pesquisa de Médicos" },
  { icon: Rocket, label: "E muito mais!" },
];

const ComingSoonSection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-hero overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[150px]" />

      <div className="container relative mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Em Breve
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl lg:text-5xl">
            Novos módulos chegando.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/60">
            Estamos construindo a plataforma mais completa para gestão de saúde do Brasil.
          </p>
        </motion.div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass flex items-center gap-3 rounded-full px-6 py-3 transition-all hover:scale-105"
            >
              <mod.icon className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-primary-foreground">{mod.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
