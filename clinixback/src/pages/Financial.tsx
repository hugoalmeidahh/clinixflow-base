import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useSubscriptions,
  useRegisterPayment,
  type SubscriptionItem,
} from "@/hooks/useSubscriptions";
import { SubscriptionsTable } from "@/components/financial/SubscriptionsTable";
import { ManualPaymentDialog } from "@/components/financial/ManualPaymentDialog";

export default function Financial() {
  const { t } = useTranslation();
  const { data: subscriptions, isLoading } = useSubscriptions();
  const registerPayment = useRegisterPayment();
  const [paymentTarget, setPaymentTarget] = useState<SubscriptionItem | null>(null);

  const handlePayment = (data: {
    tenantId: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
  }) => {
    registerPayment.mutate(data, {
      onSuccess: () => setPaymentTarget(null),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">{t("financial.title")}</h1>

      <SubscriptionsTable
        subscriptions={subscriptions || []}
        loading={isLoading}
        onRegisterPayment={setPaymentTarget}
      />

      <ManualPaymentDialog
        subscription={paymentTarget}
        open={!!paymentTarget}
        onOpenChange={(open) => !open && setPaymentTarget(null)}
        onSubmit={handlePayment}
        saving={registerPayment.isPending}
      />
    </div>
  );
}
