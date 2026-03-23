import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { FileSignature, Plus, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PrescriptionEditor from "./PrescriptionEditor";

interface PrescriptionListProps {
  patientId: string;
  professionals: any[];
}

const PrescriptionList = ({ patientId, professionals }: PrescriptionListProps) => {
  const { tenantId, user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewContent, setViewContent] = useState<string | null>(null);

  const fetchPrescriptions = async () => {
    if (!tenantId) return;
    const { data } = await supabase
      .from("prescriptions" as any)
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });
    setPrescriptions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPrescriptions(); }, [tenantId, patientId]);

  const getProfessionalName = (profId: string) => {
    const prof = professionals.find((p: any) => p.id === profId);
    return prof?.full_name || "—";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  // Find professional record linked to current user
  const currentProfessional = professionals.find((p: any) => p.user_id === user?.id);

  if (loading) {
    return <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Prescrições</h3>
        {currentProfessional && (
          <Button size="sm" onClick={() => setEditorOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Nova Prescrição
          </Button>
        )}
      </div>

      {prescriptions.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="Nenhuma prescrição"
          description="Nenhuma prescrição registrada para este paciente."
          actionLabel={currentProfessional ? "+ Nova Prescrição" : undefined}
          onAction={currentProfessional ? () => setEditorOpen(true) : undefined}
        />
      ) : (
        <div className="space-y-2">
          {prescriptions.map((rx: any) => (
            <Card key={rx.id} className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setViewContent(rx.content)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileSignature className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{getProfessionalName(rx.professional_id)}</span>
                    <StatusBadge
                      variant={rx.is_signed ? "active" : "warning"}
                      label={rx.is_signed ? "Assinada" : "Rascunho"}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(rx.created_at)}</p>
                </div>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentProfessional && (
        <PrescriptionEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          patientId={patientId}
          professionalId={currentProfessional.id}
          onCreated={fetchPrescriptions}
        />
      )}

      {/* View prescription content */}
      <Dialog open={!!viewContent} onOpenChange={() => setViewContent(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Prescrição</DialogTitle></DialogHeader>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: viewContent || "" }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrescriptionList;
