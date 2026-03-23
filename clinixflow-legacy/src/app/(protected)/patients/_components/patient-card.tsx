"use client";

import { Mail, Phone, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { patientsTable } from "@/src/db/schema";

import UpsertPatientForm from "./upsert-patient-form";

interface PatientCardProps {
  patient: typeof patientsTable.$inferSelect;
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const t = useTranslations("patients");
  const [isUpsertPatientDialogOpen, setIsUpsertPatientDialogOpen] =
    useState(false);

  const patientInitials = patient.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");
    // Format as (XX) XXXXX-XXXX
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getSexLabel = (sex: "male" | "female") => {
    return sex === "male" ? t("male") : t("female");
  };

  return (
    <Card className="border-border shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {patientInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {patient.name}
            </h3>
            <p className="text-sm text-muted-foreground">{getSexLabel(patient.sex)}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline" className="border-border">
          <Mail className="mr-1 h-3 w-3" />
          {patient.email}
        </Badge>
        <Badge variant="outline" className="border-border">
          <Phone className="mr-1 h-3 w-3" />
          {formatPhoneNumber(patient.phoneNumber)}
        </Badge>
        <Badge variant="outline" className="border-border">
          <User className="mr-1 h-3 w-3" />
          {getSexLabel(patient.sex)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog
          open={isUpsertPatientDialogOpen}
          onOpenChange={setIsUpsertPatientDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">{t("viewDetails")}</Button>
          </DialogTrigger>
          <UpsertPatientForm
            key={isUpsertPatientDialogOpen ? patient.id : undefined}
            patient={patient}
            onSuccess={() => setIsUpsertPatientDialogOpen(false)}
            isOpen={isUpsertPatientDialogOpen}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
