"use client";

import {
  AlertTriangle,
  Building2,
  CreditCard,
  DollarSign,
  History,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MasterStats {
  totalOwners: number;
  totalClinics: number;
  totalPatients: number;
  totalDoctors: number;
  activeSubscriptions: number;
  pendingPayments: number;
  paymentInconsistencies: number;
  totalPayments: number;
}

interface MasterStatsCardsProps {
  stats: MasterStats;
}

export function MasterStatsCards({ stats }: MasterStatsCardsProps) {
  const cards = [
    {
      title: "Owners",
      value: stats.totalOwners,
      description: "Usuários owners cadastrados",
      icon: UserCheck,
      href: "/master/owners",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Clínicas",
      value: stats.totalClinics,
      description: "Clínicas cadastradas",
      icon: Building2,
      href: "#",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Pacientes",
      value: stats.totalPatients,
      description: "Total de pacientes",
      icon: Users,
      href: "#",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Profissionais",
      value: stats.totalDoctors,
      description: "Profissionais cadastrados",
      icon: Stethoscope,
      href: "#",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Assinaturas Ativas",
      value: stats.activeSubscriptions,
      description: "Subscriptions ativas",
      icon: CreditCard,
      href: "/master/owners",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Pagamentos Pendentes",
      value: stats.pendingPayments,
      description: "Aguardando aprovação",
      icon: DollarSign,
      href: "/master/owners",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      highlight: stats.pendingPayments > 0,
    },
    {
      title: "Pagamentos Vencidos",
      value: stats.paymentInconsistencies,
      description: "Aguardando validação",
      icon: AlertTriangle,
      href: "/master/payment-inconsistencies",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      highlight: stats.paymentInconsistencies > 0,
    },
    {
      title: "Total de Pagamentos",
      value: stats.totalPayments,
      description: "Histórico completo",
      icon: History,
      href: "/master/owners",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const content = (
          <Card
            className={`transition-all hover:shadow-md min-w-0 ${
              card.highlight ? "ring-2 ring-red-500" : ""
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">
                {card.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${card.bgColor} shrink-0`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{card.value}</div>
              <CardDescription className="mt-1 text-xs sm:text-sm">
                {card.description}
              </CardDescription>
              {card.href !== "#" && (
                <Link href={card.href} className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
                    Ver detalhes
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        );

        return <div key={card.title}>{content}</div>;
      })}
    </div>
  );
}
