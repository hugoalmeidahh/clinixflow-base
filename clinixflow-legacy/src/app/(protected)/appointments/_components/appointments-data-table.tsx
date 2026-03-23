"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect,useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { patientRecordsTable } from "@/src/db/schema";

interface AppointmentsDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  recordsMap?: Map<string, typeof patientRecordsTable.$inferSelect>;
}

export function AppointmentsDataTable<TData, TValue>({
  columns,
  data,
}: AppointmentsDataTableProps<TData, TValue>) {
  const [isFiltering, setIsFiltering] = useState(false);
  const prevDataLengthRef = useRef(data.length);

  // Detectar quando os dados estão sendo filtrados
  useEffect(() => {
    if (data.length !== prevDataLengthRef.current) {
      setIsFiltering(true);
      const timer = setTimeout(() => {
        setIsFiltering(false);
        prevDataLengthRef.current = data.length;
      }, 300);
      return () => clearTimeout(timer);
    }
    prevDataLengthRef.current = data.length;
  }, [data.length]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const actionButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  return (
    <div className="rounded-md border relative">
      {isFiltering && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Filtrando...</span>
          </div>
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const rowId = row.id;
              
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={(e) => {
                    // Se clicou diretamente no botão de ações, não fazer nada
                    if ((e.target as HTMLElement).closest('button')) {
                      return;
                    }
                    // Clicar no botão de ações programaticamente
                    const actionButton = actionButtonRefs.current.get(rowId);
                    if (actionButton) {
                      actionButton.click();
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    // Se for a célula de ações, adicionar ref ao botão
                    if (cell.column.id === "actions") {
                      return (
                        <TableCell key={cell.id} onClick={(e) => e.stopPropagation()}>
                          <div
                            ref={(el) => {
                              if (el) {
                                const button = el.querySelector('button');
                                if (button) {
                                  actionButtonRefs.current.set(rowId, button);
                                }
                              }
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

