import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const APP_URL = "https://app.clinixflow.com.br";

const CTASection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            Transforme a gestão da sua{" "}
            <span className="text-gradient-primary">clínica hoje.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Com o ClinixFlow você tem organização, eficiência e controle total da operação.
            Comece gratuitamente, sem cartão de crédito.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-gradient-accent text-accent-foreground font-bold text-lg px-10 py-7 rounded-xl shadow-elevated hover:opacity-90 transition-all animate-pulse-glow"
              asChild
            >
              <a href={`${APP_URL}/sign-up`}>
                Criar Conta Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-bold text-lg px-10 py-7 rounded-xl"
            >
              Solicitar Demonstração
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Sem compromisso • Cancele quando quiser • Suporte incluso
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
