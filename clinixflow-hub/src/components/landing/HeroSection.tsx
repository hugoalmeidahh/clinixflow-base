import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const APP_URL = "https://app.clinixflow.com.br";

const highlights = [
  "Gestão de pacientes",
  "Agendamentos inteligentes",
  "Relatórios completos",
  "Controle de vacinas",
  "Medicina ocupacional",
  "Terapias e TEA",
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-hero">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      }} />

      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />

      <div className="container relative mx-auto flex flex-col items-center px-6 pt-32 pb-20 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-1.5"
        >
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-primary-foreground/80">
            Plataforma completa para clínicas modernas
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-center font-display text-4xl font-extrabold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          Gestão Inteligente para{" "}
          <span className="text-gradient-accent">Clínicas Modernas.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-center text-lg text-primary-foreground/60 sm:text-xl"
        >
          O ClinixFlow é um sistema completo para gestão de clínicas, pacientes, equipe, 
          agendamentos, vacinas, terapias e medicina do trabalho — tudo em uma única 
          plataforma simples e poderosa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="bg-gradient-accent text-accent-foreground font-bold text-base px-8 py-6 rounded-xl shadow-elevated hover:opacity-90 transition-all animate-pulse-glow"
            asChild
          >
            <a href={`${APP_URL}/sign-up`}>
              Testar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5 px-8 py-6"
          >
            <Play className="mr-2 h-4 w-4" />
            Agendar Demonstração
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {highlights.map((text) => (
            <span key={text} className="flex items-center gap-2 text-sm text-primary-foreground/50">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              {text}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mt-16 w-full max-w-5xl"
        >
          <div className="absolute -inset-4 rounded-2xl bg-gradient-primary opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-primary-foreground/10 shadow-elevated">
            <img
              src={heroDashboard}
              alt="ClinixFlow Dashboard - Sistema de gestão para clínicas"
              className="w-full"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
