"use client";

import { BookOpen, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { FinanceStatsCards } from "./finance-stats-cards";
import { MonthSelector } from "./month-selector";
import { RevenueByInsuranceChart } from "./revenue-by-insurance-chart";
import { RevenueDistributionChart } from "./revenue-distribution-chart";

interface FinanceDashboardContentProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  averageTicket: number;
  revenueBySpecialty: { name: string; value: number }[];
  revenueByInsurance: { name: string; value: number }[];
}

export function FinanceDashboardContent({
  totalRevenue,
  totalExpenses,
  netProfit,
  averageTicket,
  revenueBySpecialty,
  revenueByInsurance,
}: FinanceDashboardContentProps) {
  const t = useTranslations("finance");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Month selector and quick links */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <MonthSelector />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/finance/cash-book">
              <BookOpen className="h-4 w-4" />
              {t("cashBook")}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/finance/closing">
              <CalendarCheck className="h-4 w-4" />
              {t("monthlyClosing")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <FinanceStatsCards
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        averageTicket={averageTicket}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
        <RevenueDistributionChart data={revenueBySpecialty} />
        <RevenueByInsuranceChart data={revenueByInsurance} />
      </div>
    </div>
  );
}
