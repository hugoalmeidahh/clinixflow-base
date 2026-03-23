"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { patientsTable } from "@/src/db/schema";

import PatientsTableActions from "./table-actions";

type Patient = typeof patientsTable.$inferSelect;

const SexCell = ({ sex }: { sex: "male" | "female" }) => {
  const t = useTranslations("patients");
  return <>{sex === "male" ? t("male") : t("female")}</>;
};

const NameHeader = () => {
  const t = useTranslations("patients");
  return <>{t("name")}</>;
};

const EmailHeader = () => {
  const t = useTranslations("patients");
  return <>{t("email")}</>;
};

const PhoneHeader = () => {
  const t = useTranslations("patients");
  return <>{t("phone")}</>;
};

const SexHeader = () => {
  const t = useTranslations("patients");
  return <>{t("sex")}</>;
};

export const patientsTableColumns: ColumnDef<Patient>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: () => <NameHeader />,
  },
  {
    id: "email",
    accessorKey: "email",
    header: () => <EmailHeader />,
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: () => <PhoneHeader />,
    cell: (params) => {
      const patient = params.row.original;
      const phoneNumber = patient.phoneNumber;
      if (!phoneNumber) return "";
      const formatted = phoneNumber.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3",
      );
      return formatted;
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: () => <SexHeader />,
    cell: (params) => {
      const patient = params.row.original;
      return <SexCell sex={patient.sex} />;
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const patient = params.row.original;
      return <PatientsTableActions patient={patient} />;
    },
  },
];