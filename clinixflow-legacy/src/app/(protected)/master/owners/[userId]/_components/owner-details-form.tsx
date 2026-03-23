"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOwnerAccess } from "@/src/actions/update-owner-access";

const formSchema = z.object({
  plan: z.string().min(1, "Plano é obrigatório"),
  days: z.coerce.number().int().min(1, "Dias deve ser maior que 0"),
  notes: z.string().optional(),
});

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

interface OwnerDetailsFormProps {
  owner: Owner;
}

const getStatusBadge = (status: Owner["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Ativo</Badge>;
    case "expiring_soon":
      return <Badge className="bg-yellow-500">Expirando em breve</Badge>;
    case "expired":
      return <Badge variant="destructive">Expirado</Badge>;
    case "no_plan":
      return <Badge variant="outline">Sem Plano</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

export function OwnerDetailsForm({ owner }: OwnerDetailsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: owner.plan || "alpha",
      days: owner.daysUntilExpiration && owner.daysUntilExpiration > 0
        ? owner.daysUntilExpiration
        : 30,
      notes: "",
    },
  });

  const updateAction = useAction(updateOwnerAccess, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success(data.message || "Acesso atualizado com sucesso!");
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao atualizar acesso");
    },
    onExecute: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateAction.execute({
      userId: owner.id,
      plan: values.plan,
      days: values.days,
      notes: values.notes,
    });
  };

  return (
    <div className="space-y-6">
      {/* Informações do Owner */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Owner</CardTitle>
          <CardDescription>Dados cadastrais do owner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{owner.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{owner.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cadastrado em</p>
                <p className="font-medium">
                  {format(new Date(owner.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status Atual</p>
              <div className="mt-1">{getStatusBadge(owner.status)}</div>
            </div>
          </div>

          {owner.planExpiresAt && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Plano Atual
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Plano</p>
                  <p className="font-medium">{owner.plan || "Sem plano"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expira em</p>
                  <p className="font-medium">
                    {format(
                      new Date(owner.planExpiresAt),
                      "dd/MM/yyyy",
                      { locale: ptBR },
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Dias restantes
                  </p>
                  <p className="font-medium">
                    {owner.daysUntilExpiration !== null
                      ? owner.daysUntilExpiration > 0
                        ? `${owner.daysUntilExpiration} dias`
                        : "Expirado"
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulário de Atualização */}
      <Card>
        <CardHeader>
          <CardTitle>Atualizar Acesso</CardTitle>
          <CardDescription>
            Atualize o plano e a duração da licença do owner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="alpha">Alpha</SelectItem>
                        <SelectItem value="beta_partner">
                          Beta Partner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione o tipo de plano para o owner
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (dias)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="30"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Número de dias de acesso a partir de hoje
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Notas sobre esta atualização..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Adicione observações sobre esta atualização
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Atualizando..." : "Atualizar Acesso"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
