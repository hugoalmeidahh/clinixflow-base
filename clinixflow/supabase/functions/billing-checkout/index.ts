import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.0";
import { getPaymentGateway } from "../_shared/payment-gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Missing authorization");

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonClient = createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );
  const {
    data: { user },
  } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
  if (!user) throw new Error("Unauthorized");

  const serviceClient = createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get user's tenant and role
  const { data: userRole } = await serviceClient
    .from("user_roles")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!userRole) throw new Error("No active tenant role");

  return { user, userRole, serviceClient };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user, userRole, serviceClient } = await getAuthenticatedUser(req);

    // GET: Current subscription + plan info
    if (req.method === "GET") {
      const { data: subscription } = await serviceClient
        .from("subscriptions")
        .select("*, plans(name, tier, price_monthly, price_yearly, max_users, max_patients, allowed_modules)")
        .eq("tenant_id", userRole.tenant_id)
        .single();

      const { data: tenant } = await serviceClient
        .from("tenants")
        .select("name, email, active_modules, gateway_customer_id")
        .eq("id", userRole.tenant_id)
        .single();

      // Usage stats
      const { count: userCount } = await serviceClient
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", userRole.tenant_id)
        .eq("is_active", true);

      const { count: patientCount } = await serviceClient
        .from("patients")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", userRole.tenant_id)
        .eq("is_active", true);

      return jsonResponse({
        subscription,
        tenant,
        usage: {
          currentUsers: userCount || 0,
          currentPatients: patientCount || 0,
        },
      });
    }

    // POST: Create checkout session (ORG_ADMIN only)
    if (req.method === "POST") {
      if (userRole.role !== "ORG_ADMIN") {
        return jsonResponse({ error: "Only ORG_ADMIN can manage subscriptions" }, 403);
      }

      const { planId, billingCycle } = await req.json();
      if (!planId || !billingCycle) {
        return jsonResponse({ error: "planId and billingCycle are required" }, 400);
      }

      // Fetch plan
      const { data: plan, error: planError } = await serviceClient
        .from("plans")
        .select("*")
        .eq("id", planId)
        .eq("is_active", true)
        .single();

      if (planError || !plan) {
        return jsonResponse({ error: "Plan not found or inactive" }, 404);
      }

      const priceInCentavos =
        billingCycle === "YEARLY" ? plan.price_yearly : plan.price_monthly;

      // Fetch tenant info for checkout
      const { data: tenant } = await serviceClient
        .from("tenants")
        .select("name, email, gateway_customer_id")
        .eq("id", userRole.tenant_id)
        .single();

      if (!tenant) {
        return jsonResponse({ error: "Tenant not found" }, 404);
      }

      // Get or create subscription row
      const { data: existingSub } = await serviceClient
        .from("subscriptions")
        .select("id, gateway_customer_id")
        .eq("tenant_id", userRole.tenant_id)
        .single();

      const gateway = getPaymentGateway();
      const appUrl = Deno.env.get("APP_URL") || "http://localhost:8080";

      const checkoutResult = await gateway.createCheckoutSession({
        customerEmail: tenant.email || user.email || "",
        customerName: tenant.name,
        customerId: existingSub?.gateway_customer_id || tenant.gateway_customer_id || undefined,
        planName: plan.name,
        priceInCentavos,
        billingCycle,
        tenantId: userRole.tenant_id,
        successUrl: `${appUrl}/settings?tab=subscription&status=success`,
        cancelUrl: `${appUrl}/settings?tab=subscription&status=cancelled`,
      });

      // Calculate period
      const now = new Date();
      const periodEnd = new Date(now);
      if (billingCycle === "YEARLY") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      // Upsert subscription
      if (existingSub) {
        await serviceClient
          .from("subscriptions")
          .update({
            plan_id: planId,
            billing_cycle: billingCycle,
            gateway: Deno.env.get("PAYMENT_GATEWAY") as any,
            gateway_subscription_id: checkoutResult.gatewaySessionId,
            gateway_customer_id: checkoutResult.gatewayCustomerId,
            price_centavos: priceInCentavos,
          })
          .eq("id", existingSub.id);
      } else {
        await serviceClient.from("subscriptions").insert({
          tenant_id: userRole.tenant_id,
          plan_id: planId,
          status: "TRIAL",
          billing_cycle: billingCycle,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          gateway: Deno.env.get("PAYMENT_GATEWAY") as any,
          gateway_subscription_id: checkoutResult.gatewaySessionId,
          gateway_customer_id: checkoutResult.gatewayCustomerId,
          price_centavos: priceInCentavos,
        });
      }

      // Create pending invoice
      await serviceClient.from("subscription_invoices").insert({
        subscription_id: existingSub?.id || (
          await serviceClient
            .from("subscriptions")
            .select("id")
            .eq("tenant_id", userRole.tenant_id)
            .single()
        ).data?.id,
        tenant_id: userRole.tenant_id,
        amount_centavos: priceInCentavos,
        status: "PENDING",
        billing_cycle: billingCycle,
        period_start: now.toISOString(),
        period_end: periodEnd.toISOString(),
        payment_gateway: Deno.env.get("PAYMENT_GATEWAY") as any,
        gateway_invoice_id: checkoutResult.gatewaySessionId,
        due_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });

      return jsonResponse({ checkoutUrl: checkoutResult.checkoutUrl });
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (error: any) {
    const status =
      error.message === "Unauthorized" || error.message === "Missing authorization"
        ? 401
        : 400;
    return new Response(JSON.stringify({ error: error.message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
