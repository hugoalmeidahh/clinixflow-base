import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SistemaParaClinicaDeVacinas from "./pages/SistemaParaClinicaDeVacinas";
import GestaoDeClinicas from "./pages/GestaoDeClinicas";
import AvaliacoesIntegradas from "./pages/AvaliacoesIntegradas";
import GestaoDePacientesEAgendamentos from "./pages/GestaoDePacientesEAgendamentos";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sistema-para-clinica-de-vacinas" element={<SistemaParaClinicaDeVacinas />} />
            <Route path="/gestao-de-clinicas" element={<GestaoDeClinicas />} />
            <Route path="/avaliacoes-integradas" element={<AvaliacoesIntegradas />} />
            <Route path="/gestao-de-pacientes-e-agendamentos" element={<GestaoDePacientesEAgendamentos />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
