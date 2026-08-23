import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar, 
  Edit3, 
  Camera 
} from 'lucide-react';
import { UserProfile } from '../../types/profileTypes';
import { isSuperAdmin, isAdmin, isModerator } from '../../utils/roleUtils';

interface ProfileHeroProps {
  profile: UserProfile;
  onEditProfile: () => void;
  onAvatarClick?: () => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  onEditProfile,
  onAvatarClick
}) => {
  const getInitials = (name: string) => {
    if (!name) return 'LK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-[#041C43] text-white p-5 sm:p-6 rounded-b-[28px] shadow-lg relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#1464F4]/20 via-[#00D2FF]/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#1464F4]/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          
          {/* Avatar Section */}
          <div className="flex items-center sm:block">
            <div className="relative group cursor-pointer" onClick={onAvatarClick || onEditProfile}>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white/20 shadow-xl overflow-hidden bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-105">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback to initials if broken image
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
                    {getInitials(profile.fullName)}
                  </span>
                )}
              </div>

              {/* Camera / Edit Badge */}
              <div 
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1464F4] text-white flex items-center justify-center ring-2 ring-[#041C43] shadow-md hover:bg-blue-600 active:scale-95 transition-all"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </div>
            </div>

            {/* Mobile View: Name & Edit Button right beside Avatar */}
            <div className="ml-4 sm:hidden flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-black text-white font-heading truncate">
                  {profile.fullName}
                </h2>
                {profile.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-[#00D2FF] shrink-0" />
                )}
                {isSuperAdmin(profile) && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[9px] font-extrabold uppercase tracking-wide">Super Admin</span>
                )}
                {!isSuperAdmin(profile) && isAdmin(profile) && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[9px] font-extrabold uppercase tracking-wide">Admin</span>
                )}
                {!isSuperAdmin(profile) && !isAdmin(profile) && isModerator(profile) && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[9px] font-extrabold uppercase tracking-wide">Moderator</span>
                )}
              </div>
              {profile.displayName && profile.displayName !== profile.fullName && (
                <p className="text-xs text-blue-200 font-medium truncate">
                  @{profile.displayName}
                </p>
              )}
              {profile.isVerified && (
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Account
                </div>
              )}
            </div>
          </div>

          {/* User Details & Meta Section */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Desktop / Tablet Header */}
            <div className="hidden sm:flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-black text-white font-heading">
                    {profile.fullName}
                  </h1>
                  {profile.isVerified && (
                    <ShieldCheck className="w-5 h-5 text-[#00D2FF]" />
                  )}
                  {isSuperAdmin(profile) && (
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[10px] font-extrabold uppercase tracking-wide">Super Admin</span>
                  )}
                  {!isSuperAdmin(profile) && isAdmin(profile) && (
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[10px] font-extrabold uppercase tracking-wide">Admin</span>
                  )}
                  {!isSuperAdmin(profile) && !isAdmin(profile) && isModerator(profile) && (
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-extrabold uppercase tracking-wide">Moderator</span>
                  )}
                </div>
                {profile.displayName && profile.displayName !== profile.fullName && (
                  <p className="text-xs text-blue-200 font-medium mt-0.5">
                    @{profile.displayName}
                  </p>
                )}
                {profile.isVerified && (
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Account
                  </div>
                )}
              </div>

              {/* Edit Profile Button Desktop */}
              <button
                onClick={onEditProfile}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold border border-white/20 transition-all shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>

            {/* Profile Contact Items (real fields only) */}
            {(profile.email || profile.phone) && (
              <div className="mt-3 sm:mt-3.5 grid grid-cols-1 gap-1.5 text-xs text-slate-200">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                    <span className="truncate font-mono text-[11px] text-slate-300">{profile.email}</span>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            )}

            {/* Bio (if explicitly provided by user) */}
            {profile.bio && (
              <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/10">
                {profile.bio}
              </p>
            )}

            {/* Meta Row: Member Since (derived from created_at) */}
            {profile.memberSince && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-blue-300" />
                  <span>Member Since <strong className="text-white font-semibold">{profile.memberSince}</strong></span>
                </div>
              </div>
            )}

            {/* Mobile Edit Profile Button */}
            <div className="mt-3.5 sm:hidden">
              <button
                onClick={onEditProfile}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-98 text-white text-xs font-bold border border-white/20 transition-all shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
