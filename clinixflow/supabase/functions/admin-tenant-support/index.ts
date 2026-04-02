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

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleTeam(adminClient: ReturnType<typeof createClient>, tenantId: string) {
  const { data, error } = await adminClient
    .from("user_roles")
    .select(`
      id,
      user_id,
      role,
      is_active,
      accepted_at,
      created_at,
      profiles!user_roles_user_id_fkey (
        full_name,
        email,
        phone,
        avatar_url
      )
    `)
    .eq("tenant_id", tenantId)
    .order("role", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  const result = (data || []).map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    full_name: row.profiles?.full_name ?? null,
    email: row.profiles?.email ?? null,
    phone: row.profiles?.phone ?? null,
    avatar_url: row.profiles?.avatar_url ?? null,
    role: row.role,
    is_active: row.is_active,
    accepted_at: row.accepted_at,
    created_at: row.created_at,
  }));

  // Secondary sort by full_name within each role group
  result.sort((a: any, b: any) => {
    if (a.role !== b.role) return a.role < b.role ? -1 : 1;
    return (a.full_name || "").localeCompare(b.full_name || "");
  });

  return jsonResponse(result);
}

async function handlePatients(
  adminClient: ReturnType<typeof createClient>,
  tenantId: string,
  search: string | null,
  page: number,
  pageSize: number,
) {
  let query = adminClient
    .from("patients")
    .select(
      "id, tenant_id, user_id, record_number, full_name, email, phone, cpf, date_of_birth, gender, care_type, is_active, created_at",
      { count: "exact" },
    )
    .eq("tenant_id", tenantId)
    .order("full_name", { ascending: true });

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,cpf.ilike.%${search}%,record_number.ilike.%${search}%`,
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return jsonResponse({
    data: data || [],
    total: count || 0,
    page,
    pageSize,
  });
}

async function handleAppointments(
  adminClient: ReturnType<typeof createClient>,
  tenantId: string,
  month: number,
  year: number,
  status: string | null,
  professionalId: string | null,
) {
  // Build date range for the given month/year
  const startDate = `${year}-${String(month).padStart(2, "0")}-01T00:00:00`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01T00:00:00`;

  let query = adminClient
    .from("appointments")
    .select(`
      id,
      tenant_id,
      patient_id,
      professional_id,
      specialty_id,
      room_id,
      code,
      scheduled_at,
      duration_min,
      status,
      appointment_type,
      notes,
      fee,
      created_at,
      patients!appointments_patient_id_fkey (
        full_name
      ),
      professionals!appointments_professional_id_fkey (
        full_name
      ),
      specialties!appointments_specialty_id_fkey (
        name
      )
    `)
    .eq("tenant_id", tenantId)
    .gte("scheduled_at", startDate)
    .lt("scheduled_at", endDate)
    .order("scheduled_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (professionalId) {
    query = query.eq("professional_id", professionalId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const result = (data || []).map((row: any) => ({
    id: row.id,
    tenant_id: row.tenant_id,
    patient_id: row.patient_id,
    professional_id: row.professional_id,
    specialty_id: row.specialty_id,
    room_id: row.room_id,
    code: row.code,
    scheduled_at: row.scheduled_at,
    duration_min: row.duration_min,
    status: row.status,
    appointment_type: row.appointment_type,
    notes: row.notes,
    fee: row.fee,
    created_at: row.created_at,
    patient_name: row.patients?.full_name ?? null,
    professional_name: row.professionals?.full_name ?? null,
    specialty_name: row.specialties?.name ?? null,
  }));

  return jsonResponse(result);
}

async function handleClinical(
  adminClient: ReturnType<typeof createClient>,
  tenantId: string,
  patientId: string,
) {
  const [eventsRes, evaluationsRes] = await Promise.all([
    adminClient
      .from("clinical_events")
      .select(
        "id, tenant_id, patient_id, appointment_id, event_type, performed_by, performed_at, content, metadata, is_immutable, created_at",
      )
      .eq("tenant_id", tenantId)
      .eq("patient_id", patientId)
      .order("performed_at", { ascending: false }),
    adminClient
      .from("evaluations")
      .select(`
        id,
        tenant_id,
        patient_id,
        professional_id,
        evaluation_type_id,
        appointment_id,
        form_data,
        result,
        notes,
        is_draft,
        is_locked,
        finalized_at,
        created_at,
        evaluation_types!evaluations_evaluation_type_id_fkey (
          name
        ),
        professionals!evaluations_professional_id_fkey (
          full_name
        )
      `)
      .eq("tenant_id", tenantId)
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false }),
  ]);

  if (eventsRes.error) throw eventsRes.error;
  if (evaluationsRes.error) throw evaluationsRes.error;

  const evaluations = (evaluationsRes.data || []).map((row: any) => ({
    id: row.id,
    tenant_id: row.tenant_id,
    patient_id: row.patient_id,
    professional_id: row.professional_id,
    evaluation_type_id: row.evaluation_type_id,
    appointment_id: row.appointment_id,
    form_data: row.form_data,
    result: row.result,
    notes: row.notes,
    is_draft: row.is_draft,
    is_locked: row.is_locked,
    finalized_at: row.finalized_at,
    created_at: row.created_at,
    evaluation_type_name: row.evaluation_types?.name ?? null,
    professional_name: row.professionals?.full_name ?? null,
  }));

  return jsonResponse({
    events: eventsRes.data || [],
    evaluations,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "GET") {
      throw new Error("Invalid request method");
    }

    const { adminClient } = await verifyAdmin(req);
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const tenantId = url.searchParams.get("tenantId");

    if (!tenantId) {
      return jsonResponse({ error: "Missing required parameter: tenantId" }, 400);
    }

    if (!action) {
      return jsonResponse({ error: "Missing required parameter: action" }, 400);
    }

    switch (action) {
      case "team":
        return await handleTeam(adminClient, tenantId);

      case "patients": {
        const search = url.searchParams.get("search") || null;
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get("pageSize") || "25", 10)));
        return await handlePatients(adminClient, tenantId, search, page, pageSize);
      }

      case "appointments": {
        const monthParam = url.searchParams.get("month");
        const yearParam = url.searchParams.get("year");
        if (!monthParam || !yearParam) {
          return jsonResponse({ error: "Missing required parameters: month and year" }, 400);
        }
        const month = parseInt(monthParam, 10);
        const year = parseInt(yearParam, 10);
        if (month < 1 || month > 12 || isNaN(month) || isNaN(year)) {
          return jsonResponse({ error: "Invalid month or year parameter" }, 400);
        }
        const status = url.searchParams.get("status") || null;
        const professionalId = url.searchParams.get("professionalId") || null;
        return await handleAppointments(adminClient, tenantId, month, year, status, professionalId);
      }

      case "clinical": {
        const patientId = url.searchParams.get("patientId");
        if (!patientId) {
          return jsonResponse({ error: "Missing required parameter: patientId" }, 400);
        }
        return await handleClinical(adminClient, tenantId, patientId);
      }

      default:
        return jsonResponse({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (error: any) {
    const message = error.message || "Internal server error";
    let status = 500;
    if (message === "Missing authorization" || message === "Unauthorized") status = 401;
    else if (message === "Forbidden") status = 403;
    else if (message.startsWith("Missing") || message.startsWith("Invalid")) status = 400;

    return jsonResponse({ error: message }, status);
  }
});
