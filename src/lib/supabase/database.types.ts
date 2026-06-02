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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_assets: {
        Row: {
          bucket_id: string
          created_at: string
          field_name: string
          id: string
          kind: Database["public"]["Enums"]["asset_kind"]
          mime_type: string | null
          object_path: string
          order_id: string
          original_filename: string | null
          size_bytes: number
        }
        Insert: {
          bucket_id: string
          created_at?: string
          field_name: string
          id?: string
          kind?: Database["public"]["Enums"]["asset_kind"]
          mime_type?: string | null
          object_path: string
          order_id: string
          original_filename?: string | null
          size_bytes?: number
        }
        Update: {
          bucket_id?: string
          created_at?: string
          field_name?: string
          id?: string
          kind?: Database["public"]["Enums"]["asset_kind"]
          mime_type?: string | null
          object_path?: string
          order_id?: string
          original_filename?: string | null
          size_bytes?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_assets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_log: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: string
          note: string | null
          order_id: string
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          note?: string | null
          order_id: string
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          note?: string | null
          order_id?: string
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_idr: number
          created_at: string
          customer_email: string
          customer_name: string
          customer_whatsapp: string | null
          delivered_at: string | null
          delivery_slug: string | null
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          delivery_url: string | null
          delivery_zip_path: string | null
          form_data: Json
          id: string
          midtrans_order_id: string | null
          midtrans_payment_type: string | null
          midtrans_raw_status: Json | null
          midtrans_transaction_id: string | null
          midtrans_transaction_status: string | null
          notes_customer: string | null
          notes_internal: string | null
          order_code: string
          paid_at: string | null
          ready_at: string | null
          status: Database["public"]["Enums"]["order_status"]
          template_id: string
          updated_at: string
        }
        Insert: {
          amount_idr: number
          created_at?: string
          customer_email: string
          customer_name: string
          customer_whatsapp?: string | null
          delivered_at?: string | null
          delivery_slug?: string | null
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          delivery_url?: string | null
          delivery_zip_path?: string | null
          form_data?: Json
          id?: string
          midtrans_order_id?: string | null
          midtrans_payment_type?: string | null
          midtrans_raw_status?: Json | null
          midtrans_transaction_id?: string | null
          midtrans_transaction_status?: string | null
          notes_customer?: string | null
          notes_internal?: string | null
          order_code: string
          paid_at?: string | null
          ready_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          template_id: string
          updated_at?: string
        }
        Update: {
          amount_idr?: number
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_whatsapp?: string | null
          delivered_at?: string | null
          delivery_slug?: string | null
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          delivery_url?: string | null
          delivery_zip_path?: string | null
          form_data?: Json
          id?: string
          midtrans_order_id?: string | null
          midtrans_payment_type?: string | null
          midtrans_raw_status?: Json | null
          midtrans_transaction_id?: string | null
          midtrans_transaction_status?: string | null
          notes_customer?: string | null
          notes_internal?: string | null
          order_code?: string
          paid_at?: string | null
          ready_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          estimated_days_max: number
          estimated_days_min: number
          form_schema: Json
          id: string
          is_active: boolean
          name: string
          preview_image_path: string | null
          price_idr: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          estimated_days_max?: number
          estimated_days_min?: number
          form_schema?: Json
          id?: string
          is_active?: boolean
          name: string
          preview_image_path?: string | null
          price_idr: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          estimated_days_max?: number
          estimated_days_min?: number
          form_schema?: Json
          id?: string
          is_active?: boolean
          name?: string
          preview_image_path?: string | null
          price_idr?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_kind: "customer_upload" | "delivery_zip"
      delivery_type: "hosted" | "download"
      order_status:
        | "pending_payment"
        | "paid"
        | "in_progress"
        | "ready"
        | "delivered"
        | "cancelled"
        | "expired"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      asset_kind: ["customer_upload", "delivery_zip"],
      delivery_type: ["hosted", "download"],
      order_status: [
        "pending_payment",
        "paid",
        "in_progress",
        "ready",
        "delivered",
        "cancelled",
        "expired",
      ],
    },
  },
} as const
