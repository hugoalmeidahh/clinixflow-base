"use client";

import { format } from "date-fns";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { doctorsTable, patientsTable } from "@/src/db/schema";

type FilterData = {
  date?: Date;
  doctorId?: string;
  patientId?: string;
};

interface ActiveFiltersTagsProps {
  filters: FilterData;
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  onRemoveFilter: (filterKey: keyof FilterData) => void;
}

const ActiveFiltersTags = ({
  filters,
  patients,
  doctors,
  onRemoveFilter,
}: ActiveFiltersTagsProps) => {
  const hasActiveFilters =
    filters.date ||
    (filters.doctorId && filters.doctorId !== "") ||
    (filters.patientId && filters.patientId !== "");

  if (!hasActiveFilters) {
    return null;
  }

  const getFilterLabel = (key: keyof FilterData, value: unknown) => {
    if (key === "date" && value) {
      return format(value as Date, "dd/MM/yyyy");
    }
    if (key === "doctorId" && value && value !== "") {
      const doctor = doctors.find((d) => d.id === value);
      return doctor?.name || "";
    }
    if (key === "patientId" && value && value !== "") {
      const patient = patients.find((p) => p.id === value);
      return patient?.name || "";
    }
    return "";
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.date && (
        <Badge variant="secondary" className="gap-1 px-2 py-1">
          {getFilterLabel("date", filters.date)}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onRemoveFilter("date")}
          />
        </Badge>
      )}
      {filters.doctorId && filters.doctorId !== "" && (
        <Badge variant="secondary" className="gap-1 px-2 py-1">
          {getFilterLabel("doctorId", filters.doctorId)}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onRemoveFilter("doctorId")}
          />
        </Badge>
      )}
      {filters.patientId && filters.patientId !== "" && (
        <Badge variant="secondary" className="gap-1 px-2 py-1">
          {getFilterLabel("patientId", filters.patientId)}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onRemoveFilter("patientId")}
          />
        </Badge>
      )}
    </div>
  );
};

export default ActiveFiltersTags;

