import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { LucideIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";

const APP_URL = "https://app.clinixflow.com.br";

interface Problem {
  title: string;
  description: string;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Benefit {
  text: string;
}

interface SEOPageProps {
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  problems: Problem[];
  problemsTitle: string;
  features: Feature[];
  featuresTitle: string;
  featuresHighlight: string;
  benefits: Benefit[];
  ctaTitle: string;
  ctaHighlight: string;
  ctaDescription: string;
  canonicalPath: string;
}

const SEOPageLayout = ({
  title,
  metaDescription,
  heroTitle,
  heroHighlight,
  heroSubtitle,
  problems,
  problemsTitle,
  features,
  featuresTitle,
  featuresHighlight,
  benefits,
  ctaTitle,
  ctaHighlight,
  ctaDescription,
  canonicalPath,
}: SEOPageProps) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`https://clinixflow.com.br${canonicalPath}`} />
      </Helmet>

      <main className="min-h-screen">
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden bg-hero pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
          <div className="container relative mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl"
            >
              {heroTitle}{" "}
              <span className="text-gradient-accent">{heroHighlight}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/60 sm:text-xl"
            >
              {heroSubtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button
                size="lg"
                className="bg-gradient-accent text-accent-foreground font-bold text-base px-8 py-6 rounded-xl shadow-elevated hover:opacity-90 transition-all"
                asChild
              >
                <a href={`${APP_URL}/sign-up`}>
                  Testar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Problemas */}
        <section className="py-20 lg:py-28 bg-secondary">
          <div className="container mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center font-display text-3xl font-extrabold text-foreground sm:text-4xl"
            >
              {problemsTitle}
            </motion.h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {problems.map((problem, i) => (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {problem.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {problem.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                {featuresTitle}{" "}
                <span className="text-gradient-primary">{featuresHighlight}</span>
              </h2>
            </motion.div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-elevated hover:-translate-y-1"
                >
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
            </div>
          </div>
        </section>

        {/* Benefícios + CTA */}
        <section className="py-20 lg:py-28 bg-hero">
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl lg:text-5xl"
            >
              {ctaTitle}{" "}
              <span className="text-gradient-accent">{ctaHighlight}</span>
            </motion.h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/60">
              {ctaDescription}
            </p>
            <div className="mx-auto mt-10 flex max-w-md flex-col gap-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-left"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm text-primary-foreground/70">{b.text}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <Button
                size="lg"
                className="bg-gradient-accent text-accent-foreground font-bold text-base px-10 py-6 rounded-xl shadow-elevated hover:opacity-90 transition-all"
                asChild
              >
                <a href={`${APP_URL}/sign-up`}>
                  Começar Agora — É Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default SEOPageLayout;
