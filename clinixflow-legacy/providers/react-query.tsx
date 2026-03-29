"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,       // dados considerados frescos por 1 minuto
      gcTime: 5 * 60 * 1000,      // cache mantido por 5 minutos
      refetchOnWindowFocus: false, // não re-buscar ao focar a janela
      retry: 1,                    // apenas 1 retry em falhas
    },
  },
});

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};