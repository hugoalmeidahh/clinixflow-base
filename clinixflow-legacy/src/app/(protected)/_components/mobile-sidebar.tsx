"use client";

import {
  AlertTriangle,
  CalendarDays,
  DollarSign,
  FileBarChart,
  FileText,
  Globe,
  LayoutDashboard,
  LogOutIcon,
  Menu,
  ScrollText,
  Shield,
  Star,
  Stethoscope,
  User,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/src/components/language-switcher";

type MenuItem = {
  titleKey: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
};

const ownerItems: MenuItem[] = [
  { titleKey: "dashboard", url: "/dashboard", icon: LayoutDashboard },
  { titleKey: "professionals", url: "/doctors", icon: Stethoscope },
  { titleKey: "appointments", url: "/appointments", icon: CalendarDays },
  { titleKey: "patients", url: "/patients", icon: UsersRound },
  { titleKey: "guides", url: "/guides", icon: ScrollText },
  { titleKey: "finance", url: "/finance", icon: DollarSign },
  { titleKey: "reports", url: "/reports", icon: FileBarChart },
];

const doctorItems: MenuItem[] = [
  { titleKey: "dashboard", url: "/professional/dashboard", icon: LayoutDashboard },
  { titleKey: "schedule", url: "/professional/appointments", icon: CalendarDays },
  { titleKey: "inconsistencies", url: "/inconsistencies", icon: AlertTriangle },
  { titleKey: "profile", url: "/profile", icon: User },
];

const patientItems: MenuItem[] = [
  { titleKey: "dashboard", url: "/patient/dashboard", icon: LayoutDashboard },
  { titleKey: "patientReports", url: "/patient/reports", icon: FileText, comingSoon: true },
  { titleKey: "evaluations", url: "/patient/evaluations", icon: Star, comingSoon: true },
  { titleKey: "requests", url: "/patient/requests", icon: FileText, comingSoon: true },
  { titleKey: "profile", url: "/profile", icon: User },
];

const masterItems: MenuItem[] = [
  { titleKey: "dashboard", url: "/master/dashboard", icon: LayoutDashboard },
  { titleKey: "manageOwners", url: "/master/owners", icon: Shield },
  { titleKey: "overduePayments", url: "/master/payment-inconsistencies", icon: AlertTriangle },
  { titleKey: "profile", url: "/profile", icon: User },
];

function getBottomItems(role?: string): MenuItem[] {
  const items: MenuItem[] = [];
  if (role === "master") {
    items.push({ titleKey: "overduePayments", url: "/master/payment-inconsistencies", icon: AlertTriangle });
  } else if (role === "owner" || role === "doctor") {
    items.push({ titleKey: "inconsistencies", url: "/inconsistencies", icon: AlertTriangle });
  }
  return items;
}

async function getVersionApp() {
  try {
    const res = await fetch("/api/version");
    const data = await res.json();
    return data.version;
  } catch {
    return "";
  }
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState("");
  const path = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const t = useTranslations("sidebar");
  const tCommon = useTranslations("common");

  useEffect(() => {
    getVersionApp().then(setVersion);
  }, []);

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [path]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success(t("signedOutSuccess"));
          router.push("/authentication");
        },
      },
    });
  };

  const userRole = session.data?.user.role;
  const isMaster = userRole === "master";
  const isDoctor = userRole === "doctor";
  const isPatient = userRole === "patient";
  const menuItems = isMaster
    ? masterItems
    : isDoctor
      ? doctorItems
      : isPatient
        ? patientItems
        : ownerItems;

  const bottomTitleKeys = ["inconsistencies", "overduePayments"];
  const mainMenuItems = menuItems.filter(
    (item) => !bottomTitleKeys.includes(item.titleKey),
  );
  const bottomMenuItems = getBottomItems(userRole);

  const isLoading = session.isPending || !session.data?.user;

  return (
    <>
      {/* Hamburger button for the mobile header */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="flex w-[280px] flex-col p-0 sm:max-w-[280px]">
          {/* Header - Logo */}
          <SheetHeader className="border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-5 dark:from-blue-950/20 dark:to-purple-950/20">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex items-center justify-center">
              <Link href="/" onClick={() => setOpen(false)}>
                <Image
                  src="/clinix_flow_dark.png"
                  alt="ClinixFlow"
                  width={160}
                  height={50}
                  className="block h-8 w-auto object-contain dark:hidden"
                  priority
                />
                <Image
                  src="/clinix_flow_white.png"
                  alt="ClinixFlow"
                  width={160}
                  height={50}
                  className="hidden h-8 w-auto object-contain dark:block"
                  priority
                />
              </Link>
            </div>
          </SheetHeader>

          {/* Clinic/Company info */}
          {!isLoading && session.data?.user.clinic?.name && (
            <div className="border-b border-border px-6 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {tCommon("teams")}
              </p>
              <p className="mt-1 truncate text-sm font-semibold">
                {session.data.user.clinic.name}
              </p>
            </div>
          )}

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                      <div className="h-5 w-5 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    </li>
                  ))
                : mainMenuItems.map((item) => {
                    const isActive = path === item.url;
                    const title = t(item.titleKey);
                    return (
                      <li key={item.titleKey}>
                        <Link
                          href={item.url}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span>{title}</span>
                          {item.comingSoon && (
                            <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              Em breve
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto border-t border-border">
            {/* Bottom menu items (inconsistencies) */}
            {bottomMenuItems.length > 0 && (
              <div className="border-b border-border px-3 py-2">
                {bottomMenuItems.map((item) => {
                  const isActive = path === item.url;
                  const title = t(item.titleKey);
                  return (
                    <Link
                      key={item.titleKey}
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{title}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Language switcher */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <LanguageSwitcher />
            </div>

            {/* User info */}
            {!isLoading && (
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage
                    src={session.data?.user.image ?? undefined}
                    alt={session.data?.user.name ?? ""}
                  />
                  <AvatarFallback className="rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100">
                    {session.data?.user.name
                      ? session.data.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                      : "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {session.data?.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.data?.user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Logout + Version */}
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOutIcon className="h-4 w-4" />
                {tCommon("signOut")}
              </button>
              {version && (
                <span className="text-[10px] text-muted-foreground">
                  v{version}
                </span>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}