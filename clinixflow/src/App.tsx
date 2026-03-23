import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ModuleGuard from "@/components/ModuleGuard";
import AppLayout from "@/components/layout/AppLayout";
import PatientLayout from "@/components/layout/PatientLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ForcePasswordChange from "./pages/ForcePasswordChange";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import Professionals from "./pages/Professionals";
import ProfessionalDetail from "./pages/ProfessionalDetail";
import Appointments from "./pages/Appointments";
import Inconsistencies from "./pages/Inconsistencies";
import Financial from "./pages/Financial";
import Evaluations from "./pages/Evaluations";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";
import Vaccines from "./pages/Vaccines";
import Settings from "./pages/Settings";
import SubscriptionExpired from "./pages/SubscriptionExpired";
import Plans from "./pages/Plans";
import Billing from "@/pages/Billing";
import Blocked from "@/pages/Blocked";
import NotFound from "./pages/NotFound";
import PatientPortalDashboard from "./pages/portal/PatientPortalDashboard";
import PatientPortalAppointments from "./pages/portal/PatientPortalAppointments";
import PatientPortalDocuments from "./pages/portal/PatientPortalDocuments";
import PatientPortalBooking from "./pages/portal/PatientPortalBooking";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/blocked" element={<Blocked />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/force-password-change" element={<ProtectedRoute><ForcePasswordChange /></ProtectedRoute>} />
            <Route path="/subscription-expired" element={<ProtectedRoute><SubscriptionExpired /></ProtectedRoute>} />
            <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />

            {/* Patient portal routes */}
            <Route path="/portal" element={<ProtectedRoute roles={["PATIENT"]}><PatientLayout /></ProtectedRoute>}>
              <Route index element={<PatientPortalDashboard />} />
              <Route path="appointments" element={<PatientPortalAppointments />} />
              <Route path="documents" element={<PatientPortalDocuments />} />
              <Route path="booking" element={<PatientPortalBooking />} />
            </Route>

            {/* Protected app routes (clinic staff) */}
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:id" element={<PatientDetail />} />
              <Route path="professionals" element={<Professionals />} />
              <Route path="professionals/:id" element={<ProfessionalDetail />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="inconsistencies" element={<Inconsistencies />} />
              <Route path="financial" element={<ModuleGuard module="FINANCIAL"><Financial /></ModuleGuard>} />
              <Route path="evaluations" element={<ModuleGuard module="EVALUATIONS"><Evaluations /></ModuleGuard>} />
              <Route path="documents" element={<Documents />} />
              <Route path="reports" element={<ModuleGuard module="REPORTS"><Reports /></ModuleGuard>} />
              <Route path="vaccines" element={<ModuleGuard module="VACCINES"><Vaccines /></ModuleGuard>} />
              <Route path="settings" element={<Settings />} />
              <Route path="billing" element={<Billing />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
