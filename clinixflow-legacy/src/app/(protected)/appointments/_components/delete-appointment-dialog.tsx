"use client";

import { Loader2, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { deleteAppointment } from "@/src/actions/delete-appointment";
import { getRelatedAppointments } from "@/src/actions/get-related-appointments";
import { appointmentsTable } from "@/src/db/schema";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
  } | null;
  doctor: {
    id: string;
    name: string;
  } | null;
};

interface DeleteAppointmentDialogProps {
  appointment: AppointmentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: DeleteAppointmentDialogProps) {
  const t = useTranslations("appointments");
  const [deleteOption, setDeleteOption] = useState<"single" | "all">("single");
  const [hasEvolution, setHasEvolution] = useState(false);
  const [futureAppointmentsCount, setFutureAppointmentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getRelatedAction = useAction(getRelatedAppointments, {
    onSuccess: ({ data }) => {
      if (data) {
        setHasEvolution(data.hasEvolution);
        setFutureAppointmentsCount(data.futureAppointmentsCount);
      }
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
      toast.error(t("errorCheckingAppointment"));
    },
  });

  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success(
        deleteOption === "all"
          ? t("futureAppointmentsDeleted")
          : t("appointmentDeleted"),
      );
      onOpenChange(false);
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || t("errorDeletingAppointment"));
    },
  });

  useEffect(() => {
    if (open && appointment?.id) {
      setIsLoading(true);
      setDeleteOption("single");
      getRelatedAction.execute({ appointmentId: appointment.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, appointment?.id]);

  const handleDelete = () => {
    if (!appointment) return;
    deleteAppointmentAction.execute({
      id: appointment.id,
      deleteAllFuture: deleteOption === "all",
    });
  };

  if (!appointment) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-muted-foreground text-sm">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("checkingAppointment")}
                </span>
              ) : hasEvolution ? (
                <span className="text-destructive font-medium">
                  {t("hasEvolutionCannotDelete")}
                </span>
              ) : futureAppointmentsCount > 1 ? (
                <div className="space-y-4">
                  <p>
                    {t("futureAppointmentsFound", {
                      count: futureAppointmentsCount,
                    })}
                  </p>
                  <RadioGroup
                    value={deleteOption}
                    onValueChange={(value) =>
                      setDeleteOption(value as "single" | "all")
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single" />
                      <Label htmlFor="single">{t("deleteSingleOption")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">
                        {t("deleteAllFutureOption", {
                          count: futureAppointmentsCount,
                        })}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ) : (
                <p>{t("deleteConfirmAction")}</p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteAppointmentAction.isPending}>
            {t("cancel")}
          </AlertDialogCancel>
          {!hasEvolution && !isLoading && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteAppointmentAction.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAppointmentAction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                <>
                  <TrashIcon className="mr-2 h-4 w-4" />
                  {t("delete")}
                </>
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
