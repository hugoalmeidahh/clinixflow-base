"use client";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";

export function MonthSelector() {
  const today = new Date();
  const defaultFrom = startOfMonth(today);
  const defaultTo = endOfMonth(today);

  const [from, setFrom] = useQueryState(
    "from",
    parseAsIsoDate.withDefault(defaultFrom),
  );
  const [, setTo] = useQueryState(
    "to",
    parseAsIsoDate.withDefault(defaultTo),
  );

  const currentMonth = from || defaultFrom;

  const goToPreviousMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setFrom(startOfMonth(prev), { shallow: false });
    setTo(endOfMonth(prev), { shallow: false });
  };

  const goToNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setFrom(startOfMonth(next), { shallow: false });
    setTo(endOfMonth(next), { shallow: false });
  };

  const goToCurrentMonth = () => {
    setFrom(startOfMonth(today), { shallow: false });
    setTo(endOfMonth(today), { shallow: false });
  };

  const isCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant={isCurrentMonth ? "default" : "outline"}
        size="sm"
        className="h-8 min-w-[120px] text-xs sm:min-w-[140px] sm:text-sm"
        onClick={goToCurrentMonth}
      >
        {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
