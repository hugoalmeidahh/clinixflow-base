"use client";

import { BarChart3, CalendarDays, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const reportCategories = [
  {
    titleKey: "financialReports" as const,
    descriptionKey: "financialReportsDesc" as const,
    href: "/reports/financial",
    icon: DollarSign,
    gradient: "from-emerald-500 to-green-600",
  },
  {
    titleKey: "appointmentReports" as const,
    descriptionKey: "appointmentReportsDesc" as const,
    href: "/reports/appointments",
    icon: CalendarDays,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    titleKey: "performanceReports" as const,
    descriptionKey: "performanceReportsDesc" as const,
    href: "/reports/performance",
    icon: BarChart3,
    gradient: "from-purple-500 to-violet-600",
  },
  {
    titleKey: "patientReports" as const,
    descriptionKey: "patientReportsDesc" as const,
    href: "/reports/patients",
    icon: Users,
    gradient: "from-orange-500 to-amber-600",
  },
];

export function ReportsHub() {
  const t = useTranslations("reports");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {reportCategories.map((category) => {
        const Icon = category.icon;
        return (
          <Link key={category.href} href={category.href}>
            <Card className="min-w-0 gap-2 border-border shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div
                  className={`bg-gradient-to-br ${category.gradient} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm sm:text-base font-semibold truncate">
                    {t(category.titleKey)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm line-clamp-3">
                  {t(category.descriptionKey)}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
