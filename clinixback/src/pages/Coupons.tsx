import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Tag } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  scope: "FIRST_MONTH" | "ALL_MONTHS";
  expires_at: string | null;
  max_uses: number | null;
  status: "ACTIVE" | "PAUSED";
  coupon_redemptions?: { count: number }[];
}

interface CouponForm {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  scope: "FIRST_MONTH" | "ALL_MONTHS";
  expires_at: string;
  max_uses: string;
  status: "ACTIVE" | "PAUSED";
}

const emptyForm: CouponForm = {
  code: "",
  type: "PERCENTAGE",
  value: 0,
  scope: "FIRST_MONTH",
  expires_at: "",
  max_uses: "",
  status: "ACTIVE",
};

const fmtValue = (type: "PERCENTAGE" | "FIXED", value: number) => {
  if (type === "PERCENTAGE") return `${value}%`;
  return `R$ ${(value / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
};

const fmtScope = (scope: "FIRST_MONTH" | "ALL_MONTHS") => {
  return scope === "FIRST_MONTH" ? "Primeiro mês" : "Todos os meses";
};

const fmtDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR");
};

const calcStatus = (coupon: Coupon): "ACTIVE" | "PAUSED" | "EXPIRADO" => {
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return "EXPIRADO";
  }
  return coupon.status;
};

const statusBadge = (status: "ACTIVE" | "PAUSED" | "EXPIRADO") => {
  if (status === "ACTIVE")
    return (
      <Badge className="bg-green-500 text-white hover:bg-green-600">Ativo</Badge>
    );
  if (status === "PAUSED")
    return (
      <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
        Pausado
      </Badge>
    );
  return <Badge variant="secondary">Expirado</Badge>;
};

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CouponForm>(emptyForm);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("coupons")
      .select("*, coupon_redemptions(count)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar cupons: " + error.message);
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) {
      toast.error("O código do cupom é obrigatório.");
      return;
    }

    setSaving(true);
    const payload: Record<string, unknown> = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: form.value,
      scope: form.scope,
      expires_at: form.expires_at || null,
      max_uses: form.max_uses ? parseInt(form.max_uses, 10) : null,
      status: form.status,
    };

    const { error } = await (supabase as any).from("coupons").insert(payload);

    if (error) {
      toast.error("Erro ao criar cupom: " + error.message);
    } else {
      toast.success("Cupom criado com sucesso.");
      setDialogOpen(false);
      fetchCoupons();
    }
    setSaving(false);
  };

  const getRedemptionCount = (coupon: Coupon) => {
    if (!coupon.coupon_redemptions || coupon.coupon_redemptions.length === 0)
      return 0;
    return coupon.coupon_redemptions[0].count ?? 0;
  };

  const fmtUses = (coupon: Coupon) => {
    const used = getRedemptionCount(coupon);
    if (!coupon.max_uses) return `${used} / Ilimitado`;
    return `${used} / ${coupon.max_uses}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-6 w-6 text-primary" />
          <h1 className="font-heading text-2xl font-bold">Cupons</h1>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cupons de Desconto</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nenhum cupom cadastrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Escopo</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-semibold">
                        {coupon.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {coupon.type === "PERCENTAGE" ? "Percentual" : "Fixo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {fmtValue(coupon.type, coupon.value)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fmtScope(coupon.scope)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {fmtDate(coupon.expires_at)}
                    </TableCell>
                    <TableCell className="text-sm">{fmtUses(coupon)}</TableCell>
                    <TableCell>{statusBadge(calcStatus(coupon))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Cupom</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="coupon-code">
                Código <span className="text-destructive">*</span>
              </Label>
              <Input
                id="coupon-code"
                placeholder="ex: DESCONTO20"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="coupon-type">Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm({ ...form, type: v as CouponForm["type"] })
                  }
                >
                  <SelectTrigger id="coupon-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentual (%)</SelectItem>
                    <SelectItem value="FIXED">Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="coupon-value">
                  Valor{" "}
                  {form.type === "PERCENTAGE"
                    ? "(%)"
                    : "(centavos)"}
                </Label>
                <Input
                  id="coupon-value"
                  type="number"
                  min={0}
                  value={form.value}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coupon-scope">Escopo</Label>
              <Select
                value={form.scope}
                onValueChange={(v) =>
                  setForm({ ...form, scope: v as CouponForm["scope"] })
                }
              >
                <SelectTrigger id="coupon-scope">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIRST_MONTH">Primeiro mês</SelectItem>
                  <SelectItem value="ALL_MONTHS">Todos os meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="coupon-expires">Validade (opcional)</Label>
                <Input
                  id="coupon-expires"
                  type="date"
                  value={form.expires_at}
                  onChange={(e) =>
                    setForm({ ...form, expires_at: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="coupon-maxuses">
                  Máx. usos (0 = ilimitado)
                </Label>
                <Input
                  id="coupon-maxuses"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.max_uses}
                  onChange={(e) =>
                    setForm({ ...form, max_uses: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coupon-status">Status inicial</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as CouponForm["status"] })
                }
              >
                <SelectTrigger id="coupon-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="PAUSED">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Criar Cupom"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
