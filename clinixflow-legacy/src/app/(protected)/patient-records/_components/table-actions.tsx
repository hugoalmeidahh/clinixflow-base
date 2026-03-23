"use client";

import { MoreHorizontal, View } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AddPatientRecordButton } from "./add-patient-record-button";

export function PatientRecordsTableActions() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AddPatientRecordButton />
      </div>
    </div>
  );
}

export function PatientRecordRowActions({ patientRecord }: { patientRecord: { id: number } }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/patient-records/${patientRecord.id}`}>
            <View className="mr-2 h-4 w-4" />
            Visualizar
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 