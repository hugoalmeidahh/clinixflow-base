"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CheckCircle2, Mail, User, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  markPaymentAsOverdue,
  markPaymentAsPaid,
} from "@/src/actions/mark-payment-status";

type PaymentInconsistency = {
  id: string;
  userId: string;
  expiredAt: Date;
  status: string;
  createdAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
    plan: string | null;
    planExpiresAt: Date | null;
  } | null;
};

interface PaymentInconsistenciesListProps {
  inconsistencies: PaymentInconsistency[];
}

export function PaymentInconsistenciesList({
  inconsistencies,
}: PaymentInconsistenciesListProps) {
  const router = useRouter();
  const [selectedInconsistency, setSelectedInconsistency] =
    useState<PaymentInconsistency | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"paid" | "overdue" | null>(null);
  const [notes, setNotes] = useState("");

  const markAsPaidAction = useAction(markPaymentAsPaid, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success(data.message || "Pagamento marcado como pago!");
        setIsDialogOpen(false);
        setSelectedInconsistency(null);
        setNotes("");
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao marcar como pago");
    },
  });

  const markAsOverdueAction = useAction(markPaymentAsOverdue, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success(data.message || "Marcado como inadimplente!");
        setIsDialogOpen(false);
        setSelectedInconsistency(null);
        setNotes("");
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao marcar como inadimplente");
    },
  });

  const handleMarkAsPaid = (inc: PaymentInconsistency) => {
    setSelectedInconsistency(inc);
    setActionType("paid");
    setIsDialogOpen(true);
  };

  const handleMarkAsOverdue = (inc: PaymentInconsistency) => {
    setSelectedInconsistency(inc);
    setActionType("overdue");
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedInconsistency) return;

    if (actionType === "paid") {
      markAsPaidAction.execute({
        userId: selectedInconsistency.userId,
        notes: notes || undefined,
      });
    } else if (actionType === "overdue") {
      markAsOverdueAction.execute({
        userId: selectedInconsistency.userId,
        notes: notes || undefined,
      });
    }
  };

  if (inconsistencies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhuma inconsistência encontrada</CardTitle>
          <CardDescription>
            Todos os owners estão com pagamentos em dia! 🎉
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inconsistências Pendentes</CardTitle>
          <CardDescription>
            {inconsistencies.length} owner(s) com plano vencido aguardando
            validação
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Owner</TableHead>
                  <TableHead className="hidden min-w-[180px] sm:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="min-w-[100px]">Plano</TableHead>
                  <TableHead className="hidden min-w-[120px] md:table-cell">
                    Vencido em
                  </TableHead>
                  <TableHead className="min-w-[100px]">Dias vencido</TableHead>
                  <TableHead className="min-w-[250px] text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inconsistencies.map((inc) => {
                  if (!inc.owner) return null;

                  const expiredDate = new Date(inc.expiredAt);
                  const now = new Date();
                  const daysOverdue = Math.floor(
                    (now.getTime() - expiredDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  );

                  return (
                    <TableRow key={inc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="text-muted-foreground h-4 w-4 shrink-0" />
                          <span className="text-sm font-medium">
                            {inc.owner.name}
                          </span>
                        </div>
                        <div className="mt-1 sm:hidden">
                          <div className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Mail className="h-3 w-3" />
                            <span>{inc.owner.email}</span>
                          </div>
                          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(expiredDate, "dd/MM/yyyy", {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Mail className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">{inc.owner.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {inc.owner.plan || "Sem plano"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm">
                            {format(expiredDate, "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="text-xs">
                          {daysOverdue} {daysOverdue === 1 ? "dia" : "dias"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1 sm:gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleMarkAsPaid(inc)}
                            className="bg-green-600 px-2 text-xs hover:bg-green-700 sm:px-3"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                              Marcar como Pago
                            </span>
                            <span className="sm:hidden">Pago</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleMarkAsOverdue(inc)}
                            className="px-2 text-xs sm:px-3"
                          >
                            <XCircle className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                              Inadimplente
                            </span>
                            <span className="sm:hidden">Inad.</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {actionType === "paid"
                ? "Marcar como Pago"
                : "Marcar como Inadimplente"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {actionType === "paid"
                ? `Confirmar que ${selectedInconsistency?.owner?.name} pagou?`
                : `Confirmar que ${selectedInconsistency?.owner?.name} está inadimplente? O plano será removido.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">Observações (opcional)</Label>
              <Textarea
                placeholder="Adicione observações sobre esta ação..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 text-sm"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setNotes("");
              }}
              disabled={
                markAsPaidAction.status === "executing" ||
                markAsOverdueAction.status === "executing"
              }
              className="w-full text-xs sm:w-auto sm:text-sm"
            >
              Cancelar
            </Button>
            <Button
              variant={actionType === "paid" ? "default" : "destructive"}
              onClick={handleConfirm}
              disabled={
                markAsPaidAction.status === "executing" ||
                markAsOverdueAction.status === "executing"
              }
              className="w-full text-xs sm:w-auto sm:text-sm"
            >
              {markAsPaidAction.status === "executing" ||
              markAsOverdueAction.status === "executing"
                ? "Processando..."
                : actionType === "paid"
                  ? "Confirmar Pagamento"
                  : "Confirmar Inadimplência"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
