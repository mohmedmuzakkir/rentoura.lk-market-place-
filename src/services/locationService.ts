import { supabase } from '../lib/supabase';

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

export interface LocationValueModel {
  displayName: string;
  provinceId?: string;
  provinceName?: string;
  districtId?: string;
  districtName?: string;
  cityId?: string;
  cityName?: string;
  areaId?: string;
  areaName?: string;
  type?: LocationType;
  latitude?: number;
  longitude?: number;
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
  /**
   * Loads all locations from Supabase public.locations
   */
  static async loadLocationsFromDB(forceRefresh = false): Promise<LocationRecord[]> {
    const now = Date.now();
    if (!forceRefresh && this.cache && (now - this.cacheTimestamp < this.CACHE_TTL_MS)) {
      return this.cache;
    }

    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading locations from Supabase:', error);
        return this.cache || [];
      }

      this.cache = (data || []) as LocationRecord[];
      this.cacheTimestamp = now;
      return this.cache;
    } catch (err) {
      console.error('Failed to query locations table:', err);
      return this.cache || [];
    }
  }

  /**
   * Clears in-memory cache
   */
  static invalidateCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('rentoura_locations_updated'));
  }

  /**
   * Converts DB LocationRecord into CanonicalLocation format with full parent chain resolution
   */
  static transformToCanonical(rec: LocationRecord, allRecords: LocationRecord[]): CanonicalLocation {
    const parent = rec.parent_id ? allRecords.find(r => r.id === rec.parent_id) : undefined;
    
    // Resolve ancestor hierarchy recursively
    let city = rec.city_id ? allRecords.find(r => r.id === rec.city_id) : undefined;
    if (!city && rec.type === 'area' && rec.parent_id) {
      city = allRecords.find(r => r.id === rec.parent_id && r.type === 'city');
    }

    let district = rec.district_id ? allRecords.find(r => r.id === rec.district_id) : undefined;
    if (!district && rec.type === 'city' && rec.parent_id) {
      district = allRecords.find(r => r.id === rec.parent_id && r.type === 'district');
    }
    if (!district && city?.parent_id) {
      district = allRecords.find(r => r.id === city.parent_id && r.type === 'district');
    }

    let province = rec.province_id ? allRecords.find(r => r.id === rec.province_id) : undefined;
    if (!province && rec.type === 'district' && rec.parent_id) {
      province = allRecords.find(r => r.id === rec.parent_id && r.type === 'province');
    }
    if (!province && district?.parent_id) {
      province = allRecords.find(r => r.id === district.parent_id && r.type === 'province');
    }

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
      provinceId: rec.province_id || (rec.type === 'province' ? rec.id : province?.id),
      provinceName: province?.name || (rec.type === 'province' ? rec.name : undefined),
      districtId: rec.district_id || (rec.type === 'district' ? rec.id : district?.id),
      districtName: district?.name || (rec.type === 'district' ? rec.name : undefined),
      cityId: rec.city_id || (rec.type === 'city' ? rec.id : city?.id),
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
      listingsCount: 0
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
   * Returns ranked search results (exact name matches & prefix matches prioritized)
   */
  static async searchLocations(query: string, options?: { limit?: number }): Promise<CanonicalLocation[]> {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    const records = await this.loadLocationsFromDB();
    
    const activeRecords = records.filter(r => r.status === 'active');
    
    const matches = activeRecords.filter(r => 
      r.name.toLowerCase().includes(q) || 
      (r.code && r.code.toLowerCase().includes(q)) ||
      (r.postal_code && r.postal_code.toLowerCase().includes(q)) ||
      (r.name_si && r.name_si.toLowerCase().includes(q)) ||
      (r.name_ta && r.name_ta.toLowerCase().includes(q))
    );

    // Rank results
    matches.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      // 1. Exact match
      if (aName === q && bName !== q) return -1;
      if (bName === q && aName !== q) return 1;

      // 2. Starts with query
      const aStarts = aName.startsWith(q);
      const bStarts = bName.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;

      // 3. Hierarchy level preference (cities/areas preferred over provinces for granular search)
      const typeRank = { area: 1, city: 2, district: 3, province: 4 };
      const aRank = typeRank[a.type] || 5;
      const bRank = typeRank[b.type] || 5;
      if (aRank !== bRank) return aRank - bRank;

      return aName.localeCompare(bName);
    });

    const results = matches.map(m => this.transformToCanonical(m, records));
    if (options?.limit && options.limit > 0) {
      return results.slice(0, options.limit);
    }
    return results;
  }

  /**
   * Calculates Haversine distance in km between two geographical points
   */
  public static calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Finds nearest location record with valid coordinates within threshold distance
   */
  public static async findNearestLocation(lat: number, lng: number): Promise<{
    matchedLocation: CanonicalLocation | null;
    distanceKm: number | null;
  }> {
    const records = await this.loadLocationsFromDB();
    const recordsWithCoords = records.filter(r => r.latitude !== null && r.longitude !== null && r.status === 'active');

    if (recordsWithCoords.length === 0) {
      return { matchedLocation: null, distanceKm: null };
    }

    let closestRecord: LocationRecord | null = null;
    let minDistance = Infinity;

    for (const r of recordsWithCoords) {
      const dist = this.calculateDistanceKm(lat, lng, r.latitude!, r.longitude!);
      if (dist < minDistance) {
        minDistance = dist;
        closestRecord = r;
      }
    }

    // Require reliable match threshold <= 25km
    if (closestRecord && minDistance <= 25) {
      const canonical = this.transformToCanonical(closestRecord, records);
      return { matchedLocation: canonical, distanceKm: Math.round(minDistance * 10) / 10 };
    }

    return { matchedLocation: null, distanceKm: null };
  }

  /**
   * Resolves a string name or ID into a full LocationValueModel object
   */
  public static async resolveLocationValueModel(idOrName?: string | null): Promise<LocationValueModel> {
    if (!idOrName || idOrName === 'All Sri Lanka' || idOrName === 'Islandwide' || idOrName.trim() === '') {
      return {
        displayName: 'All Sri Lanka',
        type: 'country'
      };
    }

    const records = await this.loadLocationsFromDB();
    const input = idOrName.trim();

    // 1. Try by ID match
    let foundRecord = records.find(r => r.id === input);

    // 2. Try by exact name match or comma-split main segment
    if (!foundRecord) {
      const mainSegment = input.split(',')[0].trim().toLowerCase();
      foundRecord = records.find(r => r.name.toLowerCase() === mainSegment || r.name.toLowerCase() === input.toLowerCase());
    }

    // 3. Try partial name match
    if (!foundRecord) {
      const mainSegment = input.split(',')[0].trim().toLowerCase();
      foundRecord = records.find(r => r.name.toLowerCase().includes(mainSegment));
    }

    if (foundRecord) {
      const canonical = this.transformToCanonical(foundRecord, records);
      return {
        displayName: input.includes(',') ? input : (
          canonical.type === 'area' && canonical.cityName ? `${canonical.name}, ${canonical.cityName}` :
          canonical.type === 'city' && canonical.districtName ? `${canonical.name}, ${canonical.districtName}` :
          canonical.type === 'district' && canonical.provinceName ? `${canonical.name}, ${canonical.provinceName}` :
          canonical.name
        ),
        provinceId: canonical.provinceId,
        provinceName: canonical.provinceName,
        districtId: canonical.districtId,
        districtName: canonical.districtName,
        cityId: canonical.cityId,
        cityName: canonical.cityName,
        areaId: canonical.type === 'area' ? canonical.id : undefined,
        areaName: canonical.type === 'area' ? canonical.name : undefined,
        type: canonical.type,
        latitude: canonical.latitude,
        longitude: canonical.longitude
      };
    }

    return {
      displayName: input
    };
  }

  /**
   * Logs explicit location apply events to public.location_search_events
   */
  public static async logLocationApplyEvent(
    valueModel: LocationValueModel,
    searchQuery?: string
  ): Promise<void> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id || null;

      const selectedLocId = valueModel.areaId || valueModel.cityId || valueModel.districtId || valueModel.provinceId || null;

      await supabase.from('location_search_events').insert({
        user_id: userId,
        search_query: searchQuery?.trim() || null,
        province_id: valueModel.provinceId || null,
        district_id: valueModel.districtId || null,
        city_id: valueModel.cityId || null,
        area_id: valueModel.areaId || null,
        location_id: selectedLocId
      });
    } catch (err) {
      console.warn('Non-fatal: failed to log location apply event:', err);
    }
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

  private static slugify(value: string): string { return value.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private static async mutate(action: string, id: string | null, values: Record<string, unknown>): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.rpc('admin_manage_location', { p_action: action, p_location_id: id, p_values: values });
    if (error) return { success: false, message: error.message };
    this.invalidateCache(); await this.loadLocationsFromDB(true); return { success: true, message: 'Location saved successfully' };
  }
  static async addLocation(payload: AddLocationPayload): Promise<{ success: boolean; location?: CanonicalLocation; message: string }> {
    const result = await this.mutate('create', null, { type: payload.type, name: payload.name.trim(), code: this.slugify(payload.code || payload.name), parent_id: payload.parentId || null, postal_code: payload.postalCode || null, name_si: payload.name_si || null, name_ta: payload.name_ta || null, latitude: payload.latitude ?? null, longitude: payload.longitude ?? null, status: payload.status || 'active', reason: 'Location created' });
    return result;
  }

  /**
   * Admin mutation: Update location in Supabase
   */
  static async updateLocation(
    id: string, 
    payload: Partial<AddLocationPayload>
  ): Promise<{ success: boolean; location?: CanonicalLocation; message: string }> {
    const values: Record<string, unknown> = { reason: 'Location details updated' };
    if (payload.name !== undefined) values.name = payload.name.trim(); if (payload.code !== undefined) values.code = this.slugify(payload.code);
    if (payload.parentId !== undefined) values.parent_id = payload.parentId || null; if (payload.postalCode !== undefined) values.postal_code = payload.postalCode || null;
    if (payload.name_si !== undefined) values.name_si = payload.name_si || null; if (payload.name_ta !== undefined) values.name_ta = payload.name_ta || null;
    if (payload.latitude !== undefined) values.latitude = payload.latitude; if (payload.longitude !== undefined) values.longitude = payload.longitude; if (payload.status !== undefined) values.status = payload.status;
    return this.mutate('update', id, values);
  }

  /**
   * Admin mutation: Toggle status in Supabase
   */
  static async toggleStatus(
    id: string
  ): Promise<{ success: boolean; newStatus?: LocationStatus; message: string }> {
    try {
      const records = await this.loadLocationsFromDB();
      const current = records.find(r => r.id === id);
      if (!current) {
        return { success: false, message: 'Location not found' };
      }

      const nextStatus: LocationStatus = current.status === 'active' ? 'inactive' : 'active';

      const result = await this.mutate('set_status', id, { status: nextStatus, reason: `Location ${nextStatus}` });
      if (!result.success) return result;

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
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.mutate('delete', id, { reason: 'Confirmed deletion of unreferenced location' });
  }

  /**
   * Export CSV helper
   */
  static exportLocationsCSV(): string {
    const records = this.cache || [];
    const quote = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const headers = ['ID','Type','Name','Code','Parent ID','Province ID','District ID','City ID','Postal Code','Sinhala Name','Tamil Name','Latitude','Longitude','Status','Sort Order'];
    const rows = records.map(r => [
      r.id,
      r.type,
      quote(r.name),
      r.code || '',
      r.parent_id || '',
      r.province_id || '',
      r.district_id || '',
      r.city_id || '', r.postal_code || '', quote(r.name_si), quote(r.name_ta), r.latitude ?? '', r.longitude ?? '', r.status, r.sort_order
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

/**
 * Global normalized location matcher across all marketplace feeds
 */
export function matchesLocation(
  itemLocationStr: string | null | undefined,
  selectedLoc: string | LocationValueModel | null | undefined
): boolean {
  if (!selectedLoc) return true;

  const selDisplay = typeof selectedLoc === 'string' ? selectedLoc : selectedLoc.displayName;
  if (!selDisplay || selDisplay === 'All Sri Lanka' || selDisplay === 'Islandwide' || selDisplay.trim() === '') {
    return true;
  }

  if (!itemLocationStr || itemLocationStr.trim() === '') {
    return false;
  }

  const itemLower = itemLocationStr.toLowerCase().trim();
  const selLower = selDisplay.toLowerCase().trim();

  // Direct substring matches
  if (itemLower.includes(selLower) || selLower.includes(itemLower)) {
    return true;
  }

  // Handle object properties if available
  if (typeof selectedLoc === 'object') {
    const targets = [
      selectedLoc.areaName,
      selectedLoc.cityName,
      selectedLoc.districtName,
      selectedLoc.provinceName
    ].filter(Boolean).map(s => s!.toLowerCase().trim());

    for (const target of targets) {
      if (itemLower.includes(target) || target.includes(itemLower)) {
        return true;
      }
    }
  }

  // Clean alpha-numeric string comparison
  const itemClean = itemLower.replace(/[^a-z0-9]/g, '');
  const selClean = selLower.replace(/[^a-z0-9]/g, '');
  if (itemClean.includes(selClean) || selClean.includes(itemClean)) {
    return true;
  }

  // Tokenized word matching (e.g. "Kandy" in "Kandy, Central Province" or "Central" in "Central Province")
  const stopWords = new Set(['province', 'district', 'city', 'town', 'sri', 'lanka', 'islandwide']);
  const selTokens = selLower
    .split(/[\s,]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 3 && !stopWords.has(t));

  const itemTokens = itemLower
    .split(/[\s,]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 3 && !stopWords.has(t));

  if (selTokens.length > 0 && selTokens.some(st => itemTokens.some(it => it.includes(st) || st.includes(it)))) {
    return true;
  }

  return false;
}
