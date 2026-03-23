"use client";

import { useTranslations } from "next-intl";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockProfitabilityData = [
  { name: "Cardiologia", value: 35000, color: "#6366f1" },
  { name: "Dermatologia", value: 28000, color: "#22c55e" },
  { name: "Ortopedia", value: 22000, color: "#f59e0b" },
  { name: "Pediatria", value: 18000, color: "#ef4444" },
  { name: "Neurologia", value: 15000, color: "#8b5cf6" },
  { name: "Outros", value: 12000, color: "#94a3b8" },
];

export function ProfitabilityBySpecialtyChart() {
  const t = useTranslations("reports");

  return (
    <Card className="gap-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-medium">
          {t("profitabilityBySpecialty")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={mockProfitabilityData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={true}
            >
              {mockProfitabilityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                `R$ ${value.toLocaleString("pt-BR")}`
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
