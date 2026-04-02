"use client";

import { Search, Users } from "lucide-react";
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
import { getAllPatients } from "@/src/actions/get-all-patients";

import { AllPatientsList } from "./all-patients-list";

type Clinic = { id: string; name: string };

interface PatientsWithFiltersProps {
  clinics: Clinic[];
}

export function PatientsWithFilters({ clinics }: PatientsWithFiltersProps) {
  const [clinicId, setClinicId] = useState("");

  const { execute, result, isPending, hasSucceeded } = useAction(getAllPatients);

  const patients = result?.data ?? [];

  const handleSearch = () => {
    if (!clinicId) return;
    execute({ clinicId });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtros</CardTitle>
          <CardDescription>
            Selecione a clínica para listar os pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium">Clínica</label>
              <Select value={clinicId} onValueChange={setClinicId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a clínica..." />
                </SelectTrigger>
                <SelectContent>
                  {clinics.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearch}
              disabled={!clinicId || isPending}
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
          <Users className="h-5 w-5 mr-2 animate-pulse" />
          <span>Carregando pacientes...</span>
        </div>
      )}

      {!isPending && hasSucceeded && (
        <>
          <div className="text-sm text-muted-foreground text-right">
            {patients.length} paciente{patients.length !== 1 ? "s" : ""}{" "}
            encontrado{patients.length !== 1 ? "s" : ""}
          </div>
          <AllPatientsList patients={patients} onRefresh={() => execute({ clinicId })} />
        </>
      )}

      {!isPending && !hasSucceeded && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Users className="mb-2 h-10 w-10 opacity-30" />
          <p className="text-sm">
            Selecione uma clínica para visualizar os pacientes
          </p>
        </div>
      )}
    </div>
  );
}
