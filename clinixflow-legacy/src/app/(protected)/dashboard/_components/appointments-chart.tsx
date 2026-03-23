"use client";

import "dayjs/locale/pt-br";

import dayjs from "dayjs";

dayjs.locale("pt-br");
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DailyAppointment {
  date: string;
  scheduled: number;
  attended: number;
  noShow: number;
  scheduledRevenue: number;
  attendedRevenue: number;
}

interface AppointmentsChartProps {
  dailyAppointmentsData: DailyAppointment[];
}

const AppointmentsChart = ({
  dailyAppointmentsData,
}: AppointmentsChartProps) => {
  const chartData = dailyAppointmentsData.map((item) => ({
    date: dayjs(item.date).format("DD/MM"),
    fullDate: item.date,
    scheduled: Number(item.scheduled) || 0,
    attended: Number(item.attended) || 0,
    noShow: Number(item.noShow) || 0,
  }));

  const chartConfig = {
    scheduled: {
      label: "Agendados",
      color: "#0B68F7",
    },
    attended: {
      label: "Atendidos",
      color: "#10B981",
    },
    noShow: {
      label: "Faltas",
      color: "#EF4444",
    },
  } satisfies ChartConfig;

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <TrendingUp className="h-5 w-5 shrink-0" />
        <CardTitle className="text-sm sm:text-base">Agendamentos por Dia</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer config={chartConfig} className="h-[180px] sm:h-[220px] lg:h-[250px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              fontSize={11}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              fontSize={11}
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return dayjs(payload[0].payload?.fullDate).format(
                        "DD/MM/YYYY (dddd)",
                      );
                    }
                    return label;
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="scheduled"
              stroke="var(--color-scheduled)"
              strokeWidth={2}
              dot={{ fill: "var(--color-scheduled)", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="attended"
              stroke="var(--color-attended)"
              strokeWidth={2}
              dot={{ fill: "var(--color-attended)", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="noShow"
              stroke="var(--color-noShow)"
              strokeWidth={2}
              dot={{ fill: "var(--color-noShow)", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AppointmentsChart;