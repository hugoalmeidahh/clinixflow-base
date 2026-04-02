import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePortalSettings } from "@/hooks/usePortalSettings";
import { usePatientDocuments, useDownloadDocument } from "@/hooks/usePatientPortal";
import { supabase } from "@/integrations/supabase/client";
import FeatureDisabled from "@/components/portal/FeatureDisabled";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Loader2, Upload, FileText, Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";

const PatientPortalMedicalRequests = () => {
  const { user, tenantId } = useAuth();
  const { settings, loading: settingsLoading } = usePortalSettings();
  const { data: documents = [] } = usePatientDocuments();
  const downloadDoc = useDownloadDocument();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [uploading, setUploading] = useState(false);

  if (settingsLoading) return null;
  if (!settings.allow_upload_medical_request) return <FeatureDisabled />;

  const medicalRequests = documents.filter((d: any) => d.category === "MEDICAL_REQUEST");

  const handleUpload = async () => {
    if (!file || !user?.id || !tenantId) return;
    setUploading(true);
    try {
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!patient) throw new Error("Perfil de paciente não encontrado");

      const ext = file.name.split(".").pop();
      const filePath = `${tenantId}/${patient.id}/medical-requests/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      await supabase.from("documents").insert({
        tenant_id: tenantId,
        patient_id: patient.id,
        name: docName || file.name,
        file_url: filePath,
        file_type: file.type,
        file_size: file.size,
        category: "MEDICAL_REQUEST" as any,
        is_generated: false,
        created_by: user.id,
      });

      toast.success("Pedido médico enviado!");
      setFile(null);
      setDocName("");
      if (fileRef.current) fileRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["patient-documents"] });
    } catch (e: any) {
      toast.error(e.message || "Erro ao enviar documento");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileUrl: string) => {
    try {
      const url = await downloadDoc.mutateAsync(fileUrl);
      window.open(url, "_blank");
    } catch {
      toast.error("Erro ao baixar documento");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Pedidos Médicos</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enviar Pedido Médico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do documento (opcional)</Label>
            <Input
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Ex: Pedido de exame de sangue"
            />
          </div>
          <div className="space-y-2">
            <Label>Arquivo *</Label>
            <Input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Enviar
          </Button>
        </CardContent>
      </Card>

      {medicalRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enviados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicalRequests.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(doc.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDownload(doc.file_url)}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientPortalMedicalRequests;
