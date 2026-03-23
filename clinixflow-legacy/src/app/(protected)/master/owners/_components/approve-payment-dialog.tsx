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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { approvePayment } from "@/src/actions/approve-payment";

type Owner = {
  id: string;
  name: string;
  email: string;
  plan: string | null;
  subscription: {
    needsPayment: boolean;
  } | null;
};

interface ApprovePaymentDialogProps {
  owner: Owner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  plan: z.string().min(1, "Plano é obrigatório"),
  planType: z.enum(["mensal", "trimestral", "semestral", "anual"], {
    errorMap: () => ({ message: "Tipo de plano inválido" }),
  }),
  notes: z.string().optional(),
});

export function ApprovePaymentDialog({
  owner,
  open,
  onOpenChange,
}: ApprovePaymentDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: owner.plan || "alpha",
      planType: "mensal",
      notes: "",
    },
  });

  const approveAction = useAction(approvePayment, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success(data.message || "Pagamento aprovado com sucesso!");
        onOpenChange(false);
        router.refresh();
        form.reset();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao aprovar pagamento");
    },
    onExecute: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    approveAction.execute({
      userId: owner.id,
      plan: values.plan,
      planType: values.planType,
      notes: values.notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Liberar Pagamento
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Aprovar pagamento e ativar licença para {owner.name}
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
              name="planType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período</FormLabel>
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
                    Selecione o período de pagamento
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
                    Notas internas sobre esta aprovação
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
                {isSubmitting ? "Aprovando..." : "Aprovar Pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
