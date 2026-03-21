export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointment_code_sequences: {
        Row: {
          last_number: number
          tenant_id: string
          year: number
        }
        Insert: {
          last_number?: number
          tenant_id: string
          year: number
        }
        Update: {
          last_number?: number
          tenant_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "appointment_code_sequences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          absence_justified: boolean | null
          absence_reason: string | null
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          attended_at: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          code: string
          confirmed_at: string | null
          created_at: string
          created_by: string | null
          duration_min: number
          fee: number | null
          id: string
          notes: string | null
          original_appointment_id: string | null
          patient_id: string
          professional_id: string
          recurrence_group_id: string | null
          room_id: string | null
          scheduled_at: string
          specialty_id: string
          status: Database["public"]["Enums"]["appointment_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          absence_justified?: boolean | null
          absence_reason?: string | null
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          attended_at?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          code: string
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          duration_min?: number
          fee?: number | null
          id?: string
          notes?: string | null
          original_appointment_id?: string | null
          patient_id: string
          professional_id: string
          recurrence_group_id?: string | null
          room_id?: string | null
          scheduled_at: string
          specialty_id: string
          status?: Database["public"]["Enums"]["appointment_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          absence_justified?: boolean | null
          absence_reason?: string | null
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          attended_at?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          code?: string
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          duration_min?: number
          fee?: number | null
          id?: string
          notes?: string | null
          original_appointment_id?: string | null
          patient_id?: string
          professional_id?: string
          recurrence_group_id?: string | null
          room_id?: string | null
          scheduled_at?: string
          specialty_id?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_original_appointment_id_fkey"
            columns: ["original_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_events: {
        Row: {
          appointment_id: string | null
          content: string | null
          created_at: string
          event_type: Database["public"]["Enums"]["clinical_event_type"]
          id: string
          ip_address: string | null
          is_immutable: boolean
          metadata: Json | null
          patient_id: string
          performed_at: string
          performed_by: string
          tenant_id: string
        }
        Insert: {
          appointment_id?: string | null
          content?: string | null
          created_at?: string
          event_type: Database["public"]["Enums"]["clinical_event_type"]
          id?: string
          ip_address?: string | null
          is_immutable?: boolean
          metadata?: Json | null
          patient_id: string
          performed_at?: string
          performed_by: string
          tenant_id: string
        }
        Update: {
          appointment_id?: string | null
          content?: string | null
          created_at?: string
          event_type?: Database["public"]["Enums"]["clinical_event_type"]
          id?: string
          ip_address?: string | null
          is_immutable?: boolean
          metadata?: Json | null
          patient_id?: string
          performed_at?: string
          performed_by?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_events_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_events_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      conventions: {
        Row: {
          cnpj: string | null
          contact: string | null
          created_at: string
          default_fee_table: Json | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          contact?: string | null
          created_at?: string
          default_fee_table?: Json | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          contact?: string | null
          created_at?: string
          default_fee_table?: Json | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conventions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          content_html: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          template_type: string
          tenant_id: string
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          content_html: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          template_type: string
          tenant_id: string
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          content_html?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          template_type?: string
          tenant_id?: string
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          created_by: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_generated: boolean
          name: string
          patient_id: string
          template_type: string | null
          tenant_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          created_by?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_generated?: boolean
          name: string
          patient_id: string
          template_type?: string | null
          tenant_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          created_by?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_generated?: boolean
          name?: string
          patient_id?: string
          template_type?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_types: {
        Row: {
          code: string
          created_at: string
          description: string | null
          form_schema: Json
          id: string
          is_active: boolean
          is_custom: boolean
          name: string
          scoring_logic: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          form_schema?: Json
          id?: string
          is_active?: boolean
          is_custom?: boolean
          name: string
          scoring_logic?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          form_schema?: Json
          id?: string
          is_active?: boolean
          is_custom?: boolean
          name?: string
          scoring_logic?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_types_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          appointment_id: string | null
          created_at: string
          evaluation_type_id: string
          finalized_at: string | null
          finalized_by: string | null
          form_data: Json
          id: string
          is_draft: boolean
          is_locked: boolean
          notes: string | null
          patient_id: string
          pdf_url: string | null
          professional_id: string
          result: Json | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          evaluation_type_id: string
          finalized_at?: string | null
          finalized_by?: string | null
          form_data?: Json
          id?: string
          is_draft?: boolean
          is_locked?: boolean
          notes?: string | null
          patient_id: string
          pdf_url?: string | null
          professional_id: string
          result?: Json | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          evaluation_type_id?: string
          finalized_at?: string | null
          finalized_by?: string | null
          form_data?: Json
          id?: string
          is_draft?: boolean
          is_locked?: boolean
          notes?: string | null
          patient_id?: string
          pdf_url?: string | null
          professional_id?: string
          result?: Json | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_evaluation_type_id_fkey"
            columns: ["evaluation_type_id"]
            isOneToOne: false
            referencedRelation: "evaluation_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          color: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          tenant_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_record_sequences: {
        Row: {
          last_number: number
          tenant_id: string
        }
        Insert: {
          last_number?: number
          tenant_id: string
        }
        Update: {
          last_number?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_record_sequences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: Json | null
          allergy_alerts: string | null
          avatar_url: string | null
          care_type: Database["public"]["Enums"]["care_type"]
          convention_id: string | null
          cpf: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string
          gender: string | null
          general_observations: string | null
          guardian_cpf: string | null
          guardian_email: string | null
          guardian_name: string | null
          guardian_phone: string | null
          guardian_relationship: string | null
          id: string
          insurance_card_expiry: string | null
          insurance_card_number: string | null
          is_active: boolean
          phone: string | null
          record_number: string
          tenant_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: Json | null
          allergy_alerts?: string | null
          avatar_url?: string | null
          care_type?: Database["public"]["Enums"]["care_type"]
          convention_id?: string | null
          cpf?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          general_observations?: string | null
          guardian_cpf?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_relationship?: string | null
          id?: string
          insurance_card_expiry?: string | null
          insurance_card_number?: string | null
          is_active?: boolean
          phone?: string | null
          record_number: string
          tenant_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: Json | null
          allergy_alerts?: string | null
          avatar_url?: string | null
          care_type?: Database["public"]["Enums"]["care_type"]
          convention_id?: string | null
          cpf?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          general_observations?: string | null
          guardian_cpf?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_relationship?: string | null
          id?: string
          insurance_card_expiry?: string | null
          insurance_card_number?: string | null
          is_active?: boolean
          phone?: string | null
          record_number?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "conventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          allowed_modules: Database["public"]["Enums"]["module_type"][]
          created_at: string
          features: Json | null
          id: string
          is_active: boolean
          max_patients: number | null
          max_users: number
          name: string
          price_monthly: number
          price_yearly: number
          tier: Database["public"]["Enums"]["plan_tier"]
          updated_at: string
        }
        Insert: {
          allowed_modules?: Database["public"]["Enums"]["module_type"][]
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean
          max_patients?: number | null
          max_users?: number
          name: string
          price_monthly?: number
          price_yearly?: number
          tier?: Database["public"]["Enums"]["plan_tier"]
          updated_at?: string
        }
        Update: {
          allowed_modules?: Database["public"]["Enums"]["module_type"][]
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean
          max_patients?: number | null
          max_users?: number
          name?: string
          price_monthly?: number
          price_yearly?: number
          tier?: Database["public"]["Enums"]["plan_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      professional_availability: {
        Row: {
          appointment_interval_min: number
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          professional_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          appointment_interval_min?: number
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          professional_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          appointment_interval_min?: number
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          professional_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_availability_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_blocks: {
        Row: {
          created_at: string
          end_date: string
          id: string
          professional_id: string
          reason: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          professional_id: string
          reason?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          professional_id?: string
          reason?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_blocks_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_specialties: {
        Row: {
          created_at: string
          custom_fee: number | null
          id: string
          professional_id: string
          specialty_id: string
        }
        Insert: {
          created_at?: string
          custom_fee?: number | null
          id?: string
          professional_id: string
          specialty_id: string
        }
        Update: {
          created_at?: string
          custom_fee?: number | null
          id?: string
          professional_id?: string
          specialty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_specialties_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_specialties_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          address: Json | null
          avatar_url: string | null
          cpf: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          registration_number: string | null
          registration_type: string | null
          staff_role: string
          tenant_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          phone?: string | null
          registration_number?: string | null
          registration_type?: string | null
          staff_role?: string
          tenant_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          registration_number?: string | null
          registration_type?: string | null
          staff_role?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permissions: Json
          role: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: Json
          role: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: Json
          role?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          capacity: number | null
          created_at: string
          equipment_notes: string | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          equipment_notes?: string | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          equipment_notes?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      specialties: {
        Row: {
          category: string | null
          created_at: string
          default_duration_min: number
          default_fee: number | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          default_duration_min?: number
          default_fee?: number | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          default_duration_min?: number
          default_fee?: number | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      specialty_evaluation_types: {
        Row: {
          created_at: string
          evaluation_type_id: string
          id: string
          is_required: boolean
          specialty_id: string
        }
        Insert: {
          created_at?: string
          evaluation_type_id: string
          id?: string
          is_required?: boolean
          specialty_id: string
        }
        Update: {
          created_at?: string
          evaluation_type_id?: string
          id?: string
          is_required?: boolean
          specialty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialty_evaluation_types_evaluation_type_id_fkey"
            columns: ["evaluation_type_id"]
            isOneToOne: false
            referencedRelation: "evaluation_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specialty_evaluation_types_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          active_modules: Database["public"]["Enums"]["module_type"][]
          address: Json | null
          business_hours: Json | null
          cnpj: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          onboarding_completed: boolean
          phone: string | null
          plan_id: string | null
          settings: Json | null
          slug: string
          subscription_ends_at: string | null
          subscription_status: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          active_modules?: Database["public"]["Enums"]["module_type"][]
          address?: Json | null
          business_hours?: Json | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          onboarding_completed?: boolean
          phone?: string | null
          plan_id?: string | null
          settings?: Json | null
          slug: string
          subscription_ends_at?: string | null
          subscription_status?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          active_modules?: Database["public"]["Enums"]["module_type"][]
          address?: Json | null
          business_hours?: Json | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          onboarding_completed?: boolean
          phone?: string | null
          plan_id?: string | null
          settings?: Json | null
          slug?: string
          subscription_ends_at?: string | null
          subscription_status?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          appointment_id: string | null
          category_id: string | null
          convention_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_paid: boolean
          paid_at: string | null
          patient_id: string | null
          payment_method: string | null
          professional_id: string | null
          receipt_url: string | null
          reference_date: string
          tenant_id: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          category_id?: string | null
          convention_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          patient_id?: string | null
          payment_method?: string | null
          professional_id?: string | null
          receipt_url?: string | null
          reference_date: string
          tenant_id: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          category_id?: string | null
          convention_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          patient_id?: string | null
          payment_method?: string | null
          professional_id?: string | null
          receipt_url?: string | null
          reference_date?: string
          tenant_id?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_convention_id_fkey"
            columns: ["convention_id"]
            isOneToOne: false
            referencedRelation: "conventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_contracts: {
        Row: {
          acceptance_checkbox: boolean | null
          cancellation_policy: string | null
          content_html: string | null
          created_at: string
          description: string | null
          end_date: string | null
          estimated_duration: string | null
          fee_per_session: number | null
          goals: string | null
          id: string
          is_locked: boolean
          patient_id: string
          payment_terms: string | null
          pdf_url: string | null
          previous_contract_id: string | null
          professional_id: string
          session_frequency: string | null
          signature_data: string | null
          signed_at: string | null
          signed_by_name: string | null
          start_date: string | null
          tenant_id: string
          updated_at: string
          version: number
        }
        Insert: {
          acceptance_checkbox?: boolean | null
          cancellation_policy?: string | null
          content_html?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          estimated_duration?: string | null
          fee_per_session?: number | null
          goals?: string | null
          id?: string
          is_locked?: boolean
          patient_id: string
          payment_terms?: string | null
          pdf_url?: string | null
          previous_contract_id?: string | null
          professional_id: string
          session_frequency?: string | null
          signature_data?: string | null
          signed_at?: string | null
          signed_by_name?: string | null
          start_date?: string | null
          tenant_id: string
          updated_at?: string
          version?: number
        }
        Update: {
          acceptance_checkbox?: boolean | null
          cancellation_policy?: string | null
          content_html?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          estimated_duration?: string | null
          fee_per_session?: number | null
          goals?: string | null
          id?: string
          is_locked?: boolean
          patient_id?: string
          payment_terms?: string | null
          pdf_url?: string | null
          previous_contract_id?: string | null
          professional_id?: string
          session_frequency?: string | null
          signature_data?: string | null
          signed_at?: string | null
          signed_by_name?: string | null
          start_date?: string | null
          tenant_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "treatment_contracts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_contracts_previous_contract_id_fkey"
            columns: ["previous_contract_id"]
            isOneToOne: false
            referencedRelation: "treatment_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_contracts_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          invited_at: string | null
          is_active: boolean
          role: Database["public"]["Enums"]["org_role"]
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_at?: string | null
          is_active?: boolean
          role: Database["public"]["Enums"]["org_role"]
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_at?: string | null
          is_active?: boolean
          role?: Database["public"]["Enums"]["org_role"]
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccine_applications: {
        Row: {
          applied_at: string
          batch_id: string
          created_at: string
          dose_label: string
          id: string
          injection_site: string | null
          observations: string | null
          patient_id: string
          professional_id: string
          tenant_id: string
          vaccine_id: string
        }
        Insert: {
          applied_at?: string
          batch_id: string
          created_at?: string
          dose_label: string
          id?: string
          injection_site?: string | null
          observations?: string | null
          patient_id: string
          professional_id: string
          tenant_id: string
          vaccine_id: string
        }
        Update: {
          applied_at?: string
          batch_id?: string
          created_at?: string
          dose_label?: string
          id?: string
          injection_site?: string | null
          observations?: string | null
          patient_id?: string
          professional_id?: string
          tenant_id?: string
          vaccine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccine_applications_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "vaccine_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccine_applications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccine_applications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccine_applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccine_applications_vaccine_id_fkey"
            columns: ["vaccine_id"]
            isOneToOne: false
            referencedRelation: "vaccines"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccine_batches: {
        Row: {
          created_at: string
          expiration_date: string
          id: string
          lot_number: string
          manufacturer: string | null
          manufacturing_date: string | null
          max_temp_celsius: number | null
          min_temp_celsius: number | null
          quantity_received: number
          quantity_remaining: number
          received_at: string
          received_by: string | null
          tenant_id: string
          updated_at: string
          vaccine_id: string
        }
        Insert: {
          created_at?: string
          expiration_date: string
          id?: string
          lot_number: string
          manufacturer?: string | null
          manufacturing_date?: string | null
          max_temp_celsius?: number | null
          min_temp_celsius?: number | null
          quantity_received: number
          quantity_remaining: number
          received_at?: string
          received_by?: string | null
          tenant_id: string
          updated_at?: string
          vaccine_id: string
        }
        Update: {
          created_at?: string
          expiration_date?: string
          id?: string
          lot_number?: string
          manufacturer?: string | null
          manufacturing_date?: string | null
          max_temp_celsius?: number | null
          min_temp_celsius?: number | null
          quantity_received?: number
          quantity_remaining?: number
          received_at?: string
          received_by?: string | null
          tenant_id?: string
          updated_at?: string
          vaccine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccine_batches_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccine_batches_vaccine_id_fkey"
            columns: ["vaccine_id"]
            isOneToOne: false
            referencedRelation: "vaccines"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccine_temp_logs: {
        Row: {
          created_at: string
          id: string
          is_out_of_range: boolean
          notes: string | null
          recorded_by: string
          recorded_date: string
          temperature_celsius: number
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_out_of_range?: boolean
          notes?: string | null
          recorded_by: string
          recorded_date: string
          temperature_celsius: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_out_of_range?: boolean
          notes?: string | null
          recorded_by?: string
          recorded_date?: string
          temperature_celsius?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccine_temp_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccines: {
        Row: {
          contraindications: string | null
          created_at: string
          description: string | null
          dose_labels: string[] | null
          doses_required: number
          id: string
          indications: string | null
          is_active: boolean
          manufacturer: string | null
          min_interval_days: number | null
          name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          contraindications?: string | null
          created_at?: string
          description?: string | null
          dose_labels?: string[] | null
          doses_required?: number
          id?: string
          indications?: string | null
          is_active?: boolean
          manufacturer?: string | null
          min_interval_days?: number | null
          name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          contraindications?: string | null
          created_at?: string
          description?: string | null
          dose_labels?: string[] | null
          doses_required?: number
          id?: string
          indications?: string | null
          is_active?: boolean
          manufacturer?: string | null
          min_interval_days?: number | null
          name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccines_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_appointment_conflicts: {
        Args: {
          p_duration_min: number
          p_exclude_id?: string
          p_patient_id: string
          p_professional_id: string
          p_scheduled_at: string
          p_tenant_id: string
        }
        Returns: {
          conflict_type: string
          conflicting_appointment_id: string
          conflicting_end: string
          conflicting_patient_name: string
          conflicting_professional_name: string
          conflicting_start: string
        }[]
      }
      get_next_appointment_code: {
        Args: { p_tenant_id: string }
        Returns: string
      }
      get_next_record_number: { Args: { p_tenant_id: string }; Returns: string }
      get_user_tenant_id: { Args: { p_user_id: string }; Returns: string }
      has_tenant_role: {
        Args: {
          p_roles: Database["public"]["Enums"]["org_role"][]
          p_tenant_id: string
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status:
        | "SCHEDULED"
        | "CONFIRMED"
        | "ATTENDED"
        | "ABSENCE"
        | "JUSTIFIED_ABSENCE"
        | "CANCELLED"
        | "RESCHEDULED"
      appointment_type: "IN_PERSON" | "ONLINE" | "HOME_VISIT"
      care_type: "SINGLE_SESSION" | "ONGOING_TREATMENT"
      clinical_event_type:
        | "EVALUATION"
        | "NOTE"
        | "ATTENDED"
        | "ABSENCE"
        | "JUSTIFIED_ABSENCE"
        | "DOCUMENT"
      document_category:
        | "MEDICAL_REQUEST"
        | "LAB_RESULT"
        | "INSURANCE_AUTHORIZATION"
        | "TREATMENT_CONTRACT"
        | "ATTENDANCE_CERTIFICATE"
        | "OTHER"
      module_type: "BASE" | "EVALUATIONS" | "FINANCIAL" | "REPORTS" | "VACCINES"
      org_role:
        | "ORG_ADMIN"
        | "MANAGER"
        | "HEALTH_PROFESSIONAL"
        | "RECEPTIONIST"
        | "FINANCIAL"
        | "PATIENT"
      plan_tier: "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE"
      transaction_type: "INCOME" | "EXPENSE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "SCHEDULED",
        "CONFIRMED",
        "ATTENDED",
        "ABSENCE",
        "JUSTIFIED_ABSENCE",
        "CANCELLED",
        "RESCHEDULED",
      ],
      appointment_type: ["IN_PERSON", "ONLINE", "HOME_VISIT"],
      care_type: ["SINGLE_SESSION", "ONGOING_TREATMENT"],
      clinical_event_type: [
        "EVALUATION",
        "NOTE",
        "ATTENDED",
        "ABSENCE",
        "JUSTIFIED_ABSENCE",
        "DOCUMENT",
      ],
      document_category: [
        "MEDICAL_REQUEST",
        "LAB_RESULT",
        "INSURANCE_AUTHORIZATION",
        "TREATMENT_CONTRACT",
        "ATTENDANCE_CERTIFICATE",
        "OTHER",
      ],
      module_type: ["BASE", "EVALUATIONS", "FINANCIAL", "REPORTS", "VACCINES"],
      org_role: [
        "ORG_ADMIN",
        "MANAGER",
        "HEALTH_PROFESSIONAL",
        "RECEPTIONIST",
        "FINANCIAL",
        "PATIENT",
      ],
      plan_tier: ["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"],
      transaction_type: ["INCOME", "EXPENSE"],
    },
  },
} as const
