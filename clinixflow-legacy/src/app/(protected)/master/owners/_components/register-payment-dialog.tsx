"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { registerPayment } from "@/src/actions/register-payment";

type Owner = {
  id: string;
  name: string;
  email: string;
  plan: string | null;
};

interface RegisterPaymentDialogProps {
  owner: Owner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  plan: z.string().min(1, "Plano é obrigatório"),
  paymentPeriod: z.enum(
    ["diario", "mensal", "trimestral", "semestral", "anual"],
    {
      errorMap: () => ({ message: "Período inválido" }),
    },
  ),
  paymentDate: z.string().optional(),
  notes: z.string().optional(),
});

export function RegisterPaymentDialog({
  owner,
  open,
  onOpenChange,
}: RegisterPaymentDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: owner.plan || "alpha",
      paymentPeriod: "mensal",
      paymentDate: new Date().toISOString().split("T")[0], // Data de hoje no formato YYYY-MM-DD
      notes: "",
    },
  });

  const registerPaymentAction = useAction(registerPayment, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success(data.message || "Pagamento registrado com sucesso!");
        onOpenChange(false);
        router.refresh();
        form.reset();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao registrar pagamento");
    },
    onExecute: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerPaymentAction.execute({
      userId: owner.id,
      plan: values.plan,
      paymentPeriod: values.paymentPeriod,
      paymentDate: values.paymentDate,
      notes: values.notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Informar Pagamento
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Registre o pagamento de {owner.name} e libere acesso
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <SelectItem value="beta_partner">Beta Partner</SelectItem>
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
              name="paymentPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período Pago</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="diario">Diário (1 dia)</SelectItem>
                      <SelectItem value="mensal">Mensal (30 dias)</SelectItem>
                      <SelectItem value="trimestral">
                        Trimestral (90 dias)
                      </SelectItem>
                      <SelectItem value="semestral">
                        Semestral (180 dias)
                      </SelectItem>
                      <SelectItem value="anual">Anual (365 dias)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Período que o pagamento cobre
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Pagamento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Data em que o pagamento foi realizado
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
                    <Textarea
                      placeholder="Adicione observações sobre este pagamento..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Notas internas sobre este pagamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="w-full text-xs sm:w-auto sm:text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-xs sm:w-auto sm:text-sm"
              >
                {isSubmitting ? "Registrando..." : "Registrar Pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
