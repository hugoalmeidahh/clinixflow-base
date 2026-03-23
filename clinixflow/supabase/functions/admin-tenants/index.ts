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
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // GET: List tenants
    if (req.method === "GET" && !action) {
      const search = url.searchParams.get("search") || "";
      const status = url.searchParams.get("status") || "";

      let query = adminClient
        .from("tenants")
        .select("*, plans(name, tier)")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
      }

      if (status && status !== "all") {
        query = query.eq("subscription_status", status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET: Tenant details with stats
    if (req.method === "GET" && action === "details") {
      const tenantId = url.searchParams.get("id");
      if (!tenantId) throw new Error("Missing tenant id");

      const [tenantRes, usersRes, patientsRes, appointmentsRes] = await Promise.all([
        adminClient
          .from("tenants")
          .select("*, plans(name, tier, price_monthly, price_yearly, allowed_modules, max_users, max_patients)")
          .eq("id", tenantId)
          .single(),
        adminClient
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", tenantId)
          .eq("is_active", true),
        adminClient
          .from("patients")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", tenantId),
        adminClient
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", tenantId),
      ]);

      if (tenantRes.error) throw tenantRes.error;

      return new Response(
        JSON.stringify({
          tenant: tenantRes.data,
          stats: {
            users: usersRes.count || 0,
            patients: patientsRes.count || 0,
            appointments: appointmentsRes.count || 0,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST: Suspend or reactivate tenant
    if (req.method === "POST") {
      const body = await req.json();
      const { tenantId, action: tenantAction } = body;

      if (!tenantId || !["suspend", "reactivate"].includes(tenantAction)) {
        throw new Error("Invalid request: tenantId and action (suspend|reactivate) required");
      }

      const newStatus = tenantAction === "suspend" ? "suspended" : "active";

      const { error } = await adminClient
        .from("tenants")
        .update({ subscription_status: newStatus })
        .eq("id", tenantId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, status: newStatus }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
