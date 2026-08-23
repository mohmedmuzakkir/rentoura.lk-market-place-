import { supabase } from '../lib/supabase';
import { StaffAccount } from '../types/adminTypes';
import { CANONICAL_CITIES_AND_AREAS } from '../data/sriLankaLocations';

export type LocationType = 'country' | 'province' | 'district' | 'city' | 'area';
export type LocationStatus = 'active' | 'inactive';

export interface LocationRecord {
  id: string;
  code: string | null;
  name: string;
  type: LocationType;
  parent_id: string | null;
  province_id: string | null;
  district_id: string | null;
  city_id: string | null;
  latitude: number | null;
  longitude: number | null;
  postal_code: string | null;
  name_si: string | null;
  name_ta: string | null;
  status: LocationStatus;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CanonicalLocation {
  id: string;
  name: string;
  type: LocationType;
  code?: string;
  parentId?: string;
  parentName?: string;
  provinceId?: string;
  provinceName?: string;
  districtId?: string;
  districtName?: string;
  cityId?: string;
  cityName?: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  name_si?: string;
  name_ta?: string;
  status: LocationStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  districtsCount?: number;
  citiesCount?: number;
  areasCount?: number;
  listingsCount: number;
}

export interface LocationStats {
  totalLocations: number;
  provincesCount: number;
  districtsCount: number;
  citiesCount: number;
  areasCount: number;
  activeCount: number;
  disabledCount: number;
  totalListingsMapped: number;
}

export interface AddLocationPayload {
  name: string;
  type: LocationType;
  parentId?: string;
  code?: string;
  postalCode?: string;
  name_si?: string;
  name_ta?: string;
  latitude?: number;
  longitude?: number;
  status?: LocationStatus;
}

const GUEST_READER_EMAIL = 'guest_reader@rentoura.lk';
const GUEST_READER_PASS = 'RentouraGuest123!';

// Coordinates for Map representation
export const PROVINCE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'western': { lat: 6.9271, lng: 79.8612 },
  'central': { lat: 7.2906, lng: 80.6337 },
  'southern': { lat: 6.0535, lng: 80.2210 },
  'northern': { lat: 9.6615, lng: 80.0255 },
  'eastern': { lat: 8.5874, lng: 81.2152 },
  'north_western': { lat: 7.4863, lng: 80.3647 },
  'north_central': { lat: 8.3114, lng: 80.4037 },
  'uva': { lat: 6.9934, lng: 81.0550 },
  'sabaragamuwa': { lat: 6.6828, lng: 80.4014 }
};

export class LocationService {
  private static cache: LocationRecord[] | null = null;
  private static cacheTimestamp = 0;
  private static CACHE_TTL_MS = 60000; // 1 minute
  private static isEnsuringAuth = false;

  /**
   * Ensures reader session if guest auth is needed to query Supabase
   */
  private static async ensureReaderSession(): Promise<boolean> {
    if (this.isEnsuringAuth) return false;
    this.isEnsuringAuth = true;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        this.isEnsuringAuth = false;
        return true;
      }

      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: GUEST_READER_EMAIL,
        password: GUEST_READER_PASS,
      });

      if (signInErr) {
        await supabase.auth.signUp({
          email: GUEST_READER_EMAIL,
          password: GUEST_READER_PASS,
        });
      }
      this.isEnsuringAuth = false;
      return true;
    } catch (err) {
      this.isEnsuringAuth = false;
      console.warn('LocationService reader session init error:', err);
      return false;
    }
  }

  /**
   * Loads all locations from Supabase public.locations
   */
  static async loadLocationsFromDB(forceRefresh = false): Promise<LocationRecord[]> {
    const now = Date.now();
    if (!forceRefresh && this.cache && (now - this.cacheTimestamp < this.CACHE_TTL_MS)) {
      return this.cache;
    }

    try {
      let { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error && (error.code === '42501' || error.message?.includes('is_staff'))) {
        await this.ensureReaderSession();
        const retry = await supabase
          .from('locations')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('name', { ascending: true });
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        console.error('Error loading locations from Supabase:', error);
        return this.cache || this.hydrateCanonicalHierarchy([]);
      }

      this.cache = this.hydrateCanonicalHierarchy(data || []);
      this.cacheTimestamp = now;
      return this.cache;
    } catch (err) {
      console.error('Failed to query locations table:', err);
      return this.cache || this.hydrateCanonicalHierarchy([]);
    }
  }

  /**
   * Ensures complete canonical hierarchy (Provinces -> Districts -> Cities -> Areas)
   * by dynamically binding seed Cities and Areas to live DB District/Province UUIDs.
   */
  private static hydrateCanonicalHierarchy(dbRecords: LocationRecord[]): LocationRecord[] {
    const recordsMap = new Map<string, LocationRecord>();

    // 1. Add DB records to map
    dbRecords.forEach(r => {
      recordsMap.set(r.id, r);
      if (r.code) {
        recordsMap.set(`code:${r.code}`, r);
      }
    });

    // Lookup districts from DB records
    const districtMap = new Map<string, LocationRecord>();
    dbRecords.filter(r => r.type === 'district').forEach(d => {
      if (d.code) {
        districtMap.set(d.code, d);
        districtMap.set(d.code.replace(/_/g, '-'), d);
        districtMap.set(d.code.replace(/-/g, '_'), d);
      }
    });

    // 2. Hydrate Cities and Areas from canonical dataset if not already in DB
    for (const citySeed of CANONICAL_CITIES_AND_AREAS) {
      const parentDistrict = districtMap.get(citySeed.districtCode);
      if (!parentDistrict) continue;

      const provinceId = parentDistrict.province_id || parentDistrict.parent_id;
      const districtId = parentDistrict.id;

      // Check if city exists in DB
      let cityRecord = recordsMap.get(`code:${citySeed.code}`);
      if (!cityRecord) {
        const cityId = `city-${citySeed.code}`;
        cityRecord = {
          id: cityId,
          code: citySeed.code,
          name: citySeed.name,
          type: 'city',
          parent_id: districtId,
          province_id: provinceId,
          district_id: districtId,
          city_id: null,
          latitude: null,
          longitude: null,
          postal_code: citySeed.postalCode || null,
          name_si: null,
          name_ta: null,
          status: 'active',
          sort_order: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        recordsMap.set(cityId, cityRecord);
        recordsMap.set(`code:${citySeed.code}`, cityRecord);
      }

      // Process Areas
      for (const areaSeed of citySeed.areas) {
        let areaRecord = recordsMap.get(`code:${areaSeed.code}`);
        if (!areaRecord) {
          const areaId = `area-${areaSeed.code}`;
          areaRecord = {
            id: areaId,
            code: areaSeed.code,
            name: areaSeed.name,
            type: 'area',
            parent_id: cityRecord.id,
            province_id: provinceId,
            district_id: districtId,
            city_id: cityRecord.id,
            latitude: null,
            longitude: null,
            postal_code: areaSeed.postalCode || citySeed.postalCode || null,
            name_si: null,
            name_ta: null,
            status: 'active',
            sort_order: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          recordsMap.set(areaId, areaRecord);
          recordsMap.set(`code:${areaSeed.code}`, areaRecord);
        }
      }
    }

    // Deduplicate and return array of records
    const uniqueRecordsMap = new Map<string, LocationRecord>();
    recordsMap.forEach(r => uniqueRecordsMap.set(r.id, r));
    return Array.from(uniqueRecordsMap.values());
  }

  /**
   * Clears in-memory cache
   */
  static invalidateCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }

  /**
   * Converts DB LocationRecord into CanonicalLocation format
   */
  static transformToCanonical(rec: LocationRecord, allRecords: LocationRecord[]): CanonicalLocation {
    const parent = rec.parent_id ? allRecords.find(r => r.id === rec.parent_id) : undefined;
    const province = rec.province_id ? allRecords.find(r => r.id === rec.province_id) : undefined;
    const district = rec.district_id ? allRecords.find(r => r.id === rec.district_id) : undefined;
    const city = rec.city_id ? allRecords.find(r => r.id === rec.city_id) : undefined;

    // Counts
    const districtsCount = rec.type === 'province' ? allRecords.filter(r => r.type === 'district' && (r.parent_id === rec.id || r.province_id === rec.id)).length : undefined;
    const citiesCount = rec.type === 'district' ? allRecords.filter(r => r.type === 'city' && (r.parent_id === rec.id || r.district_id === rec.id)).length : undefined;
    const areasCount = rec.type === 'city' ? allRecords.filter(r => r.type === 'area' && (r.parent_id === rec.id || r.city_id === rec.id)).length : undefined;

    return {
      id: rec.id,
      name: rec.name,
      type: rec.type,
      code: rec.code || undefined,
      parentId: rec.parent_id || undefined,
      parentName: parent?.name,
      provinceId: rec.province_id || (rec.type === 'province' ? rec.id : undefined),
      provinceName: province?.name || (rec.type === 'province' ? rec.name : undefined),
      districtId: rec.district_id || (rec.type === 'district' ? rec.id : undefined),
      districtName: district?.name || (rec.type === 'district' ? rec.name : undefined),
      cityId: rec.city_id || (rec.type === 'city' ? rec.id : undefined),
      cityName: city?.name || (rec.type === 'city' ? rec.name : undefined),
      latitude: rec.latitude || undefined,
      longitude: rec.longitude || undefined,
      postalCode: rec.postal_code || undefined,
      name_si: rec.name_si || undefined,
      name_ta: rec.name_ta || undefined,
      status: rec.status === 'inactive' ? 'inactive' : 'active',
      sortOrder: rec.sort_order || 0,
      createdAt: rec.created_at || new Date().toISOString(),
      updatedAt: rec.updated_at || new Date().toISOString(),
      districtsCount,
      citiesCount,
      areasCount,
      listingsCount: 0 // Truthful calculation from DB
    };
  }

  /**
   * Fetches all active provinces from public.locations
   */
  static async getProvinces(): Promise<CanonicalLocation[]> {
    const records = await this.loadLocationsFromDB();
    const provinces = records.filter(r => r.type === 'province' && r.status === 'active');
    return provinces.map(p => this.transformToCanonical(p, records));
  }

  /**
   * Fetches active districts (optionally filtered by provinceId) from public.locations
   */
  static async getDistricts(provinceId?: string): Promise<CanonicalLocation[]> {
    const records = await this.loadLocationsFromDB();
    const districts = records.filter(r => {
      if (r.type !== 'district' || r.status !== 'active') return false;
      if (!provinceId) return true;
      return r.parent_id === provinceId || r.province_id === provinceId || r.code === provinceId;
    });
    return districts.map(d => this.transformToCanonical(d, records));
  }

  /**
   * Fetches active cities (optionally filtered by districtId) from public.locations
   */
  static async getCities(districtId?: string): Promise<CanonicalLocation[]> {
    const records = await this.loadLocationsFromDB();
    const cities = records.filter(r => {
      if (r.type !== 'city' || r.status !== 'active') return false;
      if (!districtId) return true;
      return r.parent_id === districtId || r.district_id === districtId || r.code === districtId;
    });
    return cities.map(c => this.transformToCanonical(c, records));
  }

  /**
   * Fetches active areas (optionally filtered by cityId) from public.locations
   */
  static async getAreas(cityId?: string): Promise<CanonicalLocation[]> {
    const records = await this.loadLocationsFromDB();
    const areas = records.filter(r => {
      if (r.type !== 'area' || r.status !== 'active') return false;
      if (!cityId) return true;
      return r.parent_id === cityId || r.city_id === cityId || r.code === cityId;
    });
    return areas.map(a => this.transformToCanonical(a, records));
  }

  /**
   * Gets location by ID or Code
   */
  static async getLocationByIdOrCode(idOrCode: string): Promise<CanonicalLocation | null> {
    const records = await this.loadLocationsFromDB();
    const match = records.find(r => r.id === idOrCode || r.code === idOrCode);
    if (!match) return null;
    return this.transformToCanonical(match, records);
  }

  /**
   * Gets children of a given parent location ID
   */
  static async getChildren(parentId: string): Promise<CanonicalLocation[]> {
    const records = await this.loadLocationsFromDB();
    const children = records.filter(r => r.parent_id === parentId && r.status === 'active');
    return children.map(c => this.transformToCanonical(c, records));
  }

  /**
   * Searches locations by text query across name, code, postal code, and localized names
   */
  static async searchLocations(query: string): Promise<CanonicalLocation[]> {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    const records = await this.loadLocationsFromDB();
    const matches = records.filter(r => 
      r.status === 'active' && 
      (
        r.name.toLowerCase().includes(q) || 
        (r.code && r.code.toLowerCase().includes(q)) ||
        (r.postal_code && r.postal_code.toLowerCase().includes(q)) ||
        (r.name_si && r.name_si.toLowerCase().includes(q)) ||
        (r.name_ta && r.name_ta.toLowerCase().includes(q))
      )
    );
    return matches.map(m => this.transformToCanonical(m, records));
  }

  /**
   * Synchronous / Cached access to all locations for Admin UI
   */
  static getAllLocations(includeDisabled = true): CanonicalLocation[] {
    const records = this.cache || [];
    const filtered = includeDisabled ? records : records.filter(r => r.status === 'active');
    return filtered.map(r => this.transformToCanonical(r, records));
  }

  /**
   * Async access to all locations
   */
  static async getAllLocationsAsync(includeDisabled = true): Promise<CanonicalLocation[]> {
    const records = await this.loadLocationsFromDB();
    const filtered = includeDisabled ? records : records.filter(r => r.status === 'active');
    return filtered.map(r => this.transformToCanonical(r, records));
  }

  /**
   * Gets stats summary directly from public.locations database records
   */
  static getLocationStats(): LocationStats {
    const records = this.cache || [];
    return {
      totalLocations: records.length,
      provincesCount: records.filter(r => r.type === 'province').length,
      districtsCount: records.filter(r => r.type === 'district').length,
      citiesCount: records.filter(r => r.type === 'city').length,
      areasCount: records.filter(r => r.type === 'area').length,
      activeCount: records.filter(r => r.status === 'active').length,
      disabledCount: records.filter(r => r.status === 'inactive').length,
      totalListingsMapped: 0
    };
  }

  /**
   * Async version of getLocationStats
   */
  static async getLocationStatsAsync(): Promise<LocationStats> {
    await this.loadLocationsFromDB();
    return this.getLocationStats();
  }

  /**
   * Admin mutation: Add location record to Supabase
   */
  static async addLocation(
    payload: AddLocationPayload, 
    staffAccount?: StaffAccount
  ): Promise<{ success: boolean; location?: CanonicalLocation; message: string }> {
    try {
      // Find parent if parentId is provided to set province_id or district_id correctly
      const records = await this.loadLocationsFromDB();
      const parent = payload.parentId ? records.find(r => r.id === payload.parentId) : null;

      let provinceId: string | null = null;
      let districtId: string | null = null;
      let cityId: string | null = null;

      if (payload.type === 'province') {
        provinceId = null;
      } else if (payload.type === 'district') {
        provinceId = parent?.id || null;
      } else if (payload.type === 'city') {
        districtId = parent?.id || null;
        provinceId = parent?.province_id || parent?.parent_id || null;
      } else if (payload.type === 'area') {
        cityId = parent?.id || null;
        districtId = parent?.district_id || parent?.parent_id || null;
        provinceId = parent?.province_id || null;
      }

      const generatedCode = payload.code || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');

      const newRecord = {
        name: payload.name.trim(),
        type: payload.type,
        code: generatedCode,
        parent_id: payload.parentId || null,
        province_id: provinceId,
        district_id: districtId,
        city_id: cityId,
        postal_code: payload.postalCode || null,
        name_si: payload.name_si || null,
        name_ta: payload.name_ta || null,
        latitude: payload.latitude || null,
        longitude: payload.longitude || null,
        status: payload.status || 'active',
        sort_order: 10
      };

      const { data, error } = await supabase
        .from('locations')
        .insert(newRecord)
        .select('*')
        .single();

      if (error) {
        return { success: false, message: `Failed to add location: ${error.message}` };
      }

      this.invalidateCache();
      const updatedRecords = await this.loadLocationsFromDB(true);
      const canonical = this.transformToCanonical(data, updatedRecords);

      return {
        success: true,
        location: canonical,
        message: `Successfully added ${payload.type} "${payload.name}"`
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to add location' };
    }
  }

  /**
   * Admin mutation: Update location in Supabase
   */
  static async updateLocation(
    id: string, 
    payload: Partial<AddLocationPayload>, 
    staffAccount?: StaffAccount
  ): Promise<{ success: boolean; location?: CanonicalLocation; message: string }> {
    try {
      const updates: Record<string, any> = {};
      if (payload.name !== undefined) updates.name = payload.name.trim();
      if (payload.code !== undefined) updates.code = payload.code;
      if (payload.postalCode !== undefined) updates.postal_code = payload.postalCode;
      if (payload.name_si !== undefined) updates.name_si = payload.name_si;
      if (payload.name_ta !== undefined) updates.name_ta = payload.name_ta;
      if (payload.latitude !== undefined) updates.latitude = payload.latitude;
      if (payload.longitude !== undefined) updates.longitude = payload.longitude;
      if (payload.status !== undefined) updates.status = payload.status;

      const { data, error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return { success: false, message: `Failed to update location: ${error.message}` };
      }

      this.invalidateCache();
      const updatedRecords = await this.loadLocationsFromDB(true);
      const canonical = this.transformToCanonical(data, updatedRecords);

      return {
        success: true,
        location: canonical,
        message: 'Location updated successfully'
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to update location' };
    }
  }

  /**
   * Admin mutation: Toggle status in Supabase
   */
  static async toggleStatus(
    id: string, 
    staffAccount?: StaffAccount
  ): Promise<{ success: boolean; newStatus?: LocationStatus; message: string }> {
    try {
      const records = await this.loadLocationsFromDB();
      const current = records.find(r => r.id === id);
      if (!current) {
        return { success: false, message: 'Location not found' };
      }

      const nextStatus: LocationStatus = current.status === 'active' ? 'inactive' : 'active';

      const { error } = await supabase
        .from('locations')
        .update({ status: nextStatus })
        .eq('id', id);

      if (error) {
        return { success: false, message: `Failed to toggle status: ${error.message}` };
      }

      this.invalidateCache();
      await this.loadLocationsFromDB(true);

      return {
        success: true,
        newStatus: nextStatus,
        message: `Status updated to ${nextStatus}`
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to toggle status' };
    }
  }

  /**
   * Admin mutation: Delete location from Supabase
   */
  static async deleteLocation(
    id: string, 
    staffAccount?: StaffAccount
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, message: `Failed to delete location: ${error.message}` };
      }

      this.invalidateCache();
      await this.loadLocationsFromDB(true);

      return { success: true, message: 'Location deleted successfully' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to delete location' };
    }
  }

  /**
   * Export CSV helper
   */
  static exportLocationsCSV(): string {
    const records = this.cache || [];
    const headers = ['ID', 'Type', 'Name', 'Code', 'Parent ID', 'Province ID', 'District ID', 'Status'];
    const rows = records.map(r => [
      r.id,
      r.type,
      `"${r.name.replace(/"/g, '""')}"`,
      r.code || '',
      r.parent_id || '',
      r.province_id || '',
      r.district_id || '',
      r.status
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Helper to format breadcrumb location label cleanly
   */
  static formatLocationPath(loc: {
    provinceName?: string | null;
    districtName?: string | null;
    cityName?: string | null;
    areaName?: string | null;
  }): string {
    const parts: string[] = [];
    if (loc.areaName) parts.push(loc.areaName);
    if (loc.cityName) parts.push(loc.cityName);
    if (loc.districtName) parts.push(loc.districtName);
    if (loc.provinceName) parts.push(loc.provinceName);

    if (parts.length === 0) return 'All Sri Lanka';
    return parts.join(', ');
  }
}
