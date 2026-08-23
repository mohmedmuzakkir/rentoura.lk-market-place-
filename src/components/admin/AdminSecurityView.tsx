import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { StaffAccount } from '../../types/adminTypes';
import { AdminService } from '../../services/adminService';

interface AdminSecurityViewProps {
  staff: StaffAccount;
}

export const AdminSecurityView: React.FC<AdminSecurityViewProps> = ({ staff }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);
    try {
      const result = await AdminService.changeOwnPassword(currentPassword, newPassword);

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Your password has been changed successfully in Supabase Auth.'
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#1464F4]" />
          <span>Account Security & Staff Password</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1 font-medium">
          Manage your official administrative password, active credentials, and system security controls.
        </p>
      </div>

      {/* Staff Account Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={staff.avatarUrl}
            alt={staff.fullName}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#1464F4]"
          />
          <div>
            <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span>{staff.fullName}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1464F4] text-[10px] font-black uppercase">
                {staff.role.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">{staff.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>Active & Authenticated</span>
        </div>
      </div>

      {/* Change Password Form Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 mb-1 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#1464F4]" />
          <span>Change Administrative Password</span>
        </h3>
        <p className="text-slate-500 text-xs mb-5 font-medium">
          Updating your password will immediately change your Supabase Auth credentials.
        </p>

        {message && (
          <div className={`p-4 mb-5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-lg text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 10 chars with A-Z, a-z, 0-9 & special char"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
            />
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-600 space-y-1 font-medium">
            <div className="font-bold text-slate-800">Password Requirements:</div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
              <li>Minimum 10 characters long</li>
              <li>Must contain uppercase (A-Z) and lowercase (a-z) letters</li>
              <li>Must contain at least one number (0-9) and one special character</li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#1464F4] hover:bg-[#1052cd] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#1464F4]/20 flex items-center gap-2 transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
