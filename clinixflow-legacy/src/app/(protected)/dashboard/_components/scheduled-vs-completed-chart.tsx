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

interface DailyData {
  date: string;
  scheduled: number;
  attended: number;
  noShow: number;
}

interface ScheduledVsCompletedChartProps {
  data: DailyData[];
}

export function ScheduledVsCompletedChart({
  data,
}: ScheduledVsCompletedChartProps) {
  const t = useTranslations("dashboard");

  const chartData = data.map((item) => ({
    date: item.date,
    [t("scheduled")]: item.scheduled,
    [t("completed")]: Number(item.attended),
    [t("noShow")]: Number(item.noShow),
  }));

  return (
    <Card className="gap-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t("scheduledVsCompletedVsNoShow")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Sem dados
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={t("scheduled")}
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={t("completed")}
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={t("noShow")}
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
