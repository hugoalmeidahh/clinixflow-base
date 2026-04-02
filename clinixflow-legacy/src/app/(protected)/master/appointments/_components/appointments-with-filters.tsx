"use client";

import { CalendarDays, Search } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GridSelect } from "@/components/ui/grid-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAppointments } from "@/src/actions/get-all-appointments";
import { getAllPatients } from "@/src/actions/get-all-patients";

import { AllAppointmentsList } from "./all-appointments-list";

const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

type Clinic = { id: string; name: string };

interface AppointmentsWithFiltersProps {
  clinics: Clinic[];
}

export function AppointmentsWithFilters({
  clinics,
}: AppointmentsWithFiltersProps) {
  const now = new Date();
  const [clinicId, setClinicId] = useState("");
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [patientId, setPatientId] = useState("");

  const { execute, result, isPending, hasSucceeded } = useAction(getAllAppointments);

  const {
    execute: loadPatients,
    result: patientsResult,
    isPending: isLoadingPatients,
  } = useAction(getAllPatients);

  const appointments = result?.data ?? [];
  const patients = patientsResult?.data ?? [];
  const canSearch = !!clinicId && !!month && !!year;

  // Load patients whenever clinic changes
  useEffect(() => {
    setPatientId("");
    if (clinicId) loadPatients({ clinicId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicId]);

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: p.name,
    data: p,
  }));

  const handleSearch = () => {
    if (!canSearch) return;
    execute({
      clinicId,
      month: Number(month),
      year: Number(year),
      patientId: patientId || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[160px] space-y-1">
              <label className="text-xs text-muted-foreground">Clínica</label>
              <Select value={clinicId} onValueChange={(v) => setClinicId(v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {clinics.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[180px] space-y-1">
              <label className="text-xs text-muted-foreground">Paciente (opcional)</label>
              <GridSelect
                options={patientOptions}
                value={patientId}
                onValueChange={setPatientId}
                placeholder={
                  !clinicId ? "Selecione a clínica primeiro"
                    : isLoadingPatients ? "Carregando..."
                    : "Todos os pacientes"
                }
                searchPlaceholder="Buscar pelo nome..."
                emptyMessage="Nenhum paciente encontrado"
                disabled={!clinicId || isLoadingPatients}
                className="h-8 text-sm"
              />
            </div>

            <div className="w-[130px] space-y-1">
              <label className="text-xs text-muted-foreground">Mês</label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[90px] space-y-1">
              <label className="text-xs text-muted-foreground">Ano</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              size="sm"
              onClick={handleSearch}
              disabled={!canSearch || isPending}
              className="h-8"
            >
              <Search className="h-3.5 w-3.5 mr-1.5" />
              {isPending ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <CalendarDays className="h-5 w-5 mr-2 animate-pulse" />
          <span>Carregando agendamentos...</span>
        </div>
      )}

      {!isPending && hasSucceeded && (
        <>
          <div className="text-sm text-muted-foreground text-right">
            {appointments.length} agendamento
            {appointments.length !== 1 ? "s" : ""} encontrado
            {appointments.length !== 1 ? "s" : ""}
          </div>
          <AllAppointmentsList
            appointments={appointments}
            onRefresh={() =>
              execute({
                clinicId,
                month: Number(month),
                year: Number(year),
                patientId: patientId || undefined,
              })
            }
          />
        </>
      )}

      {!isPending && !hasSucceeded && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <CalendarDays className="mb-2 h-10 w-10 opacity-30" />
          <p className="text-sm">
            Selecione a clínica, o paciente e o período para buscar
          </p>
        </div>
      )}
    </div>
  );
}
