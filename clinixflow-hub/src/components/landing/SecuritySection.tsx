import { motion } from "framer-motion";
import { ShieldCheck, Lock, Database, FileCheck } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "LGPD Compliant",
    description: "Totalmente de acordo com a Lei Geral de Proteção de Dados. Seus dados e os dos seus pacientes seguros.",
  },
  {
    icon: Lock,
    title: "Prontuários Protegidos",
    description: "Informações de saúde protegidas conforme legislação vigente. Acesso restrito e auditável.",
  },
  {
    icon: Database,
    title: "Backups Constantes",
    description: "Backups automáticos a cada hora, diários e semanais. Recuperação rápida e garantida.",
  },
  {
    icon: FileCheck,
    title: "Criptografia de Ponta",
    description: "Dados criptografados em trânsito e em repouso. Padrão bancário de segurança.",
  },
];

const SecuritySection = () => {
  return (
    <section id="security" className="relative py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Segurança
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            Segurança que você pode{" "}
            <span className="text-gradient-primary">confiar.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Proteção máxima para sua clínica e seus pacientes. Compliance total com as regulamentações brasileiras.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-card"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
