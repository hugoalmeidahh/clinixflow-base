import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConsultingSection = () => {
  return (
    <section id="consulting" className="relative py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-3xl bg-card border border-border p-10 text-center shadow-elevated lg:p-16"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent">
            <Sparkles className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Consultoria Especializada em{" "}
            <span className="text-gradient-primary">Gestão de Clínicas</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Além do sistema, oferecemos uma consultora especializada em
            administração e gestão de clínicas para te ajudar a organizar
            processos, reduzir custos e extrair o máximo da sua empresa.
          </p>
          <p className="mt-3 text-base font-medium text-foreground">
            Sistema + Consultoria = Clínica de alta performance.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-gradient-primary text-primary-foreground font-bold px-8 py-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            Falar com Consultora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultingSection;
