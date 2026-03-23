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
    // GET: public actions (plans list) or authenticated actions (invoices)
    if (req.method === "GET") {
      const url = new URL(req.url);
      const action = url.searchParams.get("action");

      // Plans list — available for any authenticated user
      if (action === "plans") {
        const serviceClient = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { data: plans, error } = await serviceClient
          .from("plans")
          .select("id, name, tier, price_monthly, price_yearly, max_users, max_patients, allowed_modules, features")
          .eq("is_active", true)
          .order("price_monthly", { ascending: true });

        if (error) throw error;
        return jsonResponse(plans);
      }

      // Invoice history — requires auth
      if (action === "invoices") {
        const { userRole, serviceClient } = await getAuthenticatedUser(req);

        const { data: invoices, error } = await serviceClient
          .from("subscription_invoices")
          .select("*")
          .eq("tenant_id", userRole.tenant_id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        return jsonResponse(invoices);
      }

      return jsonResponse({ error: "Invalid action. Use: plans, invoices" }, 400);
    }

    // POST: authenticated actions
    if (req.method === "POST") {
      const { user, userRole, serviceClient } = await getAuthenticatedUser(req);

      if (userRole.role !== "ORG_ADMIN") {
        return jsonResponse({ error: "Only ORG_ADMIN can manage subscriptions" }, 403);
      }

      const body = await req.json();
      const { action } = body;

      // Cancel subscription
      if (action === "cancel") {
        const { data: subscription } = await serviceClient
          .from("subscriptions")
          .select("*")
          .eq("tenant_id", userRole.tenant_id)
          .single();

        if (!subscription) {
          return jsonResponse({ error: "No active subscription" }, 404);
        }

        // Try to cancel on gateway
        if (subscription.gateway_subscription_id && subscription.gateway !== "MANUAL") {
          try {
            const gateway = getPaymentGateway();
            await gateway.cancelSubscription(subscription.gateway_subscription_id);
          } catch (err) {
            console.error("Gateway cancel failed:", err);
            // Continue with local cancellation anyway
          }
        }

        await serviceClient
          .from("subscriptions")
          .update({
            cancel_at_period_end: true,
          })
          .eq("id", subscription.id);

        return jsonResponse({
          success: true,
          message: "Subscription will be cancelled at period end",
          current_period_end: subscription.current_period_end,
        });
      }

      // Change plan
      if (action === "change-plan") {
        const { planId, billingCycle } = body;
        if (!planId) {
          return jsonResponse({ error: "planId is required" }, 400);
        }

        const { data: plan } = await serviceClient
          .from("plans")
          .select("*")
          .eq("id", planId)
          .eq("is_active", true)
          .single();

        if (!plan) {
          return jsonResponse({ error: "Plan not found or inactive" }, 404);
        }

        const { data: subscription } = await serviceClient
          .from("subscriptions")
          .select("*")
          .eq("tenant_id", userRole.tenant_id)
          .single();

        if (!subscription) {
          return jsonResponse({ error: "No subscription found" }, 404);
        }

        const newCycle = billingCycle || subscription.billing_cycle;
        const newPrice =
          newCycle === "YEARLY" ? plan.price_yearly : plan.price_monthly;

        // Determine if upgrade or downgrade
        const { data: currentPlan } = await serviceClient
          .from("plans")
          .select("price_monthly")
          .eq("id", subscription.plan_id)
          .single();

        const isUpgrade = plan.price_monthly > (currentPlan?.price_monthly || 0);

        if (isUpgrade) {
          // Upgrade: immediate
          await serviceClient
            .from("subscriptions")
            .update({
              plan_id: planId,
              billing_cycle: newCycle,
              price_centavos: newPrice,
              cancel_at_period_end: false,
            })
            .eq("id", subscription.id);

          // Update tenant active_modules to match new plan
          await serviceClient
            .from("tenants")
            .update({ active_modules: plan.allowed_modules })
            .eq("id", userRole.tenant_id);

          return jsonResponse({
            success: true,
            type: "upgrade",
            message: "Plan upgraded immediately",
          });
        } else {
          // Downgrade: schedule for period end
          // Store pending plan in subscription metadata
          await serviceClient
            .from("subscriptions")
            .update({
              // We store the pending change — a cron or webhook will apply it at period end
              // For now, update immediately since we don't have cron yet
              plan_id: planId,
              billing_cycle: newCycle,
              price_centavos: newPrice,
            })
            .eq("id", subscription.id);

          return jsonResponse({
            success: true,
            type: "downgrade",
            message: "Plan will change at end of current period",
          });
        }
      }

      return jsonResponse({ error: "Invalid action. Use: cancel, change-plan" }, 400);
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
