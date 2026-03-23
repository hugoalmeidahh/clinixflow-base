export const INSURANCE_OPTIONS = [
  { value: "unimed", label: "Unimed" },
  { value: "amil", label: "Amil" },
  { value: "sulamerica", label: "SulAmérica" },
  { value: "bradesco_saude", label: "Bradesco Saúde" },
  { value: "porto_seguro", label: "Porto Seguro" },
  { value: "allianz", label: "Allianz" },
  { value: "hapvida", label: "Hapvida" },
  { value: "cassems", label: "CASSEMS" },
  { value: "santa_casa_saude", label: "Santa Casa Saúde" },
  { value: "particular", label: "Particular" },
  { value: "outros", label: "Outros" },
] as const;

export const getInsuranceLabel = (value: string) => {
  const option = INSURANCE_OPTIONS.find((opt) => opt.value === value);
  return option?.label || value;
};
