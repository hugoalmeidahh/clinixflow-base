"use client";

import { useTranslations } from "next-intl";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockLedgerData = [
  { month: "Jan", balance: 27000 },
  { month: "Fev", balance: 32000 },
  { month: "Mar", balance: 28500 },
  { month: "Abr", balance: 39000 },
  { month: "Mai", balance: 34000 },
  { month: "Jun", balance: 43000 },
  { month: "Jul", balance: 36000 },
  { month: "Ago", balance: 40500 },
  { month: "Set", balance: 36500 },
  { month: "Out", balance: 46000 },
  { month: "Nov", balance: 41500 },
  { month: "Dez", balance: 46000 },
];

export function LedgerSummaryChart() {
  const t = useTranslations("reports");

  return (
    <Card className="gap-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-medium">
          {t("ledgerSummary")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockLedgerData}>
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
            <Line
              type="monotone"
              dataKey="balance"
              name="Saldo"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
