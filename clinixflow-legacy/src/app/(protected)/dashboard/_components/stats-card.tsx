import {
  CalendarCheck,
  CalendarIcon,
  CalendarX,
  DollarSignIcon,
  UsersRound,
  WalletIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyInCents } from "@/src/helpers/currency";

interface StatsCardsProps {
  totalRevenueScheduled: number;
  totalRevenueAttended: number;
  totalAppointments: number;
  totalAttended: number;
  totalNoShow: number;
  totalPatients: number;
}

const StatsCards = ({
  totalRevenueScheduled,
  totalRevenueAttended,
  totalAppointments,
  totalAttended,
  totalNoShow,
  totalPatients,
}: StatsCardsProps) => {
  const stats = [
    {
      title: "Faturamento Agendado",
      value: formatCurrencyInCents(totalRevenueScheduled),
      icon: DollarSignIcon,
      gradient: "from-blue-500 to-purple-600",
    },
    {
      title: "Faturamento Atendido",
      value: formatCurrencyInCents(totalRevenueAttended),
      icon: WalletIcon,
      gradient: "from-emerald-500 to-green-500",
    },
    {
      title: "Agendamentos",
      value: totalAppointments.toString(),
      icon: CalendarIcon,
      gradient: "from-blue-600 to-purple-500",
    },
    {
      title: "Atendimentos",
      value: totalAttended.toString(),
      icon: CalendarCheck,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Faltas",
      value: totalNoShow.toString(),
      icon: CalendarX,
      gradient: "from-red-500 to-rose-500",
    },
    {
      title: "Pacientes Cadastrados",
      value: totalPatients.toString(),
      icon: UsersRound,
      gradient: "from-indigo-500 to-blue-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="text-xl sm:text-2xl font-bold truncate">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
