import { useState } from "react";
import { useBookingRequests, useCreateBookingRequest } from "@/hooks/usePatientPortal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Loader2, CalendarClock, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Aguardando", icon: Clock, variant: "secondary" },
  APPROVED: { label: "Aprovada", icon: CheckCircle2, variant: "default" },
  REJECTED: { label: "Recusada", icon: XCircle, variant: "destructive" },
};

const PatientPortalBooking = () => {
  const { data: requests = [], isLoading } = useBookingRequests();
  const create = useCreateBookingRequest();

  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [date3, setDate3] = useState("");
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date1) {
      toast.error("Informe ao menos uma data preferida.");
      return;
    }
    try {
      await create.mutateAsync({
        preferred_date_1: new Date(date1).toISOString(),
        preferred_date_2: date2 ? new Date(date2).toISOString() : undefined,
        preferred_date_3: date3 ? new Date(date3).toISOString() : undefined,
        notes: notes || undefined,
      });
      toast.success("Solicitação enviada! A clínica entrará em contato em breve.");
      setDate1(""); setDate2(""); setDate3(""); setNotes("");
      setShowForm(false);
    } catch {
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Solicitar Agendamento</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nova Solicitação
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Nova Solicitação de Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Informe até 3 datas e horários de sua preferência. A equipe entrará em contato para confirmar.
              </p>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="date1">1ª Opção de Data <span className="text-destructive">*</span></Label>
                  <input
                    id="date1"
                    type="datetime-local"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                    required
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <Label htmlFor="date2">2ª Opção de Data <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                  <input
                    id="date2"
                    type="datetime-local"
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <Label htmlFor="date3">3ª Opção de Data <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                  <input
                    id="date3"
                    type="datetime-local"
                    value={date3}
                    onChange={(e) => setDate3(e.target.value)}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Observações <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                  <Textarea
                    id="notes"
                    placeholder="Ex: prefiro atendimento com a Dra. Ana, é retorno..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button type="submit" disabled={create.isPending} className="gap-2">
                  {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Enviar Solicitação
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing requests */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Minhas Solicitações
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground text-sm">
              Nenhuma solicitação enviada ainda.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map((req: any) => {
              const cfg = statusConfig[req.status] || statusConfig.PENDING;
              const StatusIcon = cfg.icon;
              return (
                <Card key={req.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Enviada em {format(new Date(req.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          1ª opção: {format(new Date(req.preferred_date_1), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                        {req.preferred_date_2 && (
                          <p className="text-xs text-muted-foreground">
                            2ª opção: {format(new Date(req.preferred_date_2), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        )}
                        {req.preferred_date_3 && (
                          <p className="text-xs text-muted-foreground">
                            3ª opção: {format(new Date(req.preferred_date_3), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        )}
                        {req.notes && (
                          <p className="text-xs text-muted-foreground italic">"{req.notes}"</p>
                        )}
                      </div>
                      <Badge variant={cfg.variant} className="gap-1 shrink-0">
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPortalBooking;
