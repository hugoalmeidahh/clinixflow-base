import logo from "@/assets/clinixflow_logo_color.png";

const APP_URL = "https://app.clinixflow.com.br";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <a href="#" className="flex items-center gap-2">
            <img src={logo} alt="ClinixFlow" className="h-8" />
          </a>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#audience" className="hover:text-foreground transition-colors">Para Quem</a>
            <a href="#security" className="hover:text-foreground transition-colors">Segurança</a>
            <a href={`${APP_URL}/sign-in`} className="hover:text-foreground transition-colors">Entrar</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ClinixFlow — Pleno Inovação. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
