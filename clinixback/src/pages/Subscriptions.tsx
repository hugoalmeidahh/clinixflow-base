import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Search,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Ban,
  ChevronDown,
  Eye,
} from "lucide-react";

interface Subscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: "ACTIVE" | "TRIAL" | "PAST_DUE" | "SUSPENDED" | "CANCELLED";
  current_period_end: string | null;
  failed_payment_count: number;
  price_centavos: number;
  created_at: string;
  tenants?: { name: string; email: string } | null;
  plans?: { name: string; tier: string } | null;
}

interface Invoice {
  id: string;
  amount_centavos: number;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

type StatusFilter =
  | "ALL"
  | "ACTIVE"
  | "TRIAL"
  | "PAST_DUE"
  | "SUSPENDED"
  | "CANCELLED";

const STATUS_FILTERS: StatusFilter[] = [
  "ALL",
  "ACTIVE",
  "TRIAL",
  "PAST_DUE",
  "SUSPENDED",
  "CANCELLED",
];

const STATUS_LABELS: Record<StatusFilter, string> = {
  ALL: "Todos",
  ACTIVE: "Ativos",
  TRIAL: "Trial",
  PAST_DUE: "Inadimplentes",
  SUSPENDED: "Suspensos",
  CANCELLED: "Cancelados",
};

const fmtCurrency = (c: number) =>
  `R$ ${(c / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const fmtDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR");
};

const statusBadge = (status: Subscription["status"]) => {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          Ativo
        </Badge>
      );
    case "TRIAL":
      return (
        <Badge className="bg-blue-500 text-white hover:bg-blue-600">
          Trial
        </Badge>
      );
    case "PAST_DUE":
      return (
        <Badge className="bg-orange-500 text-white hover:bg-orange-600">
          Inadimplente
        </Badge>
      );
    case "SUSPENDED":
      return <Badge variant="destructive">Suspenso</Badge>;
    case "CANCELLED":
      return <Badge variant="secondary">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const tierBadge = (tier: string) => {
  const map: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-700",
    STARTER: "bg-blue-100 text-blue-700",
    PROFESSIONAL: "bg-purple-100 text-purple-700",
    ENTERPRISE: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-xs font-medium ${
        map[tier] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {tier}
    </span>
  );
};

export default function Subscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("subscriptions")
      .select("*, tenants(name, email), plans(name, tier)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar assinaturas: " + error.message);
    } else {
      setSubscriptions(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const fetchInvoices = async (subscriptionId: string) => {
    setInvoicesLoading(true);
    const { data, error } = await (supabase as any)
      .from("subscription_invoices")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      toast.error("Erro ao carregar faturas: " + error.message);
      setInvoices([]);
    } else {
      setInvoices(data || []);
    }
    setInvoicesLoading(false);
  };

  const handleViewDetails = (sub: Subscription) => {
    setSelected(sub);
    setInvoices([]);
    fetchInvoices(sub.id);
  };

  const handleAdminAction = async (
    action: "SUSPEND" | "REACTIVATE" | "CANCEL"
  ) => {
    if (!selected || !user) return;

    const labels: Record<string, string> = {
      SUSPEND: "suspender",
      REACTIVATE: "reativar",
      CANCEL: "cancelar",
    };

    const reason = window.prompt(
      `Informe o motivo para ${labels[action]} esta assinatura:`
    );
    if (reason === null) return;

    setActionLoading(true);

    const newStatus =
      action === "SUSPEND"
        ? "SUSPENDED"
        : action === "REACTIVATE"
        ? "ACTIVE"
        : "CANCELLED";

    const { error: updateError } = await (supabase as any)
      .from("subscriptions")
      .update({ status: newStatus })
      .eq("id", selected.id);

    if (updateError) {
      toast.error("Erro ao atualizar assinatura: " + updateError.message);
      setActionLoading(false);
      return;
    }

    await (supabase as any).from("admin_actions").insert({
      admin_user_id: user.id,
      tenant_id: selected.tenant_id,
      action_type: action,
      reason: reason || null,
    });

    toast.success("Ação executada com sucesso.");
    setActionLoading(false);
    setSelected(null);
    fetchSubscriptions();
  };

  const filtered = subscriptions.filter((s) => {
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    const tenantName = s.tenants?.name?.toLowerCase() ?? "";
    const matchesSearch =
      !search || tenantName.includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const kpiActive = subscriptions.filter((s) => s.status === "ACTIVE").length;
  const kpiPastDue = subscriptions.filter(
    (s) => s.status === "PAST_DUE"
  ).length;
  const kpiSuspended = subscriptions.filter(
    (s) => s.status === "SUSPENDED"
  ).length;
  const kpiTrial = subscriptions.filter((s) => s.status === "TRIAL").length;
  const mrr =
    subscriptions
      .filter((s) => s.status === "ACTIVE")
      .reduce((acc, s) => acc + (s.price_centavos ?? 0), 0) / 100;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Assinaturas</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{kpiActive}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              Trial
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{kpiTrial}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
              Inadimplentes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{kpiPastDue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Ban className="h-3.5 w-3.5 text-destructive" />
              Suspensos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{kpiSuspended}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              MRR
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-xl font-bold">
              {fmtCurrency(mrr * 100)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome da organização..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nenhuma assinatura encontrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organização</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Próx. cobrança</TableHead>
                  <TableHead>Falhas</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.tenants?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sub.tenants?.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          {sub.plans?.name ?? "—"}
                        </span>
                        {sub.plans?.tier && tierBadge(sub.plans.tier)}
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(sub.status)}</TableCell>
                    <TableCell className="text-sm">
                      {fmtDate(sub.current_period_end)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {sub.failed_payment_count > 0 ? (
                        <span className="text-destructive font-medium">
                          {sub.failed_payment_count}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fmtDate(sub.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(sub)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes da Assinatura —{" "}
              {selected?.tenants?.name ?? selected?.id}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-5 pt-2">
              {/* Subscription Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Informações da Assinatura
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">ID</p>
                    <p className="font-mono text-xs break-all">{selected.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <div className="mt-0.5">{statusBadge(selected.status)}</div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Plano</p>
                    <p className="font-medium">{selected.plans?.name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tier</p>
                    <div className="mt-0.5">
                      {selected.plans?.tier
                        ? tierBadge(selected.plans.tier)
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor mensal</p>
                    <p className="font-medium">
                      {fmtCurrency(selected.price_centavos)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Próx. cobrança</p>
                    <p>{fmtDate(selected.current_period_end)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Falhas de pagamento</p>
                    <p
                      className={
                        selected.failed_payment_count > 0
                          ? "text-destructive font-medium"
                          : ""
                      }
                    >
                      {selected.failed_payment_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Criado em</p>
                    <p>{fmtDate(selected.created_at)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoices */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Faturas Recentes
                </h3>
                {invoicesLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Carregando faturas...
                  </p>
                ) : invoices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma fatura encontrada.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Pago em</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium text-sm">
                            {fmtCurrency(inv.amount_centavos)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {fmtDate(inv.due_date)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {fmtDate(inv.paid_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <Separator />

              {/* Admin Actions */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Ações Administrativas</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Executando..." : "Ações"}
                      <ChevronDown className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleAdminAction("SUSPEND")}
                      disabled={selected.status === "SUSPENDED"}
                      className="text-orange-600 focus:text-orange-600"
                    >
                      Suspender manualmente
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAdminAction("REACTIVATE")}
                      disabled={selected.status === "ACTIVE"}
                      className="text-green-600 focus:text-green-600"
                    >
                      Reativar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAdminAction("CANCEL")}
                      disabled={selected.status === "CANCELLED"}
                      className="text-destructive focus:text-destructive"
                    >
                      Cancelar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
