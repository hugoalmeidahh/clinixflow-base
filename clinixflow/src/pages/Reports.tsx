import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Calendar, TrendingUp, DollarSign, ClipboardList, MessageSquare, Syringe } from "lucide-react";
import PatientTrackingReport from "@/components/reports/PatientTrackingReport";
import ClinicManagementReport from "@/components/reports/ClinicManagementReport";
import FinancialReport from "@/components/reports/FinancialReport";
import FeedbackReport from "@/components/reports/FeedbackReport";
import AssessmentEvolutionReport from "@/components/reports/AssessmentEvolutionReport";
import VaccineReport from "@/components/reports/VaccineReport";

const REPORT_CARDS = [
  { id: "patient", label: "Acompanhamento do Paciente", description: "Histórico de atendimentos, avaliações e frequência", icon: Users, color: "text-primary", tab: "patient" },
  { id: "clinic", label: "Gerencial da Clínica", description: "KPIs operacionais, volume e taxa de ocupação", icon: Calendar, color: "text-badge-scheduled", tab: "clinic" },
  { id: "financial", label: "Financeiro Gerencial", description: "DRE simplificado, comparativos e breakdown por categoria", icon: DollarSign, color: "text-badge-attended", tab: "financial" },
  { id: "feedback", label: "Devolutivas de Avaliação", description: "Status de envio de devolutivas por período", icon: MessageSquare, color: "text-badge-justified", tab: "feedback" },
  { id: "assessment", label: "Evolução por Instrumento", description: "Score inicial vs final por paciente para cada instrumento", icon: ClipboardList, color: "text-primary", tab: "assessment" },
  { id: "vaccines", label: "Desempenho de Vacinas", description: "Volume de doses aplicadas, top vacinas e evolução mensal", icon: Syringe, color: "text-primary", tab: "vaccines" },
];

const Reports = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("hub");

  const isFinancialVisible = !userRole?.role || ["ADMIN", "OWNER", "MANAGER", "FINANCIAL"].includes(userRole.role);

  const visibleCards = REPORT_CARDS.filter(c => c.id !== "financial" || isFinancialVisible);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Central de relatórios gerenciais, clínicos e financeiros</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="hub"><BarChart3 className="h-3.5 w-3.5 mr-1.5" />Central</TabsTrigger>
          <TabsTrigger value="patient"><Users className="h-3.5 w-3.5 mr-1.5" />Paciente</TabsTrigger>
          <TabsTrigger value="clinic"><Calendar className="h-3.5 w-3.5 mr-1.5" />Gerencial</TabsTrigger>
          {isFinancialVisible && <TabsTrigger value="financial"><DollarSign className="h-3.5 w-3.5 mr-1.5" />Financeiro</TabsTrigger>}
          <TabsTrigger value="feedback"><MessageSquare className="h-3.5 w-3.5 mr-1.5" />Devolutivas</TabsTrigger>
          <TabsTrigger value="assessment"><ClipboardList className="h-3.5 w-3.5 mr-1.5" />Avaliações</TabsTrigger>
          <TabsTrigger value="vaccines"><Syringe className="h-3.5 w-3.5 mr-1.5" />Vacinas</TabsTrigger>
        </TabsList>

        {/* Hub */}
        <TabsContent value="hub" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCards.map(c => (
              <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab(c.tab)}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <c.icon className={`h-8 w-8 shrink-0 ${c.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{c.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Badge variant="outline" className="text-xs">Abrir →</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patient" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Relatório de Acompanhamento do Paciente</CardTitle></CardHeader>
            <CardContent><PatientTrackingReport /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinic" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Relatório Gerencial da Clínica</CardTitle></CardHeader>
            <CardContent><ClinicManagementReport /></CardContent>
          </Card>
        </TabsContent>

        {isFinancialVisible && (
          <TabsContent value="financial" className="mt-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Relatório Financeiro Gerencial</CardTitle></CardHeader>
              <CardContent><FinancialReport /></CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="feedback" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" />Relatório de Devolutivas</CardTitle></CardHeader>
            <CardContent><FeedbackReport /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" />Evolução por Instrumento de Avaliação</CardTitle></CardHeader>
            <CardContent><AssessmentEvolutionReport /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccines" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Syringe className="h-4 w-4 text-primary" />Relatório de Desempenho de Vacinas</CardTitle></CardHeader>
            <CardContent><VaccineReport /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
