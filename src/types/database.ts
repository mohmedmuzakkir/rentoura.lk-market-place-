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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string
          actor_role: string
          created_at: string
          details: string | null
          id: string
          metadata: Json
          target_id: string | null
          target_title: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name: string
          actor_role: string
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json
          target_id?: string | null
          target_title?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string
          actor_role?: string
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json
          target_id?: string | null
          target_title?: string | null
          target_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon_key: string | null
          id: string
          level: number
          module: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          level?: number
          module: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          level?: number
          module?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      home_slides: {
        Row: {
          created_at: string
          cta_route: string | null
          cta_text: string | null
          description: string | null
          display_order: number
          duration_ms: number | null
          id: string
          image_url: string | null
          is_active: boolean
          mobile_image_url: string | null
          module: string | null
          overlay_strength: number | null
          placement: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_route?: string | null
          cta_text?: string | null
          description?: string | null
          display_order?: number
          duration_ms?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          mobile_image_url?: string | null
          module?: string | null
          overlay_strength?: number | null
          placement?: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_route?: string | null
          cta_text?: string | null
          description?: string | null
          display_order?: number
          duration_ms?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          mobile_image_url?: string | null
          module?: string | null
          overlay_strength?: number | null
          placement?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_companies: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_featured: boolean
          logo_url: string | null
          name: string
          short_description: string | null
          slug: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          name: string
          short_description?: string | null
          slug: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      listing_media: {
        Row: {
          created_at: string
          file_size: number | null
          height: number | null
          id: string
          is_cover: boolean
          listing_id: string
          media_type: string
          mime_type: string | null
          position: number
          public_url: string | null
          storage_path: string
          width: number | null
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          height?: number | null
          id?: string
          is_cover?: boolean
          listing_id: string
          media_type?: string
          mime_type?: string | null
          position?: number
          public_url?: string | null
          storage_path: string
          width?: number | null
        }
        Update: {
          created_at?: string
          file_size?: number | null
          height?: number | null
          id?: string
          is_cover?: boolean
          listing_id?: string
          media_type?: string
          mime_type?: string | null
          position?: number
          public_url?: string | null
          storage_path?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_media_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "job_marketplace_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_media_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listing_search_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_media_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_media_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "service_marketplace_view"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          area_id: string | null
          category_id: string | null
          city_id: string | null
          created_at: string
          currency: string
          description: string | null
          district_id: string | null
          exact_address: string | null
          id: string
          is_featured: boolean
          latitude: number | null
          longitude: number | null
          maximum_price: number | null
          minimum_price: number | null
          module: string
          module_data: Json
          owner_id: string
          price: number | null
          pricing_period: string | null
          province_id: string | null
          published_at: string | null
          short_summary: string | null
          status: string
          subcategory_id: string | null
          submitted_at: string | null
          third_level_category_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          district_id?: string | null
          exact_address?: string | null
          id?: string
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          maximum_price?: number | null
          minimum_price?: number | null
          module: string
          module_data?: Json
          owner_id: string
          price?: number | null
          pricing_period?: string | null
          province_id?: string | null
          published_at?: string | null
          short_summary?: string | null
          status?: string
          subcategory_id?: string | null
          submitted_at?: string | null
          third_level_category_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          district_id?: string | null
          exact_address?: string | null
          id?: string
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          maximum_price?: number | null
          minimum_price?: number | null
          module?: string
          module_data?: Json
          owner_id?: string
          price?: number | null
          pricing_period?: string | null
          province_id?: string | null
          published_at?: string | null
          short_summary?: string | null
          status?: string
          subcategory_id?: string | null
          submitted_at?: string | null
          third_level_category_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_third_level_category_id_fkey"
            columns: ["third_level_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      location_search_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          location_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string
          id?: string
          location_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          location_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_search_events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city_id: string | null
          code: string | null
          created_at: string
          district_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          name_si: string | null
          name_ta: string | null
          parent_id: string | null
          postal_code: string | null
          province_id: string | null
          sort_order: number
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          city_id?: string | null
          code?: string | null
          created_at?: string
          district_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          name_si?: string | null
          name_ta?: string | null
          parent_id?: string | null
          postal_code?: string | null
          province_id?: string | null
          sort_order?: number
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          city_id?: string | null
          code?: string | null
          created_at?: string
          district_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_si?: string | null
          name_ta?: string | null
          parent_id?: string | null
          postal_code?: string | null
          province_id?: string | null
          sort_order?: number
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string
          category: string
          created_at: string
          dedupe_key: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          priority: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body: string
          category?: string
          created_at?: string
          dedupe_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          priority?: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string
          category?: string
          created_at?: string
          dedupe_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          priority?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string
          agreement_accepted_at: string | null
          agreement_version: string | null
          area_id: string | null
          city_id: string | null
          created_at: string
          district_id: string | null
          email: string
          full_name: string
          id: string
          phone_normalized: string | null
          province_id: string | null
          role: string
          updated_at: string
        }
        Insert: {
          account_status?: string
          agreement_accepted_at?: string | null
          agreement_version?: string | null
          area_id?: string | null
          city_id?: string | null
          created_at?: string
          district_id?: string | null
          email?: string
          full_name?: string
          id: string
          phone_normalized?: string | null
          province_id?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          account_status?: string
          agreement_accepted_at?: string | null
          agreement_version?: string | null
          area_id?: string | null
          city_id?: string | null
          created_at?: string
          district_id?: string | null
          email?: string
          full_name?: string
          id?: string
          phone_normalized?: string | null
          province_id?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      report_internal_notes: {
        Row: {
          actor_id: string
          created_at: string
          id: string
          note: string
          report_id: string
        }
        Insert: {
          actor_id: string
          created_at?: string
          id?: string
          note: string
          report_id: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          id?: string
          note?: string
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_internal_notes_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_internal_notes_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          allow_contact: boolean
          assigned_to: string | null
          contact_info: string | null
          created_at: string
          details: string | null
          history: Json | null
          id: string
          internal_notes: Json | null
          listing_id: string | null
          message_id: string | null
          reason_code: string
          reason_label: string
          reporter_id: string | null
          resolution_outcome: string | null
          review_id: string | null
          status: string
          status_note: string | null
          target_image_url: string | null
          target_location: string | null
          target_module: string | null
          target_price: string | null
          target_title: string | null
          target_type: string
          target_user_id: string | null
          updated_at: string
          user_facing_message: string | null
        }
        Insert: {
          allow_contact?: boolean
          assigned_to?: string | null
          contact_info?: string | null
          created_at?: string
          details?: string | null
          history?: Json | null
          id?: string
          internal_notes?: Json | null
          listing_id?: string | null
          message_id?: string | null
          reason_code: string
          reason_label: string
          reporter_id?: string | null
          resolution_outcome?: string | null
          review_id?: string | null
          status?: string
          status_note?: string | null
          target_image_url?: string | null
          target_location?: string | null
          target_module?: string | null
          target_price?: string | null
          target_title?: string | null
          target_type?: string
          target_user_id?: string | null
          updated_at?: string
          user_facing_message?: string | null
        }
        Update: {
          allow_contact?: boolean
          assigned_to?: string | null
          contact_info?: string | null
          created_at?: string
          details?: string | null
          history?: Json | null
          id?: string
          internal_notes?: Json | null
          listing_id?: string | null
          message_id?: string | null
          reason_code?: string
          reason_label?: string
          reporter_id?: string | null
          resolution_outcome?: string | null
          review_id?: string | null
          status?: string
          status_note?: string | null
          target_image_url?: string | null
          target_location?: string | null
          target_module?: string | null
          target_price?: string | null
          target_title?: string | null
          target_type?: string
          target_user_id?: string | null
          updated_at?: string
          user_facing_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "job_marketplace_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listing_search_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "service_marketplace_view"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_id: string
          body: string
          created_at: string
          helpful_count: number
          helpful_user_ids: string[]
          id: string
          listing_id: string
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          owner_reply: string | null
          owner_reply_at: string | null
          rating: number
          status: string
          subratings: Json
          title: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          helpful_count?: number
          helpful_user_ids?: string[]
          id?: string
          listing_id: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          owner_reply?: string | null
          owner_reply_at?: string | null
          rating: number
          status?: string
          subratings?: Json
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          helpful_count?: number
          helpful_user_ids?: string[]
          id?: string
          listing_id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          owner_reply?: string | null
          owner_reply_at?: string | null
          rating?: number
          status?: string
          subratings?: Json
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "job_marketplace_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listing_search_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "service_marketplace_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_listings: {
        Row: {
          created_at: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "job_marketplace_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listing_search_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "service_marketplace_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      job_marketplace_view: {
        Row: {
          application_deadline: string | null
          area_id: string | null
          area_name: string | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          city_id: string | null
          city_name: string | null
          company_logo_url: string | null
          company_name: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          district_id: string | null
          district_name: string | null
          employment_type: string | null
          exact_address: string | null
          experience: string | null
          id: string | null
          is_featured: boolean | null
          is_remote: boolean | null
          job_search_text: string | null
          latitude: number | null
          longitude: number | null
          maximum_price: number | null
          minimum_price: number | null
          module: string | null
          module_data: Json | null
          owner_id: string | null
          price: number | null
          pricing_period: string | null
          province_id: string | null
          province_name: string | null
          published_at: string | null
          salary_type: string | null
          search_text: string | null
          short_summary: string | null
          skills_text: string | null
          status: string | null
          subcategory_id: string | null
          subcategory_name: string | null
          submitted_at: string | null
          third_level_category_id: string | null
          third_level_category_name: string | null
          title: string | null
          updated_at: string | null
          work_mode: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_third_level_category_id_fkey"
            columns: ["third_level_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_search_view: {
        Row: {
          area_id: string | null
          area_name: string | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          city_id: string | null
          city_name: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          district_id: string | null
          district_name: string | null
          exact_address: string | null
          id: string | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          maximum_price: number | null
          minimum_price: number | null
          module: string | null
          module_data: Json | null
          owner_id: string | null
          price: number | null
          pricing_period: string | null
          province_id: string | null
          province_name: string | null
          published_at: string | null
          search_text: string | null
          short_summary: string | null
          status: string | null
          subcategory_id: string | null
          subcategory_name: string | null
          submitted_at: string | null
          third_level_category_id: string | null
          third_level_category_name: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_third_level_category_id_fkey"
            columns: ["third_level_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_marketplace_view: {
        Row: {
          area_id: string | null
          area_name: string | null
          availability_text: string | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          city_id: string | null
          city_name: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          district_id: string | null
          district_name: string | null
          exact_address: string | null
          id: string | null
          is_emergency: boolean | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          maximum_price: number | null
          minimum_price: number | null
          module: string | null
          module_data: Json | null
          owner_id: string | null
          price: number | null
          pricing_period: string | null
          pricing_type: string | null
          provider_name: string | null
          province_id: string | null
          province_name: string | null
          published_at: string | null
          service_search_text: string | null
          service_type: string | null
          short_summary: string | null
          status: string | null
          subcategory_id: string | null
          subcategory_name: string | null
          submitted_at: string | null
          third_level_category_id: string | null
          third_level_category_name: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_third_level_category_id_fkey"
            columns: ["third_level_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_change_user_status: {
        Args: { p_reason: string; p_status: string; p_user_id: string }
        Returns: Json
      }
      admin_manage_category: {
        Args: { p_action: string; p_category_id?: string; p_values?: Json }
        Returns: Json
      }
      admin_manage_location: {
        Args: { p_action: string; p_location_id?: string; p_values?: Json }
        Returns: Json
      }
      admin_moderate_report: {
        Args: {
          p_action: string
          p_assignee?: string
          p_linked_action?: string
          p_note?: string
          p_outcome?: string
          p_report_id: string
          p_user_message?: string
        }
        Returns: Json
      }
      admin_moderate_review: {
        Args: { p_reason: string; p_review_id: string; p_status: string }
        Returns: Json
      }
      admin_reorder_category: {
        Args: { p_category_id: string; p_direction: string }
        Returns: Json
      }
      admin_user_directory: {
        Args: {
          p_page?: number
          p_page_size?: number
          p_search?: string
          p_status?: string
        }
        Returns: Json
      }
      get_popular_locations: {
        Args: { p_days?: number; p_limit?: number }
        Returns: {
          active_listing_count: number
          location_id: string
          search_count: number
        }[]
      }
      get_published_review_summary: {
        Args: { p_listing_id: string }
        Returns: {
          average_rating: number
          rating: number
          rating_count: number
          total_count: number
        }[]
      }
      is_account_active: { Args: { p_user_id?: string }; Returns: boolean }
      is_staff: { Args: { p_user_id?: string }; Returns: boolean }
      moderate_listing: {
        Args: { p_action: string; p_listing_id: string; p_reason?: string }
        Returns: Json
      }
      search_active_locations: {
        Args: { result_limit?: number; search_term: string }
        Returns: {
          city_id: string
          city_name: string
          code: string
          district_id: string
          district_name: string
          id: string
          name: string
          parent_id: string
          postal_code: string
          province_id: string
          province_name: string
          type: string
        }[]
      }
      search_marketplace: {
        Args: {
          p_area_id?: string
          p_category_id?: string
          p_city_id?: string
          p_district_id?: string
          p_limit?: number
          p_max_price?: number
          p_min_price?: number
          p_module?: string
          p_offset?: number
          p_province_id?: string
          p_query?: string
          p_sort?: string
        }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      super_admin_change_staff_role: {
        Args: { p_reason: string; p_role: string; p_user_id: string }
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

