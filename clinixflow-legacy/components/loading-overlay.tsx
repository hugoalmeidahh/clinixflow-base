"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function LoadingOverlay() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para limpar timer
  const clearLoadingTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Função para iniciar loading com timeout de segurança
  const startLoading = (duration = 600) => {
    clearLoadingTimer();
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      timerRef.current = null;
    }, duration);
  };

  // Detectar mudança de rota
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      startLoading(500);
    }

    return () => {
      clearLoadingTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Detectar cliques em links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href && !link.href.includes("#")) {
        try {
          const url = new URL(link.href);
          const currentUrl = new URL(window.location.href);

          // Se for uma navegação interna e diferente da rota atual
          if (
            url.origin === currentUrl.origin &&
            url.pathname !== currentUrl.pathname
          ) {
            startLoading(800); // Timeout maior para garantir que a navegação complete
          }
        } catch {
          // Ignorar erros de URL inválida
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearLoadingTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detectar chamadas de API (fetch)
  useEffect(() => {
    const originalFetch = window.fetch;
    let activeRequests = 0;
    const requestTimers = new Map<number, NodeJS.Timeout>();

    window.fetch = async (...args) => {
      let url = "";
      if (typeof args[0] === "string") {
        url = args[0];
      } else if (args[0] instanceof Request) {
        url = args[0].url;
      } else if (args[0] instanceof URL) {
        url = args[0].toString();
      }
      const requestId = Date.now() + Math.random();

      // Detectar método da requisição
      const method =
        (args[1] as RequestInit | undefined)?.method?.toUpperCase() ?? "GET";

      // Ignorar:
      // - POST/PUT/PATCH/DELETE: server actions e mutações (têm loading state próprio)
      // - /api/: rotas de API internas (polling, etc.)
      // - Padrões de RSC/Next.js: _next, _rsc (refreshes internos do router)
      // - Requisições de busca/filtro específicas
      const isFilterRequest =
        method !== "GET" ||
        url.includes("/_next/") ||
        url.includes("_rsc=") ||
        url.includes("/api/") ||
        url.includes("available-times") ||
        url.includes("patient-records") ||
        url.includes("get-patient-record");

      const startTime = Date.now();
      activeRequests++;

      // Só mostrar loading para requisições que não são filtros e após um delay
      // Isso evita flickering em requisições muito rápidas
      if (!isFilterRequest) {
        const timer = setTimeout(() => {
          // Só mostrar se ainda houver requisições ativas
          if (activeRequests > 0) {
            setApiLoading(true);
          }
          requestTimers.delete(requestId);
        }, 400); // Delay de 400ms antes de mostrar o overlay

        requestTimers.set(requestId, timer);
      }

      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;

        // Se a requisição foi muito rápida (< 300ms), cancelar o timer
        if (duration < 300) {
          const timer = requestTimers.get(requestId);
          if (timer) {
            clearTimeout(timer);
            requestTimers.delete(requestId);
          }
        }

        return response;
      } finally {
        activeRequests--;

        // Limpar timer desta requisição
        const timer = requestTimers.get(requestId);
        if (timer) {
          clearTimeout(timer);
          requestTimers.delete(requestId);
        }

        // Se não houver mais requisições ativas, esconder o loading
        if (activeRequests === 0) {
          // Pequeno delay para evitar flickering em múltiplas requisições rápidas
          setTimeout(() => {
            if (activeRequests === 0) {
              setApiLoading(false);
            }
          }, 150);
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
      // Limpar todos os timers pendentes
      requestTimers.forEach((timer) => clearTimeout(timer));
      requestTimers.clear();
    };
  }, []);

  if (!isLoading && !apiLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative">
        {/* Logo em cinza (base) */}
        <div className="relative h-[66px] w-[200px]">
          <Image
            src="/clinix_flow_dark.png"
            alt="ClinixFlow"
            width={200}
            height={66}
            className="block opacity-30 grayscale dark:hidden"
            priority
          />
          <Image
            src="/clinix_flow_white.png"
            alt="ClinixFlow"
            width={200}
            height={66}
            className="hidden opacity-30 grayscale dark:block"
            priority
          />
          {/* Logo colorido (animação) */}
          <div className="absolute inset-0 animate-[logoColorize_1.5s_ease-in-out_infinite]">
            <Image
              src="/clinix_flow_dark.png"
              alt="ClinixFlow"
              width={200}
              height={66}
              className="block dark:hidden"
              priority
            />
            <Image
              src="/clinix_flow_white.png"
              alt="ClinixFlow"
              width={200}
              height={66}
              className="hidden dark:block"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
