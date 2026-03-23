import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/clinixflow_logo_white.png";

const APP_URL = "https://app.clinixflow.com.br";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Funcionalidades", href: "#features" },
    { label: "Para Quem", href: "#audience" },
    { label: "Segurança", href: "#security" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="ClinixFlow" className="h-9" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <a href={`${APP_URL}/sign-in`}>Entrar</a>
          </Button>
          <Button
            className="bg-gradient-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
            asChild
          >
            <a href={`${APP_URL}/sign-up`}>Testar Grátis</a>
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary-foreground md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass border-t border-primary-foreground/10 md:hidden"
        >
          <div className="container mx-auto flex flex-col gap-4 px-6 py-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 w-full"
                asChild
              >
                <a href={`${APP_URL}/sign-in`}>Entrar</a>
              </Button>
              <Button
                className="bg-gradient-accent text-accent-foreground font-semibold w-full"
                asChild
              >
                <a href={`${APP_URL}/sign-up`}>Testar Grátis</a>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
