import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  TenantTeamMember,
  TenantPatientsResponse,
  TenantAppointment,
  TenantClinicalData,
} from "@/types/tenantSupport";

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  return session.access_token;
}

export function useTenantTeam(tenantId: string) {
  return useQuery({
    queryKey: ["admin-tenant-support", "team", tenantId],
    queryFn: async (): Promise<TenantTeamMember[]> => {
      const token = await getAccessToken();
      const params = new URLSearchParams({
        action: "team",
        tenantId,
      });

      const response = await supabase.functions.invoke(
        `admin-tenant-support?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );

      if (response.error) throw new Error(response.error.message);
      return response.data as TenantTeamMember[];
    },
    enabled: !!tenantId,
    staleTime: 30_000,
  });
}

export function useTenantPatients(tenantId: string, search: string, page: number) {
  return useQuery({
    queryKey: ["admin-tenant-support", "patients", tenantId, search, page],
    queryFn: async (): Promise<TenantPatientsResponse> => {
      const token = await getAccessToken();
      const params = new URLSearchParams({
        action: "patients",
        tenantId,
        page: String(page),
        pageSize: "25",
      });
      if (search) params.set("search", search);

      const response = await supabase.functions.invoke(
        `admin-tenant-support?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );

      if (response.error) throw new Error(response.error.message);
      return response.data as TenantPatientsResponse;
    },
    enabled: !!tenantId,
    staleTime: 30_000,
  });
}

export function useTenantAppointments(
  tenantId: string,
  month: number,
  year: number,
  status?: string,
  professionalId?: string
) {
  return useQuery({
    queryKey: ["admin-tenant-support", "appointments", tenantId, month, year, status, professionalId],
    queryFn: async (): Promise<TenantAppointment[]> => {
      const token = await getAccessToken();
      const params = new URLSearchParams({
        action: "appointments",
        tenantId,
        month: String(month),
        year: String(year),
      });
      if (status) params.set("status", status);
      if (professionalId) params.set("professionalId", professionalId);

      const response = await supabase.functions.invoke(
        `admin-tenant-support?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );

      if (response.error) throw new Error(response.error.message);
      return response.data as TenantAppointment[];
    },
    enabled: !!tenantId,
    staleTime: 30_000,
  });
}

export function useTenantClinical(tenantId: string, patientId: string | null) {
  return useQuery({
    queryKey: ["admin-tenant-support", "clinical", tenantId, patientId],
    queryFn: async (): Promise<TenantClinicalData> => {
      const token = await getAccessToken();
      const params = new URLSearchParams({
        action: "clinical",
        tenantId,
        patientId: patientId!,
      });

      const response = await supabase.functions.invoke(
        `admin-tenant-support?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );

      if (response.error) throw new Error(response.error.message);
      return response.data as TenantClinicalData;
    },
    enabled: !!tenantId && !!patientId,
    staleTime: 30_000,
  });
}
