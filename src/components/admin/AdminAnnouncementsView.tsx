import React, { useEffect, useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { PlatformAnnouncement, StaffAccount } from '../../types/adminTypes';
import { AdminService } from '../../services/adminService';

interface AdminAnnouncementsViewProps {
  staff: StaffAccount;
  onRefresh: () => void;
}

export const AdminAnnouncementsView: React.FC<AdminAnnouncementsViewProps> = ({ staff, onRefresh }) => {
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>([]);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetModule, setTargetModule] = useState<'all' | 'rentals' | 'jobs' | 'services'>('all');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  const refreshAnnouncements = async () => {
    try { setAnnouncements(await AdminService.getAnnouncementsAsync()); setError(''); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Announcements are unavailable.'); }
    onRefresh();
  };

  useEffect(() => { void refreshAnnouncements(); }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    await AdminService.createAnnouncementAsync({
      title: title.trim(),
      message: message.trim(),
      targetModule,
      priority,
      createdBy: staff.fullName
    }, staff);

    setShowCreateModal(false);
    setTitle('');
    setMessage('');
    await refreshAnnouncements();
  };

  const handleToggleActive = async (id: string) => {
    await AdminService.toggleAnnouncementActiveAsync(id, staff);
    await refreshAnnouncements();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this announcement?')) {
      await AdminService.deleteAnnouncementAsync(id, staff);
      await refreshAnnouncements();
    }
  };

  return (
    <div className="space-y-6">
      {error && <div role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-500" />
            <span>Platform Broadcast Announcements</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Broadcast platform updates, scheduled maintenance alerts, or module notifications to active users.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-[#1052cd] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#1464F4]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map(anc => (
          <div key={anc.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase ${
                  anc.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-[#1464F4]'
                }`}>
                  {anc.priority} Priority
                </span>

                <span className="text-[10px] font-bold text-slate-400 capitalize">
                  Module: {anc.targetModule}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900">{anc.title}</h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">{anc.message}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400 text-[10px]">
                By {anc.createdBy}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActive(anc.id)}
                  className={`px-3 py-1 rounded-xl font-bold text-[11px] ${
                    anc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {anc.active ? 'Active' : 'Inactive'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(anc.id)}
                  className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Create Announcement</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled Maintenance"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Marketplace Module</label>
                <select
                  value={targetModule}
                  onChange={(e: any) => setTargetModule(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="all">All Marketplace Modules</option>
                  <option value="rentals">Rentals Only</option>
                  <option value="jobs">Jobs Only</option>
                  <option value="services">Services Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="urgent">Urgent Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Body</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter details broadcasted to users..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1464F4] text-white font-bold rounded-xl"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
