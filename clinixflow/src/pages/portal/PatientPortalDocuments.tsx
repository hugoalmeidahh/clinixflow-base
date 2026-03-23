import { usePatientDocuments, useDownloadDocument } from "@/hooks/usePatientPortal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  ATTENDANCE_CERTIFICATE: "Atestado",
  MEDICAL_REQUEST: "Pedido Médico",
  LAB_RESULT: "Resultado de Exame",
  INSURANCE_AUTHORIZATION: "Autorização de Convênio",
  TREATMENT_CONTRACT: "Contrato de Tratamento",
  OTHER: "Outro",
};

const formatBytes = (bytes?: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const PatientPortalDocuments = () => {
  const { data: documents = [], isLoading } = usePatientDocuments();
  const download = useDownloadDocument();

  const handleDownload = async (doc: any) => {
    try {
      const url = await download.mutateAsync(doc.file_url);
      window.open(url, "_blank");
    } catch {
      toast.error("Erro ao baixar o documento. Tente novamente.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Meus Documentos</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum documento disponível.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[doc.category] || doc.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(doc.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        {doc.file_size && (
                          <span className="text-xs text-muted-foreground">
                            {formatBytes(doc.file_size)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 gap-1.5"
                    onClick={() => handleDownload(doc)}
                    disabled={download.isPending}
                  >
                    {download.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPortalDocuments;
