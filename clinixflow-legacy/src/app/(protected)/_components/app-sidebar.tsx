"use client";

import {
  AlertTriangle,
  CalendarDays,
  DollarSign,
  FileBarChart,
  FileText,
  HelpCircle,
  KeyRound,
  Laptop,
  LayoutDashboard,
  LogOutIcon,
  Monitor,
  Moon,
  ScrollText,
  Settings,
  Shield,
  Star,
  Stethoscope,
  Sun,
  User,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

// Tipo para items do menu
type MenuItem = {
  titleKey: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
};

// Menu items para owners/admins
const ownerItems: MenuItem[] = [
  {
    titleKey: "dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "professionals",
    url: "/doctors",
    icon: Stethoscope,
  },
  {
    titleKey: "appointments",
    url: "/appointments",
    icon: CalendarDays,
  },
  {
    titleKey: "patients",
    url: "/patients",
    icon: UsersRound,
  },
  {
    titleKey: "guides",
    url: "/guides",
    icon: ScrollText,
  },
  {
    titleKey: "finance",
    url: "/finance",
    icon: DollarSign,
  },
  {
    titleKey: "reports",
    url: "/reports",
    icon: FileBarChart,
  },
];

// Menu items para profissionais (doctors)
const doctorItems: MenuItem[] = [
  {
    titleKey: "dashboard",
    url: "/professional/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "schedule",
    url: "/professional/appointments",
    icon: CalendarDays,
  },
  {
    titleKey: "inconsistencies",
    url: "/inconsistencies",
    icon: AlertTriangle,
  },
  {
    titleKey: "profile",
    url: "/profile",
    icon: User,
  },
];

// Menu items para pacientes
const patientItems: MenuItem[] = [
  {
    titleKey: "dashboard",
    url: "/patient/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "patientReports",
    url: "/patient/reports",
    icon: FileText,
    comingSoon: true,
  },
  {
    titleKey: "evaluations",
    url: "/patient/evaluations",
    icon: Star,
    comingSoon: true,
  },
  {
    titleKey: "requests",
    url: "/patient/requests",
    icon: FileText,
    comingSoon: true,
  },
  {
    titleKey: "profile",
    url: "/profile",
    icon: User,
  },
];

// Menu items para master
const masterItems: MenuItem[] = [
  {
    titleKey: "dashboard",
    url: "/master/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "manageOwners",
    url: "/master/owners",
    icon: Shield,
  },
  {
    titleKey: "manageUsers",
    url: "/master/users",
    icon: KeyRound,
  },
  {
    titleKey: "allAppointments",
    url: "/master/appointments",
    icon: CalendarDays,
  },
  {
    titleKey: "overduePayments",
    url: "/master/payment-inconsistencies",
    icon: AlertTriangle,
  },
  {
    titleKey: "profile",
    url: "/profile",
    icon: User,
  },
];

// Helper to separate bottom items
function getBottomItems(role?: string): MenuItem[] {
  const items: MenuItem[] = [];

  if (role === "master") {
    items.push({
      titleKey: "overduePayments",
      url: "/master/payment-inconsistencies",
      icon: AlertTriangle,
    });
  } else if (role === "owner" || role === "doctor") {
    items.push({
      titleKey: "inconsistencies",
      url: "/inconsistencies",
      icon: AlertTriangle,
    });
  }

  return items;
}

export function AppSidebar() {
  const path = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const { setTheme } = useTheme();
  const t = useTranslations("sidebar");
  const tCommon = useTranslations("common");
  const [version, setVersion] = useState("");

  useEffect(() => {
    fetch("/api/version")
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch(() => {});
  }, []);

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

  // Determinar qual menu mostrar baseado no role
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
  const isLoading = session.isPending || !session.data?.user;

  // Filter out bottom items from main arrays if needed
  const bottomTitleKeys = ["inconsistencies", "overduePayments"];
  const mainMenuItems = menuItems.filter(
    (item) => !bottomTitleKeys.includes(item.titleKey),
  );
  const bottomMenuItems = getBottomItems(userRole);

  return (
    <Sidebar
      collapsible="none"
      className="h-screen !w-[90px] border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="flex items-center justify-center border-b border-sidebar-border bg-gradient-to-r from-blue-50 to-purple-50 py-4 dark:from-blue-950/20 dark:to-purple-950/20">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/g-icon copy.svg"
            alt="Icone ClinixFlow"
            width={40}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="h-full px-2 py-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <div className="flex flex-col items-center gap-2 p-2">
                        <div className="bg-muted h-5 w-5 animate-pulse rounded" />
                        <div className="bg-muted h-2 w-10 animate-pulse rounded" />
                      </div>
                    </SidebarMenuItem>
                  ))
                : mainMenuItems.map((item) => {
                    const isActive = path === item.url;
                    const title = t(item.titleKey);
                    return (
                      <SidebarMenuItem key={item.titleKey}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={title}
                          className={cn(
                            "flex h-auto w-full flex-col items-center justify-center gap-1.5 rounded-lg py-2.5 transition-all",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                              : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                          )}
                        >
                          <Link href={item.url}>
                            <item.icon className="!size-5" />
                            <span className="text-[10px] leading-none">
                              {title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {bottomMenuItems.map((item) => {
                const isActive = path === item.url;
                const title = t(item.titleKey);
                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={title}
                      className={cn(
                        "flex h-auto w-full flex-col items-center justify-center gap-1.5 rounded-lg py-2.5 transition-all",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className="!size-5" />
                        <span className="text-[10px] leading-none">
                          {title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoading ? (
              <div className="flex justify-center p-2">
                <div className="bg-muted h-9 w-9 animate-pulse rounded-lg" />
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent flex aspect-square h-auto w-full items-center justify-center p-0"
                  >
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
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80 rounded-xl p-2"
                  side="right"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-3 px-2 py-3 text-left text-sm">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage
                          src={session.data?.user.image ?? undefined}
                          alt={session.data?.user.name ?? ""}
                        />
                        <AvatarFallback className="rounded-lg">
                          {session.data?.user.name
                            ? session.data.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "CN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-base font-semibold">
                          {session.data?.user.name}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {session.data?.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs font-medium tracking-wider uppercase">
                    {tCommon("teams")}
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    className="cursor-pointer gap-3 p-3"
                    asChild
                  >
                    <Link href="/dashboard">
                      <div className="bg-background flex size-8 items-center justify-center rounded-md border">
                        <LayoutDashboard className="size-5 shrink-0" />
                      </div>
                      <span className="font-medium">
                        {session.data?.user.clinic?.name || tCommon("myClinic")}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuGroup className="flex flex-col gap-1">
                    <DropdownMenuItem
                      className="cursor-pointer gap-3 p-3"
                      asChild
                    >
                      <Link href="/profile">
                        <Settings className="h-5 w-5" />
                        {tCommon("settings")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer gap-3 p-3">
                        <Monitor className="h-5 w-5" />
                        {tCommon("theme")}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          <Sun className="mr-2 h-4 w-4" />
                          {tCommon("themeLight")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          <Moon className="mr-2 h-4 w-4" />
                          {tCommon("themeDark")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          <Laptop className="mr-2 h-4 w-4" />
                          {tCommon("themeSystem")}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem className="cursor-pointer gap-3 p-3">
                      <HelpCircle className="h-5 w-5" />
                      {tCommon("help")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer gap-3 p-3 text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                  >
                    <LogOutIcon className="h-5 w-5" />
                    {tCommon("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
        {version && (
          <div
            className="text-muted-foreground mt-1 text-center"
            style={{ fontSize: "0.5rem" }}
          >
            v{version}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
