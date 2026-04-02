import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useTenantPatients } from "@/hooks/useTenantSupport";
import { cn } from "@/lib/utils";

interface TenantPatientsTabProps {
  tenantId: string;
}

const PAGE_SIZE = 25;

function maskCpf(cpf: string | null): string {
  if (!cpf) return "—";
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.***.***.${digits.slice(9, 11)}`;
}

export function TenantPatientsTab({ tenantId }: TenantPatientsTabProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  const { data, isLoading, error } = useTenantPatients(tenantId, debouncedSearch, page);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("tenantSupport.patients.title")}</span>
          {data && (
            <span className="text-sm font-normal text-muted-foreground">
              {t("tenantSupport.patients.totalPatients", { count: data.total })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {/* Search */}
        <div className="px-6 pt-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("tenantSupport.patients.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3 px-6 pb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-destructive">
            {t("common.error")}
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            {t("tenantSupport.patients.noPatients")}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("tenantSupport.patients.recordNumber")}</TableHead>
                  <TableHead>{t("tenantSupport.patients.name")}</TableHead>
                  <TableHead>{t("tenantSupport.patients.email")}</TableHead>
                  <TableHead>{t("tenantSupport.patients.phone")}</TableHead>
                  <TableHead>{t("tenantSupport.patients.cpf")}</TableHead>
                  <TableHead>{t("tenantSupport.patients.status")}</TableHead>
                  <TableHead>{t("tenantSupport.patients.createdAt")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-mono text-sm">
                      {patient.record_number}
                    </TableCell>
                    <TableCell className="font-medium">
                      {patient.full_name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {patient.email || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {patient.phone || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {maskCpf(patient.cpf)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          patient.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        )}
                      >
                        {patient.is_active
                          ? t("tenantSupport.patients.active")
                          : t("tenantSupport.patients.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(patient.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t px-6 py-4">
              <span className="text-sm text-muted-foreground">
                {t("tenantSupport.patients.pageInfo", {
                  page,
                  total: totalPages,
                })}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  {t("tenantSupport.patients.previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  {t("tenantSupport.patients.next")}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
