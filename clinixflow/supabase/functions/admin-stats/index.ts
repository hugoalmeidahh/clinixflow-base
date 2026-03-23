import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is SAAS_ADMIN via their JWT
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user: caller } } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!caller) throw new Error("Unauthorized");

    const role = caller.app_metadata?.role || caller.user_metadata?.role;
    if (role !== "SAAS_ADMIN") throw new Error("Forbidden: not a platform admin");

    // Use service_role to bypass RLS
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Get active tenants count
    const { count: activeTenants } = await adminClient
      .from("tenants")
      .select("*", { count: "exact", head: true })
      .eq("subscription_status", "active");

    // Get new tenants this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newThisMonth } = await adminClient
      .from("tenants")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());

    // Calculate MRR from active subscriptions
    const { data: activeSubscriptions } = await adminClient
      .from("subscriptions")
      .select("price_centavos, billing_cycle")
      .eq("status", "ACTIVE");

    const mrr = (activeSubscriptions || []).reduce((sum, s) => {
      // Normalize yearly to monthly for MRR
      const monthlyPrice =
        s.billing_cycle === "YEARLY"
          ? Math.round(s.price_centavos / 12)
          : s.price_centavos;
      return sum + monthlyPrice;
    }, 0);

    // Get tenant counts per month for last 6 months
    const months: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const { count } = await adminClient
        .from("tenants")
        .select("*", { count: "exact", head: true })
        .lte("created_at", end.toISOString());

      months.push({
        month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
        count: count || 0,
      });
    }

    // Get total tenants count
    const { count: totalTenants } = await adminClient
      .from("tenants")
      .select("*", { count: "exact", head: true });

    return new Response(
      JSON.stringify({
        activeTenants: activeTenants || 0,
        newThisMonth: newThisMonth || 0,
        mrr,
        totalTenants: totalTenants || 0,
        tenantsOverTime: months,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: error.message === "Forbidden: not a platform admin" ? 403 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
