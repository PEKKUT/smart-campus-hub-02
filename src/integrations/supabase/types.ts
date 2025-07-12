export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chat_history: {
        Row: {
          created_at: string
          id: string
          message: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          response?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jadwal_kuliah: {
        Row: {
          created_at: string
          dosen: string | null
          hari: string
          id: string
          jam_mulai: string
          jam_selesai: string
          mata_kuliah: string
          ruangan: string | null
          sks: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dosen?: string | null
          hari: string
          id?: string
          jam_mulai: string
          jam_selesai: string
          mata_kuliah: string
          ruangan?: string | null
          sks?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          dosen?: string | null
          hari?: string
          id?: string
          jam_mulai?: string
          jam_selesai?: string
          mata_kuliah?: string
          ruangan?: string | null
          sks?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jadwal_kuliah_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kehadiran: {
        Row: {
          created_at: string
          id: string
          jadwal_id: string
          status: string
          tanggal: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          jadwal_id: string
          status: string
          tanggal: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          jadwal_id?: string
          status?: string
          tanggal?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kehadiran_jadwal_id_fkey"
            columns: ["jadwal_id"]
            isOneToOne: false
            referencedRelation: "jadwal_kuliah"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kehadiran_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      nilai: {
        Row: {
          created_at: string
          grade: string | null
          id: string
          jadwal_id: string
          nilai_akhir: number | null
          semester: number
          tugas: number | null
          uas: number | null
          user_id: string
          uts: number | null
        }
        Insert: {
          created_at?: string
          grade?: string | null
          id?: string
          jadwal_id: string
          nilai_akhir?: number | null
          semester: number
          tugas?: number | null
          uas?: number | null
          user_id: string
          uts?: number | null
        }
        Update: {
          created_at?: string
          grade?: string | null
          id?: string
          jadwal_id?: string
          nilai_akhir?: number | null
          semester?: number
          tugas?: number | null
          uas?: number | null
          user_id?: string
          uts?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nilai_jadwal_id_fkey"
            columns: ["jadwal_id"]
            isOneToOne: false
            referencedRelation: "jadwal_kuliah"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nilai_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transaksi: {
        Row: {
          created_at: string
          deskripsi: string
          id: string
          kategori: string
          nominal: number
          tanggal: string
          tipe: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deskripsi: string
          id?: string
          kategori: string
          nominal: number
          tanggal: string
          tipe: string
          user_id: string
        }
        Update: {
          created_at?: string
          deskripsi?: string
          id?: string
          kategori?: string
          nominal?: number
          tanggal?: string
          tipe?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaksi_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          nama: string
          nim: string
          prodi: string | null
          role: string | null
          semester: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nama: string
          nim: string
          prodi?: string | null
          role?: string | null
          semester?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nama?: string
          nim?: string
          prodi?: string | null
          role?: string | null
          semester?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
