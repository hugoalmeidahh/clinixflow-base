import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import logoColor from "@/assets/logo-color.png";

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message === "Invalid login credentials"
        ? t("auth.invalid_credentials")
        : error.message === "Email not confirmed"
        ? t("auth.email_not_confirmed")
        : error.message);
      setLoading(false);
      return;
    }

    toast.success(t("auth.login_success"));

    // Pulse Analytics — track login event
    window.pulse?.track("login", { method: "email" });

    navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-6 md:p-8 shadow-elegant border border-border">
        <div className="flex flex-col items-center gap-3">
          <img src={logoColor} alt="ClinixFlow" className="h-9 md:h-10" />
          <p className="text-sm text-muted-foreground">{t("auth.access_account")}</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email_label")}</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password_label")}</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("auth.sign_in")}
          </Button>
        </form>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">{t("auth.forgot_password")}</Link>
          <p className="text-muted-foreground">
            {t("auth.no_account")}{" "}
            <Link to="/sign-up" className="text-primary hover:underline font-medium">{t("auth.create_account")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
