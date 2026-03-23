import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/hooks/useTenant";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard, Users, Users2, Calendar, ClipboardList, DollarSign,
  BarChart3, Syringe, Settings, AlertTriangle, FileText, LogOut,
  ChevronLeft, ChevronDown, Menu, X, Upload, List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Database } from "@/integrations/supabase/types";
import type { Resource } from "@/lib/permissions";
import logoWhite from "@/assets/logo-white.png";
import logoIcon from "@/assets/logo-icon.png";

type ModuleType = Database["public"]["Enums"]["module_type"];

interface SubItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavItem {
  labelKey: string;
  icon: React.ElementType;
  path: string;
  module?: ModuleType;
  resource: Resource;
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  { labelKey: "nav.dashboard", icon: LayoutDashboard, path: "/dashboard", resource: "dashboard" },
  { labelKey: "nav.patients", icon: Users, path: "/patients", resource: "patients" },
  { labelKey: "nav.team", icon: Users2, path: "/professionals", resource: "team" },
  { labelKey: "nav.appointments", icon: Calendar, path: "/appointments", resource: "appointments" },
  { labelKey: "nav.inconsistencies", icon: AlertTriangle, path: "/inconsistencies", resource: "inconsistencies" },
  {
    labelKey: "nav.documents", icon: FileText, path: "/documents", resource: "documents",
    subItems: [
      { label: "Lista", path: "/documents", icon: List },
      { label: "Enviar", path: "/documents?action=upload", icon: Upload },
    ],
  },
  {
    labelKey: "nav.evaluations", icon: ClipboardList, path: "/evaluations", module: "EVALUATIONS", resource: "evaluations",
  },
  {
    labelKey: "nav.financial", icon: DollarSign, path: "/financial", module: "FINANCIAL", resource: "financial",
  },
  {
    labelKey: "nav.reports", icon: BarChart3, path: "/reports", module: "REPORTS", resource: "reports",
  },
  {
    labelKey: "nav.vaccines", icon: Syringe, path: "/vaccines", module: "VACCINES", resource: "vaccines",
  },
  { labelKey: "nav.settings", icon: Settings, path: "/settings", resource: "settings" },
];

const AppSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { tenant } = useTenant();
  const { canView } = usePermissions();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const activeModules: ModuleType[] = (tenant?.active_modules as ModuleType[]) || ["BASE"];

  const isModuleActive = (module?: ModuleType) => {
    if (!module) return true;
    return activeModules.includes(module);
  };

  const isVisible = (item: NavItem) => {
    if (!isModuleActive(item.module)) return false;
    return canView(item.resource);
  };

  const isActive = (path: string) => {
    const basePath = path.split("?")[0];
    return location.pathname === basePath || location.pathname.startsWith(basePath + "/");
  };

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const renderNavItem = (item: NavItem, isCollapsedMode: boolean) => {
    if (!isVisible(item)) return null;
    const active = isActive(item.path);
    const hasSubItems = item.subItems && item.subItems.length > 0 && !isCollapsedMode;

    if (hasSubItems) {
      const isOpen = openMenus.includes(item.path) || item.subItems!.some(s => isActive(s.path));
      return (
        <Collapsible key={item.path} open={isOpen} onOpenChange={() => toggleMenu(item.path)}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate flex-1 text-left">{t(item.labelKey)}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-0.5 mt-0.5">
            {item.subItems!.map(sub => (
              <button
                key={sub.path}
                onClick={() => handleNavClick(sub.path)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                  isActive(sub.path) && location.search === (sub.path.includes("?") ? "?" + sub.path.split("?")[1] : "")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
                )}
              >
                <sub.icon className="h-4 w-4 shrink-0" />
                <span>{sub.label}</span>
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    const btn = (
      <button
        key={item.path}
        onClick={() => handleNavClick(item.path)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
          active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!isCollapsedMode && <span className="truncate">{t(item.labelKey)}</span>}
      </button>
    );

    if (isCollapsedMode) {
      return (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>{btn}</TooltipTrigger>
          <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
        </Tooltip>
      );
    }

    return btn;
  };

  // Mobile
  if (isMobile) {
    return (
      <>
        <button onClick={() => setMobileOpen(true)} className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border shadow-md">
          <Menu className="h-5 w-5" />
        </button>
        {mobileOpen && <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />}
        <aside className={cn("fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 shadow-2xl", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <img src={logoWhite} alt="ClinixFlow" className="h-7" />
            <button onClick={() => setMobileOpen(false)} className="p-1 rounded text-sidebar-foreground hover:bg-sidebar-accent"><X className="h-5 w-5" /></button>
          </div>
          {tenant && <div className="px-4 py-3 border-b border-sidebar-border"><p className="text-xs text-sidebar-foreground/60 truncate">{tenant.name}</p></div>}
          <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
            {navItems.map(item => renderNavItem(item, false))}
          </nav>
          <div className="border-t border-sidebar-border p-2">
            <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
              <LogOut className="h-5 w-5 shrink-0" /><span>Sair</span>
            </button>
          </div>
        </aside>
      </>
    );
  }

  // Desktop
  return (
    <aside className={cn("flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed ? <img src={logoWhite} alt="ClinixFlow" className="h-7" /> : <img src={logoIcon} alt="ClinixFlow" className="h-8 mx-auto" />}
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => setCollapsed(!collapsed)}>
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>
      {!collapsed && tenant && <div className="px-4 py-3 border-b border-sidebar-border"><p className="text-xs text-sidebar-foreground/60 truncate">{tenant.name}</p></div>}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {navItems.map(item => renderNavItem(item, collapsed))}
      </nav>
      <div className="border-t border-sidebar-border p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={signOut} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
              <LogOut className="h-5 w-5 shrink-0" />{!collapsed && <span>Sair</span>}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Sair</TooltipContent>}
        </Tooltip>
      </div>
    </aside>
  );
};

export default AppSidebar;
