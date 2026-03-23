"use client";

import { CalendarIcon, ClockIcon, Loader2, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { deleteDoctor } from "@/src/actions/delete-doctor";
import { doctorsTable } from "@/src/db/schema";

import { getAvailability } from "../_helpers/availability";
import UpsertDoctorForm from "./upsert-doctor-form";

interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect & {
    clinic?: {
      id: string;
      name: string;
      clinicCode: string;
    } | null;
  };
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const t = useTranslations("doctors");
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    useState(false);
  const deleteDoctorAction = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success(t("deletedSuccess"));
    },
    onError: () => {
      toast.error(t("deletedError"));
    },
  });
  const handleDeleteDoctorClick = () => {
    if (!doctor) return;
    deleteDoctorAction.execute({ id: doctor.id });
  };

  const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name[0])
    .join("");
  const availability = getAvailability(doctor);

  return (
    <Card className="border-border shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarImage src={doctor.avatarImageUrl ?? ""} alt={doctor.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {doctorInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {doctor.name}
            </h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline" className="border-border">
          <CalendarIcon className="mr-1 h-3 w-3" />
          {availability.from.format("dddd")} {t("to")} {availability.to.format("dddd")}
        </Badge>
        <Badge variant="outline" className="border-border">
          <ClockIcon className="mr-1 h-3 w-3" />
          {availability.from.format("HH:mm")} {t("until")}{" "}
          {availability.to.format("HH:mm")}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog
          open={isUpsertDoctorDialogOpen}
          onOpenChange={setIsUpsertDoctorDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">{t("viewDetails")}</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            key={isUpsertDoctorDialogOpen ? doctor.id : undefined}
            doctor={{
              ...doctor,
              availableFromTime: availability.from.format("HH:mm:ss"),
              availableToTime: availability.to.format("HH:mm:ss"),
            }}
            onSuccess={() => setIsUpsertDoctorDialogOpen(false)}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Trash2Icon className="text-red-500" />
              {t("deleteButton")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("deleteConfirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteConfirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteDoctorAction.isPending}>
                {t("buttons.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDoctorClick}
                disabled={deleteDoctorAction.isPending}
              >
                {deleteDoctorAction.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("deleting")}
                  </>
                ) : (
                  t("buttons.delete")
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
