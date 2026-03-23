"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UpsertPatientRecordForm } from "./upsert-patient-record-form";

export function AddPatientRecordButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Prontuário
        </Button>
      </DialogTrigger>
      <DialogContent className="xl:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Novo Prontuário</DialogTitle>
          <DialogDescription>
            Registre o relatório médico da consulta realizada.
          </DialogDescription>
        </DialogHeader>
        <UpsertPatientRecordForm
          isOpen={isOpen}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
