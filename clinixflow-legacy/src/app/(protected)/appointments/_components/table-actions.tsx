"use client";

import {
  CheckCircle2,
  ClipboardList,
  Edit,
  FileText,
  MoreVerticalIcon,
  TrashIcon,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appointmentsTable } from "@/src/db/schema";

import { DeleteAppointmentDialog } from "./delete-appointment-dialog";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    sex?: "male" | "female";
  } | null;
  doctor: {
    id: string;
    name: string;
    specialty?: string | null;
  } | null;
};

interface AppointmentsTableActionsProps {
  appointment: AppointmentWithRelations;
  onAttendClick?: (appointment: AppointmentWithRelations) => void;
  onPresenceClick?: (appointment: AppointmentWithRelations) => void;
  onEvolutionClick?: (appointment: AppointmentWithRelations) => void;
  onConfirmationClick?: (appointment: AppointmentWithRelations) => void;
  onEditClick?: (appointment: AppointmentWithRelations) => void;
}

const AppointmentsTableActions = ({
  appointment,
  onAttendClick,
  onPresenceClick,
  onEvolutionClick,
  onConfirmationClick,
  onEditClick,
}: AppointmentsTableActionsProps) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {appointment.patient ? appointment.patient.name : "-"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {onAttendClick && (
            <DropdownMenuItem onClick={() => onAttendClick(appointment)}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Atendimento
            </DropdownMenuItem>
          )}
          {onPresenceClick && (
            <DropdownMenuItem onClick={() => onPresenceClick(appointment)}>
              <UserCheck className="mr-2 h-4 w-4" />
              Presença
            </DropdownMenuItem>
          )}
          {onEvolutionClick && (
            <DropdownMenuItem
              onClick={() => onEvolutionClick(appointment)}
              disabled={appointment.attended !== true}
              className={
                appointment.attended !== true
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              Evolução
              {appointment.attended !== true && (
                <span className="text-muted-foreground ml-auto text-xs">
                  (Requer presença)
                </span>
              )}
            </DropdownMenuItem>
          )}
          {onConfirmationClick && (
            <DropdownMenuItem onClick={() => onConfirmationClick(appointment)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmação
            </DropdownMenuItem>
          )}
          {onEditClick && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEditClick(appointment)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </>
          )}
          {appointment.patientId && (
            <DropdownMenuItem asChild>
              <Link
                href={`/professional/patient-records/${appointment.patientId}${appointment.id ? `?appointmentId=${appointment.id}` : ""}`}
              >
                <FileText className="mr-2 h-4 w-4" />
                Prontuário
              </Link>
            </DropdownMenuItem>
          )}
          {(onAttendClick ||
            onPresenceClick ||
            onEvolutionClick ||
            onConfirmationClick ||
            appointment.patientId) && <DropdownMenuSeparator />}
          <DropdownMenuItem
            onClick={() => {
              setMenuOpen(false);
              setDeleteDialogOpen(true);
            }}
            className="text-destructive focus:text-destructive"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAppointmentDialog
        appointment={appointment}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
};

export default AppointmentsTableActions;
