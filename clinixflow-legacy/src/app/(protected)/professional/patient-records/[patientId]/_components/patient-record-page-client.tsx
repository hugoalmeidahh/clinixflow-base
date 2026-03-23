"use client";

import { Eye, Pencil, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appointmentsTable, patientRecordsTable } from "@/src/db/schema";
import { formatLocalDateTime } from "@/src/lib/date-utils";

import { EvolutionModal } from "./evolution-modal";
import { ViewEvolutionModal } from "./view-evolution-modal";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient?: {
    id: string;
    name: string;
  } | null;
  doctor?: {
    id: string;
    name: string;
  } | null;
};

type PatientRecord = typeof patientRecordsTable.$inferSelect & {
  appointment?: {
    id: string;
    date: Date | string;
  } | null;
  doctor?: {
    id: string;
    name: string;
    specialty?: string | null;
  } | null;
};

interface PatientRecordPageClientProps {
  patient: {
    id: string;
    name: string;
    email?: string | null;
    phoneNumber?: string | null;
    birthDate: Date;
    sex?: "male" | "female" | null;
    insurance?: string | null;
    cpf?: string | null;
    rg?: string | null;
    address?: string | null;
    number?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    state?: string | null;
    patientRecordNumber?: string | null;
  };
  records: PatientRecord[];
  appointments: Appointment[];
  doctorId?: string; // Opcional para owners
  clinicId: string;
  selectedAppointmentId?: string | null;
  selectedRecordId?: string | null;
}

export function PatientRecordPageClient({
  patient,
  records,
  appointments,
  doctorId,
  clinicId,
  selectedAppointmentId,
  selectedRecordId,
}: PatientRecordPageClientProps) {
  const [evolutionModalOpen, setEvolutionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(
      selectedAppointmentId
        ? appointments.find((a) => a.id === selectedAppointmentId) || null
        : null,
    );
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(
    selectedRecordId
      ? records.find((r) => r.id === Number(selectedRecordId)) || null
      : null,
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<PatientRecord | null>(null);

  // Filtrar agendamentos abertos (com presença confirmada mas sem evolução)
  const openAppointments = appointments.filter((apt) => {
    if (apt.attended !== true) return false;
    // Verificar se já tem evolução
    const hasRecord = records.some((r) => r.appointmentId === apt.id);
    return !hasRecord;
  });

  const handleOpenEvolutionModal = (
    appointment?: Appointment | null,
    record?: PatientRecord | null,
  ) => {
    if (appointment) {
      setSelectedAppointment(appointment);
    }
    if (record) {
      setSelectedRecord(record);
      // Encontrar o agendamento relacionado ao registro
      const relatedAppointment = appointments.find(
        (a) => a.id === record.appointmentId,
      );
      if (relatedAppointment) {
        setSelectedAppointment(relatedAppointment);
      }
    }
    setEvolutionModalOpen(true);
  };

  const handleViewEvolution = (record: PatientRecord) => {
    setViewRecord(record);
    setViewModalOpen(true);
  };

  const handleEvolutionSuccess = () => {
    setEvolutionModalOpen(false);
    setSelectedAppointment(null);
    setSelectedRecord(null);
    // Recarregar a página para atualizar os dados
    window.location.reload();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Prontuário #{patient.patientRecordNumber || "N/A"} -{" "}
              {patient.name}
            </h2>
            <p className="text-muted-foreground">
              Dados do paciente e histórico de evoluções
            </p>
          </div>
          {doctorId && openAppointments.length > 0 && (
            <Button onClick={() => handleOpenEvolutionModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Evolução
            </Button>
          )}
        </div>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList>
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="evolucoes">Evoluções</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <div className="text-muted-foreground text-sm font-medium">
                      Nome
                    </div>
                    <div className="text-base">{patient.name}</div>
                  </div>
                  {patient.email && (
                    <div>
                      <div className="text-muted-foreground text-sm font-medium">
                        Email
                      </div>
                      <div className="text-base">{patient.email}</div>
                    </div>
                  )}
                  {patient.phoneNumber && (
                    <div>
                      <div className="text-muted-foreground text-sm font-medium">
                        Telefone
                      </div>
                      <div className="text-base">{patient.phoneNumber}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-muted-foreground text-sm font-medium">
                      Data de Nascimento
                    </div>
                    <div className="text-base">
                      {new Date(patient.birthDate).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  {patient.sex && (
                    <div>
                      <div className="text-muted-foreground text-sm font-medium">
                        Sexo
                      </div>
                      <div className="text-base">
                        {patient.sex === "male" ? "Masculino" : "Feminino"}
                      </div>
                    </div>
                  )}
                  {patient.insurance && (
                    <div>
                      <div className="text-muted-foreground text-sm font-medium">
                        Convênio
                      </div>
                      <div className="text-base">{patient.insurance}</div>
                    </div>
                  )}
                  {patient.cpf && (
                    <div>
                      <div className="text-muted-foreground text-sm font-medium">
                        CPF
                      </div>
                      <div className="text-base">{patient.cpf}</div>
                    </div>
                  )}
                  {patient.rg && (
                    <div>
                      <div className="text-muted-foreground text-sm font-medium">
                        RG
                      </div>
                      <div className="text-base">{patient.rg}</div>
                    </div>
                  )}
                  {patient.address && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <div className="text-muted-foreground text-sm font-medium">
                        Endereço
                      </div>
                      <div className="text-base">
                        {patient.address}
                        {patient.number && `, ${patient.number}`}
                        {patient.neighborhood && ` - ${patient.neighborhood}`}
                        {patient.city && `, ${patient.city}`}
                        {patient.state && ` - ${patient.state}`}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolucoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Histórico de Evoluções</span>
                  {doctorId && openAppointments.length > 0 && (
                    <Button
                      onClick={() => handleOpenEvolutionModal()}
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Evolução
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {records.length === 0 ? (
                  <div className="rounded-lg border p-8 text-center">
                    <p className="text-muted-foreground">
                      Nenhuma evolução registrada ainda.
                    </p>
                    {doctorId && openAppointments.length > 0 && (
                      <Button
                        onClick={() => handleOpenEvolutionModal()}
                        className="mt-4"
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Primeira Evolução
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Evolução</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {record.appointment?.date
                              ? formatLocalDateTime(
                                  record.appointment.date,
                                  "DD/MM/YYYY [às] HH:mm",
                                )
                              : formatLocalDateTime(
                                  record.createdAt,
                                  "DD/MM/YYYY [às] HH:mm",
                                )}
                          </TableCell>
                          <TableCell>
                            {record.firstConsultation ? (
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Avaliação
                              </span>
                            ) : (
                              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                Evolução
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate">{record.content}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewEvolution(record)}
                                title="Visualizar"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {doctorId && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleOpenEvolutionModal(null, record)
                                  }
                                  title="Editar"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {doctorId && (
        <EvolutionModal
          open={evolutionModalOpen}
          onOpenChange={setEvolutionModalOpen}
          patientId={patient.id}
          doctorId={doctorId}
          clinicId={clinicId}
          appointments={openAppointments}
          selectedAppointment={selectedAppointment || undefined}
          lockedAppointment={!!selectedAppointmentId || !!selectedRecordId}
          existingRecordId={
            selectedRecord?.id ? String(selectedRecord.id) : null
          }
          onSuccess={handleEvolutionSuccess}
        />
      )}

      <ViewEvolutionModal
        record={viewRecord}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
    </>
  );
}
