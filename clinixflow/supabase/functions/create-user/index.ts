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

    // Verify caller is authenticated and has admin role
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!);
    const { data: { user: caller } } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!caller) throw new Error("Unauthorized");

    const adminClient = createClient(supabaseUrl, serviceKey);

    // Check caller has ORG_ADMIN role
    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("tenant_id, role")
      .eq("user_id", caller.id)
      .eq("is_active", true)
      .in("role", ["ORG_ADMIN", "MANAGER"])
      .limit(1)
      .single();

    if (!callerRole) throw new Error("Insufficient permissions");

    const { email, password, fullName, role, professionalId } = await req.json();

    if (!email || !password || !fullName || !role) {
      throw new Error("Missing required fields: email, password, fullName, role");
    }

    // Check if email already exists
    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (existingProfile) {
      throw new Error("Já existe um usuário com este e-mail.");
    }

    // Create the user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        must_change_password: true,
      },
    });

    if (createError) throw createError;

    // Create profile
    await adminClient.from("profiles").upsert({
      user_id: newUser.user.id,
      email,
      full_name: fullName,
    }, { onConflict: "user_id" });

    // Create user_role
    await adminClient.from("user_roles").insert({
      user_id: newUser.user.id,
      tenant_id: callerRole.tenant_id,
      role,
      accepted_at: new Date().toISOString(),
    });

    // Link to professional record if provided
    if (professionalId) {
      await adminClient.from("professionals")
        .update({ user_id: newUser.user.id })
        .eq("id", professionalId)
        .eq("tenant_id", callerRole.tenant_id);
    }

    return new Response(
      JSON.stringify({ success: true, userId: newUser.user.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
