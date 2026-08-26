import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Camera, 
  User, 
  Mail, 
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
  Sparkles,
  MapPin,
  Loader2
} from 'lucide-react';
import { AppRoute } from '../types';
import { UserProfile } from '../types/profileTypes';
import { LocationService, CanonicalLocation } from '../services/locationService';
import { AuthService, normalizeSriLankanPhone } from '../services/authService';
import { supabase } from '../lib/supabase';

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
  const [displayName, setDisplayName] = useState(profile.displayName || profile.fullName || '');
  const [email] = useState(profile.email || ''); // Email is read-only / auth-controlled
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  
  // Location States (UUID based)
  const [dbProvinces, setDbProvinces] = useState<CanonicalLocation[]>([]);
  const [dbDistricts, setDbDistricts] = useState<CanonicalLocation[]>([]);
  const [dbCities, setDbCities] = useState<CanonicalLocation[]>([]);
  const [dbAreas, setDbAreas] = useState<CanonicalLocation[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');

  // Preferences & Toggles
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Sinhala' | 'Tamil' | string>(
    profile.preferredLanguage || 'English'
  );
  const [emailNotifications, setEmailNotifications] = useState(profile.emailNotifications ?? true);
  const [pushNotifications, setPushNotifications] = useState(profile.pushNotifications ?? true);

  // UI / Validation / Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; photo?: string }>({});
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Password modal state
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Provinces & Resolve Initial Location Hierarchy
  useEffect(() => {
    let isMounted = true;
    async function initLocations() {
      const provs = await LocationService.getProvinces();
      if (!isMounted) return;
      setDbProvinces(provs);

      // Resolve initial Province UUID
      let matchProv = provs.find(p => p.id === profile.province || p.name.toLowerCase() === (profile.province || '').toLowerCase());
      if (!matchProv && provs.length > 0) matchProv = provs[0];

      if (matchProv) {
        setSelectedProvinceId(matchProv.id);
        const dists = await LocationService.getDistricts(matchProv.id);
        if (!isMounted) return;
        setDbDistricts(dists);

        // Resolve initial District UUID
        let matchDist = dists.find(d => d.id === profile.district || d.name.toLowerCase() === (profile.district || '').toLowerCase());
        if (!matchDist && dists.length > 0) matchDist = dists[0];

        if (matchDist) {
          setSelectedDistrictId(matchDist.id);
          const cities = await LocationService.getCities(matchDist.id);
          if (!isMounted) return;
          setDbCities(cities);

          // Resolve initial City UUID
          let matchCity = cities.find(c => c.id === profile.city || c.name.toLowerCase() === (profile.city || '').toLowerCase());
          if (!matchCity && cities.length > 0) matchCity = cities[0];

          if (matchCity) {
            setSelectedCityId(matchCity.id);
            const areas = await LocationService.getAreas(matchCity.id);
            if (!isMounted) return;
            setDbAreas(areas);

            let matchArea = areas.find(a => a.id === profile.area || a.name.toLowerCase() === (profile.area || '').toLowerCase());
            if (matchArea) {
              setSelectedAreaId(matchArea.id);
            }
          }
        }
      }
    }
    initLocations();
    return () => { isMounted = false; };
  }, []);

  // Handle Province Change
  const handleProvinceChange = async (newProvId: string) => {
    setSelectedProvinceId(newProvId);
    setSelectedDistrictId('');
    setSelectedCityId('');
    setSelectedAreaId('');
    setDbDistricts([]);
    setDbCities([]);
    setDbAreas([]);

    if (newProvId) {
      const dists = await LocationService.getDistricts(newProvId);
      setDbDistricts(dists);
      if (dists.length > 0) {
        handleDistrictChange(dists[0].id);
      }
    }
  };

  // Handle District Change
  const handleDistrictChange = async (newDistId: string) => {
    setSelectedDistrictId(newDistId);
    setSelectedCityId('');
    setSelectedAreaId('');
    setDbCities([]);
    setDbAreas([]);

    if (newDistId) {
      const cities = await LocationService.getCities(newDistId);
      setDbCities(cities);
      if (cities.length > 0) {
        handleCityChange(cities[0].id);
      }
    }
  };

  // Handle City Change
  const handleCityChange = async (newCityId: string) => {
    setSelectedCityId(newCityId);
    setSelectedAreaId('');
    setDbAreas([]);

    if (newCityId) {
      const areas = await LocationService.getAreas(newCityId);
      setDbAreas(areas);
      if (areas.length > 0) {
        setSelectedAreaId(areas[0].id);
      }
    }
  };

  // Detect Unsaved Changes
  const hasChanges = useMemo(() => {
    return (
      fullName !== profile.fullName ||
      displayName !== profile.displayName ||
      phone !== profile.phone ||
      bio !== profile.bio ||
      avatarUrl !== profile.avatarUrl ||
      selectedProvinceId !== profile.province ||
      selectedDistrictId !== profile.district ||
      selectedCityId !== profile.city ||
      selectedAreaId !== (profile.area || '') ||
      preferredLanguage !== profile.preferredLanguage ||
      emailNotifications !== profile.emailNotifications ||
      pushNotifications !== profile.pushNotifications
    );
  }, [
    fullName, displayName, phone, bio, avatarUrl,
    selectedProvinceId, selectedDistrictId, selectedCityId, selectedAreaId,
    preferredLanguage, emailNotifications, pushNotifications, profile
  ]);

  // Durable Photo Upload Handler via Supabase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrors(prev => ({ ...prev, photo: 'Only JPG, PNG or WEBP images are supported.' }));
      return;
    }

    // Check size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Photo must be smaller than 5MB.' }));
      return;
    }

    setErrors(prev => ({ ...prev, photo: undefined }));
    setIsUploadingPhoto(true);

    try {
      const uploadedUrl = await AuthService.uploadAvatar(profile.id, file);
      setAvatarUrl(uploadedUrl);
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        photo: err?.message || 'Failed to upload photo to storage. Please try again.'
      }));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Form Validation & Save
  const handleSave = async () => {
    const newErrors: { fullName?: string; phone?: string } = {};
    setSaveErrorMessage(null);

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    let normalizedPhone = phone.trim();
    if (normalizedPhone) {
      const phoneVal = normalizeSriLankanPhone(normalizedPhone);
      if (!phoneVal.isValid) {
        newErrors.phone = phoneVal.error;
      } else {
        normalizedPhone = phoneVal.normalized;
      }
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
      phone: normalizedPhone,
      bio: bio.trim(),
      avatarUrl,
      province: selectedProvinceId,
      district: selectedDistrictId,
      city: selectedCityId,
      area: selectedAreaId,
      preferredLanguage,
      emailNotifications,
      pushNotifications,
      twoFactorEnabled: false
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

  // Handle Real Password Change via Supabase Auth
  const handleSavePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);

      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 1500);
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password.');
    } finally {
      setIsChangingPassword(false);
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

      {/* 2. Hero Banner */}
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

          {/* Hero Avatar Badge */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-white/30 bg-blue-900 flex items-center justify-center overflow-hidden shadow-xl">
              {isUploadingPhoto ? (
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              ) : avatarUrl ? (
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
              disabled={isUploadingPhoto}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#1464F4] hover:bg-blue-600 text-white ring-2 ring-white shadow-md transition-all active:scale-95 disabled:opacity-50"
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
                Upload a photo to Supabase storage to build trust with users.
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
                disabled={isUploadingPhoto}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1464F4] text-xs font-bold transition-all tap-bounce flex items-center gap-1.5 border border-blue-200 disabled:opacity-60"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
                <span>{isUploadingPhoto ? 'Uploading...' : 'Change Photo'}</span>
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
            <span>JPG, PNG or WEBP. Max 5MB. Uploaded to avatars storage.</span>
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

        {/* 5. Location Information Section (UUID Based) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-[#1464F4]" />
            <h3 className="text-xs font-extrabold text-slate-900 font-heading uppercase tracking-wider">
              Location Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Province Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Province
              </label>
              <div className="relative">
                <select
                  value={selectedProvinceId}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all appearance-none"
                >
                  <option value="">Select Province</option>
                  {dbProvinces.map((prov) => (
                    <option key={prov.id} value={prov.id}>
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
                  value={selectedDistrictId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all appearance-none"
                >
                  <option value="">Select District</option>
                  {dbDistricts.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* City Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                City / Town
              </label>
              <div className="relative">
                <select
                  value={selectedCityId}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all appearance-none"
                >
                  <option value="">Select City / Town</option>
                  {dbCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Area / Suburb Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Area / Suburb (Optional)
              </label>
              <div className="relative">
                <select
                  value={selectedAreaId}
                  onChange={(e) => setSelectedAreaId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#1464F4] focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all appearance-none"
                >
                  <option value="">Select Area / Suburb</option>
                  {dbAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
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
                  onChange={(e) => setPreferredLanguage(e.target.value)}
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
              onClick={() => {
                setPasswordError(null);
                setPasswordSuccess(false);
                setNewPassword('');
                setConfirmNewPassword('');
                setShowPasswordModal(true);
              }}
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
                  <p className="text-[10px] text-slate-400">Update account password</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Two-Factor Authentication (Coming Soon) */}
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
                  <h4 className="text-xs font-bold text-slate-800 font-heading">
                    Two-Factor Auth
                  </h4>
                  <p className="text-[10px] text-slate-400">Enhance account security</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Coming Soon
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

        {/* 8. Action Buttons (Cancel / Save Changes) */}
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
            disabled={isSaving || isUploadingPhoto}
            className="py-3 px-4 rounded-2xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all tap-bounce flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
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

      {/* Change Password Modal (Supabase Auth updateUser) */}
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

            {passwordError && (
              <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <button
                onClick={handleSavePassword}
                disabled={isChangingPassword}
                className="w-full py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold shadow-sm hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isChangingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>{isChangingPassword ? 'Updating Password...' : 'Save New Password'}</span>
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
              Enhance account security by requiring an SMS or Authenticator app (TOTP) verification code whenever you log in from a new device.
            </p>
            
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-amber-900 text-xs leading-relaxed mb-4">
              <strong className="font-bold block mb-0.5">Feature Coming Soon</strong>
              Two-factor authentication with SMS verification and TOTP security keys will be enabled in an upcoming security release.
            </div>

            <button
              onClick={() => setShow2FAModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
