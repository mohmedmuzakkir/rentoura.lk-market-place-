export type PostModule = 'rentals' | 'jobs' | 'services';

export type ListingStatus = 'draft' | 'pending' | 'active' | 'rejected' | 'expired' | 'paused';

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'select'
  | 'multi-select'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'date'
  | 'time'
  | 'date-range'
  | 'phone'
  | 'email'
  | 'location'
  | 'image-upload'
  | 'tags';

export interface FieldOption {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
  description?: string;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  errorMessage?: string;
  customValidator?: (value: any, formValues: Record<string, any>) => string | null;
}

export interface FieldDependency {
  fieldId: string;
  value?: any;
  condition?: 'equals' | 'not_equals' | 'includes' | 'truthy' | 'greater_than';
}

export interface FieldSchema {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  options?: FieldOption[];
  validation?: FieldValidation;
  defaultValue?: any;
  prefix?: string;
  suffix?: string;
  displayOrder?: number;
  gridCols?: 1 | 2;
  dependsOn?: FieldDependency;
  applicableCategories?: string[]; // category IDs where this field applies
}

export interface CategoryFormSchema {
  module: 'rentals' | 'jobs' | 'services';
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  title: string;
  description?: string;
  fields: FieldSchema[];
  steps?: {
    stepNumber: number;
    stepTitle: string;
    stepDescription?: string;
    fieldIds: string[];
  }[];
}

export interface UploadedImage {
  id: string;
  url: string;
  name?: string;
  size?: number;
  isCover?: boolean;
}

export interface LocationDataState {
  provinceId?: string;
  provinceName?: string;
  districtId?: string;
  districtName?: string;
  cityId?: string;
  cityName?: string;
  areaId?: string;
  areaName?: string;
  address?: string;
  hideExactAddress?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface RentalPricingState {
  rate: number;
  ratePeriod: 'day' | 'month' | 'week' | 'hour' | 'event';
  hasSecondaryRate?: boolean;
  secondaryRate?: number;
  secondaryPeriod?: 'day' | 'month' | 'week' | 'hour';
  depositRequired: boolean;
  depositAmount?: number;
  depositTerms?: string;
  minRentalDuration: string;
  bookingType: 'instant' | 'inquire';
  availableImmediately: boolean;
  availableFromDate?: string;
  offerLongTermDiscount?: boolean;
  discountWeek?: number; // e.g. 10%
  discountMonth?: number; // e.g. 20%
}

export interface RentalRulesState {
  requiredDocuments: string[]; // e.g. ['nic', 'driving_license', 'billing_proof', 'passport']
  smokingAllowed: boolean;
  petsAllowed: boolean;
  commercialUsageAllowed: boolean;
  handoverMode: 'pickup' | 'delivery' | 'both';
  deliveryFee?: number;
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  customRules?: string;
}

export interface ListingDraft {
  id: string;
  ownerId: string;
  module: 'rentals' | 'jobs' | 'services';
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  thirdLevelId?: string;
  thirdLevelName?: string;
  categoryPath: string;
  currentStep: number;
  condition?: string; // e.g. 'brand-new', 'like-new', 'good', 'heavy-duty'
  pricing?: RentalPricingState;
  rules?: RentalRulesState;
  formValues: Record<string, any>;
  location: LocationDataState;
  images: UploadedImage[];
  contactPreferences: {
    contactName?: string;
    showPhone: boolean;
    phone: string;
    showWhatsApp: boolean;
    whatsappNumber: string;
    allowDirectChat: boolean;
  };
  lastSavedAt: number;
}

/**
 * Validates and normalizes Sri Lankan phone numbers
 * Formats supported: 07XXXXXXXX, +947XXXXXXXX, 07X XXX XXXX
 */
export function validateSriLankanPhone(input: string): { isValid: boolean; normalized: string; formatted: string; error?: string } {
  if (!input) {
    return { isValid: false, normalized: '', formatted: '', error: 'Phone number is required' };
  }
  
  // Clean all non-digit and non-plus characters
  const cleaned = input.replace(/[^\d+]/g, '');
  
  // Match standard formats: +94 7X XXX XXXX or 07X XXX XXXX
  let digits = cleaned;
  if (digits.startsWith('+94')) {
    digits = '0' + digits.substring(3);
  } else if (digits.startsWith('94') && digits.length === 11) {
    digits = '0' + digits.substring(2);
  }

  // Check if valid 10 digits starting with 07
  const validRegex = /^07[01245678]\d{7}$/;
  if (!validRegex.test(digits)) {
    return {
      isValid: false,
      normalized: input,
      formatted: input,
      error: 'Please enter a valid Sri Lankan mobile number (e.g. 077 123 4567)'
    };
  }

  const normalized = `+94${digits.substring(1)}`;
  const formatted = `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;

  return {
    isValid: true,
    normalized,
    formatted
  };
}

/**
 * Price & Numeric Normalizer
 */
export function normalizeNumericPrice(value: string | number): { amount: number; formatted: string } {
  if (typeof value === 'number') {
    return {
      amount: Math.max(0, value),
      formatted: `Rs. ${Math.max(0, value).toLocaleString('en-US')}`
    };
  }

  if (!value) {
    return { amount: 0, formatted: 'Rs. 0' };
  }

  // Remove currency words, Rs, commas, spaces
  const cleaned = value.toString().replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  const amount = isNaN(parsed) ? 0 : Math.max(0, Math.round(parsed));

  return {
    amount,
    formatted: `Rs. ${amount.toLocaleString('en-US')}`
  };
}
