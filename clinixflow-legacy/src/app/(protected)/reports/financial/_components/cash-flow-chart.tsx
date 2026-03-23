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

const mockCashFlowData = [
  { month: "Jan", income: 45000, expenses: 18000 },
  { month: "Fev", income: 52000, expenses: 20000 },
  { month: "Mar", income: 48000, expenses: 19500 },
  { month: "Abr", income: 61000, expenses: 22000 },
  { month: "Mai", income: 55000, expenses: 21000 },
  { month: "Jun", income: 67000, expenses: 24000 },
  { month: "Jul", income: 59000, expenses: 23000 },
  { month: "Ago", income: 63000, expenses: 22500 },
  { month: "Set", income: 58000, expenses: 21500 },
  { month: "Out", income: 71000, expenses: 25000 },
  { month: "Nov", income: 65000, expenses: 23500 },
  { month: "Dez", income: 72000, expenses: 26000 },
];

export function CashFlowChart() {
  const t = useTranslations("reports");

  return (
    <Card className="gap-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-medium">
          {t("cashFlow")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockCashFlowData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(value) =>
                `R$ ${(value / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              formatter={(value: number) =>
                `R$ ${value.toLocaleString("pt-BR")}`
              }
            />
            <Legend />
            <Bar
              dataKey="income"
              name="Receitas"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              name="Despesas"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
