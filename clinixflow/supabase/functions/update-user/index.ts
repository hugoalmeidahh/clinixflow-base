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

    // Verify caller is authenticated
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!);
    const { data: { user: caller } } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!caller) throw new Error("Unauthorized");

    const adminClient = createClient(supabaseUrl, serviceKey);

    // Check caller has ORG_ADMIN or MANAGER role
    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("tenant_id, role")
      .eq("user_id", caller.id)
      .eq("is_active", true)
      .in("role", ["ORG_ADMIN", "MANAGER"])
      .limit(1)
      .single();

    if (!callerRole) throw new Error("Insufficient permissions: only ORG_ADMIN or MANAGER can edit users");

    const { userId, fullName, email } = await req.json();

    if (!userId) throw new Error("Missing required field: userId");
    if (!fullName && !email) throw new Error("Provide at least one field to update: fullName or email");

    // Verify target user belongs to the same tenant
    const { data: targetRole } = await adminClient
      .from("user_roles")
      .select("tenant_id")
      .eq("user_id", userId)
      .eq("tenant_id", callerRole.tenant_id)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!targetRole) throw new Error("User not found in your organization");

    // Update email in auth.users if provided
    if (email) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(userId, { email });
      if (authError) throw authError;
    }

    // Update profile (full_name and/or email)
    const profileUpdate: Record<string, string> = {};
    if (fullName) profileUpdate.full_name = fullName;
    if (email) profileUpdate.email = email;

    const { error: profileError } = await adminClient
      .from("profiles")
      .update(profileUpdate)
      .eq("user_id", userId);

    if (profileError) throw profileError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
