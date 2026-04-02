"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Trash2, UserRound, Users } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { masterBulkDeletePatients } from "@/src/actions/master-bulk-delete-patients";
import { masterDeletePatient } from "@/src/actions/master-delete-patient";

type PatientItem = {
  id: string;
  patientCode: string | null;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  cpf: string | null;
  birthDate: Date | null;
  sex: "male" | "female" | null;
  isActive: boolean;
  createdAt: Date;
  clinicId: string | null;
  clinicName: string | null;
};

interface AllPatientsListProps {
  patients: PatientItem[];
  onRefresh?: () => void;
}

export function AllPatientsList({ patients }: AllPatientsListProps) {
  const [localPatients, setLocalPatients] = useState(patients);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<PatientItem | null>(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const { execute: executeDelete, isPending: isDeleting } = useAction(
    masterDeletePatient,
    {
      onSuccess: ({ input }) => {
        toast.success("Paciente excluído com sucesso");
        setLocalPatients((prev) => prev.filter((p) => p.id !== input.id));
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(err.error?.serverError || "Erro ao excluir paciente");
      },
    },
  );

  const { execute: executeBulkDelete, isPending: isBulkDeleting } = useAction(
    masterBulkDeletePatients,
    {
      onSuccess: (result) => {
        const { deleted, skipped, skippedIds } = result.data ?? { deleted: 0, skipped: 0, skippedIds: [] };
        setLocalPatients((prev) =>
          prev.filter((p) => (skippedIds ?? []).includes(p.id) || !selected.has(p.id)),
        );
        setSelected(new Set());
        setShowBulkConfirm(false);
        if (skipped && skipped > 0) {
          toast.warning(
            `${deleted} paciente(s) excluído(s). ${skipped} não puderam ser excluídos pois possuem agendamentos vinculados.`,
          );
        } else {
          toast.success(`${deleted} paciente(s) excluído(s) com sucesso`);
        }
      },
      onError: (err) => {
        toast.error(err.error?.serverError || "Erro ao excluir pacientes");
      },
    },
  );

  const filteredPatients = localPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.cpf || "").replace(/\D/g, "").includes(search.replace(/\D/g, "")) ||
      (p.clinicName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.patientCode || "").toLowerCase().includes(search.toLowerCase()),
  );

  const allVisibleSelected =
    filteredPatients.length > 0 &&
    filteredPatients.every((p) => selected.has(p.id));

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filteredPatients.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filteredPatients.forEach((p) => next.add(p.id));
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Todos os Pacientes</CardTitle>
              <CardDescription>
                Visualize e gerencie pacientes de todas as clínicas do sistema
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
              placeholder="Buscar por nome, e-mail, CPF, código ou clínica..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="mb-2 h-8 w-8" />
              <p>Nenhum paciente encontrado</p>
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
                    <TableHead className="min-w-[160px]">Paciente</TableHead>
                    <TableHead className="min-w-[130px] hidden sm:table-cell">
                      Clínica
                    </TableHead>
                    <TableHead className="min-w-[120px] hidden md:table-cell">
                      CPF
                    </TableHead>
                    <TableHead className="min-w-[140px] hidden md:table-cell">
                      Telefone
                    </TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">
                      Nascimento
                    </TableHead>
                    <TableHead className="min-w-[80px] hidden lg:table-cell">
                      Sexo
                    </TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="min-w-[110px] hidden xl:table-cell">
                      Cadastrado em
                    </TableHead>
                    <TableHead className="min-w-[60px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow
                      key={patient.id}
                      data-state={selected.has(patient.id) ? "selected" : undefined}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selected.has(patient.id)}
                          onCheckedChange={() => toggleOne(patient.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div>
                            <div className="font-medium text-sm">
                              {patient.name}
                            </div>
                            {patient.patientCode && (
                              <div className="text-xs text-muted-foreground">
                                #{patient.patientCode}
                              </div>
                            )}
                            <div className="sm:hidden text-xs text-muted-foreground mt-0.5">
                              {patient.clinicName || "—"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm">
                          {patient.clinicName || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm font-mono">
                          {patient.cpf || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">
                          {patient.phoneNumber || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">
                          {patient.birthDate
                            ? format(new Date(patient.birthDate), "dd/MM/yyyy", {
                                locale: ptBR,
                              })
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">
                          {patient.sex === "male"
                            ? "Masc."
                            : patient.sex === "female"
                              ? "Fem."
                              : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {patient.isActive ? (
                          <Badge className="bg-green-500 text-xs">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(patient.createdAt), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(patient)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
            <AlertDialogTitle>Excluir paciente?</AlertDialogTitle>
            <AlertDialogDescription>
              O paciente <strong>{deleteTarget?.name}</strong> da clínica{" "}
              <strong>{deleteTarget?.clinicName || "N/A"}</strong> será
              permanentemente excluído.
              <br />
              <br />
              Pacientes com agendamentos vinculados não podem ser excluídos.
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
            <AlertDialogTitle>Excluir {selected.size} paciente(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              Os pacientes selecionados serão permanentemente excluídos.
              <br />
              Pacientes com agendamentos vinculados serão ignorados automaticamente.
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
    </>
  );
}
