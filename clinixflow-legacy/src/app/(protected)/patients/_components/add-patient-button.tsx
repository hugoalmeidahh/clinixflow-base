"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertPatientForm from "./upsert-patient-form";

const AddPatientButton = () => {
  const t = useTranslations("patients");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t("addPatientButton")}</span>
        </Button>
      </DialogTrigger>
      <UpsertPatientForm
        key={isOpen ? "new-patient" : undefined}
        onSuccess={() => setIsOpen(false)}
        isOpen={isOpen}
      />
    </Dialog>
  );
};

export default AddPatientButton;