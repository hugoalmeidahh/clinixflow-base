import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/EmptyState";
import { Clock, CheckCircle, XCircle, AlertTriangle, FileText, ClipboardList, Pill } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const eventIcons: Record<string, React.ElementType> = {
  ATTENDED: CheckCircle,
  ABSENCE: XCircle,
  JUSTIFIED_ABSENCE: AlertTriangle,
  EVALUATION: ClipboardList,
  NOTE: FileText,
  DOCUMENT: FileText,
};

const eventColors: Record<string, string> = {
  ATTENDED: "text-badge-attended bg-badge-attended/10",
  ABSENCE: "text-badge-absent bg-badge-absent/10",
  JUSTIFIED_ABSENCE: "text-badge-justified bg-badge-justified/10",
  EVALUATION: "text-primary bg-primary/10",
  NOTE: "text-muted-foreground bg-muted",
  DOCUMENT: "text-badge-scheduled bg-badge-scheduled/10",
};

const eventLabels: Record<string, string> = {
  ATTENDED: "Presença registrada",
  ABSENCE: "Ausência registrada",
  JUSTIFIED_ABSENCE: "Falta justificada",
  EVALUATION: "Avaliação",
  NOTE: "Nota clínica",
  DOCUMENT: "Documento",
};

interface ClinicalTimelineProps {
  patientId: string;
  tenantId: string;
}

const ClinicalTimeline = ({ patientId, tenantId }: ClinicalTimelineProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("clinical_events")
        .select("*")
        .eq("patient_id", patientId)
        .eq("tenant_id", tenantId)
        .order("performed_at", { ascending: false })
        .limit(100);

      setEvents(data || []);
      setLoading(false);
    };
    fetch();
  }, [patientId, tenantId]);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="font-heading">Evoluções</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Evoluções</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Nenhuma evolução registrada"
            description="Registros clínicos aparecerão aqui conforme consultas e atendimentos forem realizados."
          />
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4">
              {events.map((event) => {
                const Icon = eventIcons[event.event_type] || Clock;
                const colorClass = eventColors[event.event_type] || "text-muted-foreground bg-muted";
                const label = eventLabels[event.event_type] || event.event_type;

                return (
                  <div key={event.id} className="relative flex gap-4 pl-0">
                    {/* Icon */}
                    <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground shrink-0">
                          {format(new Date(event.performed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      {event.content && (
                        <p className="text-sm text-muted-foreground mt-1">{event.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClinicalTimeline;
