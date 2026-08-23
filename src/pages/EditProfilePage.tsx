import React, { useState, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Camera, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  MapPin, 
  Building, 
  Globe, 
  Coins, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle2,
  Trash2,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { AppRoute } from '../types';
import { UserProfile } from '../types/profileTypes';
import { LocationService, CanonicalLocation } from '../services/locationService';

interface EditProfilePageProps {
  profile: UserProfile;
  unreadNotificationsCount: number;
  onSaveProfile: (updatedProfile: UserProfile) => Promise<void> | void;
  onBack: () => void;
  onNavigate: (route: AppRoute) => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({
  profile,
  unreadNotificationsCount,
  onSaveProfile,
  onBack,
  onNavigate
}) => {
  // Form State initialized from current profile
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [email] = useState(profile.email || ''); // Email is read-only / auth-controlled
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  
  // Location States
  const [dbProvinces, setDbProvinces] = React.useState<CanonicalLocation[]>([]);
  const [dbDistricts, setDbDistricts] = React.useState<CanonicalLocation[]>([]);
  const [selectedProvinceName, setSelectedProvinceName] = useState(profile.province || '');
  const [selectedDistrictName, setSelectedDistrictName] = useState(profile.district || '');
  const [selectedCityName, setSelectedCityName] = useState(profile.city || '');
  const [areaVillage, setAreaVillage] = useState(profile.area || '');

  // Preferences & Toggles
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Sinhala' | 'Tamil'>(
    profile.preferredLanguage || 'English'
  );
  const [emailNotifications, setEmailNotifications] = useState(profile.emailNotifications ?? true);
  const [pushNotifications, setPushNotifications] = useState(profile.pushNotifications ?? true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(profile.twoFactorEnabled ?? false);

  // UI / Validation / Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; photo?: string }>({});
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Provinces
  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      const provs = await LocationService.getProvinces();
      if (isMounted) {
        setDbProvinces(provs);
        if (!selectedProvinceName && provs.length > 0) {
          setSelectedProvinceName(provs[0].name);
        }
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Load Districts when selected province changes
  React.useEffect(() => {
    let isMounted = true;
    async function loadDistricts() {
      if (!selectedProvinceName) return;
      const prov = dbProvinces.find(p => p.name.toLowerCase() === selectedProvinceName.toLowerCase());
      if (prov) {
        const dists = await LocationService.getDistricts(prov.id);
        if (isMounted) setDbDistricts(dists);
      }
    }
    loadDistricts();
    return () => { isMounted = false; };
  }, [selectedProvinceName, dbProvinces]);

  // Handle Province Change
  const handleProvinceChange = async (newProvinceName: string) => {
    setSelectedProvinceName(newProvinceName);
    const prov = dbProvinces.find(p => p.name === newProvinceName);
    if (prov) {
      const dists = await LocationService.getDistricts(prov.id);
      setDbDistricts(dists);
      if (dists.length > 0) {
        setSelectedDistrictName(dists[0].name);
      } else {
        setSelectedDistrictName('');
      }
    }
  };

  // Handle District Change
  const handleDistrictChange = (newDistrictName: string) => {
    setSelectedDistrictName(newDistrictName);
  };

  // Detect Unsaved Changes
  const hasChanges = useMemo(() => {
    return (
      fullName !== profile.fullName ||
      displayName !== profile.displayName ||
      phone !== profile.phone ||
      bio !== profile.bio ||
      avatarUrl !== profile.avatarUrl ||
      selectedProvinceName !== profile.province ||
      selectedDistrictName !== profile.district ||
      selectedCityName !== profile.city ||
      areaVillage !== (profile.area || '') ||
      preferredLanguage !== profile.preferredLanguage ||
      emailNotifications !== profile.emailNotifications ||
      pushNotifications !== profile.pushNotifications ||
      twoFactorEnabled !== profile.twoFactorEnabled
    );
  }, [
    fullName, displayName, phone, bio, avatarUrl,
    selectedProvinceName, selectedDistrictName, selectedCityName, areaVillage,
    preferredLanguage, emailNotifications, pushNotifications, twoFactorEnabled, profile
  ]);

  // Photo Upload Handler with File Validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: 'Only JPG, PNG or WEBP images are supported.' }));
      return;
    }

    // Check size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Photo must be smaller than 5MB.' }));
      return;
    }

    setErrors(prev => ({ ...prev, photo: undefined }));

    // Read preview using FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Form Validation & Save
  const handleSave = async () => {
    const newErrors: { fullName?: string; phone?: string } = {};
    setSaveErrorMessage(null);

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (phone.trim() && !/^(\+94|0)[0-9]{9}$/.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid Sri Lankan phone number (e.g. 070 123 4567).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    const updatedProfile: UserProfile = {
      ...profile,
      fullName: fullName.trim(),
      displayName: displayName.trim() || fullName.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      avatarUrl,
      province: selectedProvinceName,
      district: selectedDistrictName,
      city: selectedCityName,
      area: areaVillage.trim(),
      preferredLanguage,
      emailNotifications,
      pushNotifications,
      twoFactorEnabled
    };

    try {
      await onSaveProfile(updatedProfile);
      setIsSaving(false);
      setSuccessToast(true);
      setTimeout(() => {
        onBack();
      }, 800);
    } catch (err: any) {
      setIsSaving(false);
      setSaveErrorMessage(err?.message || 'Failed to save profile changes to Supabase. Please try again.');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowDiscardConfirm(true);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-32 overflow-x-hidden">
      {/* 1. Header (Sticky Top) */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-slate-100 active:scale-95 text-slate-700 transition-colors"
            aria-label="Back to profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Centered Brand */}
          <div 
            onClick={() => onNavigate('/')} 
            className="cursor-pointer flex flex-col items-center select-none"
          >
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
                R<span className="text-[#1464F4]">E</span>NTOURA<span className="text-[#1464F4]">.LK</span>
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium tracking-wide">
              Everything for Rent, All in One Place
            </p>
          </div>

          <button
            onClick={() => onNavigate('/notifications')}
            className="relative p-2 rounded-full hover:bg-slate-100 active:scale-95 text-slate-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Hero Banner matching Image 2 */}
      <div className="bg-gradient-to-r from-[#1464F4] via-[#0B357B] to-[#041C43] text-white px-5 py-6 sm:py-8 shadow-md">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Edit Profile
            </h1>
            <p className="text-xs text-blue-100 mt-1 max-w-xs leading-relaxed">
              Update your information and manage your account details.
            </p>
          </div>

          {/* Hero Avatar Badge with Camera */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-white/30 bg-blue-900 flex items-center justify-center overflow-hidden shadow-xl">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-8 h-8 text-white/80" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#1464F4] hover:bg-blue-600 text-white ring-2 ring-white shadow-md transition-all active:scale-95"
              title="Upload photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="max-w-xl mx-auto px-4 mt-5 space-y-5">
        {saveErrorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-rose-900">Failed to save profile</h4>
              <p className="mt-0.5">{saveErrorMessage}</p>
            </div>
          </div>
        )}
        
        {/* 3. Profile Photo Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 font-heading">
                Profile Photo
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload a clear photo to build trust with others.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1464F4] text-xs font-bold transition-all tap-bounce flex items-center gap-1.5 border border-blue-200"
              >
                <Camera className="w-3.5 h-3.5" />
                Change Photo
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all tap-bounce border border-rose-200"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>JPG, PNG or WEBP. Max 5MB.</span>
          </div>

          {errors.photo && (
            <p className="text-xs text-rose-600 font-medium mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.photo}
            </p>
          )}
        </div>

        {/* 4. Personal Information Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-[#1464F4]" />
            <h3 className="text-xs font-extrabold text-slate-900 font-heading uppercase tracking-wider">
              Personal Information
            </h3>
          </div>

          {/* Full Name & Display Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                  }}
                  placeholder="e.g. Mohammed Muzakkir"
                  className={`w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border ${
                    errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100'
                  } outline-none transition-all`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-red-600 font-medium mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Display Name (Public Handle)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Muza X Official"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email Address & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email Address
                </label>
                <span className="text-[10px] text-slate-400">Auth Managed</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100/70 text-slate-600 outline-none font-mono cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Email changes are managed through account security.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number (Sri Lanka)
              </label>
              <div className="flex items-center">
                <div className="flex items-center gap-1 px-2.5 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs text-slate-700 select-none">
                  <span className="text-base leading-none">🇱🇰</span>
                  <span className="font-semibold text-slate-600">+94</span>
                </div>
                <input
                  type="tel"
                  value={phone.replace(/^\+94\s*/, '')}
                  onChange={(e) => {
                    setPhone('+94 ' + e.target.value.replace(/[^0-9\s]/g, ''));
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="70 123 4567"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-r-xl border ${
                    errors.phone ? 'border-red-400' : 'border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100'
                  } outline-none transition-all font-mono`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-600 font-medium mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Bio Textarea with 200 Character Limit */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Bio / About Me
              </label>
              <span className={`text-[11px] font-mono ${bio.length > 190 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                {bio.length}/200
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other renters, buyers and service clients a little about yourself or your business..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none leading-relaxed transition-all resize-none"
            />
          </div>
        </div>

        {/* 5. Location Information Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-[#1464F4]" />
            <h3 className="text-xs font-extrabold text-slate-900 font-heading uppercase tracking-wider">
              Location Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Province Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Province
              </label>
              <div className="relative">
                <select
                  value={selectedProvinceName}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all appearance-none"
                >
                  {dbProvinces.map((prov) => (
                    <option key={prov.id} value={prov.name}>
                      {prov.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* District Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                District
              </label>
              <div className="relative">
                <select
                  value={selectedDistrictName}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all appearance-none"
                >
                  {dbDistricts.map((dist) => (
                    <option key={dist.id} value={dist.name}>
                      {dist.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* City / Town Input / Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                City / Town
              </label>
              <input
                type="text"
                value={selectedCityName}
                onChange={(e) => setSelectedCityName(e.target.value)}
                placeholder="e.g. Kandy / Colombo"
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all"
              />
            </div>
          </div>

          {/* Area / Village (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Area / Village (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={areaVillage}
                onChange={(e) => setAreaVillage(e.target.value)}
                placeholder="e.g. Pilimathalawa, Peradeniya, Aniwatta"
                className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              {areaVillage && (
                <button
                  type="button"
                  onClick={() => setAreaVillage('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 6. Preferences Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 text-[#1464F4]" />
            <h3 className="text-xs font-extrabold text-slate-900 font-heading uppercase tracking-wider">
              Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Preferred Language
              </label>
              <div className="relative">
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all appearance-none"
                >
                  <option value="English">English</option>
                  <option value="Sinhala">සිංහල (Sinhala)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Currency (Fixed LKR Rs.) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Currency
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="LKR (Rs.)"
                  readOnly
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100/70 text-slate-700 outline-none font-semibold cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Account Settings Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-[#1464F4]" />
            <h3 className="text-xs font-extrabold text-slate-900 font-heading uppercase tracking-wider">
              Account Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Change Password Button */}
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="p-3.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-between text-left transition-all tap-bounce shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-heading">
                    Change Password
                  </h4>
                  <p className="text-[10px] text-slate-400">Update your password</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Two-Factor Authentication */}
            <button
              type="button"
              onClick={() => setShow2FAModal(true)}
              className="p-3.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-between text-left transition-all tap-bounce shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#08A34F] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-800 font-heading">
                      Two-Factor Authentication
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-400">Add extra security</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {twoFactorEnabled ? 'Active' : 'Setup'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>

            {/* Email Notifications Toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-left shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-heading">
                    Email Notifications
                  </h4>
                  <p className="text-[10px] text-slate-400">Manage email alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  emailNotifications ? 'bg-[#1464F4]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Push Notifications Toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-left shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-heading">
                    Push Notifications
                  </h4>
                  <p className="text-[10px] text-slate-400">Manage push alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  pushNotifications ? 'bg-[#1464F4]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    pushNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 8. Sticky Action Buttons (Cancel / Save Changes) */}
        <div className="pt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="py-3 px-4 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all tap-bounce text-center"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="py-3 px-4 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all tap-bounce flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile details saved successfully!</span>
        </div>
      )}

      {/* Discard Changes Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Discard unsaved changes?</h3>
            <p className="text-xs text-slate-500 mt-1">
              You have unsaved changes that will be lost if you leave now.
            </p>
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Keep Editing
              </button>
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onBack();
                }}
                className="py-2 px-3 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-[#1464F4]" />
              Update Account Password
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>
              <button
                onClick={() => {
                  alert('Password updated successfully!');
                  setShowPasswordModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold shadow-sm hover:bg-blue-600"
              >
                Save New Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 relative">
            <button
              onClick={() => setShow2FAModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#08A34F]" />
              Two-Factor Authentication (2FA)
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Enhance account security by requiring an SMS verification code whenever you log in from a new device.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between mb-4">
              <span>SMS Security Code (+94...)</span>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {twoFactorEnabled ? 'Enabled' : 'Enable'}
              </button>
            </div>
            <button
              onClick={() => setShow2FAModal(false)}
              className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
