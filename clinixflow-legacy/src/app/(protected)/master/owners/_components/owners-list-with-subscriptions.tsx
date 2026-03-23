"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CreditCard, DollarSign,Mail, User } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ApprovePaymentDialog } from "./approve-payment-dialog";
import { RegisterPaymentDialog } from "./register-payment-dialog";

type OwnerWithSubscription = {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string | null;
  planExpiresAt: Date | null;
  activatedByCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  planStatus: "active" | "expiring_soon" | "expired" | "no_plan";
  daysUntilExpiration: number | null;
  subscription: {
    id: string;
    status: string;
    paymentStatus: string;
    planType: string;
    amount: number;
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    needsPayment: boolean;
  } | null;
};

interface OwnersListWithSubscriptionsProps {
  owners: OwnerWithSubscription[];
}

const getStatusBadge = (status: OwnerWithSubscription["planStatus"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Ativo</Badge>;
    case "expiring_soon":
      return <Badge className="bg-yellow-500">Expirando</Badge>;
    case "expired":
      return <Badge variant="destructive">Expirado</Badge>;
    case "no_plan":
      return <Badge variant="outline">Sem Plano</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getPaymentStatusBadge = (paymentStatus: string, needsPayment: boolean) => {
  if (needsPayment) {
    return <Badge variant="destructive">Pendente</Badge>;
  }
  if (paymentStatus === "paid") {
    return <Badge className="bg-green-500">Pago</Badge>;
  }
  return <Badge variant="outline">{paymentStatus}</Badge>;
};

export function OwnersListWithSubscriptions({
  owners,
}: OwnersListWithSubscriptionsProps) {
  const [selectedOwnerForApprove, setSelectedOwnerForApprove] =
    useState<OwnerWithSubscription | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  const [selectedOwnerForPayment, setSelectedOwnerForPayment] =
    useState<OwnerWithSubscription | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handleApprovePayment = (owner: OwnerWithSubscription) => {
    setSelectedOwnerForApprove(owner);
    setIsApproveDialogOpen(true);
  };

  const handleRegisterPayment = (owner: OwnerWithSubscription) => {
    setSelectedOwnerForPayment(owner);
    setIsPaymentDialogOpen(true);
  };

  if (owners.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum owner encontrado</CardTitle>
          <CardDescription>
            Não há owners cadastrados no sistema ainda.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Owners</CardTitle>
          <CardDescription>
            Gerencie acesso, licenças e pagamentos dos owners
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Nome</TableHead>
                  <TableHead className="min-w-[180px] hidden sm:table-cell">Email</TableHead>
                  <TableHead className="min-w-[100px]">Plano</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[100px] hidden md:table-cell">Pagamento</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Expira em</TableHead>
                  <TableHead className="text-right min-w-[200px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm">{owner.name}</span>
                      </div>
                      <div className="sm:hidden mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{owner.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{owner.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {owner.plan || "Sem plano"}
                      </span>
                      {owner.subscription && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {owner.subscription.planType}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(owner.planStatus)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {owner.subscription ? (
                        <div className="space-y-1">
                          {getPaymentStatusBadge(
                            owner.subscription.paymentStatus,
                            owner.subscription.needsPayment,
                          )}
                          {owner.subscription.status && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {owner.subscription.status}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {owner.planExpiresAt ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(owner.planExpiresAt), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                            {owner.daysUntilExpiration !== null &&
                              owner.daysUntilExpiration > 0 && (
                                <span className="ml-2 text-muted-foreground">
                                  ({owner.daysUntilExpiration} dias)
                                </span>
                              )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegisterPayment(owner)}
                          className="text-xs px-2 sm:px-3"
                        >
                          <DollarSign className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Informar Pagamento</span>
                          <span className="sm:hidden">Pagamento</span>
                        </Button>
                        {(owner.subscription?.needsPayment ||
                          !owner.subscription ||
                          owner.planStatus === "expired") && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprovePayment(owner)}
                            className="text-xs px-2 sm:px-3"
                          >
                            <CreditCard className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Liberar Acesso</span>
                            <span className="sm:hidden">Liberar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedOwnerForApprove && (
        <ApprovePaymentDialog
          owner={selectedOwnerForApprove}
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
        />
      )}

      {selectedOwnerForPayment && (
        <RegisterPaymentDialog
          owner={selectedOwnerForPayment}
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        />
      )}
    </>
  );
}
