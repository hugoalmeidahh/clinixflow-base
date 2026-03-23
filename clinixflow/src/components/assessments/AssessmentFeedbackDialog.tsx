import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, Loader2, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  assessmentId: string;
  patientName: string;
  globalConsideration?: string;
  appliedAt?: string;
  open: boolean;
  onClose: () => void;
}

const AssessmentFeedbackDialog = ({ assessmentId, patientName, globalConsideration, appliedAt, open, onClose }: Props) => {
  const { user } = useAuth();
  const [channel, setChannel] = useState<"EMAIL" | "WHATSAPP">("EMAIL");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const defaultMessage = (name: string, date: string, consideration: string) =>
    `Prezado(a) ${name},\n\nSegue a devolutiva da avaliação realizada em ${date}.\n\n${consideration ? `Considerações gerais:\n${consideration}\n\n` : ""}Para dúvidas, entre em contato com nossa equipe.\n\nAtenciosamente.`;

  useEffect(() => {
    if (!open) return;
    const date = appliedAt ? format(parseISO(appliedAt), "dd/MM/yyyy", { locale: ptBR }) : format(new Date(), "dd/MM/yyyy");
    setMessage(defaultMessage(patientName, date, globalConsideration || ""));
    loadHistory();
  }, [open, patientName, globalConsideration, appliedAt]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    const { data } = await (supabase as any).from("assessment_feedback")
      .select("*").eq("assessment_id", assessmentId).order("sent_at", { ascending: false });
    setHistory(data || []);
    setHistoryLoading(false);
  };

  const handleSend = async () => {
    if (!recipient || !message) return;
    setSending(true);
    const { error } = await (supabase as any).from("assessment_feedback").insert({
      assessment_id: assessmentId,
      channel,
      recipient,
      message,
      sent_by: user?.id,
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`Devolutiva registrada! (${channel === "EMAIL" ? "e-mail" : "WhatsApp"})`);
      setRecipient("");
      loadHistory();
    }
    setSending(false);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Enviar Devolutiva — {patientName}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          {/* Channel */}
          <div className="space-y-1.5">
            <Label className="text-xs">Canal de envio</Label>
            <div className="flex gap-2">
              {(["EMAIL", "WHATSAPP"] as const).map(c => (
                <button key={c} onClick={() => setChannel(c)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${channel === c ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"}`}>
                  {c === "EMAIL" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                  {c === "EMAIL" ? "E-mail" : "WhatsApp"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{channel === "EMAIL" ? "E-mail do destinatário" : "WhatsApp (DDD + número)"} *</Label>
            <Input value={recipient} onChange={e => setRecipient(e.target.value)}
              placeholder={channel === "EMAIL" ? "paciente@email.com" : "+55 11 99999-9999"} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Mensagem *</Label>
            <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={6} className="text-sm" />
            <p className="text-xs text-muted-foreground">Variáveis: {"{nome_paciente}"}, {"{data_avaliacao}"}, {"{consideracao_geral}"}</p>
          </div>

          <Button onClick={handleSend} disabled={sending || !recipient || !message} className="w-full gap-1.5">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Registrar Envio
          </Button>

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Histórico de envios:</p>
              {history.map(h => (
                <div key={h.id} className="flex items-start justify-between text-xs p-2 rounded-md bg-muted/40">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-xs">{h.channel}</Badge>
                      <span className="text-muted-foreground">{h.recipient}</span>
                    </div>
                    <p className="mt-0.5 text-muted-foreground">{format(parseISO(h.sent_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentFeedbackDialog;
