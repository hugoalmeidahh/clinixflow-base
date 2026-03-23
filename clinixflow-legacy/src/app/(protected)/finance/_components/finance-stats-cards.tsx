"use client";

import {
  DollarSign,
  MinusCircle,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyInCents } from "@/src/helpers/currency";

interface FinanceStatsCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  averageTicket: number;
}

export function FinanceStatsCards({
  totalRevenue,
  totalExpenses,
  netProfit,
  averageTicket,
}: FinanceStatsCardsProps) {
  const t = useTranslations("finance");

  const stats = [
    {
      title: t("totalRevenue"),
      value: formatCurrencyInCents(totalRevenue),
      icon: DollarSign,
      gradient: "from-emerald-500 to-green-500",
    },
    {
      title: t("totalExpenses"),
      value: formatCurrencyInCents(totalExpenses),
      icon: MinusCircle,
      gradient: "from-red-500 to-rose-500",
    },
    {
      title: t("netProfit"),
      value: formatCurrencyInCents(netProfit),
      icon: TrendingUp,
      gradient: "from-blue-500 to-purple-600",
    },
    {
      title: t("averageTicket"),
      value: formatCurrencyInCents(averageTicket),
      icon: Ticket,
      gradient: "from-indigo-500 to-blue-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="gap-2 border-border shadow-lg transition-all hover:shadow-xl min-w-0"
          >
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <div
                className={`bg-gradient-to-br ${stat.gradient} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-muted-foreground text-xs sm:text-sm font-medium truncate">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold truncate">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
