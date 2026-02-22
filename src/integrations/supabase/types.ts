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
      address_learning: {
        Row: {
          created_at: string
          id: string
          last_used_at: string
          lat: number
          lng: number
          raw_address: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_used_at?: string
          lat: number
          lng: number
          raw_address: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_used_at?: string
          lat?: number
          lng?: number
          raw_address?: string
          usage_count?: number
        }
        Relationships: []
      }
      credit_purchases: {
        Row: {
          amount_brl: number | null
          amount_cents: number
          created_at: string
          credits: number
          gateway_charge_id: string | null
          id: string
          package_id: string
          pix_id: string
          processed: boolean
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_brl?: number | null
          amount_cents: number
          created_at?: string
          credits: number
          gateway_charge_id?: string | null
          id?: string
          package_id: string
          pix_id: string
          processed?: boolean
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_brl?: number | null
          amount_cents?: number
          created_at?: string
          credits?: number
          gateway_charge_id?: string | null
          id?: string
          package_id?: string
          pix_id?: string
          processed?: boolean
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      driver_auto_submit_config: {
        Row: {
          auto_submit_enabled: boolean
          created_at: string | null
          id: string
          last_auto_submit_at: string | null
          last_auto_submit_day: string | null
          selected_days: number[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_submit_enabled?: boolean
          created_at?: string | null
          id?: string
          last_auto_submit_at?: string | null
          last_auto_submit_day?: string | null
          selected_days?: number[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_submit_enabled?: boolean
          created_at?: string | null
          id?: string
          last_auto_submit_at?: string | null
          last_auto_submit_day?: string | null
          selected_days?: number[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      driver_availability: {
        Row: {
          created_at: string | null
          id: string
          identificacao_motorista: string
          modal_nivel_1: string
          modal_nivel_2: string
          nome_completo: string
          regiao_cep_1: string | null
          regiao_cep_2: string | null
          regiao_cep_3: string | null
          telefone: string
          transportadora: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          identificacao_motorista: string
          modal_nivel_1: string
          modal_nivel_2: string
          nome_completo: string
          regiao_cep_1?: string | null
          regiao_cep_2?: string | null
          regiao_cep_3?: string | null
          telefone: string
          transportadora: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          identificacao_motorista?: string
          modal_nivel_1?: string
          modal_nivel_2?: string
          nome_completo?: string
          regiao_cep_1?: string | null
          regiao_cep_2?: string | null
          regiao_cep_3?: string | null
          telefone?: string
          transportadora?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      driver_submission_log: {
        Row: {
          created_at: string | null
          error_message: string | null
          forms_response_status: number | null
          id: string
          status: string
          submission_type: string
          submitted_at: string | null
          submitted_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          forms_response_status?: number | null
          id?: string
          status: string
          submission_type: string
          submitted_at?: string | null
          submitted_data: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          forms_response_status?: number | null
          id?: string
          status?: string
          submission_type?: string
          submitted_at?: string | null
          submitted_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      navigation_run_stops: {
        Row: {
          address: string
          check_in_time: string | null
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          note: string | null
          run_id: string
          status: Database["public"]["Enums"]["navigation_stop_status"]
          stop_order: number
        }
        Insert: {
          address: string
          check_in_time?: string | null
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          note?: string | null
          run_id: string
          status?: Database["public"]["Enums"]["navigation_stop_status"]
          stop_order: number
        }
        Update: {
          address?: string
          check_in_time?: string | null
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          note?: string | null
          run_id?: string
          status?: Database["public"]["Enums"]["navigation_stop_status"]
          stop_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "navigation_run_stops_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "navigation_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_runs: {
        Row: {
          ended_at: string | null
          id: string
          metadata: Json | null
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          last_seen_version: string | null
          name: string | null
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_seen_version?: string | null
          name?: string | null
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_seen_version?: string | null
          name?: string | null
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          expiration_time: string | null
          id: string
          last_notified_version: string | null
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          expiration_time?: string | null
          id?: string
          last_notified_version?: string | null
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          expiration_time?: string | null
          id?: string
          last_notified_version?: string | null
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          balance_credits: number
          created_at: string
          id: string
          subscription_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_credits?: number
          created_at?: string
          id?: string
          subscription_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_credits?: number
          created_at?: string
          id?: string
          subscription_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          external_payment_id: string | null
          id: string
          reason: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          external_payment_id?: string | null
          id?: string
          reason: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          external_payment_id?: string | null
          id?: string
          reason?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_wallet_for_payment: {
        Args: {
          p_amount: number
          p_external_payment_id: string
          p_reason: string
          p_user_id: string
        }
        Returns: number
      }
      debit_wallet_for_download: {
        Args: { p_amount: number; p_reason: string; p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      navigation_stop_status: "pending" | "active" | "completed" | "skipped"
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
      navigation_stop_status: ["pending", "active", "completed", "skipped"],
    },
  },
} as const
