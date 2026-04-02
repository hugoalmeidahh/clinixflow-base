import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTenantTeam } from "@/hooks/useTenantSupport";
import { cn } from "@/lib/utils";
import type { TenantTeamMember } from "@/types/tenantSupport";

interface TenantTeamTabProps {
  tenantId: string;
}

const ROLE_COLORS: Record<TenantTeamMember["role"], string> = {
  ORG_ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  MANAGER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  HEALTH_PROFESSIONAL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  RECEPTIONIST: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  FINANCIAL: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PATIENT: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function TenantTeamTab({ tenantId }: TenantTeamTabProps) {
  const { t } = useTranslation();
  const { data: members, isLoading, error } = useTenantTeam(tenantId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("tenantSupport.team.title")}</span>
          {members && (
            <span className="text-sm font-normal text-muted-foreground">
              {t("tenantSupport.team.totalMembers", { count: members.length })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-destructive">
            {t("common.error")}
          </div>
        ) : !members || members.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            {t("tenantSupport.team.noMembers")}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("tenantSupport.team.name")}</TableHead>
                <TableHead>{t("tenantSupport.team.email")}</TableHead>
                <TableHead>{t("tenantSupport.team.phone")}</TableHead>
                <TableHead>{t("tenantSupport.team.role")}</TableHead>
                <TableHead>{t("tenantSupport.team.status")}</TableHead>
                <TableHead>{t("tenantSupport.team.memberSince")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.full_name || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.phone || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("font-medium", ROLE_COLORS[member.role])}
                    >
                      {t(`tenantSupport.team.roles.${member.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        member.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      )}
                    >
                      {member.is_active
                        ? t("tenantSupport.team.active")
                        : t("tenantSupport.team.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
