"use client";

import { endOfMonth, format, isSameMonth, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  // Valores padrão: primeiro e último dia do mês atual
  const today = new Date();
  const defaultFrom = startOfMonth(today);
  const defaultTo = endOfMonth(today);

  // Usando useQueryState para gerenciar o estado da data selecionada
  // com o formato ISO, permitindo que a data seja compartilhada via URL.
  const [from, setFrom] = useQueryState(
    "from",
    parseAsIsoDate.withDefault(defaultFrom),
  );
  const [to, setTo] = useQueryState(
    "to",
    parseAsIsoDate.withDefault(defaultTo),
  );

  // Verificar se os valores da URL estão no mês atual
  // Se não estiverem, atualizar para o mês atual (apenas na primeira renderização)
  React.useEffect(() => {
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);

    // Se from não existe ou não está no mês atual, atualizar
    if (!from || (from && !isSameMonth(from, today))) {
      setFrom(currentMonthStart, { shallow: false });
    }
    // Se to não existe ou não está no mês atual, atualizar
    if (!to || (to && !isSameMonth(to, today))) {
      setTo(currentMonthEnd, { shallow: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Apenas na montagem inicial

  const handleDateSelect = (dateRange: DateRange | undefined) => {
    // O Calendar pode passar undefined quando o usuário clica para limpar a seleção
    // ou quando está selecionando o primeiro ponto do range
    if (!dateRange) {
      // Limpar ambos os valores para permitir nova seleção
      setFrom(null, { shallow: false });
      setTo(null, { shallow: false });
      return;
    }

    // Sempre atualizar o from quando fornecido
    if (dateRange.from) {
      setFrom(dateRange.from, {
        shallow: false,
      });
    }

    // Atualizar o to quando fornecido
    if (dateRange.to) {
      setTo(dateRange.to, {
        shallow: false,
      });
    } else if (dateRange.from) {
      // Se há from mas não há to, limpar o to para permitir que o usuário selecione o fim do range
      setTo(null, { shallow: false });
    }
  };

  // Usar valores da URL ou defaults
  const date: DateRange = {
    from: from || defaultFrom,
    to: to || defaultTo,
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", {
                    locale: ptBR,
                  })}{" "}
                  -{" "}
                  {format(date.to, "LLL dd, y", {
                    locale: ptBR,
                  })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || defaultFrom}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
