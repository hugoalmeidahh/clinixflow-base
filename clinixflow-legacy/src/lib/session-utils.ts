/**
 * Duração padrão de sessão por convênio (em minutos)
 */
export const INSURANCE_SESSION_DURATION: Record<string, number> = {
  unimed: 40,
  amil: 40,
  sulamerica: 50,
  bradesco_saude: 30,
  porto_seguro: 40,
  allianz: 50,
  hapvida: 40,
  cassems: 40,
  santa_casa_saude: 30,
  particular: 30, // Padrão para particular
  outros: 30, // Padrão genérico
};

/**
 * Nomes amigáveis dos convênios
 */
export const INSURANCE_NAMES: Record<string, string> = {
  unimed: "Unimed",
  amil: "Amil",
  sulamerica: "SulAmérica",
  bradesco_saude: "Bradesco Saúde",
  porto_seguro: "Porto Seguro",
  allianz: "Allianz",
  hapvida: "Hapvida",
  cassems: "Cassems",
  santa_casa_saude: "Santa Casa Saúde",
  particular: "Particular",
  outros: "Outros",
};

/**
 * Retorna o nome amigável do convênio
 */
export function getInsuranceName(insurance: string): string {
  return INSURANCE_NAMES[insurance] || insurance;
}

/**
 * Calcula quantas sessões baseado na duração total e no tipo de convênio
 */
export function calculateSessions(
  totalDurationMinutes: number,
  insurance: string
): { sessions: number; sessionDuration: number; totalDuration: number } {
  const sessionDuration = INSURANCE_SESSION_DURATION[insurance] || 30;
  const sessions = Math.round(totalDurationMinutes / sessionDuration);
  
  return {
    sessions,
    sessionDuration,
    totalDuration: totalDurationMinutes,
  };
}

/**
 * Retorna a duração padrão de sessão para um convênio
 */
export function getSessionDuration(insurance: string): number {
  return INSURANCE_SESSION_DURATION[insurance] || 30;
}

/**
 * Gera opções de duração baseadas em múltiplos de sessões
 * Retorna opções: 1 sessão, 2 sessões, 3 sessões, etc.
 */
export function generateDurationOptions(sessionDuration: number): Array<{
  value: number;
  label: string;
  sessions: number;
}> {
  const options: Array<{ value: number; label: string; sessions: number }> = [];
  
  // Gerar até 4 sessões (ajustável)
  for (let sessions = 1; sessions <= 4; sessions++) {
    const duration = sessionDuration * sessions;
    const label =
      sessions === 1
        ? `${duration} minutos (1 sessão)`
        : `${duration} minutos (${sessions} sessões)`;
    
    options.push({
      value: duration,
      label,
      sessions,
    });
  }
  
  return options;
}

