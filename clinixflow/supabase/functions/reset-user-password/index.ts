import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    if (!callerRole) throw new Error("Insufficient permissions: only ORG_ADMIN or MANAGER can reset passwords");

    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      throw new Error("Missing required fields: userId, newPassword");
    }

    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // Verify target user belongs to the same tenant
    const { data: targetRole } = await adminClient
      .from("user_roles")
      .select("tenant_id")
      .eq("user_id", userId)
      .eq("tenant_id", callerRole.tenant_id)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!targetRole) {
      throw new Error("User not found in your organization");
    }

    // Reset the password and set must_change_password flag
    const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
      password: newPassword,
      user_metadata: { must_change_password: true },
    });

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, message: "Password reset successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
