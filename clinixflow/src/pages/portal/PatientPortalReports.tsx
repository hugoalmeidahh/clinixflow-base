import { useAuth } from "@/contexts/AuthContext";
import { usePortalSettings } from "@/hooks/usePortalSettings";
import { useDownloadDocument } from "@/hooks/usePatientPortal";
import { supabase } from "@/integrations/supabase/client";
import FeatureDisabled from "@/components/portal/FeatureDisabled";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { BarChart3, Download, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";

const PatientPortalReports = () => {
  const { user } = useAuth();
  const { settings, loading: settingsLoading } = usePortalSettings();
  const downloadDoc = useDownloadDocument();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["patient-reports", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: patient } = await supabase
        .from("patients")
        .select("id, tenant_id")
        .eq("user_id", user.id)
        .single();
      if (!patient) return [];

      // Try report_history table first
      const { data, error } = await (supabase as any)
        .from("report_history")
        .select("*")
        .eq("tenant_id", patient.tenant_id)
        .order("generated_at", { ascending: false })
        .limit(50);

      if (error || !data) return [];
      return data;
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });

  if (settingsLoading) return null;
  if (!settings.allow_view_reports) return <FeatureDisabled />;

  const handleDownload = async (fileUrl: string) => {
    try {
      const url = await downloadDoc.mutateAsync(fileUrl);
      window.open(url, "_blank");
    } catch {
      toast.error("Erro ao baixar relatório");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Relatórios Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-muted-foreground">
              <FileText className="h-8 w-8 mb-2" />
              <p className="text-sm">Nenhum relatório disponível no momento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{r.report_type}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(r.generated_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  {r.file_url && (
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(r.file_url)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientPortalReports;
