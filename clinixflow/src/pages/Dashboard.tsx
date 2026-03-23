import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CheckCircle, XCircle, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface KPI {
  activePatients: number;
  totalAppointments: number;
  completedAppointments: number;
  missedAppointments: number;
  attendanceRate: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { tenantId } = useAuth();
  const navigate = useNavigate();
  const { formatDate, formatCustom } = useDateFormatter();
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [inconsistencyCount, setInconsistencyCount] = useState(0);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;
    const fetchDashboard = async () => {
      const now = new Date();
      const monthStart = startOfMonth(now).toISOString();
      const monthEnd = endOfMonth(now).toISOString();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

      const [patientsRes, appointmentsRes, todayRes, pastAptsRes, incomeRes, expenseRes] = await Promise.all([
        supabase.from("patients").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId).eq("is_active", true),
        supabase.from("appointments").select("status").eq("tenant_id", tenantId).gte("scheduled_at", monthStart).lte("scheduled_at", monthEnd),
        supabase.from("appointments").select("*, patients!inner(full_name, record_number), professionals!inner(full_name), specialties!inner(name)")
          .eq("tenant_id", tenantId).gte("scheduled_at", todayStart).lt("scheduled_at", todayEnd).order("scheduled_at").limit(8),
        supabase.from("appointments").select("id", { count: "exact", head: true })
          .eq("tenant_id", tenantId).eq("status", "SCHEDULED").lt("scheduled_at", new Date().toISOString()),
        supabase.from("transactions").select("amount").eq("tenant_id", tenantId).eq("type", "INCOME")
          .gte("reference_date", format(startOfMonth(now), "yyyy-MM-dd")).lte("reference_date", format(endOfMonth(now), "yyyy-MM-dd")),
        supabase.from("transactions").select("amount").eq("tenant_id", tenantId).eq("type", "EXPENSE")
          .gte("reference_date", format(startOfMonth(now), "yyyy-MM-dd")).lte("reference_date", format(endOfMonth(now), "yyyy-MM-dd")),
      ]);

      const appointments = appointmentsRes.data || [];
      const completed = appointments.filter(a => a.status === "ATTENDED").length;
      const missed = appointments.filter(a => ["ABSENCE", "JUSTIFIED_ABSENCE"].includes(a.status)).length;

      setKpi({
        activePatients: patientsRes.count || 0,
        totalAppointments: appointments.length,
        completedAppointments: completed,
        missedAppointments: missed,
        attendanceRate: appointments.length > 0 ? Math.round((completed / appointments.length) * 100) : 0,
        monthlyIncome: (incomeRes.data || []).reduce((s, t) => s + Number(t.amount), 0),
        monthlyExpense: (expenseRes.data || []).reduce((s, t) => s + Number(t.amount), 0),
      });

      setTodayAppointments(todayRes.data || []);
      setInconsistencyCount(pastAptsRes.count || 0);

      // Fetch 6-month trend
      const trend: any[] = [];
      for (let i = 5; i >= 0; i--) {
        const m = subMonths(now, i);
        const ms = format(startOfMonth(m), "yyyy-MM-dd");
        const me = format(endOfMonth(m), "yyyy-MM-dd");
        const { count: aptCount } = await supabase.from("appointments").select("id", { count: "exact", head: true })
          .eq("tenant_id", tenantId).eq("status", "ATTENDED").gte("scheduled_at", ms).lte("scheduled_at", me + "T23:59:59");
        trend.push({ month: format(m, "MMM", { locale: ptBR }), atendimentos: aptCount || 0 });
      }
      setTrendData(trend);
      setLoading(false);
    };
    fetchDashboard();
  }, [tenantId]);

  const kpiCards = kpi ? [
    { label: t("dashboard.active_patients"), value: kpi.activePatients, icon: Users, color: "text-primary" },
    { label: t("dashboard.month_appointments"), value: kpi.totalAppointments, icon: Calendar, color: "text-badge-scheduled" },
    { label: t("dashboard.completed_appointments"), value: kpi.completedAppointments, icon: CheckCircle, color: "text-badge-attended" },
    { label: t("dashboard.absences"), value: kpi.missedAppointments, icon: XCircle, color: "text-badge-absent" },
    { label: t("dashboard.attendance_rate"), value: `${kpi.attendanceRate}%`, icon: TrendingUp, color: "text-primary" },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground text-sm">{formatDate(new Date(), "monthYear")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-16" /></CardContent></Card>
          ))
        ) : (
          kpiCards.map((card) => (
            <Card key={card.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <card.icon className={`h-8 w-8 ${card.color}`} />
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold font-heading">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts */}
      {!loading && kpi && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-heading">Atendimentos (últimos 6 meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trendData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="atendimentos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-heading">Status do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[220px]">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Atendidos", value: kpi.completedAppointments, fill: "#22c55e" },
                        { name: "Faltas", value: kpi.missedAppointments, fill: "#ef4444" },
                        { name: "Outros", value: Math.max(0, kpi.totalAppointments - kpi.completedAppointments - kpi.missedAppointments), fill: "#94a3b8" },
                      ].filter(d => d.value > 0)}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {kpi.monthlyIncome > 0 && (
                <div className="flex justify-between text-sm border-t pt-3 mt-2">
                  <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> Receita: <strong className="text-badge-attended">R$ {kpi.monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong></span>
                  <span className="text-muted-foreground">Despesa: <strong className="text-badge-absent">R$ {kpi.monthlyExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong></span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-heading">{t("dashboard.today_appointments")}</CardTitle>
            <button onClick={() => navigate("/appointments")} className="text-sm text-primary hover:underline">{t("common.view_all")}</button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("dashboard.no_appointments_today")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/appointments`)}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground">{formatCustom(new Date(apt.scheduled_at), "HH:mm")}</span>
                      <div>
                        <p className="text-sm font-medium">{apt.patients?.full_name}</p>
                        <p className="text-xs text-muted-foreground">{apt.professionals?.full_name} · {apt.specialties?.name}</p>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-heading">{t("dashboard.inconsistencies")}</CardTitle>
            <button onClick={() => navigate("/inconsistencies")} className="text-sm text-primary hover:underline">{t("dashboard.view_all")}</button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              {inconsistencyCount > 0 ? (
                <>
                  <p className="text-3xl font-bold text-badge-absent">{inconsistencyCount}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("dashboard.pending_items")}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/inconsistencies")}>{t("common.view_details")}</Button>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">{t("dashboard.no_inconsistencies")}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
