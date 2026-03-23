import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Missing authorization");

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
  if (!user) throw new Error("Unauthorized");

  const role = user.app_metadata?.role || user.user_metadata?.role;
  if (role !== "SAAS_ADMIN") throw new Error("Forbidden");

  const adminClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  return { user, adminClient };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { adminClient } = await verifyAdmin(req);

    // GET: List tenant subscriptions overview
    if (req.method === "GET") {
      const { data: tenants, error } = await adminClient
        .from("tenants")
        .select("id, name, slug, subscription_status, subscription_ends_at, plan_id, plans(name, tier, price_monthly)")
        .order("name", { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify(tenants), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: Register manual payment
    if (req.method === "POST") {
      const body = await req.json();
      const { tenantId, amount, paymentMethod, notes, billingCycle } = body;

      if (!tenantId || !amount || !paymentMethod) {
        throw new Error("Missing required fields: tenantId, amount, paymentMethod");
      }

      const now = new Date();
      const cycle = billingCycle || "MONTHLY";
      const periodEnd = new Date(now);
      if (cycle === "YEARLY") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      // Get or create subscription
      const { data: existingSub } = await adminClient
        .from("subscriptions")
        .select("id, plan_id")
        .eq("tenant_id", tenantId)
        .single();

      let subscriptionId: string;

      if (existingSub) {
        // Update existing subscription
        await adminClient
          .from("subscriptions")
          .update({
            status: "ACTIVE",
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            gateway: "MANUAL",
            price_centavos: Number(amount),
            failed_payment_count: 0,
            cancel_at_period_end: false,
          })
          .eq("id", existingSub.id);
        subscriptionId = existingSub.id;
      } else {
        // Get tenant's plan
        const { data: tenant } = await adminClient
          .from("tenants")
          .select("plan_id")
          .eq("id", tenantId)
          .single();

        if (!tenant?.plan_id) throw new Error("Tenant has no plan assigned");

        const { data: newSub, error: subError } = await adminClient
          .from("subscriptions")
          .insert({
            tenant_id: tenantId,
            plan_id: tenant.plan_id,
            status: "ACTIVE",
            billing_cycle: cycle,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            gateway: "MANUAL",
            price_centavos: Number(amount),
          })
          .select("id")
          .single();

        if (subError) throw subError;
        subscriptionId = newSub.id;
      }

      // Create invoice record
      const { data: invoice, error: invError } = await adminClient
        .from("subscription_invoices")
        .insert({
          subscription_id: subscriptionId,
          tenant_id: tenantId,
          amount_centavos: Number(amount),
          status: "PAID",
          billing_cycle: cycle,
          period_start: now.toISOString(),
          period_end: periodEnd.toISOString(),
          payment_method: paymentMethod,
          payment_gateway: "MANUAL",
          paid_at: now.toISOString(),
          registered_by: (await adminClient.auth.getUser()).data.user?.id || null,
          notes: notes || null,
        })
        .select()
        .single();

      if (invError) throw invError;

      // Trigger sync handles tenant update automatically

      return new Response(JSON.stringify({ success: true, invoice }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid request method");
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : 400;
    return new Response(
      JSON.stringify({ error: error.message }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
