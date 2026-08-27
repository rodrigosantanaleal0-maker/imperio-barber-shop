// Tipos do banco — mantidos manualmente na Fase 1.
// Depois de estabilizado, trocar por:
//   npx supabase gen types typescript --project-id wfbxgevazeczpzsxxypa > src/domain/types/database.ts

export type StaffRole = "barber" | "admin";

export type AppointmentStatus =
  | "pending_payment"
  | "confirmed"
  | "completed"
  | "canceled"
  | "no_show";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ServiceCategory = "corte" | "barba" | "combo" | "acabamento" | "sobrancelha";

type BuildTable<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: BuildTable<
        { id: string; full_name: string; role: StaffRole; created_at: string },
        { id: string; full_name: string; role: StaffRole },
        { full_name?: string; role?: StaffRole }
      >;
      customers: BuildTable<
        { id: string; full_name: string; phone: string; email: string | null; created_at: string },
        { id?: string; full_name: string; phone: string; email?: string | null },
        { full_name?: string; email?: string | null }
      >;
      barbers: BuildTable<
        {
          id: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          specialties: string[];
          active: boolean;
          profile_id: string | null;
          created_at: string;
        },
        {
          id?: string;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          specialties?: string[];
          active?: boolean;
          profile_id?: string | null;
        },
        {
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          specialties?: string[];
          active?: boolean;
          profile_id?: string | null;
        }
      >;
      services: BuildTable<
        {
          id: string;
          name: string;
          description: string | null;
          duration_minutes: number;
          price_cents: number;
          compare_at_price_cents: number | null;
          category: ServiceCategory;
          active: boolean;
          image_url: string | null;
          created_at: string;
        },
        {
          id?: string;
          name: string;
          description?: string | null;
          duration_minutes: number;
          price_cents: number;
          compare_at_price_cents?: number | null;
          category?: ServiceCategory;
          active?: boolean;
          image_url?: string | null;
        },
        {
          name?: string;
          description?: string | null;
          duration_minutes?: number;
          price_cents?: number;
          compare_at_price_cents?: number | null;
          category?: ServiceCategory;
          active?: boolean;
          image_url?: string | null;
        }
      >;
      barber_services: BuildTable<
        { barber_id: string; service_id: string },
        { barber_id: string; service_id: string },
        { barber_id?: string; service_id?: string }
      >;
      combo_items: BuildTable<
        { combo_service_id: string; included_service_id: string },
        { combo_service_id: string; included_service_id: string },
        { combo_service_id?: string; included_service_id?: string }
      >;
      availability: BuildTable<
        { id: string; barber_id: string; weekday: number; start_time: string; end_time: string; created_at: string },
        { id?: string; barber_id: string; weekday: number; start_time: string; end_time: string },
        { barber_id?: string; weekday?: number; start_time?: string; end_time?: string }
      >;
      availability_exceptions: BuildTable<
        {
          id: string;
          barber_id: string;
          date: string;
          is_full_day: boolean;
          start_time: string | null;
          end_time: string | null;
          reason: string | null;
        },
        {
          id?: string;
          barber_id: string;
          date: string;
          is_full_day?: boolean;
          start_time?: string | null;
          end_time?: string | null;
          reason?: string | null;
        },
        {
          date?: string;
          is_full_day?: boolean;
          start_time?: string | null;
          end_time?: string | null;
          reason?: string | null;
        }
      >;
      appointments: BuildTable<
        {
          id: string;
          code: string;
          customer_id: string;
          barber_id: string;
          service_id: string;
          starts_at: string;
          ends_at: string;
          status: AppointmentStatus;
          notes: string | null;
          access_token_hash: string;
          access_token_expires_at: string;
          created_at: string;
          updated_at: string;
        },
        never,
        { status?: AppointmentStatus }
      >;
      payments: BuildTable<
        {
          id: string;
          appointment_id: string;
          provider: string;
          provider_payment_id: string | null;
          amount_cents: number;
          status: PaymentStatus;
          method: string | null;
          raw_payload: unknown;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          appointment_id: string;
          provider: string;
          provider_payment_id?: string | null;
          amount_cents: number;
          status?: PaymentStatus;
          method?: string | null;
          raw_payload?: unknown;
        },
        { status?: PaymentStatus; provider_payment_id?: string | null; raw_payload?: unknown }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      create_appointment_public: {
        Args: {
          p_full_name: string;
          p_phone: string;
          p_email: string | null;
          p_barber_id: string;
          p_service_id: string;
          p_starts_at: string;
          p_access_token_hash: string;
        };
        Returns: Database["public"]["Tables"]["appointments"]["Row"];
      };
      get_appointment_by_token: {
        Args: { p_code: string; p_token_hash: string };
        Returns: Database["public"]["Tables"]["appointments"]["Row"];
      };
      reschedule_appointment_public: {
        Args: { p_code: string; p_token_hash: string; p_new_starts_at: string };
        Returns: Database["public"]["Tables"]["appointments"]["Row"];
      };
      cancel_appointment_public: {
        Args: { p_code: string; p_token_hash: string };
        Returns: Database["public"]["Tables"]["appointments"]["Row"];
      };
      get_busy_ranges_public: {
        Args: { p_barber_id: string; p_date: string };
        Returns: { starts_at: string; ends_at: string }[];
      };
      record_payment_public: {
        Args: {
          p_code: string;
          p_token_hash: string;
          p_provider: string;
          p_provider_payment_id: string | null;
          p_amount_cents: number;
          p_method: string | null;
          p_status: PaymentStatus;
        };
        Returns: Database["public"]["Tables"]["appointments"]["Row"];
      };
      get_payment_by_token: {
        Args: { p_code: string; p_token_hash: string };
        Returns: Database["public"]["Tables"]["payments"]["Row"];
      };
      find_appointment_public: {
        Args: { p_phone: string; p_code: string };
        Returns: Database["public"]["Tables"]["appointments"]["Row"];
      };
      barber_update_appointment_status: {
        Args: { p_appointment_id: string; p_status: "completed" | "no_show" };
        Returns: Database["public"]["Tables"]["appointments"]["Row"];
      };
      admin_dashboard_totals: {
        Args: { p_from: string; p_to: string };
        Returns: {
          revenue_cents: number;
          appointments_count: number;
          completed_count: number;
          canceled_count: number;
          no_show_count: number;
          new_customers_count: number;
        }[];
      };
      admin_revenue_by_day: {
        Args: { p_from: string; p_to: string };
        Returns: { day: string; revenue_cents: number }[];
      };
      admin_appointments_by_status: {
        Args: { p_from: string; p_to: string };
        Returns: { status: AppointmentStatus; count: number }[];
      };
      admin_top_services: {
        Args: { p_from: string; p_to: string; p_limit?: number };
        Returns: { service_id: string; service_name: string; count: number; revenue_cents: number }[];
      };
      admin_barber_performance: {
        Args: { p_from: string; p_to: string };
        Returns: {
          barber_id: string;
          barber_name: string;
          appointments_count: number;
          revenue_cents: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
