"use client";

import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockFinancialSummary = [
  {
    titleKey: "totalRevenue",
    value: "R$ 716.000",
    icon: DollarSign,
    gradient: "from-emerald-500 to-green-600",
    change: "+12.5%",
    positive: true,
  },
  {
    titleKey: "totalExpenses",
    value: "R$ 266.000",
    icon: TrendingDown,
    gradient: "from-red-500 to-rose-600",
    change: "+8.2%",
    positive: false,
  },
  {
    titleKey: "netProfit",
    value: "R$ 450.000",
    icon: TrendingUp,
    gradient: "from-blue-500 to-indigo-600",
    change: "+15.3%",
    positive: true,
  },
  {
    titleKey: "averageTicket",
    value: "R$ 180",
    icon: Wallet,
    gradient: "from-purple-500 to-violet-600",
    change: "+3.1%",
    positive: true,
  },
];

export function FinancialSummaryCards() {
  const t = useTranslations("reports");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {mockFinancialSummary.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.titleKey}
            className="min-w-0 gap-2 border-border shadow-lg transition-all hover:shadow-xl"
          >
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <div
                className={`bg-gradient-to-br ${item.gradient} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                {t(item.titleKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="truncate text-xl font-bold sm:text-2xl">
                {item.value}
              </div>
              <p
                className={`text-xs mt-1 ${
                  item.positive ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {item.change} {t("vsPreviousMonth")}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
