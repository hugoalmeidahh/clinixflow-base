'use client';

import { generatePrescriptionPdf } from "@/src/actions/generate-prescription";


export function DownloadPrescriptionButton({
  doctor,
  patient,
  contentHtml,
}: {
  doctor: string;
  patient: string;
  contentHtml: string;
}) {
  const handleDownload = async () => {
    const pdfBuffer = await generatePrescriptionPdf({
      doctor,
      patient,
      contentHtml,
    });

    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `receita-${patient}.pdf`;
    a.click();
  };

  return (
    <button onClick={handleDownload} className="btn btn-primary">
      Baixar Receita
    </button>
  );
}
