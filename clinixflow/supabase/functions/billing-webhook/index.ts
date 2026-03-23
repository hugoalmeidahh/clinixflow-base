import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.0";
import { getPaymentGateway } from "../_shared/payment-gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const gateway = getPaymentGateway();
    const event = await gateway.parseWebhookEvent(req);

    // Find subscription by gateway customer ID or subscription ID
    const { data: subscription, error: subError } = await serviceClient
      .from("subscriptions")
      .select("*")
      .or(
        `gateway_subscription_id.eq.${event.gatewaySubscriptionId},gateway_customer_id.eq.${event.gatewayCustomerId}`
      )
      .single();

    if (subError || !subscription) {
      console.error("Subscription not found for webhook event:", event);
      // Return 200 to prevent gateway retries for unknown subscriptions
      return new Response(JSON.stringify({ received: true, matched: false }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (event.type) {
      case "payment.confirmed": {
        // Update invoice to PAID
        if (event.gatewayInvoiceId) {
          await serviceClient
            .from("subscription_invoices")
            .update({
              status: "PAID",
              paid_at: new Date().toISOString(),
              payment_method: event.paymentMethod || null,
            })
            .eq("gateway_invoice_id", event.gatewayInvoiceId);
        }

        // Calculate new period end
        const now = new Date();
        const periodEnd = new Date(now);
        if (subscription.billing_cycle === "YEARLY") {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        // Activate subscription
        await serviceClient
          .from("subscriptions")
          .update({
            status: "ACTIVE",
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            failed_payment_count: 0,
          })
          .eq("id", subscription.id);

        console.log(`Subscription ${subscription.id} activated for tenant ${subscription.tenant_id}`);
        break;
      }

      case "payment.failed": {
        const newCount = (subscription.failed_payment_count || 0) + 1;
        let newStatus = subscription.status;

        if (newCount >= 5) {
          newStatus = "SUSPENDED";
        } else if (newCount >= 3) {
          newStatus = "PAST_DUE";
        }

        await serviceClient
          .from("subscriptions")
          .update({
            failed_payment_count: newCount,
            status: newStatus,
          })
          .eq("id", subscription.id);

        // Update invoice to FAILED
        if (event.gatewayInvoiceId) {
          await serviceClient
            .from("subscription_invoices")
            .update({ status: "FAILED" })
            .eq("gateway_invoice_id", event.gatewayInvoiceId);
        }

        console.log(
          `Payment failed for subscription ${subscription.id}, count: ${newCount}, status: ${newStatus}`
        );
        break;
      }

      case "subscription.cancelled": {
        await serviceClient
          .from("subscriptions")
          .update({
            status: "CANCELLED",
            cancelled_at: new Date().toISOString(),
          })
          .eq("id", subscription.id);

        console.log(`Subscription ${subscription.id} cancelled`);
        break;
      }

      case "subscription.renewed": {
        // Create new invoice for the renewed period
        const now = new Date();
        const periodEnd = new Date(now);
        if (subscription.billing_cycle === "YEARLY") {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        await serviceClient.from("subscription_invoices").insert({
          subscription_id: subscription.id,
          tenant_id: subscription.tenant_id,
          amount_centavos: event.amountCentavos || subscription.price_centavos,
          status: "PAID",
          billing_cycle: subscription.billing_cycle,
          period_start: now.toISOString(),
          period_end: periodEnd.toISOString(),
          payment_method: event.paymentMethod || null,
          payment_gateway: subscription.gateway,
          gateway_invoice_id: event.gatewayInvoiceId || null,
          paid_at: new Date().toISOString(),
        });

        // Extend subscription period
        await serviceClient
          .from("subscriptions")
          .update({
            status: "ACTIVE",
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            failed_payment_count: 0,
          })
          .eq("id", subscription.id);

        console.log(`Subscription ${subscription.id} renewed until ${periodEnd.toISOString()}`);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true, type: event.type }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
