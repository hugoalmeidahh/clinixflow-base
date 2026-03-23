import { useTimezone } from "@/src/components/timezone-provider";
import { getUserTimezone } from "@/src/lib/timezone";

export const useUserTimezone = () => {
  const { userTimezone, isDetected } = useTimezone();

  // Função para obter o timezone atual (com fallback)
  const getCurrentTimezone = () => {
    if (isDetected) {
      return userTimezone;
    }
    return getUserTimezone();
  };

  return {
    userTimezone,
    isDetected,
    getCurrentTimezone,
  };
};
