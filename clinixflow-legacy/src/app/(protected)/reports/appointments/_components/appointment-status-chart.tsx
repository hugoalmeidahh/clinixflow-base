"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockAppointmentStatusData = [
  { month: "Jan", scheduled: 120, confirmed: 100, completed: 85, noShow: 15 },
  { month: "Fev", scheduled: 135, confirmed: 115, completed: 98, noShow: 17 },
  { month: "Mar", scheduled: 128, confirmed: 108, completed: 92, noShow: 16 },
  { month: "Abr", scheduled: 145, confirmed: 125, completed: 110, noShow: 15 },
  { month: "Mai", scheduled: 140, confirmed: 120, completed: 105, noShow: 15 },
  { month: "Jun", scheduled: 155, confirmed: 135, completed: 118, noShow: 17 },
  { month: "Jul", scheduled: 138, confirmed: 118, completed: 100, noShow: 18 },
  { month: "Ago", scheduled: 150, confirmed: 130, completed: 115, noShow: 15 },
  { month: "Set", scheduled: 142, confirmed: 122, completed: 106, noShow: 16 },
  { month: "Out", scheduled: 160, confirmed: 140, completed: 125, noShow: 15 },
  { month: "Nov", scheduled: 148, confirmed: 128, completed: 112, noShow: 16 },
  { month: "Dez", scheduled: 165, confirmed: 145, completed: 130, noShow: 15 },
];

export function AppointmentStatusChart() {
  const t = useTranslations("reports");

  return (
    <Card className="gap-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-medium">
          {t("statusBreakdown")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={mockAppointmentStatusData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="scheduled"
              name="Agendados"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="confirmed"
              name="Confirmados"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="completed"
              name="Realizados"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="noShow"
              name="Faltas"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
