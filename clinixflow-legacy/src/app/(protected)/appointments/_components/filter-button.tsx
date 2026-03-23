"use client";

import { Filter, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { doctorsTable, patientsTable } from "@/src/db/schema";

import AppointmentsFilters from "./appointments-filters";

interface FilterButtonProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  onFiltersChange: (filters: {
    date?: Date;
    doctorId?: string;
    patientId?: string;
  }) => void;
  initialFilters?: {
    date?: Date;
    doctorId?: string;
    patientId?: string;
  };
  hideDoctorFilter?: boolean;
}

const FilterButton = ({
  patients,
  doctors,
  onFiltersChange,
  initialFilters,
  hideDoctorFilter = false,
}: FilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFiltersChange = (filters: {
    date?: Date;
    doctorId?: string;
    patientId?: string;
  }) => {
    onFiltersChange(filters);
    // Fechar o popover após aplicar os filtros
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtros</span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Filtros</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filtros</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <AppointmentsFilters
            patients={patients}
            doctors={doctors}
            onFiltersChange={handleFiltersChange}
            initialFilters={initialFilters}
            compact
            hideDoctorFilter={hideDoctorFilter}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterButton;

