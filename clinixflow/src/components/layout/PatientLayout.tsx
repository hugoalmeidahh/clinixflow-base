import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePortalSettings } from "@/hooks/usePortalSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Calendar, FileText, PlusCircle, FileCheck, Upload, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PatientPortalSettings } from "@/types/portalSettings";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  settingsKey?: keyof PatientPortalSettings;
}

const allNav: NavItem[] = [
  { path: "/portal", label: "Início", icon: Home, exact: true },
  { path: "/portal/appointments", label: "Consultas", icon: Calendar, settingsKey: "allow_track_appointments" },
  { path: "/portal/documents", label: "Documentos", icon: FileText },
  { path: "/portal/booking", label: "Solicitar", icon: PlusCircle, settingsKey: "allow_request_booking" },
  { path: "/portal/certificates", label: "Atestados", icon: FileCheck, settingsKey: "allow_request_certificate" },
  { path: "/portal/medical-requests", label: "Pedidos", icon: Upload, settingsKey: "allow_upload_medical_request" },
  { path: "/portal/reports", label: "Relatórios", icon: BarChart3, settingsKey: "allow_view_reports" },
];

const PatientLayout = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = usePortalSettings();

  const filteredNav = allNav.filter((item) =>
    !item.settingsKey || settings[item.settingsKey]
  );

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "P";

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:h-16 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-none">{profile?.full_name || "Paciente"}</p>
            <p className="text-xs text-muted-foreground">Portal do Paciente</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-2"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Sair</span>
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        <Outlet />
      </main>

      {/* Bottom nav (mobile) — max 5 visible, rest scroll */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 flex overflow-x-auto border-t border-border bg-card md:hidden">
        {filteredNav.map(({ path, label, icon: Icon, exact }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors",
              isActive(path, exact)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop side nav */}
      <aside className="fixed left-0 top-14 bottom-0 hidden w-56 flex-col border-r border-border bg-card p-3 md:flex md:top-16">
        {filteredNav.map(({ path, label, icon: Icon, exact }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(path, exact)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </aside>

      {/* Offset for desktop sidebar */}
      <style>{`
        @media (min-width: 768px) {
          main { margin-left: 14rem; }
        }
      `}</style>
    </div>
  );
};

export default PatientLayout;
