"use client";

import { CalendarCheck, CalendarClock, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodaySummaryCardsProps {
  appointmentsToday: number;
  confirmed: number;
  pending: number;
}

export function TodaySummaryCards({
  appointmentsToday,
  confirmed,
  pending,
}: TodaySummaryCardsProps) {
  const t = useTranslations("dashboard");

  const cards = [
    {
      title: t("appointmentsToday"),
      value: appointmentsToday,
      icon: Clock,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: t("confirmed"),
      value: confirmed,
      icon: CalendarCheck,
      gradient: "from-emerald-500 to-green-500",
    },
    {
      title: t("pending"),
      value: pending,
      icon: CalendarClock,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="min-w-0 gap-2 border-border shadow-lg transition-all hover:shadow-xl"
          >
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <div
                className={`bg-gradient-to-br ${card.gradient} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="truncate text-xl font-bold sm:text-2xl">
                {card.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
