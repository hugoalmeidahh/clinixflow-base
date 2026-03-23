"use client";

import { Building2, Check, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function ClinicSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Garantir que o componente só renderize conteúdo dinâmico após montagem no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Evitar renderização durante hidratação para evitar mismatch servidor/cliente
  if (!isMounted || !session.data?.user) {
    return (
      <Button
        variant="outline"
        className="h-9 gap-2 shadow-sm"
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="font-medium">Carregando...</span>
      </Button>
    );
  }

  const activeClinicId =
    searchParams.get("clinic") || session.data?.user.clinic?.id;
  const availableClinics = session.data?.user.availableClinics || [];
  const userRole = session.data?.user.role;

  // Pacientes e master não devem ver o seletor de clínica
  if (userRole === "patient" || userRole === "master") {
    return null;
  }

  if (availableClinics.length === 0) {
    return null;
  }

  const activeClinic =
    availableClinics.find((c) => c.id === activeClinicId) ||
    availableClinics[0];

  const handleSwitchClinic = (clinicId: string) => {
    setIsNavigating(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("clinic", clinicId);
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
    // Reset loading state after navigation
    setTimeout(() => setIsNavigating(false), 500);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 gap-2 shadow-sm",
            isNavigating && "opacity-50 cursor-not-allowed",
          )}
          disabled={isNavigating}
        >
          {isNavigating ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Building2 className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium">
            {isNavigating
              ? "Carregando..."
              : activeClinic?.name || "Selecionar Clínica"}
          </span>
          {availableClinics.length > 1 && !isNavigating && (
            <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {availableClinics.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground">TROCAR CLÍNICA</p>
        </div>
        <DropdownMenuSeparator />

        {availableClinics.map((clinic) => {
          if (!clinic.id) return null;
          const isActive = clinic.id === activeClinicId;
          const roleLabel =
            {
              owner: "Proprietário",
              doctor: "Profissional",
              patient: "Paciente",
            }[clinic.role] || clinic.role;

          return (
            <DropdownMenuItem
              key={clinic.id}
              onClick={() => handleSwitchClinic(clinic.id!)}
              disabled={isNavigating}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2",
                isActive && "bg-accent hover:bg-accent/80",
                isNavigating && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Building2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {clinic.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{roleLabel}</p>
                </div>
              </div>
              {isActive && (
                <Check className="h-4 w-4 flex-shrink-0 text-blue-600" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
