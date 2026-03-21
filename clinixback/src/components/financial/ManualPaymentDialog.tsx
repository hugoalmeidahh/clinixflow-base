import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SubscriptionItem } from "@/hooks/useSubscriptions";

interface ManualPaymentDialogProps {
  subscription: SubscriptionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { tenantId: string; amount: number; paymentMethod: string; notes?: string }) => void;
  saving: boolean;
}

interface FormValues {
  amount: string;
  paymentMethod: string;
  notes: string;
}

export function ManualPaymentDialog({
  subscription,
  open,
  onOpenChange,
  onSubmit,
  saving,
}: ManualPaymentDialogProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: {
      amount: "",
      paymentMethod: "pix",
      notes: "",
    },
  });

  const watchMethod = watch("paymentMethod");

  const handleFormSubmit = (data: FormValues) => {
    if (!subscription) return;
    onSubmit({
      tenantId: subscription.id,
      amount: Math.round(Number(data.amount) * 100), // convert to cents
      paymentMethod: data.paymentMethod,
      notes: data.notes || undefined,
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {t("financial.manualPayment")}
          </DialogTitle>
          {subscription && (
            <p className="text-sm text-muted-foreground">{subscription.name}</p>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("financial.amount")} (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("amount", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("financial.paymentMethod")}</Label>
            <Select
              value={watchMethod}
              onValueChange={(val) => setValue("paymentMethod", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">{t("financial.pix")}</SelectItem>
                <SelectItem value="boleto">{t("financial.boleto")}</SelectItem>
                <SelectItem value="credit_card">{t("financial.creditCard")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("financial.notes")}</Label>
            <Textarea
              placeholder={t("financial.notes")}
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {t("common.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
