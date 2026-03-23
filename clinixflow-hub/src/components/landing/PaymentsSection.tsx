import { motion } from "framer-motion";
import { CreditCard, QrCode, RefreshCcw, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const methods = [
  { icon: QrCode, label: "PIX", desc: "Receba instantaneamente" },
  { icon: CreditCard, label: "Cartão de Crédito", desc: "Parcelamento fácil" },
  { icon: CreditCard, label: "Cartão de Débito", desc: "Pagamento à vista" },
  { icon: RefreshCcw, label: "Recorrência", desc: "Cobranças automáticas" },
];

const PaymentsSection = () => {
  return (
    <section id="payments" className="relative overflow-hidden py-24 lg:py-32 bg-hero">
      {/* Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />

      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              Pagamentos
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl lg:text-5xl">
              Receba pelo ClinixFlow com{" "}
              <span className="text-gradient-accent">taxa baixíssima.</span>
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/60 leading-relaxed">
              Abra sua carteira digital no sistema e comece a cobrar seus
              atendimentos. Cobrança pontual ou recorrente, você escolhe como
              receber — tudo integrado ao financeiro da sua clínica.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-xl bg-accent/20 px-4 py-3">
                <Zap className="h-5 w-5 text-accent" />
                <span className="font-display text-2xl font-extrabold text-primary-foreground">
                  0,99%
                </span>
              </div>
              <span className="text-sm text-primary-foreground/50">
                Taxa a partir de — a menor do mercado para clínicas
              </span>
            </div>

            <Button
              size="lg"
              className="mt-8 bg-gradient-accent text-accent-foreground font-bold px-8 py-6 rounded-xl hover:opacity-90 transition-opacity"
            >
              Abrir Minha Carteira
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {methods.map((method, i) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-2xl p-6 text-center transition-all hover:scale-105"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20">
                  <method.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-primary-foreground">
                  {method.label}
                </h3>
                <p className="mt-1 text-sm text-primary-foreground/50">{method.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PaymentsSection;
