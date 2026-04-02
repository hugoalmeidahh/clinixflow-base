import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePortalSettings } from "@/hooks/usePortalSettings";
import { usePatientDocuments } from "@/hooks/usePatientPortal";
import { supabase } from "@/integrations/supabase/client";
import FeatureDisabled from "@/components/portal/FeatureDisabled";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Loader2, FileCheck, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";

const PatientPortalCertificates = () => {
  const { user, tenantId } = useAuth();
  const { settings, loading: settingsLoading } = usePortalSettings();
  const { data: documents = [] } = usePatientDocuments();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (settingsLoading) return null;
  if (!settings.allow_request_certificate) return <FeatureDisabled />;

  const certificates = documents.filter((d: any) => d.category === "ATTENDANCE_CERTIFICATE");

  const handleRequest = async () => {
    if (!user?.id || !tenantId) return;
    setSaving(true);
    try {
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!patient) throw new Error("Perfil de paciente não encontrado");

      await supabase.from("documents").insert({
        tenant_id: tenantId,
        patient_id: patient.id,
        name: `Solicitação de Atestado - ${format(new Date(), "dd/MM/yyyy")}`,
        file_url: "request-pending",
        category: "ATTENDANCE_CERTIFICATE" as any,
        is_generated: false,
        created_by: user.id,
        template_type: notes || null,
      });

      toast.success("Solicitação de atestado enviada!");
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["patient-documents"] });
    } catch (e: any) {
      toast.error(e.message || "Erro ao solicitar atestado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Solicitar Atestado</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nova Solicitação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o motivo ou a data de referência do atestado..."
              rows={3}
            />
          </div>
          <Button onClick={handleRequest} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Solicitar Atestado
          </Button>
        </CardContent>
      </Card>

      {certificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meus Atestados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {certificates.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(doc.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <Badge variant={doc.file_url === "request-pending" ? "secondary" : "default"}>
                  {doc.file_url === "request-pending" ? "Pendente" : "Disponível"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientPortalCertificates;
