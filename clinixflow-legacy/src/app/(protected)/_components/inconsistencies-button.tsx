"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function InconsistenciesButton() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch("/api/inconsistencies/count");
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
        } else {
          setCount(0);
        }
      } catch (error) {
        console.error("Erro ao buscar contagem de inconsistências:", error);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCount();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      fetchCount();
      router.refresh();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [router]);

  // Não mostrar se não houver inconsistências ou se estiver carregando
  if (isLoading || count === null || count === 0) {
    return null;
  }

  return (
    <Button variant="outline" size="icon" asChild className="relative">
      <Link href="/inconsistencies">
        <AlertTriangle className="h-[1.2rem] w-[1.2rem]" />
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {count > 99 ? "99+" : count}
        </Badge>
        <span className="sr-only">
          Inconsistências ({count})
        </span>
      </Link>
    </Button>
  );
}
