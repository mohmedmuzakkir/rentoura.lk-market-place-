import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone, 
  CheckCircle2, 
  X, 
  Lock, 
  User,
  KeyRound,
  AlertCircle,
  Loader2,
  UserX,
  RefreshCw,
  MoreVertical,
  ShieldAlert
} from 'lucide-react';
import { StaffAccount, StaffRole } from '../../types/adminTypes';
import { AdminService } from '../../services/adminService';

interface AdminStaffViewProps {
  currentStaff: StaffAccount;
  onRefresh: () => void;
}

export const AdminStaffView: React.FC<AdminStaffViewProps> = ({ currentStaff, onRefresh }) => {
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Role Modal State
  const [targetStaff, setTargetStaff] = useState<StaffAccount | null>(null);
  const [selectedRole, setSelectedRole] = useState<StaffRole>('MODERATOR');
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Confirmation Modals
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  // Add Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<StaffRole>('MODERATOR');
  const [newPhone, setNewPhone] = useState('');
  const [formError, setFormError] = useState('');

  const loadStaffData = async () => {
    setLoading(true);
    try {
      const realStaff = await AdminService.getStaffAccountsAsync();
      setStaffList(realStaff);
    } catch (e) {
      console.error('Error loading staff list:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffData();
  }, []);

  const handleCreateStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newFullName.trim() || !newEmail.trim()) {
      setFormError('Full Name and Email are required.');
      return;
    }

    setSubmittingAdd(true);
    try {
      const result = await AdminService.addStaffAccountAsync(
        {
          fullName: newFullName.trim(),
          email: newEmail.trim().toLowerCase(),
          role: newRole,
          phone: newPhone.trim() || undefined
        },
        currentStaff
      );

      if (result.success) {
        setActionMessage({
          type: 'success',
          text: `Staff account provisioned! A password setup email has been sent to ${newEmail.trim()}.`
        });
        setShowAddModal(false);
        setNewFullName('');
        setNewEmail('');
        setNewPhone('');
        await loadStaffData();
      } else {
        setFormError(result.error || 'Failed to create staff account.');
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while creating staff account.');
    } finally {
      setSubmittingAdd(false);
    }
  };

  const handleUpdateRoleSubmit = async () => {
    if (!targetStaff) return;
    setSubmittingAction(true);
    setActionMessage(null);

    try {
      const result = await AdminService.updateStaffRoleAsync(targetStaff.id, selectedRole, currentStaff);
      if (result.success) {
        setActionMessage({
          type: 'success',
          text: `Role for ${targetStaff.fullName} updated to ${selectedRole}.`
        });
        setShowRoleModal(false);
        setTargetStaff(null);
        await loadStaffData();
      } else {
        setActionMessage({ type: 'error', text: result.error || 'Failed to update role.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error updating role.' });
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleToggleSuspendSubmit = async () => {
    if (!targetStaff) return;
    setSubmittingAction(true);
    setActionMessage(null);

    const nextStatus = targetStaff.status === 'Active' ? 'Suspended' : 'Active';

    try {
      const result = await AdminService.updateStaffStatusAsync(targetStaff.id, nextStatus, currentStaff);
      if (result.success) {
        setActionMessage({
          type: 'success',
          text: `Staff account status for ${targetStaff.fullName} updated to ${nextStatus}.`
        });
        setShowSuspendModal(false);
        setTargetStaff(null);
        await loadStaffData();
      } else {
        setActionMessage({ type: 'error', text: result.error || 'Failed to update staff status.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error updating staff status.' });
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleSendResetPasswordSubmit = async () => {
    if (!targetStaff) return;
    setSubmittingAction(true);
    setActionMessage(null);

    try {
      const result = await AdminService.sendStaffPasswordReset(targetStaff.email, currentStaff);
      if (result.success) {
        setActionMessage({
          type: 'success',
          text: `Password reset email sent to ${targetStaff.email}.`
        });
        setShowResetPasswordModal(false);
        setTargetStaff(null);
      } else {
        setActionMessage({ type: 'error', text: result.error || 'Failed to send password reset email.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error sending password reset.' });
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRemoveStaffSubmit = async () => {
    if (!targetStaff) return;
    setSubmittingAction(true);
    setActionMessage(null);

    try {
      const result = await AdminService.updateStaffRoleAsync(targetStaff.id, 'MODERATOR', currentStaff);
      const statusRes = await AdminService.updateStaffStatusAsync(targetStaff.id, 'Disabled', currentStaff);

      if (result.success && statusRes.success) {
        setActionMessage({
          type: 'success',
          text: `Staff administrative access removed for ${targetStaff.fullName}.`
        });
        setShowRemoveModal(false);
        setTargetStaff(null);
        await loadStaffData();
      } else {
        setActionMessage({ type: 'error', text: result.error || statusRes.error || 'Failed to remove staff access.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error removing staff access.' });
    } finally {
      setSubmittingAction(false);
    }
  };

  const totalStaffCount = staffList.length;
  const superAdminCount = staffList.filter(s => s.role === 'SUPER_ADMIN').length;
  const adminCount = staffList.filter(s => s.role === 'ADMIN').length;
  const modCount = staffList.filter(s => s.role === 'MODERATOR').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#1464F4]" />
            <span>Staff & Administrative Account Management</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Manage administrative personnel, role permissions (Super Admin, Admin, Moderator), and secure access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadStaffData}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Refresh Staff List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {currentStaff.role === 'SUPER_ADMIN' && (
            <button
              type="button"
              onClick={() => {
                setFormError('');
                setShowAddModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-[#1052cd] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#1464F4]/20 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Toast / Alert */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
          actionMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{actionMessage.text}</span>
          </div>
          <button type="button" onClick={() => setActionMessage(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Total Staff</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalStaffCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-purple-600 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Super Admins
          </div>
          <div className="text-2xl font-black text-purple-900 mt-1">{superAdminCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-[#1464F4] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Admins
          </div>
          <div className="text-2xl font-black text-[#1464F4] mt-1">{adminCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-cyan-600 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Moderators
          </div>
          <div className="text-2xl font-black text-cyan-900 mt-1">{modCount}</div>
        </div>
      </div>

      {/* Staff List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Active Staff Personnel</h3>
          <span className="text-xs text-slate-500 font-medium">Source of truth: Supabase Profiles</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#1464F4]" />
            <span>Loading staff accounts from database...</span>
          </div>
        ) : staffList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            No staff records found in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Created At</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {staffList.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.fullName}
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#1464F4]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1464F4] to-cyan-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-[#1464F4]">
                            {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'S'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{member.fullName}</span>
                            {member.id === currentStaff.id && (
                              <span className="text-[9px] bg-blue-100 text-[#1464F4] px-1.5 py-0.5 rounded font-black">YOU</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{member.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-xl font-black text-[10px] tracking-wider uppercase ${
                        member.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        member.role === 'ADMIN' ? 'bg-blue-100 text-[#1464F4] border border-blue-200' :
                        'bg-cyan-100 text-cyan-800 border border-cyan-200'
                      }`}>
                        {member.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        member.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {member.phone || 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Change Role Button (Super Admin only) */}
                        {currentStaff.role === 'SUPER_ADMIN' && (
                          <button
                            type="button"
                            onClick={() => {
                              setTargetStaff(member);
                              setSelectedRole(member.role);
                              setShowRoleModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                            title="Change Role"
                          >
                            <Shield className="w-3.5 h-3.5 text-[#1464F4]" />
                            <span>Role</span>
                          </button>
                        )}

                        {/* Reset Password Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setTargetStaff(member);
                            setShowResetPasswordModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                          title="Send Password Reset Email"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                          <span>Reset</span>
                        </button>

                        {/* Suspend / Activate Button */}
                        {(currentStaff.role === 'SUPER_ADMIN' || (currentStaff.role === 'ADMIN' && member.role !== 'SUPER_ADMIN')) && member.id !== currentStaff.id && (
                          <button
                            type="button"
                            onClick={() => {
                              setTargetStaff(member);
                              setShowSuspendModal(true);
                            }}
                            className={`p-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors ${
                              member.status === 'Active' 
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700' 
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                            title={member.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>{member.status === 'Active' ? 'Suspend' : 'Activate'}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#1464F4]" /> Add New Staff Member
            </h3>
            <p className="text-slate-500 text-xs mb-4">
              Provision administrative credentials. Staff member will receive a password setup email.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaffSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Priyantha Jayawardena"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="staff@rentoura.lk"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Staff Role</label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  <option value="MODERATOR">MODERATOR (Listing approvals & report handling)</option>
                  <option value="ADMIN">ADMIN MANAGER (Platform management & moderation)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  Note: Newly added staff accounts cannot be created directly as Super Admin.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={submittingAdd}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd}
                  className="px-5 py-2.5 bg-[#1464F4] hover:bg-[#1052cd] text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-70"
                >
                  {submittingAdd ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && targetStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => { setShowRoleModal(false); setTargetStaff(null); }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" /> Change Staff Role
            </h3>
            <p className="text-slate-500 text-xs mb-4">
              Update administrative permissions for <span className="font-bold text-slate-800">{targetStaff.fullName}</span> ({targetStaff.email}).
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select New Role</label>
                <select
                  value={selectedRole}
                  onChange={(e: any) => setSelectedRole(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="ADMIN">ADMIN MANAGER</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                </select>
              </div>

              {selectedRole === 'SUPER_ADMIN' && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-medium flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    Warning: Super Admins receive full unrestricted control over staff accounts and security settings.
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowRoleModal(false); setTargetStaff(null); }}
                  disabled={submittingAction}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateRoleSubmit}
                  disabled={submittingAction}
                  className="px-5 py-2.5 bg-[#1464F4] hover:bg-[#1052cd] text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-70"
                >
                  {submittingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Save Role</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {showSuspendModal && targetStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {targetStaff.status === 'Active' ? 'Suspend Staff Account?' : 'Activate Staff Account?'}
            </h3>
            <p className="text-slate-500 text-xs mb-5">
              Are you sure you want to {targetStaff.status === 'Active' ? 'suspend' : 'activate'} access for <span className="font-bold text-slate-800">{targetStaff.fullName}</span>?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setShowSuspendModal(false); setTargetStaff(null); }}
                disabled={submittingAction}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleSuspendSubmit}
                disabled={submittingAction}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                {submittingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Confirmation Modal */}
      {showResetPasswordModal && targetStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1464F4] flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Send Password Reset Email?</h3>
            <p className="text-slate-500 text-xs mb-5">
              A secure password reset link will be sent to <span className="font-bold text-slate-800">{targetStaff.email}</span> via Supabase Auth.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setShowResetPasswordModal(false); setTargetStaff(null); }}
                disabled={submittingAction}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendResetPasswordSubmit}
                disabled={submittingAction}
                className="flex-1 py-2.5 bg-[#1464F4] hover:bg-[#1052cd] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                {submittingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset</span>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
