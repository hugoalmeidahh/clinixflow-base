"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, Calendar, Mail, User } from "lucide-react";
import Link from "next/link";

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

type Owner = {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string | null;
  planExpiresAt: Date | null;
  activatedByCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "expiring_soon" | "expired" | "no_plan";
  daysUntilExpiration: number | null;
};

interface OwnersListProps {
  owners: Owner[];
}

const getStatusBadge = (status: Owner["status"]) => {
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

export function OwnersList({ owners }: OwnersListProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Lista de Owners</CardTitle>
        <CardDescription>
          Clique em um owner para ver detalhes e gerenciar acesso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expira em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {owners.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{owner.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{owner.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {owner.plan || "Sem plano"}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(owner.status)}</TableCell>
                <TableCell>
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
                  <Link href={`/master/owners/${owner.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
