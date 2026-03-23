"use client";

import { UseFormReturn } from "react-hook-form";

import { type DoctorFormData } from "../types";

interface DocumentsTabProps {
  form: UseFormReturn<DoctorFormData>;
}

/**
 * @deprecated Esta tab foi descontinuada. 
 * - Documentos pessoais (CPF/CNPJ, RG) estão em PersonalDataTab
 * - Registro profissional está em SpecialtiesTab
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DocumentsTab(_props: DocumentsTabProps) {
  return (
    <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
      <p>Esta seção foi movida.</p>
      <p className="text-sm">
        Documentos pessoais estão em &quot;Dados Pessoais&quot; e registro profissional está em &quot;Especialidades&quot;.
      </p>
    </div>
  );
}
