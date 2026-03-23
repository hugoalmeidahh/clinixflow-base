"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarDays,
  Check,
  Clock,
  Search,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AppointmentItem = {
  id: string;
  date: Date;
  durationInMinutes: number;
  confirmed: boolean;
  attended: boolean | null;
  appointmentPriceInCents: number;
  reposicao: boolean;
  atendimentoAvaliacao: boolean;
  guideNumber: string | null;
  createdAt: Date;
  patientName: string | null;
  doctorName: string | null;
  clinicName: string | null;
};

interface AllAppointmentsListProps {
  appointments: AppointmentItem[];
}

const getAttendanceBadge = (attended: boolean | null) => {
  if (attended === null) {
    return <Badge variant="outline">Pendente</Badge>;
  }
  if (attended) {
    return (
      <Badge className="bg-green-500">
        <Check className="mr-1 h-3 w-3" />
        Presente
      </Badge>
    );
  }
  return (
    <Badge variant="destructive">
      <X className="mr-1 h-3 w-3" />
      Faltou
    </Badge>
  );
};

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
};

export function AllAppointmentsList({
  appointments,
}: AllAppointmentsListProps) {
  const [search, setSearch] = useState("");

  const filteredAppointments = appointments.filter(
    (apt) =>
      (apt.patientName || "").toLowerCase().includes(search.toLowerCase()) ||
      (apt.doctorName || "").toLowerCase().includes(search.toLowerCase()) ||
      (apt.clinicName || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os Agendamentos</CardTitle>
        <CardDescription>
          Visualize todos os agendamentos de todas as clínicas do sistema
        </CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por paciente, profissional ou clínica..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CalendarDays className="mb-2 h-8 w-8" />
            <p>Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Data/Hora</TableHead>
                  <TableHead className="min-w-[150px]">Paciente</TableHead>
                  <TableHead className="min-w-[150px] hidden sm:table-cell">
                    Profissional
                  </TableHead>
                  <TableHead className="min-w-[130px] hidden md:table-cell">
                    Clínica
                  </TableHead>
                  <TableHead className="min-w-[70px] hidden lg:table-cell">
                    Duração
                  </TableHead>
                  <TableHead className="min-w-[90px]">Presença</TableHead>
                  <TableHead className="min-w-[90px] hidden md:table-cell">
                    Valor
                  </TableHead>
                  <TableHead className="min-w-[80px] hidden lg:table-cell">
                    Tipo
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-medium text-sm">
                            {format(new Date(apt.date), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(apt.date), "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">
                          {apt.patientName || "N/A"}
                        </span>
                      </div>
                      <div className="sm:hidden mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Stethoscope className="h-3 w-3" />
                          <span>{apt.doctorName || "N/A"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {apt.doctorName || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm">
                        {apt.clinicName || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {apt.durationInMinutes}min
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getAttendanceBadge(apt.attended)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm font-medium">
                        {formatCurrency(apt.appointmentPriceInCents)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        {apt.reposicao && (
                          <Badge variant="secondary" className="text-xs">
                            Reposição
                          </Badge>
                        )}
                        {apt.atendimentoAvaliacao && (
                          <Badge variant="secondary" className="text-xs">
                            Avaliação
                          </Badge>
                        )}
                        {!apt.reposicao && !apt.atendimentoAvaliacao && (
                          <span className="text-xs text-muted-foreground">
                            Regular
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
