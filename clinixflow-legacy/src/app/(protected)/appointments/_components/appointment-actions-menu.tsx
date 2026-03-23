"use client";

import {
  CheckCircle2,
  ClipboardList,
  Edit,
  FileText,
  MoreVertical,
  TrashIcon,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appointmentsTable } from "@/src/db/schema";

import { DeleteAppointmentDialog } from "./delete-appointment-dialog";

// Tipo que aceita tanto campos opcionais quanto obrigatórios
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

// Tipo completo usado em weekly-calendar-view e outros componentes
type AppointmentWithRelationsFull = typeof appointmentsTable.$inferSelect & {
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

// Callback que aceita explicitamente o tipo completo
// Isso permite que callbacks que esperam o tipo completo sejam passados
type AppointmentCallback = (appointment: AppointmentWithRelationsFull) => void;

interface AppointmentActionsMenuProps {
  appointment: AppointmentWithRelations | AppointmentWithRelationsFull;
  onAttendClick: AppointmentCallback;
  onPresenceClick: AppointmentCallback;
  onEvolutionClick: AppointmentCallback;
  onConfirmationClick: AppointmentCallback;
  onEditClick?: AppointmentCallback;
  triggerAsChild?: boolean; // Se true, permite que o trigger seja passado como child
  triggerClassName?: string; // Classe customizada para o trigger
}

const AppointmentActionsMenu = ({
  appointment,
  onAttendClick,
  onPresenceClick,
  onEvolutionClick,
  onConfirmationClick,
  onEditClick,
  triggerAsChild = false,
  triggerClassName,
}: AppointmentActionsMenuProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          asChild={triggerAsChild}
          className={triggerClassName}
        >
          {triggerAsChild ? (
            <div className="h-full w-full" />
          ) : (
            <button
              className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {
              onAttendClick(appointment as AppointmentWithRelationsFull);
              setOpen(false);
            }}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Atendimento
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onPresenceClick(appointment as AppointmentWithRelationsFull);
              setOpen(false);
            }}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Presença
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onEvolutionClick(appointment as AppointmentWithRelationsFull);
              setOpen(false);
            }}
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
          <DropdownMenuItem
            onClick={() => {
              onConfirmationClick(appointment as AppointmentWithRelationsFull);
              setOpen(false);
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirmação
          </DropdownMenuItem>
          {onEditClick && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  onEditClick(appointment as AppointmentWithRelationsFull);
                  setOpen(false);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </>
          )}
          {appointment.patientId && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/professional/patient-records/${appointment.patientId}${appointment.id ? `?appointmentId=${appointment.id}` : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Prontuário
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setOpen(false);
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
        appointment={appointment as AppointmentWithRelationsFull}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
};

export default AppointmentActionsMenu;
