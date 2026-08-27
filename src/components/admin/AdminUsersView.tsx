import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Ban, ChevronLeft, ChevronRight, FileText, List, Loader2, RefreshCw, Search, ShieldAlert, UserRound, Users, X } from 'lucide-react';
import { AdminAccountStatus, AdminDirectoryResult, AdminDirectoryUser, AdminService } from '../../services/adminService';
import { StaffAccount } from '../../types/adminTypes';

interface Props { staff: StaffAccount; onRefresh: () => void; onNavigateToListings?: (userId: string) => void; }
const PAGE_SIZE = 10;
const statusStyle: Record<AdminAccountStatus, string> = { active: 'bg-emerald-50 text-emerald-700', restricted: 'bg-amber-50 text-amber-800', suspended: 'bg-orange-50 text-orange-800', banned: 'bg-rose-50 text-rose-700' };
const date = (value: string) => new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium' }).format(new Date(value));
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'U';

export const AdminUsersView: React.FC<Props> = ({ staff, onRefresh }) => {
  const [result, setResult] = useState<AdminDirectoryResult | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<AdminAccountStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionUser, setActionUser] = useState<AdminDirectoryUser | null>(null);
  const [nextStatus, setNextStatus] = useState<AdminAccountStatus>('suspended');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [activityUser, setActivityUser] = useState<AdminDirectoryUser | null>(null);
  const [activity, setActivity] = useState<Awaited<ReturnType<typeof AdminService.getAdminUserActivity>> | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => { const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300); return () => clearTimeout(timer); }, [search]);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setResult(await AdminService.getAdminUsers({ search: debouncedSearch, status, page, pageSize: PAGE_SIZE })); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load the user directory.'); }
    finally { setLoading(false); }
  }, [debouncedSearch, status, page]);
  useEffect(() => { void load(); }, [load]);

  const openAction = (user: AdminDirectoryUser, value: AdminAccountStatus) => { setActionUser(user); setNextStatus(value); setReason(''); setError(null); };
  const changeStatus = async () => {
    if (!actionUser || !reason.trim()) return;
    setSaving(true); setError(null);
    try { await AdminService.changeUserStatus(actionUser.id, nextStatus, reason); setActionUser(null); await load(); onRefresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to change account status.'); }
    finally { setSaving(false); }
  };
  const openActivity = async (user: AdminDirectoryUser) => {
    setActivityUser(user); setActivity(null); setActivityLoading(true);
    try { setActivity(await AdminService.getAdminUserActivity(user.id)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load user activity.'); }
    finally { setActivityLoading(false); }
  };

  const counts = result?.statusCounts || { total: 0, active: 0, restricted: 0, suspended: 0, banned: 0 };
  const pages = Math.max(1, Math.ceil((result?.total || 0) / PAGE_SIZE));
  return <div className="space-y-5">
    <header className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4"><div><p className="text-xs font-bold text-[#1464F4]">ADMIN DIRECTORY</p><h1 className="text-2xl font-black text-[#041C43]">Users</h1><p className="text-sm text-slate-500 mt-1">Live profiles and account enforcement. Authentication secrets are never exposed.</p></div><button onClick={() => void load()} className="px-4 py-2.5 rounded-xl border font-bold text-sm self-start flex gap-2"><RefreshCw className="w-4"/>Refresh</button></header>
    <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">{(['total','active','restricted','suspended','banned'] as const).map(key => <button key={key} onClick={() => {setStatus(key === 'total' ? 'all' : key);setPage(1);}} className={`bg-white border rounded-2xl p-4 text-left ${(key === 'total' ? status === 'all' : status === key) ? 'border-[#1464F4] ring-1 ring-[#1464F4]' : 'border-slate-200'}`}><span className="text-[10px] font-bold uppercase text-slate-500">{key}</span><strong className="block text-2xl text-[#041C43]">{counts[key]}</strong></button>)}</section>
    <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-3"><label className="relative flex-1"><Search className="absolute left-3 top-3 w-4 text-slate-400"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone or exact UUID" className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm"/></label><select value={status} onChange={e => {setStatus(e.target.value as AdminAccountStatus | 'all');setPage(1);}} className="px-3 py-2.5 border rounded-xl text-sm"><option value="all">All statuses</option><option value="active">Active</option><option value="restricted">Restricted</option><option value="suspended">Suspended</option><option value="banned">Banned</option></select></div>
      {error && <div className="m-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex gap-2"><AlertCircle className="w-5 shrink-0"/>{error}</div>}
      {loading ? <div className="py-20 text-center text-slate-500"><Loader2 className="w-7 animate-spin mx-auto mb-2"/>Loading live users…</div> : !result?.users.length ? <div className="py-20 text-center text-slate-500"><Users className="w-10 mx-auto mb-2"/><p className="font-bold text-slate-700">No matching users</p><p className="text-sm">The database returned zero profiles for these filters.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-sm"><thead className="bg-slate-50 text-left text-[10px] uppercase text-slate-500"><tr><th className="p-4">User</th><th className="p-4">Role / status</th><th className="p-4">Joined</th><th className="p-4">Listings</th><th className="p-4">Reports</th><th className="p-4">Actions</th></tr></thead><tbody>{result.users.map(user => <tr key={user.id} className="border-t"><td className="p-4"><div className="flex gap-3 items-center"><div className="w-10 h-10 rounded-full bg-[#1464F4]/10 text-[#1464F4] grid place-items-center font-black">{initials(user.fullName)}</div><div><p className="font-bold text-slate-900">{user.fullName}</p><p className="text-xs text-slate-500">{user.email}</p><p className="text-xs text-slate-500">{user.phone || 'Phone not provided'}</p><p className="text-[10px] font-mono text-slate-400">{user.id}</p></div></div></td><td className="p-4"><p className="font-semibold capitalize">{user.role.replace('_',' ')}</p><span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-bold capitalize ${statusStyle[user.status]}`}>{user.status}</span></td><td className="p-4 text-slate-600">{date(user.createdAt)}</td><td className="p-4"><button onClick={() => void openActivity(user)} className="font-bold text-[#1464F4] underline-offset-2 hover:underline">{user.listingCount}</button></td><td className="p-4"><button onClick={() => void openActivity(user)} className="font-bold text-[#1464F4] underline-offset-2 hover:underline">{user.reportCount}</button></td><td className="p-4"><div className="flex flex-wrap gap-2"><button onClick={() => void openActivity(user)} className="px-3 py-2 border rounded-lg font-bold">View activity</button>{user.id !== staff.id && <><button onClick={() => openAction(user,'restricted')} className="px-3 py-2 bg-amber-50 text-amber-800 rounded-lg font-bold">Restrict</button><button onClick={() => openAction(user,user.status === 'active' ? 'suspended' : 'active')} className="px-3 py-2 bg-orange-50 text-orange-800 rounded-lg font-bold">{user.status === 'active' ? 'Suspend' : 'Restore'}</button>{staff.role !== 'MODERATOR' && <button onClick={() => openAction(user,'banned')} className="px-3 py-2 bg-rose-50 text-rose-700 rounded-lg font-bold"><Ban className="w-4 inline"/> Ban</button>}</>}</div></td></tr>)}</tbody></table></div>}
      <div className="p-4 border-t flex items-center justify-between text-sm"><span>{result ? `${result.total} matching users` : '—'}</span><div className="flex items-center gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)} className="p-2 border rounded-lg disabled:opacity-30"><ChevronLeft/></button><span>Page {page} of {pages}</span><button disabled={page >= pages || loading} onClick={() => setPage(p => p + 1)} className="p-2 border rounded-lg disabled:opacity-30"><ChevronRight/></button></div></div>
    </section>
    {actionUser && <div className="fixed inset-0 z-50 bg-[#041C43]/70 p-4 grid place-items-center"><div className="bg-white rounded-3xl p-6 max-w-lg w-full"><button onClick={() => setActionUser(null)} className="float-right"><X/></button><ShieldAlert className="w-9 text-[#1464F4]"/><h2 className="text-xl font-black mt-3 capitalize">Set account to {nextStatus}</h2><p className="text-sm text-slate-600 mt-1">{actionUser.fullName} · {actionUser.id}</p><textarea autoFocus rows={4} value={reason} onChange={e => setReason(e.target.value)} placeholder="Required reason for the audit log and user notification" className="w-full mt-4 p-3 border rounded-xl"/><div className="flex justify-end gap-2 mt-4"><button onClick={() => setActionUser(null)} className="px-4 py-2 border rounded-xl">Cancel</button><button disabled={!reason.trim() || saving} onClick={() => void changeStatus()} className="px-5 py-2 bg-[#1464F4] text-white font-bold rounded-xl disabled:opacity-40">{saving ? 'Saving…' : 'Confirm status'}</button></div></div></div>}
    {activityUser && <div className="fixed inset-0 z-50 bg-[#041C43]/70 p-3 sm:p-6 overflow-y-auto"><div className="bg-white rounded-3xl max-w-3xl mx-auto p-5 sm:p-7"><button onClick={() => setActivityUser(null)} className="float-right"><X/></button><UserRound className="w-9 text-[#1464F4]"/><h2 className="text-xl font-black mt-2">Activity for {activityUser.fullName}</h2><p className="text-xs font-mono text-slate-500">Filtered by user UUID: {activityUser.id}</p>{activityLoading ? <Loader2 className="w-7 animate-spin mx-auto my-16"/> : activity && <div className="grid md:grid-cols-2 gap-5 mt-6"><Activity title={`Listings (${activity.listings.length})`} icon={<List/>}>{activity.listings.map(item => <div key={item.id} className="p-3 border rounded-xl"><p className="font-bold">{item.title}</p><p className="text-xs capitalize text-slate-500">{item.module} · {item.status} · {date(item.createdAt)}</p><p className="text-[10px] font-mono text-slate-400 break-all">{item.id}</p></div>)}</Activity><Activity title={`Reports (${activity.reports.length})`} icon={<FileText/>}>{activity.reports.map(item => <div key={item.id} className="p-3 border rounded-xl"><p className="font-bold">{item.reason}</p><p className="text-xs text-slate-500">{item.relation} · {item.status} · {date(item.createdAt)}</p><p className="text-[10px] font-mono text-slate-400 break-all">{item.id}</p></div>)}</Activity></div>}</div></div>}
  </div>;
};

const Activity: React.FC<{title:string;icon:React.ReactNode;children:React.ReactNode}> = ({title,icon,children}) => <section><h3 className="font-black flex gap-2 [&>svg]:w-5">{icon}{title}</h3><div className="space-y-2 mt-3">{React.Children.count(children) ? children : <p className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500">No records returned.</p>}</div></section>;
