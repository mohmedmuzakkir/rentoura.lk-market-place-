import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  User, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import { AuditLogItem, StaffAccount } from '../../types/adminTypes';
import { AdminModerationService, StaffModerationMetric } from '../../services/adminModerationService';

interface AdminAuditLogsViewProps {
  staff: StaffAccount;
}

export const AdminAuditLogsView: React.FC<AdminAuditLogsViewProps> = ({ staff }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [metrics, setMetrics] = useState<StaffModerationMetric[]>([]);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (staff.role !== 'SUPER_ADMIN') return;
    const from = new Date(); from.setDate(from.getDate() - 6); from.setHours(0, 0, 0, 0);
    void Promise.all([AdminModerationService.getModerationAudit({ from: from.toISOString() }), AdminModerationService.getStaffModerationAnalytics({ from: from.toISOString() })])
      .then(([events, daily]) => {
        setMetrics(daily);
        setLogs(events.map(event => ({ id:event.id, actorId:event.actorId || '', actorName:event.actorName, actorRole:event.actorRole.toUpperCase() as AuditLogItem['actorRole'], action:event.action, targetType:'listing', targetId:event.listingId, targetTitle:event.listingTitle, details:event.reason || '', timestamp:new Date(event.createdAt).getTime(), createdAt:event.createdAt })));
      }).catch(error => setLoadError(error instanceof Error ? error.message : 'Failed to load moderation oversight.'));
  }, [staff.role]);

  const staffTotals = Object.values(metrics.reduce<Record<string, StaffModerationMetric>>((result, item) => {
    const current = result[item.actorId] || { ...item, reviewed:0, approved:0, rejected:0, changesRequested:0 };
    current.reviewed += item.reviewed; current.approved += item.approved; current.rejected += item.rejected; current.changesRequested += item.changesRequested;
    result[item.actorId] = current; return result;
  }, {})) as StaffModerationMetric[];

  if (staff.role !== 'SUPER_ADMIN') return <div className="rounded-2xl border bg-white p-8 text-sm text-slate-600">Super Admin authorization is required for staff moderation oversight.</div>;

  const filteredLogs = logs.filter(log => {
    const matchesQuery = !searchQuery.trim() || 
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetTitle && log.targetTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTarget = targetTypeFilter === 'all' || log.targetType === targetTypeFilter;

    return matchesQuery && matchesTarget;
  });

  return (
    <div className="space-y-6">
      {loadError && <div role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{loadError}</div>}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{staffTotals.map(item => <div key={item.actorId} className="rounded-2xl border bg-white p-4"><div className="font-bold">{item.actorName}</div><div className="mt-2 grid grid-cols-2 gap-2 text-xs"><span>Reviewed: {item.reviewed}</span><span>Approved: {item.approved}</span><span>Rejected: {item.rejected}</span><span>Changes: {item.changesRequested}</span></div></div>)}</div>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#1464F4]" />
            <span>Staff Operational Audit Logs</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Immutable system logs recording all moderation actions, approvals, rejections, user suspensions, and settings updates.
          </p>
        </div>

        <div className="bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200">
          Total Recorded Actions: {logs.length}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, action, details..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-500">Target Entity:</span>
          <select
            value={targetTypeFilter}
            onChange={(e) => setTargetTypeFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
          >
            <option value="all">All Entity Types</option>
            <option value="listing">Listings</option>
            <option value="user">Users & Staff</option>
            <option value="report">Reports</option>
            <option value="announcement">Announcements</option>
            <option value="review">Reviews</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Staff Actor</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Target Title / ID</th>
                <th className="py-3.5 px-4">Activity Log Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No audit activity matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {log.createdAt}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{log.actorName}</div>
                      <span className="text-[9px] font-black uppercase text-[#1464F4] bg-blue-50 px-1.5 py-0.5 rounded">
                        {log.actorRole.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-xl font-bold text-[10px] tracking-wider uppercase inline-block ${
                        log.action.includes('APPROVED') || log.action.includes('CREATED') ? 'bg-emerald-100 text-emerald-800' :
                        log.action.includes('REJECTED') || log.action.includes('SUSPENDED') || log.action.includes('DELETED') ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-[#1464F4]'
                      }`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-900 font-bold max-w-xs truncate">
                      {log.targetTitle || log.targetId}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-md">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
