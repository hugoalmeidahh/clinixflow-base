/**
 * Gera um código único para clínica
 * Formato: 3 letras maiúsculas + 3 números (ex: "ABC123")
 */
export function generateClinicCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  
  // 3 letras aleatórias
  const letterPart = Array.from({ length: 3 }, () =>
    letters[Math.floor(Math.random() * letters.length)]
  ).join("");
  
  // 3 números aleatórios
  const numberPart = Array.from({ length: 3 }, () =>
    numbers[Math.floor(Math.random() * numbers.length)]
  ).join("");
  
  return `${letterPart}${numberPart}`;
}

/**
 * Gera o próximo código sequencial para profissional ou paciente
 * Formato: "001", "002", "003", etc.
 */
export function getNextSequentialCode(currentMax: number | null): string {
  const next = (currentMax ?? 0) + 1;
  return next.toString().padStart(3, "0");
}

