// Gateway-agnostic payment interface
// Implementar adapters em _shared/gateways/stripe.ts ou asaas.ts

export interface CreateCheckoutParams {
  customerEmail: string;
  customerName: string;
  customerId?: string;
  planName: string;
  priceInCentavos: number;
  billingCycle: "MONTHLY" | "YEARLY";
  tenantId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  gatewaySessionId: string;
  gatewayCustomerId: string;
}

export interface WebhookEvent {
  type:
    | "payment.confirmed"
    | "payment.failed"
    | "subscription.cancelled"
    | "subscription.renewed";
  gatewaySubscriptionId: string;
  gatewayCustomerId: string;
  gatewayInvoiceId?: string;
  amountCentavos?: number;
  paymentMethod?: "CREDIT_CARD" | "PIX" | "BOLETO";
  metadata?: Record<string, string>;
}

export interface PaymentGateway {
  createCheckoutSession(
    params: CreateCheckoutParams
  ): Promise<CheckoutResult>;
  cancelSubscription(gatewaySubscriptionId: string): Promise<void>;
  parseWebhookEvent(request: Request): Promise<WebhookEvent>;
}

export function getPaymentGateway(): PaymentGateway {
  const provider = Deno.env.get("PAYMENT_GATEWAY");

  if (!provider) {
    throw new Error(
      "PAYMENT_GATEWAY not configured. Set it via: supabase secrets set PAYMENT_GATEWAY=stripe|asaas"
    );
  }

  switch (provider) {
    case "stripe":
      throw new Error(
        "Stripe adapter not yet implemented. Create _shared/gateways/stripe.ts"
      );
    case "asaas":
      throw new Error(
        "Asaas adapter not yet implemented. Create _shared/gateways/asaas.ts"
      );
    default:
      throw new Error(`Unknown payment gateway: ${provider}`);
  }
}
