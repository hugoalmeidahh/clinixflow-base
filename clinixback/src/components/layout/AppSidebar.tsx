import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  DollarSign,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Package,
  Tag,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  labelKey: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { labelKey: "nav.dashboard", icon: LayoutDashboard, path: "/" },
  { labelKey: "nav.tenants", icon: Building2, path: "/tenants" },
  { labelKey: "nav.plans", icon: CreditCard, path: "/plans" },
  { labelKey: "nav.financial", icon: DollarSign, path: "/financial" },
  { labelKey: "nav.modules", icon: Package, path: "/modules" },
  { labelKey: "nav.coupons", icon: Tag, path: "/coupons" },
  { labelKey: "nav.subscriptions", icon: Receipt, path: "/subscriptions" },
];

const AppSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const renderNavItem = (item: NavItem, isCollapsedMode: boolean) => {
    const active = isActive(item.path);

    const btn = (
      <button
        key={item.path}
        onClick={() => handleNavClick(item.path)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
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

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border shadow-md"
        >
          <Menu className="h-5 w-5" />
        </button>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 shadow-2xl",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <span className="font-heading text-lg font-bold text-sidebar-primary">
              ClinixFlow
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60">Backoffice Admin</p>
          </div>
          <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
            {navItems.map((item) => renderNavItem(item, false))}
          </nav>
          <div className="border-t border-sidebar-border p-2">
            <button
              onClick={() => {
                signOut();
                setMobileOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>{t("auth.signOut")}</span>
            </button>
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed ? (
          <span className="font-heading text-lg font-bold text-sidebar-primary">
            ClinixFlow
          </span>
        ) : (
          <span className="font-heading text-lg font-bold text-sidebar-primary mx-auto">
            CF
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </Button>
      </div>
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60">Backoffice Admin</p>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {navItems.map((item) => renderNavItem(item, collapsed))}
      </nav>
      <div className="border-t border-sidebar-border p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{t("auth.signOut")}</span>}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">{t("auth.signOut")}</TooltipContent>}
        </Tooltip>
      </div>
    </aside>
  );
};

export default AppSidebar;
