"use client";

import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

dayjs.locale("pt-br");

interface MonthSelectorProps {
  onChange?: (month: number, year: number) => void;
}

export function MonthSelector({ onChange }: MonthSelectorProps) {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const handlePrevMonth = () => {
    const newDate = currentDate.subtract(1, "month");
    setCurrentDate(newDate);
    onChange?.(newDate.month() + 1, newDate.year());
  };

  const handleNextMonth = () => {
    const newDate = currentDate.add(1, "month");
    setCurrentDate(newDate);
    onChange?.(newDate.month() + 1, newDate.year());
  };

  const formattedDate = currentDate.format("MMMM YYYY");

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[160px] text-center text-sm font-medium capitalize">
        {formattedDate}
      </span>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
