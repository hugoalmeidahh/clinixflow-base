"use client";

import { Search, User } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllUsers } from "@/src/actions/get-all-users";

import { UsersList } from "./users-list";

const ROLE_OPTIONS = [
  { value: "clinic_owner", label: "Owner (Proprietário)" },
  { value: "clinic_admin", label: "Admin" },
  { value: "clinic_gestor", label: "Gestor" },
  { value: "clinic_recepcionist", label: "Recepcionista" },
  { value: "doctor", label: "Profissional" },
  { value: "patient", label: "Paciente" },
  { value: "master", label: "Master" },
] as const;

export function UsersWithFilters() {
  const [role, setRole] = useState("");

  const { execute, result, isPending, hasSucceeded } = useAction(getAllUsers);

  const users = result?.data ?? [];

  const handleSearch = () => {
    if (!role) return;
    execute({ role: role as (typeof ROLE_OPTIONS)[number]["value"] });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtros</CardTitle>
          <CardDescription>
            Selecione o tipo de usuário para listar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium">Tipo de usuário</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearch}
              disabled={!role || isPending}
              className="w-full sm:w-auto"
            >
              <Search className="h-4 w-4 mr-2" />
              {isPending ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <User className="h-5 w-5 mr-2 animate-pulse" />
          <span>Carregando usuários...</span>
        </div>
      )}

      {!isPending && hasSucceeded && (
        <>
          <div className="text-sm text-muted-foreground text-right">
            {users.length} usuário{users.length !== 1 ? "s" : ""} encontrado
            {users.length !== 1 ? "s" : ""}
          </div>
          <UsersList users={users} />
        </>
      )}

      {!isPending && !hasSucceeded && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <User className="mb-2 h-10 w-10 opacity-30" />
          <p className="text-sm">
            Selecione o tipo de usuário para visualizar a lista
          </p>
        </div>
      )}
    </div>
  );
}
