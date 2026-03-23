"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertDoctorForm from "./upsert-doctor-form";

const AddDoctorButton = () => {
  const t = useTranslations("doctors");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t("addProfessional")}</span>
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm
        key={isOpen ? "new-doctor" : undefined}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

export default AddDoctorButton;
