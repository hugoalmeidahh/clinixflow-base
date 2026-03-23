import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// ── Patient profile ─────────────────────────────────────────────────────────

export const usePatientProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("patients")
        .select("*, conventions(name)")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });
};

// ── Appointments ─────────────────────────────────────────────────────────────

export const usePatientAppointments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient-appointments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      // Get patient id first
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!patient) return [];

      const { data, error } = await supabase
        .from("appointments")
        .select("*, professionals(full_name), specialties(name), rooms(name)")
        .eq("patient_id", patient.id)
        .order("scheduled_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
};

export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "CONFIRMED" as any, confirmed_at: new Date().toISOString() })
        .eq("id", appointmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments", user?.id] });
    },
  });
};

// ── Documents ─────────────────────────────────────────────────────────────────

export const usePatientDocuments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient-documents", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!patient) return [];

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("patient_id", patient.id)
        .in("category", ["ATTENDANCE_CERTIFICATE", "MEDICAL_REQUEST", "LAB_RESULT", "INSURANCE_AUTHORIZATION"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
};

export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: async (fileUrl: string) => {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(fileUrl, 60);
      if (error) throw error;
      return data.signedUrl;
    },
  });
};

// ── Booking Requests ──────────────────────────────────────────────────────────

export const useBookingRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["booking-requests", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!patient) return [];

      const { data, error } = await (supabase as any)
        .from("appointment_booking_requests")
        .select("*")
        .eq("patient_id", patient.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
};

export const useCreateBookingRequest = () => {
  const queryClient = useQueryClient();
  const { user, tenantId } = useAuth();

  return useMutation({
    mutationFn: async (payload: {
      preferred_date_1: string;
      preferred_date_2?: string;
      preferred_date_3?: string;
      notes?: string;
    }) => {
      if (!user?.id || !tenantId) throw new Error("Not authenticated");

      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!patient) throw new Error("Patient profile not found");

      const { error } = await (supabase as any)
        .from("appointment_booking_requests")
        .insert({
          tenant_id: tenantId,
          patient_id: patient.id,
          ...payload,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-requests", user?.id] });
    },
  });
};
