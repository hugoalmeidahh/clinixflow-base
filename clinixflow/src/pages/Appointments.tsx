import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAppointments, useAppointmentsRealtime } from "@/hooks/useAppointments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ChevronLeft, ChevronRight, List, LayoutGrid, CalendarDays } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/sonner";
import AppointmentListView from "@/components/appointments/AppointmentListView";
import AppointmentDailyView from "@/components/appointments/AppointmentDailyView";
import AppointmentWeeklyView from "@/components/appointments/AppointmentWeeklyView";
import NewAppointmentDialog, { type AppointmentPrefill } from "@/components/appointments/NewAppointmentDialog";
import { useQuery } from "@tanstack/react-query";

const Appointments = () => {
  const { tenantId } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"daily" | "weekly" | "list">("list");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefill, setPrefill] = useState<AppointmentPrefill | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const dateRange = useMemo(() => ({
    start: view === "daily"
      ? startOfDay(currentDate).toISOString()
      : weekStart.toISOString(),
    end: view === "daily"
      ? endOfDay(currentDate).toISOString()
      : weekEnd.toISOString(),
  }), [view, currentDate, weekStart, weekEnd]);

  // Use React Query hook for appointments with realtime
  const { data: appointments = [], isLoading, error, refetch } = useAppointments(dateRange);
  useAppointmentsRealtime();

  // Show error toast if fetch fails
  if (error) {
    toast.error("Erro ao carregar agendamentos.");
  }

  // Form data (patients, professionals, specialties) - cached separately
  const { data: formData } = useQuery({
    queryKey: ["appointments-form-data", tenantId],
    queryFn: async () => {
      if (!tenantId) return { patients: [], professionals: [], specialties: [] };
      const [p, prof, spec] = await Promise.all([
        supabase.from("patients").select("id, full_name, record_number").eq("tenant_id", tenantId).eq("is_active", true).order("full_name"),
        supabase.from("professionals").select("id, full_name").eq("tenant_id", tenantId).eq("is_active", true).order("full_name"),
        supabase.from("specialties").select("id, name, default_duration_min").eq("tenant_id", tenantId).eq("is_active", true).order("name"),
      ]);
      return {
        patients: p.data || [],
        professionals: prof.data || [],
        specialties: spec.data || [],
      };
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 min - this data changes rarely
  });

  const patients = formData?.patients || [];
  const professionals = formData?.professionals || [];
  const specialtiesList = formData?.specialties || [];

  const navigateDate = (days: number) => setCurrentDate(d => addDays(d, days));
  const navStep = view === "daily" ? 1 : 7;

  const dateLabel = view === "daily"
    ? format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : `Semana de ${format(weekStart, "dd/MM")} a ${format(weekEnd, "dd/MM/yyyy")}`;

  const handleSlotClick = (date: string, time: string, professionalId?: string) => {
    setPrefill({ date, time, professionalId });
    setDialogOpen(true);
  };

  const handleOpenNewDialog = () => {
    setPrefill(null);
    setDialogOpen(true);
  };

  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold">Agendamentos</h1>
          <p className="text-sm text-muted-foreground capitalize">{dateLabel}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button variant={view === "daily" ? "default" : "ghost"} size="sm" onClick={() => setView("daily")} className="h-8">
              <CalendarDays className="h-4 w-4 mr-1" /> Dia
            </Button>
            <Button variant={view === "weekly" ? "default" : "ghost"} size="sm" onClick={() => setView("weekly")} className="h-8">
              <LayoutGrid className="h-4 w-4 mr-1" /> Semana
            </Button>
            <Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => setView("list")} className="h-8">
              <List className="h-4 w-4 mr-1" /> Lista
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateDate(-navStep)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setCurrentDate(new Date())}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateDate(navStep)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button size="sm" onClick={handleOpenNewDialog}>
            <Plus className="h-4 w-4 mr-1" /> Novo
          </Button>
        </div>
      </div>

      <NewAppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleRefresh}
        patients={patients}
        professionals={professionals}
        specialtiesList={specialtiesList}
        prefill={prefill}
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : (
            <>
              {view === "list" && (
                <AppointmentListView
                  appointments={appointments}
                  onRefresh={handleRefresh}
                  onNewAppointment={handleOpenNewDialog}
                />
              )}
              {view === "daily" && (
                <AppointmentDailyView
                  appointments={appointments}
                  professionals={professionals}
                  currentDate={currentDate}
                  onRefresh={handleRefresh}
                  onSlotClick={handleSlotClick}
                />
              )}
              {view === "weekly" && (
                <AppointmentWeeklyView
                  appointments={appointments}
                  currentDate={currentDate}
                  onRefresh={handleRefresh}
                  onSlotClick={handleSlotClick}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;
