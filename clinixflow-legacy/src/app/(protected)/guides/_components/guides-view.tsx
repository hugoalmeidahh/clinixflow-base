"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  ScrollText,
  Search,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { patientsTable } from "@/src/db/schema";

import { AddGuideForm } from "./add-guide-form";

type GuideStatus = "active" | "completed" | "expired" | "cancelled";

interface Guide {
  id: string;
  guideNumber: string;
  patientName: string;
  insuranceName: string;
  totalSessions: number;
  completedSessions: number;
  sessionValueInCents: number;
  issueDate: string;
  expiryDate: string | null;
  status: GuideStatus;
}

interface GuidesViewProps {
  guides?: Guide[];
  patients: (typeof patientsTable.$inferSelect)[];
}

const statusConfig: Record<
  GuideStatus,
  { icon: typeof CheckCircle2; className: string }
> = {
  active: { icon: Clock, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  completed: { icon: CheckCircle2, className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  expired: { icon: AlertCircle, className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  cancelled: { icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export function GuidesView({ guides = [], patients }: GuidesViewProps) {
  const t = useTranslations("guides");
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filteredGuides = guides.filter(
    (guide) =>
      guide.guideNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.insuranceName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatCurrency = (valueInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valueInCents / 100);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("active")}</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guides.filter((g) => g.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("completed")}</CardTitle>
            <CheckCircle2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guides.filter((g) => g.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("expired")}</CardTitle>
            <AlertCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guides.filter((g) => g.status === "expired").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalSessions")}</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guides.reduce((sum, g) => sum + g.completedSessions, 0)}/
              {guides.reduce((sum, g) => sum + g.totalSessions, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Sheet open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("addGuide")}
            </Button>
          </SheetTrigger>
          <AddGuideForm
            isOpen={addDialogOpen}
            patients={patients}
            onSuccess={() => setAddDialogOpen(false)}
          />
        </Sheet>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {filteredGuides.length} {filteredGuides.length === 1 ? t("guide") : t("guides")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredGuides.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
              <ScrollText className="mb-4 h-12 w-12 opacity-40" />
              <p>{t("noGuides")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("guideNumber")}</TableHead>
                    <TableHead>{t("patient")}</TableHead>
                    <TableHead>{t("insurance")}</TableHead>
                    <TableHead className="text-center">{t("completedSessions")}</TableHead>
                    <TableHead>{t("sessionValue")}</TableHead>
                    <TableHead>{t("issueDate")}</TableHead>
                    <TableHead>{t("expiryDate")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuides.map((guide) => {
                    const config = statusConfig[guide.status];
                    const StatusIcon = config.icon;
                    const remaining = guide.totalSessions - guide.completedSessions;

                    return (
                      <TableRow key={guide.id}>
                        <TableCell className="font-mono font-medium">
                          {guide.guideNumber}
                        </TableCell>
                        <TableCell>{guide.patientName}</TableCell>
                        <TableCell>{guide.insuranceName}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{guide.completedSessions}</span>
                          <span className="text-muted-foreground">/{guide.totalSessions}</span>
                          {remaining > 0 && (
                            <span className="text-muted-foreground ml-1 text-xs">
                              ({remaining} {t("remainingSessions").toLowerCase()})
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(guide.sessionValueInCents)}</TableCell>
                        <TableCell>
                          {format(new Date(guide.issueDate), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {guide.expiryDate
                            ? format(new Date(guide.expiryDate), "dd/MM/yyyy", { locale: ptBR })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={`gap-1 ${config.className}`} variant="outline">
                            <StatusIcon className="h-3 w-3" />
                            {t(guide.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
