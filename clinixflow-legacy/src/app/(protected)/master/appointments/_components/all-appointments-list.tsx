"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarDays,
  Check,
  Clock,
  Pencil,
  Scissors,
  Search,
  Stethoscope,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { masterBulkDeleteAppointments } from "@/src/actions/master-bulk-delete-appointments";
import { masterDeleteAppointment } from "@/src/actions/master-delete-appointment";
import { masterSplitAppointment } from "@/src/actions/master-split-appointment";
import { masterUpdateAppointmentDate } from "@/src/actions/master-update-appointment-date";
import { formatLocalDateTime } from "@/src/lib/date-utils";

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
  onRefresh?: () => void;
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
  onRefresh,
}: AllAppointmentsListProps) {
  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<AppointmentItem | null>(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [editTarget, setEditTarget] = useState<AppointmentItem | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [splitTarget, setSplitTarget] = useState<AppointmentItem | null>(null);
  const [slot1Date, setSlot1Date] = useState("");
  const [slot1Time, setSlot1Time] = useState("");
  const [slot1Duration, setSlot1Duration] = useState("");
  const [slot2Date, setSlot2Date] = useState("");
  const [slot2Time, setSlot2Time] = useState("");
  const [slot2Duration, setSlot2Duration] = useState("");

  const { execute: executeDelete, isPending: isDeleting } = useAction(
    masterDeleteAppointment,
    {
      onSuccess: ({ input }) => {
        toast.success("Agendamento excluído com sucesso");
        setLocalAppointments((prev) => prev.filter((a) => a.id !== input.id));
        setSelected((prev) => { const next = new Set(prev); next.delete(input.id); return next; });
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(err.error?.serverError || "Erro ao excluir agendamento");
      },
    },
  );

  const { execute: executeBulkDelete, isPending: isBulkDeleting } = useAction(
    masterBulkDeleteAppointments,
    {
      onSuccess: (result) => {
        const deleted = result.data?.deleted ?? 0;
        setLocalAppointments((prev) => prev.filter((a) => !selected.has(a.id)));
        setSelected(new Set());
        setShowBulkConfirm(false);
        toast.success(`${deleted} agendamento(s) excluído(s) com sucesso`);
      },
      onError: (err) => {
        toast.error(err.error?.serverError || "Erro ao excluir agendamentos");
      },
    },
  );

  const { execute: executeUpdate, isPending: isUpdating } = useAction(
    masterUpdateAppointmentDate,
    {
      onSuccess: () => {
        toast.success("Horário atualizado com sucesso");
        setEditTarget(null);
        onRefresh?.();
      },
      onError: (err) => {
        toast.error(err.error?.serverError || "Erro ao atualizar horário");
      },
    },
  );

  const { execute: executeSplit, isPending: isSplitting } = useAction(
    masterSplitAppointment,
    {
      onSuccess: () => {
        toast.success("Agendamento quebrado com sucesso");
        setSplitTarget(null);
        onRefresh?.();
      },
      onError: (err) => {
        toast.error(err.error?.serverError || "Erro ao quebrar agendamento");
      },
    },
  );

  const filteredAppointments = localAppointments.filter(
    (apt) =>
      (apt.patientName || "").toLowerCase().includes(search.toLowerCase()) ||
      (apt.doctorName || "").toLowerCase().includes(search.toLowerCase()) ||
      (apt.clinicName || "").toLowerCase().includes(search.toLowerCase()),
  );

  const allVisibleSelected =
    filteredAppointments.length > 0 &&
    filteredAppointments.every((a) => selected.has(a.id));

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filteredAppointments.forEach((a) => next.delete(a.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filteredAppointments.forEach((a) => next.add(a.id));
        return next;
      });
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openEditDialog = (apt: AppointmentItem) => {
    const localDate = formatLocalDateTime(apt.date, "YYYY-MM-DD");
    const localTime = formatLocalDateTime(apt.date, "HH:mm");
    setEditDate(localDate);
    setEditTime(localTime);
    setEditTarget(apt);
  };

  const openSplitDialog = (apt: AppointmentItem) => {
    const localDate = formatLocalDateTime(apt.date, "YYYY-MM-DD");
    const localTime = formatLocalDateTime(apt.date, "HH:mm");
    const half = Math.floor(apt.durationInMinutes / 2);
    setSlot1Date(localDate);
    setSlot1Time(localTime);
    setSlot1Duration(String(half));
    const [hh, mm] = localTime.split(":").map(Number);
    const totalMins = hh * 60 + mm + half;
    const slot2H = String(Math.floor(totalMins / 60) % 24).padStart(2, "0");
    const slot2M = String(totalMins % 60).padStart(2, "0");
    setSlot2Date(localDate);
    setSlot2Time(`${slot2H}:${slot2M}`);
    setSlot2Duration(String(apt.durationInMinutes - half));
    setSplitTarget(apt);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Todos os Agendamentos</CardTitle>
              <CardDescription>
                Visualize, edite ou exclua agendamentos de todas as clínicas
              </CardDescription>
            </div>
            {selected.size > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-muted-foreground">
                  {selected.size} selecionado{selected.size !== 1 ? "s" : ""}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowBulkConfirm(true)}
                  disabled={isBulkDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir selecionados
                </Button>
              </div>
            )}
          </div>
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
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={allVisibleSelected}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
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
                    <TableHead className="min-w-[90px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((apt) => (
                    <TableRow
                      key={apt.id}
                      data-state={selected.has(apt.id) ? "selected" : undefined}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selected.has(apt.id)}
                          onCheckedChange={() => toggleOne(apt.id)}
                        />
                      </TableCell>
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
                              {formatLocalDateTime(apt.date, "HH:mm")}
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title="Ajustar horário"
                            onClick={() => openEditDialog(apt)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-orange-500"
                            title="Quebrar horário em dois"
                            onClick={() => openSplitDialog(apt)}
                          >
                            <Scissors className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Excluir agendamento"
                            onClick={() => setDeleteTarget(apt)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Single delete */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir agendamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Agendamento de{" "}
              <strong>{deleteTarget?.patientName || "N/A"}</strong> em{" "}
              <strong>
                {deleteTarget
                  ? format(new Date(deleteTarget.date), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })
                  : ""}
              </strong>{" "}
              na clínica <strong>{deleteTarget?.clinicName || "N/A"}</strong>.
              <br />
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteTarget && executeDelete({ id: deleteTarget.id })
              }
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete */}
      <AlertDialog
        open={showBulkConfirm}
        onOpenChange={(open) => !open && setShowBulkConfirm(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {selected.size} agendamento(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              Os agendamentos selecionados serão permanentemente excluídos.
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => executeBulkDelete({ ids: [...selected] })}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? "Excluindo..." : `Excluir ${selected.size}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Split appointment dialog */}
      <Dialog
        open={!!splitTarget}
        onOpenChange={(open) => !open && setSplitTarget(null)}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Quebrar Horário
            </DialogTitle>
            <DialogDescription>
              Paciente: <strong>{splitTarget?.patientName || "N/A"}</strong>
              <br />
              Duração original: <strong>{splitTarget?.durationInMinutes}min</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="border rounded-md p-3 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Atendimento 1</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 space-y-1">
                  <Label htmlFor="s1-date">Data</Label>
                  <Input
                    id="s1-date"
                    type="date"
                    value={slot1Date}
                    onChange={(e) => setSlot1Date(e.target.value)}
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <Label htmlFor="s1-time">Horário</Label>
                  <Input
                    id="s1-time"
                    type="time"
                    value={slot1Time}
                    onChange={(e) => setSlot1Time(e.target.value)}
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <Label htmlFor="s1-duration">Duração (min)</Label>
                  <Input
                    id="s1-duration"
                    type="number"
                    min={1}
                    value={slot1Duration}
                    onChange={(e) => setSlot1Duration(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="border rounded-md p-3 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Atendimento 2 (novo)</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 space-y-1">
                  <Label htmlFor="s2-date">Data</Label>
                  <Input
                    id="s2-date"
                    type="date"
                    value={slot2Date}
                    onChange={(e) => setSlot2Date(e.target.value)}
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <Label htmlFor="s2-time">Horário</Label>
                  <Input
                    id="s2-time"
                    type="time"
                    value={slot2Time}
                    onChange={(e) => setSlot2Time(e.target.value)}
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <Label htmlFor="s2-duration">Duração (min)</Label>
                  <Input
                    id="s2-duration"
                    type="number"
                    min={1}
                    value={slot2Duration}
                    onChange={(e) => setSlot2Duration(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSplitTarget(null)}>
              Cancelar
            </Button>
            <Button
              disabled={
                isSplitting ||
                !slot1Date || !slot1Time || !slot1Duration ||
                !slot2Date || !slot2Time || !slot2Duration
              }
              onClick={() =>
                splitTarget &&
                executeSplit({
                  appointmentId: splitTarget.id,
                  slot1Date,
                  slot1Time,
                  slot1Duration: Number(slot1Duration),
                  slot2Date,
                  slot2Time,
                  slot2Duration: Number(slot2Duration),
                })
              }
            >
              {isSplitting ? "Quebrando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit date/time dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Ajustar Horário
            </DialogTitle>
            <DialogDescription>
              Paciente: <strong>{editTarget?.patientName || "N/A"}</strong>
              <br />
              Clínica: <strong>{editTarget?.clinicName || "N/A"}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-date">Data</Label>
              <Input
                id="edit-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-time">Horário</Label>
              <Input
                id="edit-time"
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              disabled={isUpdating || !editDate || !editTime}
              onClick={() =>
                editTarget &&
                executeUpdate({
                  appointmentId: editTarget.id,
                  date: editDate,
                  time: editTime,
                })
              }
            >
              {isUpdating ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
