export type AppRole = 'user' | 'moderator' | 'admin' | 'super_admin';
export type AccountStatus = 'active' | 'restricted' | 'suspended' | 'banned';
export type ListingModule = 'rental' | 'job' | 'service';
export type ListingStatus = 
  | 'draft' 
  | 'pending' 
  | 'changes_requested' 
  | 'active' 
  | 'rejected' 
  | 'paused' 
  | 'expired';

export type ReportStatus = 'submitted' | 'under_review' | 'resolved' | 'dismissed';
export type ReviewStatus = 'published' | 'removed' | 'pending_moderation';

export interface ProfileRow {
  id: string;
  full_name: string;
  email: string;
  phone_normalized: string | null;
  role: AppRole;
  account_status: AccountStatus;
  agreement_version: string | null;
  agreement_accepted_at: string | null;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  area_id: string | null;
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
  third_level_category_id: string | null;
  title: string;
  short_summary: string | null;
  description: string;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  area_id: string | null;
  exact_address: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number | null;
  minimum_price: number | null;
  maximum_price: number | null;
  pricing_period: string | null;
  currency: string | null;
  status: ListingStatus;
  is_featured: boolean;
  module_data: Record<string, any> | null;
  published_at: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingMediaRow {
  id: string;
  listing_id: string;
  storage_path: string;
  media_type: 'image' | 'video' | 'document';
  position: number;
  sort_order?: number;
  created_at: string;
}

export interface SavedListingRow {
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface JobCompanyRow {
  id: string;
  name: string;
  brand_key: string | null;
  subtitle: string | null;
  short_description: string | null;
  logo_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
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
  module?: string | null;
  is_active: boolean;
  display_order: number;
  duration_ms?: number | null;
  overlay_strength?: number | null;
  placement?: 'home' | 'rentals' | 'jobs' | 'services' | string | null;
  created_at?: string;
}

export interface LocationSearchEventRow {
  id: string;
  user_id: string | null;
  search_query: string | null;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  area_id: string | null;
  location_id?: string | null;
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
      job_companies: {
        Row: JobCompanyRow;
        Insert: Partial<JobCompanyRow> & Pick<JobCompanyRow, 'name'>;
        Update: Partial<JobCompanyRow>;
      };
      home_slides: {
        Row: HomeSlideRow;
        Insert: Partial<HomeSlideRow> & Pick<HomeSlideRow, 'title' | 'image_url'>;
        Update: Partial<HomeSlideRow>;
      };
      location_search_events: {
        Row: LocationSearchEventRow;
        Insert: Partial<LocationSearchEventRow>;
        Update: Partial<LocationSearchEventRow>;
      };
    };
  };
}
