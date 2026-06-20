export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      integrations: {
        Row: { ativo: boolean; config: Json; id: string; updated_at: string }
        Insert: { ativo?: boolean; config?: Json; id: string; updated_at?: string }
        Update: { ativo?: boolean; config?: Json; id?: string; updated_at?: string }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string
          notas: string | null
          origem: string | null
          owner_id: string | null
          status: Database["public"]["Enums"]["lead_status"]
          telefone: string | null
          tipo_projeto: string | null
          updated_at: string
          valor_estimado: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          notas?: string | null
          origem?: string | null
          owner_id?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          telefone?: string | null
          tipo_projeto?: string | null
          updated_at?: string
          valor_estimado?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          notas?: string | null
          origem?: string | null
          owner_id?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          telefone?: string | null
          tipo_projeto?: string | null
          updated_at?: string
          valor_estimado?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          autor_id: string | null
          created_at: string
          id: string
          imagens: string[]
          project_id: string
          texto: string | null
        }
        Insert: {
          autor_id?: string | null
          created_at?: string
          id?: string
          imagens?: string[]
          project_id: string
          texto?: string | null
        }
        Update: {
          autor_id?: string | null
          created_at?: string
          id?: string
          imagens?: string[]
          project_id?: string
          texto?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          capa_url: string | null
          cliente: string | null
          created_at: string
          data_entrega: string | null
          descricao: string | null
          drive_folder_id: string | null
          drive_folder_url: string | null
          id: string
          lead_id: string | null
          nome: string
          responsavel_id: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          capa_url?: string | null
          cliente?: string | null
          created_at?: string
          data_entrega?: string | null
          descricao?: string | null
          drive_folder_id?: string | null
          drive_folder_url?: string | null
          id?: string
          lead_id?: string | null
          nome: string
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          capa_url?: string | null
          cliente?: string | null
          created_at?: string
          data_entrega?: string | null
          descricao?: string | null
          drive_folder_id?: string | null
          drive_folder_url?: string | null
          id?: string
          lead_id?: string | null
          nome?: string
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          conteudo: Json | null
          created_at: string
          created_by: string | null
          id: string
          lead_id: string | null
          pdf_url: string | null
          status: Database["public"]["Enums"]["proposal_status"]
          titulo: string
          updated_at: string
          valor: number | null
        }
        Insert: {
          conteudo?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id?: string | null
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          titulo: string
          updated_at?: string
          valor?: number | null
        }
        Update: {
          conteudo?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id?: string | null
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          titulo?: string
          updated_at?: string
          valor?: number | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          created_by: string | null
          dados: Json | null
          id: string
          periodo_fim: string | null
          periodo_inicio: string | null
          tipo: string
          titulo: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dados?: Json | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          tipo?: string
          titulo: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dados?: Json | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          descricao: string | null
          id: string
          ordem: number
          prazo: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          titulo: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          prazo?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          titulo: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          prazo?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      app_role: { Args: Record<string, never>; Returns: Database["public"]["Enums"]["user_role"] }
      is_admin: { Args: Record<string, never>; Returns: boolean }
      admin_create_user: {
        Args: {
          p_email: string
          p_nome: string
          p_role: Database["public"]["Enums"]["user_role"]
          p_senha: string
        }
        Returns: string
      }
      admin_set_password: {
        Args: { p_user: string; p_senha: string }
        Returns: undefined
      }
    }
    Enums: {
      lead_status: "novo" | "contatado" | "qualificado" | "proposta" | "ganho" | "perdido"
      project_status: "briefing" | "em_andamento" | "revisao" | "entregue" | "pausado"
      proposal_status: "rascunho" | "enviada" | "aceita" | "recusada"
      task_status: "a_fazer" | "fazendo" | "concluido"
      user_role: "admin" | "marketing" | "arquiteta"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database["public"]
export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"]
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T]

export type UserRole = Enums<"user_role">
export type LeadStatus = Enums<"lead_status">
export type ProjectStatus = Enums<"project_status">
export type ProposalStatus = Enums<"proposal_status">
export type TaskStatus = Enums<"task_status">

export type Profile = Tables<"profiles">
export type Lead = Tables<"leads">
export type Proposal = Tables<"proposals">
export type Project = Tables<"projects">
export type ProjectUpdate = Tables<"project_updates">
export type Task = Tables<"tasks">
export type Report = Tables<"reports">
