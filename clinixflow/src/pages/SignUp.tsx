import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Loader2, Check, X, ChevronRight, ChevronLeft, CreditCard, Shield } from "lucide-react";
import logoColor from "@/assets/logo-color.png";

const STEPS = ["Dados da conta", "Escolha seu plano", "Pagamento"];

const fmt = (c: number) => `R$ ${(c / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [plans, setPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<any | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [form, setForm] = useState({
    orgName: "", document: "", email: "", phone: "", password: "", confirmPassword: "", acceptTerms: false,
  });
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const slugTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

  // Debounced slug validation
  useEffect(() => {
    const slug = generateSlug(form.orgName);
    if (!slug || slug.length < 3) { setSlugStatus("idle"); return; }
    setSlugStatus("checking");
    if (slugTimerRef.current) clearTimeout(slugTimerRef.current);
    slugTimerRef.current = setTimeout(async () => {
      const { data } = await supabase.from("tenants").select("id").eq("slug", slug).maybeSingle();
      setSlugStatus(data ? "taken" : "available");
    }, 500);
    return () => { if (slugTimerRef.current) clearTimeout(slugTimerRef.current); };
  }, [form.orgName]);

  // Load plans on step 2
  useEffect(() => {
    if (step !== 1 || plans.length > 0) return;
    setPlansLoading(true);
    supabase.from("plans").select("*").eq("is_active", true).order("price_monthly")
      .then(({ data }) => {
        const publicPlans = (data || []).filter((p: any) => !p.status || p.status === "PUBLIC");
        setPlans(publicPlans);
        if (publicPlans.length > 0 && !selectedPlanId) setSelectedPlanId(publicPlans[0].id);
      })
      .finally(() => setPlansLoading(false));
  }, [step]);

  const checkCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponChecking(true);
    const { data, error } = await (supabase as any).from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase().trim())
      .eq("status", "ACTIVE")
      .maybeSingle();
    if (error || !data) { toast.error("Cupom inválido ou expirado."); setCouponResult(null); }
    else {
      const expired = data.expires_at && new Date(data.expires_at) < new Date();
      const maxed = data.max_uses && data.current_uses >= data.max_uses;
      if (expired || maxed) { toast.error("Cupom expirado ou esgotado."); setCouponResult(null); }
      else { setCouponResult(data); toast.success(`Cupom aplicado: ${data.type === "PERCENTAGE" ? `${data.value}%` : fmt(data.value)} de desconto`); }
    }
    setCouponChecking(false);
  };

  const getDiscountedPrice = (plan: any) => {
    if (!couponResult || plan.id !== selectedPlanId) return plan.price_monthly;
    if (couponResult.type === "PERCENTAGE") return Math.max(0, Math.round(plan.price_monthly * (1 - couponResult.value / 100)));
    return Math.max(0, plan.price_monthly - couponResult.value);
  };

  const formatDocument = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    if (digits.length <= 11) return digits.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1-$2");
    return digits.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  };

  const formatCardNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.orgName.trim()) newErrors.orgName = "Nome da clínica obrigatório";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email inválido";
    if (form.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Senhas não coincidem";
    if (!form.acceptTerms) newErrors.acceptTerms = "Aceite os termos para continuar";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    if (!selectedPlanId) { toast.error("Selecione um plano para continuar."); return false; }
    return true;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    const digits = cardForm.number.replace(/\D/g, "");
    if (digits.length < 13) newErrors.number = "Número de cartão inválido";
    if (!cardForm.name.trim()) newErrors.name = "Nome no cartão obrigatório";
    if (!/^\d{2}\/\d{2}$/.test(cardForm.expiry)) newErrors.expiry = "Validade inválida (MM/AA)";
    if (cardForm.cvv.length < 3) newErrors.cvv = "CVV inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const slug = generateSlug(form.orgName);
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: form.orgName, org_name: form.orgName, org_slug: slug,
            org_cnpj: form.document.replace(/\D/g, "") || "",
            org_phone: form.phone.replace(/\D/g, "") || "",
            selected_plan_id: selectedPlanId,
            coupon_code: couponResult?.code || null,
          },
        },
      });
      if (authError) throw authError;
      toast.success("Conta criada! Verifique seu email para confirmar.");
      navigate("/sign-in");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (field: string) =>
    errors[field] ? <p className="text-xs text-destructive mt-1">{errors[field]}</p> : null;

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 py-8 px-4">
      <div className="w-full max-w-lg space-y-6 rounded-xl bg-card p-6 md:p-8 shadow-elegant border border-border">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <img src={logoColor} alt="ClinixFlow" className="h-9 md:h-10" />
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i < step ? "bg-primary border-primary text-primary-foreground" : i === step ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground/50"}`}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={`text-[10px] text-center leading-tight ${i === step ? "text-primary font-medium" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mb-4 ${i < step ? "bg-primary" : "bg-muted-foreground/20"}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Account data */}
        {step === 0 && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-sm">Nome da clínica *</Label>
              <Input value={form.orgName} onChange={e => setForm(p => ({ ...p, orgName: e.target.value }))} placeholder="Clínica Exemplo" />
              {form.orgName.length >= 3 && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  {slugStatus === "checking" && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  {slugStatus === "available" && <Check className="h-3 w-3 text-green-600" />}
                  {slugStatus === "taken" && <X className="h-3 w-3 text-destructive" />}
                  <span className={`text-xs ${slugStatus === "available" ? "text-green-600" : slugStatus === "taken" ? "text-destructive" : "text-muted-foreground"}`}>
                    {slugStatus === "checking" ? "Verificando..." : slugStatus === "available" ? `Disponível: clinixflow.com/${generateSlug(form.orgName)}` : "Já em uso"}
                  </span>
                </div>
              )}
              {fieldError("orgName")}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-sm">CNPJ/CPF</Label>
                <Input value={form.document} onChange={e => setForm(p => ({ ...p, document: formatDocument(e.target.value) }))} placeholder="00.000.000/0000-00" />
                {fieldError("document")}
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Telefone</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: formatPhone(e.target.value) }))} placeholder="(11) 99999-9999" />
                {fieldError("phone")}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="contato@clinica.com" />
              {fieldError("email")}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-sm">Senha * <span className="font-normal text-muted-foreground">(mín. 8)</span></Label>
                <Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
                {fieldError("password")}
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Confirmar senha *</Label>
                <Input type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="••••••••" />
                {fieldError("confirmPassword")}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="terms" checked={form.acceptTerms} onCheckedChange={v => setForm(p => ({ ...p, acceptTerms: !!v }))} className="mt-0.5" />
              <div>
                <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  Li e aceito os <span className="text-primary underline cursor-pointer">Termos de Uso</span> e a <span className="text-primary underline cursor-pointer">Política de Privacidade</span>
                </Label>
                {fieldError("acceptTerms")}
              </div>
            </div>
            <Button className="w-full gap-1.5" onClick={nextStep}>
              Próximo <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 1: Plan selection */}
        {step === 1 && (
          <div className="space-y-4">
            {plansLoading ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />)}</div>
            ) : (
              <div className="space-y-2">
                {plans.map(plan => {
                  const discounted = getDiscountedPrice(plan);
                  const selected = selectedPlanId === plan.id;
                  return (
                    <Card
                      key={plan.id}
                      className={`cursor-pointer transition-all ${selected ? "border-primary ring-1 ring-primary" : "hover:border-muted-foreground/40"}`}
                      onClick={() => setSelectedPlanId(plan.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary" : "border-muted-foreground/40"}`}>
                              {selected && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{plan.name}</p>
                              {plan.description && <p className="text-xs text-muted-foreground">{plan.description}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            {discounted !== plan.price_monthly && (
                              <p className="text-xs text-muted-foreground line-through">{fmt(plan.price_monthly)}</p>
                            )}
                            <p className="font-bold text-primary">{plan.price_monthly === 0 ? "Grátis" : `${fmt(discounted)}/mês`}</p>
                          </div>
                        </div>
                        {plan.max_patients > 0 && (
                          <div className="mt-2 flex gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">{plan.max_patients} pacientes</Badge>
                            {plan.max_team_members > 0 && <Badge variant="secondary" className="text-xs">{plan.max_team_members} membros</Badge>}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Coupon */}
            <div className="space-y-1">
              <Label className="text-sm">Cupom de desconto</Label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="CLINIX20"
                  className="font-mono uppercase"
                />
                <Button variant="outline" size="sm" onClick={checkCoupon} disabled={couponChecking || !couponCode.trim()}>
                  {couponChecking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Aplicar"}
                </Button>
              </div>
              {couponResult && (
                <p className="text-xs text-green-600 flex items-center gap-1"><Check className="h-3 w-3" /> {couponResult.type === "PERCENTAGE" ? `${couponResult.value}%` : fmt(couponResult.value)} de desconto — {couponResult.scope === "FIRST_MONTH" ? "primeiro mês" : "todos os meses"}</p>
              )}
            </div>

            {selectedPlan && (
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground text-sm mb-1">Resumo do plano selecionado</p>
                <p>Plano: <strong>{selectedPlan.name}</strong></p>
                <p>Cobrança hoje: <strong>{fmt(getDiscountedPrice(selectedPlan))}</strong></p>
                {couponResult?.scope === "FIRST_MONTH" && (
                  <p>A partir do 2º mês: <strong>{fmt(selectedPlan.price_monthly)}/mês</strong></p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-1.5" onClick={() => setStep(0)}>
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button className="flex-1 gap-1.5" onClick={nextStep}>
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <Shield className="h-4 w-4 text-green-700 shrink-0" />
              <p className="text-xs text-green-700">Seus dados de pagamento são protegidos com criptografia de ponta a ponta.</p>
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Número do cartão *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 font-mono tracking-widest"
                  value={cardForm.number}
                  onChange={e => setCardForm(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </div>
              {fieldError("number")}
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Nome no cartão *</Label>
              <Input
                value={cardForm.name}
                onChange={e => setCardForm(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                placeholder="NOME SOBRENOME"
                className="uppercase"
              />
              {fieldError("name")}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-sm">Validade *</Label>
                <Input
                  value={cardForm.expiry}
                  onChange={e => setCardForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                  placeholder="MM/AA"
                  maxLength={5}
                />
                {fieldError("expiry")}
              </div>
              <div className="space-y-1">
                <Label className="text-sm">CVV *</Label>
                <Input
                  type="password"
                  value={cardForm.cvv}
                  onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  placeholder="•••"
                  maxLength={4}
                />
                {fieldError("cvv")}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">Você tem 15 dias de direito de arrependimento com reembolso total conforme o CDC.</p>

            {selectedPlan && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <div className="flex justify-between">
                  <span>{selectedPlan.name}</span>
                  <span className="font-bold">{fmt(getDiscountedPrice(selectedPlan))}</span>
                </div>
                {couponResult && (
                  <div className="flex justify-between text-xs text-green-600 mt-0.5">
                    <span>Desconto ({couponResult.code})</span>
                    <span>- {couponResult.type === "PERCENTAGE" ? `${couponResult.value}%` : fmt(couponResult.value)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1 gap-1.5" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar e pagar
              </Button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}<Link to="/sign-in" className="text-primary hover:underline font-medium">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
