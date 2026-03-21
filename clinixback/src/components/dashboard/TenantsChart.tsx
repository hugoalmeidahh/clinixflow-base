import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TenantsChartProps {
  data: { month: string; count: number }[];
  loading?: boolean;
}

export function TenantsChart({ data, loading }: TenantsChartProps) {
  const { t } = useTranslation();

  const formattedData = data.map((d) => ({
    ...d,
    label: new Date(d.month + "-01").toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    }),
  }));

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="font-heading text-lg">
          {t("dashboard.tenantsEvolution")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("dashboard.last6Months")}</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(250, 70%, 56%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(250, 70%, 56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" className="text-xs" />
              <YAxis className="text-xs" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(250, 70%, 56%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
                name="Tenants"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
