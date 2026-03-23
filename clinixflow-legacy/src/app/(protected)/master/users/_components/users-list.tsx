"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { KeyRound, Mail, Search, User } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChangePasswordDialog } from "./change-password-dialog";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string | null;
  createdAt: Date;
};

interface UsersListProps {
  users: UserItem[];
}

const getRoleBadge = (role: string) => {
  const roleMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    master: { label: "Master", variant: "destructive" },
    clinic_owner: { label: "Owner", variant: "default" },
    clinic_admin: { label: "Admin", variant: "default" },
    clinic_gestor: { label: "Gestor", variant: "secondary" },
    clinic_recepcionist: { label: "Recepcionista", variant: "secondary" },
    doctor: { label: "Profissional", variant: "outline" },
    patient: { label: "Paciente", variant: "outline" },
  };

  const config = roleMap[role] || { label: role, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function UsersList({ users }: UsersListProps) {
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChangePassword = (user: UserItem) => {
    setSelectedUser(user);
    setIsPasswordDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Gerencie senhas e visualize todos os usuários cadastrados
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <User className="mb-2 h-8 w-8" />
              <p>Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Nome</TableHead>
                    <TableHead className="min-w-[200px] hidden sm:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="min-w-[100px]">Role</TableHead>
                    <TableHead className="min-w-[100px] hidden md:table-cell">
                      Plano
                    </TableHead>
                    <TableHead className="min-w-[120px] hidden lg:table-cell">
                      Criado em
                    </TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium text-sm">
                            {user.name}
                          </span>
                        </div>
                        <div className="sm:hidden mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">
                          {user.plan || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">
                          {format(new Date(user.createdAt), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChangePassword(user)}
                          className="text-xs"
                        >
                          <KeyRound className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Alterar Senha</span>
                          <span className="sm:hidden">Senha</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <ChangePasswordDialog
          user={selectedUser}
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
        />
      )}
    </>
  );
}
