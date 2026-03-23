"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Mostrar após um pequeno delay para melhor UX
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 shadow-lg md:px-6">
      <div className="container mx-auto flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm text-foreground">
            Usamos cookies em nosso site para oferecer a você a experiência mais
            relevante, lembrando suas preferências e visitas repetidas. Ao clicar
            em &quot;Aceitar cookies&quot;, você concorda com o uso de todos os cookies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleAccept}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Aceitar cookies
          </Button>
        </div>
      </div>
    </div>
  );
}

