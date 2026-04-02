import { useState, useRef, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, FileText, Search } from "lucide-react";
import { useTenantClinical, useTenantPatients } from "@/hooks/useTenantSupport";
import type {
  TenantClinicalEvent,
  TenantEvaluation,
  TenantPatient,
} from "@/types/tenantSupport";

const EVENT_TYPE_COLORS: Record<string, string> = {
  EVALUATION: "bg-purple-500 text-white hover:bg-purple-600",
  NOTE: "bg-blue-500 text-white hover:bg-blue-600",
  ATTENDED: "bg-green-500 text-white hover:bg-green-600",
  ABSENCE: "bg-red-500 text-white hover:bg-red-600",
  JUSTIFIED_ABSENCE: "bg-orange-500 text-white hover:bg-orange-600",
  DOCUMENT: "bg-gray-500 text-white hover:bg-gray-600",
};

const fmtDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("pt-BR");
};

interface TenantClinicalTabProps {
  tenantId: string;
}

export function TenantClinicalTab({ tenantId }: TenantClinicalTabProps) {
  const { t } = useTranslation();
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientLabel, setSelectedPatientLabel] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: patientsData, isLoading: patientsLoading } = useTenantPatients(
    tenantId,
    patientSearch,
    1
  );

  const { data: clinicalData, isLoading: clinicalLoading } = useTenantClinical(
    tenantId,
    selectedPatientId
  );

  const patients = patientsData?.data ?? [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPatient = (patient: TenantPatient) => {
    setSelectedPatientId(patient.id);
    setSelectedPatientLabel(`${patient.full_name} (${patient.record_number})`);
    setPatientSearch("");
    setDropdownOpen(false);
  };

  const events = clinicalData?.events ?? [];
  const evaluations = clinicalData?.evaluations ?? [];

  return (
    <div className="space-y-6">
      {/* Patient selector */}
      <div className="relative max-w-md" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("tenantSupport.clinical.searchPatient")}
            value={dropdownOpen ? patientSearch : selectedPatientLabel || patientSearch}
            onChange={(e) => {
              setPatientSearch(e.target.value);
              setDropdownOpen(true);
              if (!e.target.value && selectedPatientId) {
                setSelectedPatientId(null);
                setSelectedPatientLabel("");
              }
            }}
            onFocus={() => {
              setDropdownOpen(true);
              if (selectedPatientLabel) {
                setPatientSearch("");
              }
            }}
            className="pl-9"
          />
        </div>

        {dropdownOpen && patientSearch.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
            {patientsLoading ? (
              <div className="p-3 text-sm text-muted-foreground">
                {t("common.loading")}
              </div>
            ) : patients.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                {t("common.noData")}
              </div>
            ) : (
              <ul className="max-h-60 overflow-auto py-1">
                {patients.map((patient: TenantPatient) => (
                  <li
                    key={patient.id}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => handleSelectPatient(patient)}
                  >
                    <span className="font-medium">{patient.full_name}</span>
                    <span className="ml-2 text-muted-foreground">
                      ({patient.record_number})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Initial state - no patient selected */}
      {!selectedPatientId && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          <FileText className="mx-auto mb-3 h-8 w-8 opacity-50" />
          <p>{t("tenantSupport.clinical.selectPatient")}</p>
        </div>
      )}

      {/* Loading state */}
      {selectedPatientId && clinicalLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {/* Clinical data */}
      {selectedPatientId && !clinicalLoading && (
        <>
          {/* Section 1: Clinical Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("tenantSupport.clinical.events")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("tenantSupport.clinical.noEvents")}
                </p>
              ) : (
                <div className="relative space-y-0">
                  {/* Vertical timeline line */}
                  <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

                  {events.map((event: TenantClinicalEvent) => (
                    <div key={event.id} className="relative flex gap-4 py-3 pl-8">
                      {/* Timeline dot */}
                      <div className="absolute left-1.5 top-5 h-3 w-3 rounded-full border-2 border-background bg-primary" />

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              EVENT_TYPE_COLORS[event.event_type] ??
                              "bg-gray-100 text-gray-700"
                            }
                          >
                            {t(
                              `tenantSupport.clinical.eventTypes.${event.event_type}`,
                              event.event_type
                            )}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {fmtDateTime(event.performed_at)}
                          </span>
                          {event.is_immutable && (
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" title={t("tenantSupport.clinical.immutable")} />
                          )}
                        </div>
                        {event.content && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {event.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Evaluations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("tenantSupport.clinical.evaluations")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {evaluations.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  {t("tenantSupport.clinical.noEvaluations")}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("tenantSupport.clinical.evaluationType")}</TableHead>
                      <TableHead>{t("tenantSupport.clinical.professional")}</TableHead>
                      <TableHead>{t("tenantSupport.clinical.evalStatus")}</TableHead>
                      <TableHead>{t("tenantSupport.clinical.notes")}</TableHead>
                      <TableHead>{t("tenantSupport.clinical.finalizedAt")}</TableHead>
                      <TableHead>{t("tenantSupport.clinical.date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((ev: TenantEvaluation) => (
                      <TableRow key={ev.id}>
                        <TableCell className="text-sm font-medium">
                          {ev.evaluation_type_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {ev.professional_name}
                        </TableCell>
                        <TableCell>
                          {ev.is_locked ? (
                            <Badge className="bg-red-500 text-white hover:bg-red-600">
                              {t("tenantSupport.clinical.locked")}
                            </Badge>
                          ) : ev.is_draft ? (
                            <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                              {t("tenantSupport.clinical.draft")}
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500 text-white hover:bg-green-600">
                              {t("tenantSupport.clinical.finalized")}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell
                          className="max-w-[200px] truncate text-sm text-muted-foreground"
                          title={ev.notes ?? ""}
                        >
                          {ev.notes ?? "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {fmtDate(ev.finalized_at)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {fmtDate(ev.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
