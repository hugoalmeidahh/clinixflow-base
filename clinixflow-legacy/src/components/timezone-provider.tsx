"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface TimezoneContextType {
  userTimezone: string;
  isDetected: boolean;
}

const TimezoneContext = createContext<TimezoneContextType>({
  userTimezone: "America/Sao_Paulo",
  isDetected: false,
});

export const useTimezone = () => {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error("useTimezone must be used within a TimezoneProvider");
  }
  return context;
};

interface TimezoneProviderProps {
  children: React.ReactNode;
}

export const TimezoneProvider = ({ children }: TimezoneProviderProps) => {
  const [userTimezone, setUserTimezone] = useState("America/Sao_Paulo");
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    // Detectar fuso horário do usuário
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(detectedTimezone);
      setIsDetected(true);
      
      // Salvar no localStorage para uso futuro
      localStorage.setItem("userTimezone", detectedTimezone);
    } catch (error) {
      console.warn("Não foi possível detectar o fuso horário:", error);
      // Usar fuso horário salvo anteriormente ou fallback
      const savedTimezone = localStorage.getItem("userTimezone");
      if (savedTimezone) {
        setUserTimezone(savedTimezone);
        setIsDetected(true);
      }
    }
  }, []);

  return (
    <TimezoneContext.Provider value={{ userTimezone, isDetected }}>
      {children}
    </TimezoneContext.Provider>
  );
}; 