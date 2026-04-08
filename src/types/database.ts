export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string
          image_url: string
          before_image_url: string | null
          after_image_url: string | null
          category: string
          tags: string[] | null
          features: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          description: string
          image_url: string
          before_image_url?: string | null
          after_image_url?: string | null
          category: string
          tags?: string[] | null
          features?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          description?: string
          image_url?: string
          before_image_url?: string | null
          after_image_url?: string | null
          category?: string
          tags?: string[] | null
          features?: string[] | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string
          short_description: string | null
          image_url: string
          images: string[] | null
          points: string[] | null
          core_features: Json | null
          pricing: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          description: string
          short_description?: string | null
          image_url: string
          images?: string[] | null
          points?: string[] | null
          core_features?: Json | null
          pricing?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          description?: string
          short_description?: string | null
          image_url?: string
          images?: string[] | null
          points?: string[] | null
          core_features?: Json | null
          pricing?: Json | null
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          message: string
          rating: number
        }
        Insert: {
          id?: string
          name: string
          message: string
          rating: number
        }
        Update: {
          id?: string
          name?: string
          message?: string
          rating?: number
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          address: string | null
          service: string | null
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email: string
          address?: string | null
          service?: string | null
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string
          address?: string | null
          service?: string | null
          message?: string
          status?: string
          created_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          service_type: string
          budget_range: string
          timeline: string
          description: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          service_type: string
          budget_range: string
          timeline: string
          description: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          service_type?: string
          budget_range?: string
          timeline?: string
          description?: string
          status?: string
          created_at?: string
        }
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
  }
}
