export type AppRole = 'user' | 'moderator' | 'admin' | 'super_admin';
export type AccountStatus = 'active' | 'restricted' | 'suspended' | 'banned';
export type ListingModule = 'rental' | 'job' | 'service';
export type ListingStatus = 
  | 'draft' 
  | 'pending' 
  | 'changes_required' 
  | 'active' 
  | 'rejected' 
  | 'paused' 
  | 'expired' 
  | 'archived';

export type ReportStatus = 'submitted' | 'under_review' | 'resolved' | 'dismissed';
export type ReviewStatus = 'published' | 'removed' | 'pending_moderation';

export interface ProfileRow {
  id: string;
  full_name: string;
  display_name: string | null;
  email: string;
  phone_normalized: string | null;
  profile_photo_url: string | null;
  preferred_language: string | null;
  role: AppRole;
  account_status: AccountStatus;
  bio: string | null;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  area_id: string | null;
  agreement_version: string | null;
  agreement_accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  module: ListingModule;
  name: string;
  slug: string;
  parent_id: string | null;
  level: number;
  status: 'active' | 'inactive';
  sort_order: number;
  icon_key: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocationRow {
  id: string;
  code: string | null;
  name: string;
  type: 'country' | 'province' | 'district' | 'city' | 'area';
  parent_id: string | null;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  latitude: number | null;
  longitude: number | null;
  postal_code: string | null;
  name_si: string | null;
  name_ta: string | null;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ListingRow {
  id: string;
  owner_id: string;
  module: ListingModule;
  category_id: string | null;
  subcategory_id: string | null;
  title: string;
  description: string;
  status: ListingStatus;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  area_id: string | null;
  exact_address: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_email: string | null;
  hide_phone: boolean;
  negotiable: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  rejected_at: string | null;
  rejected_by: string | null;
  rejection_reason: string | null;
}

export interface RentalDetailsRow {
  listing_id: string;
  rates: Record<string, number>;
  security_deposit: number | null;
  available_from: string | null;
  delivery_available: boolean;
  pickup_available: boolean;
  terms: string | null;
  attributes: Record<string, unknown>;
  features: string[];
}

export interface JobDetailsRow {
  listing_id: string;
  company_name: string;
  employment_type: string | null;
  work_mode: string | null;
  vacancies: number;
  salary_min: number | null;
  salary_max: number | null;
  salary_type: string | null;
  experience_required: string | null;
  education_level: string | null;
  working_hours: string | null;
  working_days: string | null;
  benefits: string[];
  application_deadline: string | null;
  apply_phone: string | null;
  apply_whatsapp: string | null;
  apply_email: string | null;
}

export interface ServiceDetailsRow {
  listing_id: string;
  provider_type: string | null;
  experience_years: number | null;
  availability_days: string[];
  availability_time: string | null;
  emergency_service: boolean;
  advance_booking: boolean;
  pricing_type: string | null;
  starting_price: number | null;
  service_area: string | null;
  portfolio_urls: string[];
}

export interface ListingMediaRow {
  id: string;
  listing_id: string;
  storage_path: string;
  media_type: 'image' | 'video' | 'document';
  sort_order: number;
  created_at: string;
}

export interface SavedListingRow {
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface HomeSlideRow {
  id: string;
  title: string;
  title_highlight?: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  mobile_image_url?: string | null;
  cta_text?: string | null;
  cta_route?: string | null;
  cta_action?: string | null;
  theme_color?: string | null;
  is_active: boolean;
  display_order: number;
  duration_ms?: number | null;
  overlay_strength?: number | null;
  placement?: 'home' | 'rentals' | 'jobs' | 'services' | string | null;
  created_at?: string;
}

export interface ReviewRow {
  id: string;
  author_id: string;
  target_type: 'listing' | 'user';
  target_id: string;
  module: ListingModule | null;
  overall_rating: number;
  title: string | null;
  body: string;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface ReportRow {
  id: string;
  reporter_id: string;
  target_type: 'listing' | 'user' | 'review' | 'message';
  target_id: string;
  target_module: ListingModule | null;
  reason_code: string;
  description: string | null;
  status: ReportStatus;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_type: string | null;
  related_id: string | null;
  read_at: string | null;
  created_at: string;
}

export interface ConversationRow {
  id: string;
  listing_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipantRow {
  conversation_id: string;
  user_id: string;
  created_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  actor_id: string | null;
  actor_role: AppRole | null;
  action: string;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & Pick<ProfileRow, 'id' | 'email'>;
        Update: Partial<ProfileRow>;
      };
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow> & Pick<CategoryRow, 'module' | 'name' | 'slug'>;
        Update: Partial<CategoryRow>;
      };
      locations: {
        Row: LocationRow;
        Insert: Partial<LocationRow> & Pick<LocationRow, 'name' | 'type'>;
        Update: Partial<LocationRow>;
      };
      listings: {
        Row: ListingRow;
        Insert: Partial<ListingRow> & Pick<ListingRow, 'owner_id' | 'module' | 'title' | 'description'>;
        Update: Partial<ListingRow>;
      };
      rental_details: {
        Row: RentalDetailsRow;
        Insert: Partial<RentalDetailsRow> & Pick<RentalDetailsRow, 'listing_id'>;
        Update: Partial<RentalDetailsRow>;
      };
      job_details: {
        Row: JobDetailsRow;
        Insert: Partial<JobDetailsRow> & Pick<JobDetailsRow, 'listing_id' | 'company_name'>;
        Update: Partial<JobDetailsRow>;
      };
      service_details: {
        Row: ServiceDetailsRow;
        Insert: Partial<ServiceDetailsRow> & Pick<ServiceDetailsRow, 'listing_id'>;
        Update: Partial<ServiceDetailsRow>;
      };
      listing_media: {
        Row: ListingMediaRow;
        Insert: Partial<ListingMediaRow> & Pick<ListingMediaRow, 'listing_id' | 'storage_path'>;
        Update: Partial<ListingMediaRow>;
      };
      saved_listings: {
        Row: SavedListingRow;
        Insert: SavedListingRow;
        Update: Partial<SavedListingRow>;
      };
      reviews: {
        Row: ReviewRow;
        Insert: Partial<ReviewRow> & Pick<ReviewRow, 'author_id' | 'target_type' | 'target_id' | 'overall_rating' | 'body'>;
        Update: Partial<ReviewRow>;
      };
      reports: {
        Row: ReportRow;
        Insert: Partial<ReportRow> & Pick<ReportRow, 'reporter_id' | 'target_type' | 'target_id' | 'reason_code'>;
        Update: Partial<ReportRow>;
      };
      notifications: {
        Row: NotificationRow;
        Insert: Partial<NotificationRow> & Pick<NotificationRow, 'user_id' | 'type' | 'title' | 'message'>;
        Update: Partial<NotificationRow>;
      };
      conversations: {
        Row: ConversationRow;
        Insert: Partial<ConversationRow>;
        Update: Partial<ConversationRow>;
      };
      conversation_participants: {
        Row: ConversationParticipantRow;
        Insert: ConversationParticipantRow;
        Update: Partial<ConversationParticipantRow>;
      };
      messages: {
        Row: MessageRow;
        Insert: Partial<MessageRow> & Pick<MessageRow, 'conversation_id' | 'sender_id' | 'body'>;
        Update: Partial<MessageRow>;
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: Partial<AuditLogRow> & Pick<AuditLogRow, 'action' | 'target_type'>;
        Update: Partial<AuditLogRow>;
      };
    };
  };
}
