import { motion } from "framer-motion";
import { AlertTriangle, CalendarX, FolderOpen, BarChart3, Eye, Syringe, Brain } from "lucide-react";

const problems = [
  { icon: CalendarX, text: "Agendamentos desorganizados" },
  { icon: FolderOpen, text: "Informações de pacientes espalhadas" },
  { icon: BarChart3, text: "Falta de relatórios operacionais" },
  { icon: Eye, text: "Dificuldade em acompanhar atendimentos" },
  { icon: Syringe, text: "Controle manual de vacinas e terapias" },
  { icon: Brain, text: "Falta de visão estratégica da clínica" },
];

const ProblemSection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-destructive">
            O Problema
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            A gestão da sua clínica está{" "}
            <span className="text-gradient-primary">descentralizada?</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Muitas clínicas ainda enfrentam problemas que geram perda de tempo, 
            erros operacionais e pacientes insatisfeitos.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 rounded-2xl border border-destructive/20 bg-card p-5 transition-all hover:border-destructive/40"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                <problem.icon className="h-5 w-5 text-destructive" />
              </div>
              <span className="text-sm font-semibold text-foreground">{problem.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center justify-center gap-3 text-center"
        >
          <AlertTriangle className="h-5 w-5 text-accent" />
          <p className="text-base font-semibold text-muted-foreground">
            Isso gera perda de tempo, erros operacionais e pacientes insatisfeitos.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
