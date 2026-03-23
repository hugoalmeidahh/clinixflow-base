"use client";

import { doctorsTable, patientsTable } from "@/src/db/schema";

import ActiveFiltersTags from "./active-filters-tags";
import { useAppointmentsFilters } from "./appointments-filters-wrapper";

interface FiltersTagsHeaderProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

const FiltersTagsHeader = ({ patients, doctors }: FiltersTagsHeaderProps) => {
  const { filters, setFilters } = useAppointmentsFilters();

  const handleRemoveFilter = (filterKey: keyof typeof filters) => {
    const newFilters = { ...filters };
    if (filterKey === "date") {
      delete newFilters.date;
    } else {
      delete newFilters[filterKey];
    }
    setFilters(newFilters);
  };

  return (
    <ActiveFiltersTags
      filters={filters}
      patients={patients}
      doctors={doctors}
      onRemoveFilter={handleRemoveFilter}
    />
  );
};

export default FiltersTagsHeader;

