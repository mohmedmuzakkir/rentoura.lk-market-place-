import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, FileText, History, Image as ImageIcon, Loader2, MapPin, Shield, User } from 'lucide-react';
import { AdminReviewListing, AdminService, ModerationAction } from '../../services/adminService';
import { StaffAccount } from '../../types/adminTypes';

interface Props { listingId: string; staff: StaffAccount; onBackToQueue: () => void; onNavigateToListing: (id: string) => void; onOpenReports: () => void; onRefresh: () => void; }
const date = (v: string | null) => v ? new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(v)) : 'Not recorded';
const label = (v: string) => v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const value = (v: unknown) => Array.isArray(v) ? v.join(', ') : typeof v === 'object' && v ? JSON.stringify(v) : String(v ?? 'Not provided');

export const AdminListingReview: React.FC<Props> = ({ listingId, staff: _staff, onBackToQueue, onNavigateToListing, onOpenReports, onRefresh }) => {
  const [listing, setListing] = useState<AdminReviewListing | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState(0);
  const [decision, setDecision] = useState<ModerationAction | null>(null);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null); setPhoto(0);
    try { const [item, ids] = await Promise.all([AdminService.getListingForReview(listingId), AdminService.getPendingReviewIds()]); setListing(item); setQueue(ids); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load this listing.'); }
    finally { setLoading(false); }
  }, [listingId]);
  useEffect(() => { void load(); }, [load]);

  const submit = async () => {
    if (!decision || !listing) return;
    if (decision !== 'approve' && !reason.trim()) { setError('A clear, actionable reason is required.'); return; }
    setProcessing(true); setError(null);
    try {
      await AdminService.moderateListing(listing.id, decision, reason);
      const next = queue.find(id => id !== listing.id);
      onRefresh();
      next ? onNavigateToListing(next) : onBackToQueue();
    } catch (e) { setError(e instanceof Error ? e.message : 'Moderation failed.'); setProcessing(false); setDecision(null); void load(); }
  };

  if (loading) return <div className="min-h-[50vh] grid place-items-center"><Loader2 className="w-8 h-8 animate-spin text-[#1464F4]"/><span className="sr-only">Loading secure listing review</span></div>;
  if (!listing) return <State title={error ? 'Unable to load listing' : 'Admin listing not found'} detail={error || 'The UUID is invalid, deleted, or unavailable to this staff account.'} back={onBackToQueue}/>;
  const index = queue.indexOf(listing.id);
  const fields = Object.entries(listing.moduleData).filter(([, v]) => v !== null && v !== '' && v !== false);
  const showContact = listing.moduleData.contact_visibility !== false && listing.moduleData.hide_contact !== true;

  return <div className="space-y-5 pb-32">
    <header className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0"><button onClick={onBackToQueue} className="p-2.5 rounded-xl bg-slate-100" aria-label="Back to queue"><ArrowLeft/></button><div className="min-w-0"><p className="text-xs font-bold text-[#1464F4]">ADMIN LISTING REVIEW</p><h1 className="text-xl sm:text-2xl font-black text-[#041C43] truncate">{listing.title}</h1><p className="text-xs text-slate-500 font-mono break-all">{listing.id}</p></div></div>
      {index >= 0 && <div className="flex items-center gap-2"><button disabled={index === 0} onClick={() => onNavigateToListing(queue[index - 1])} className="p-2 border rounded-lg disabled:opacity-30" aria-label="Previous"><ChevronLeft/></button><span className="text-xs font-bold">{index + 1} / {queue.length} pending</span><button disabled={index === queue.length - 1} onClick={() => onNavigateToListing(queue[index + 1])} className="p-2 border rounded-lg disabled:opacity-30" aria-label="Next"><ChevronRight/></button></div>}
    </header>
    {error && <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold">{error}</div>}
    <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)] gap-5">
      <main className="space-y-5 min-w-0">
        <section className="bg-white border rounded-3xl overflow-hidden"><div className="aspect-video bg-slate-100 grid place-items-center relative">{listing.media[photo]?.signedUrl ? <img src={listing.media[photo].signedUrl} alt={`${listing.title}, media ${photo + 1}`} className="w-full h-full object-contain"/> : <div className="text-center text-slate-500"><ImageIcon className="w-10 h-10 mx-auto"/>No media submitted</div>}{listing.media.length > 0 && <span className="absolute bottom-3 right-3 bg-[#041C43]/90 text-white px-3 py-1 rounded-full text-xs">{photo + 1} / {listing.media.length}</span>}</div>{listing.media.length > 1 && <div className="p-3 flex gap-2 overflow-x-auto">{listing.media.map((m, i) => <button key={m.id} onClick={() => setPhoto(i)} className={`w-20 h-16 shrink-0 rounded-xl overflow-hidden border-2 ${photo === i ? 'border-[#1464F4]' : 'border-transparent'}`}><img src={m.signedUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover"/></button>)}</div>}</section>
        <Card title="Description" icon={<FileText/>}><p className="text-sm text-slate-700 whitespace-pre-wrap leading-6">{listing.description || 'No description submitted.'}</p></Card>
        <Card title={`${label(listing.module)} details`} icon={<Shield/>}>{fields.length ? <dl className="grid sm:grid-cols-2 gap-3">{fields.map(([k,v]) => <div key={k} className="bg-slate-50 rounded-xl p-3 min-w-0"><dt className="text-[10px] uppercase font-bold text-slate-500">{label(k)}</dt><dd className="text-sm font-semibold break-words">{value(v)}</dd></div>)}</dl> : <p className="text-sm text-slate-500">No module-specific fields submitted.</p>}</Card>
        <Card title={`Moderation history (${listing.auditHistory.length})`} icon={<History/>}>{listing.auditHistory.length ? listing.auditHistory.map(h => <div key={h.id} className="border-l-2 border-[#1464F4] pl-3 mb-3"><p className="text-sm font-bold">{label(h.action)} · {h.actorName}</p><p className="text-xs text-slate-500">{date(h.createdAt)}</p>{h.reason && <p className="text-sm mt-1">{h.reason}</p>}</div>) : <p className="text-sm text-slate-500">No previous moderation actions.</p>}</Card>
      </main>
      <aside className="space-y-5 min-w-0">
        <Card title="Listing facts" icon={<Shield/>}><dl className="space-y-3"><Fact k="Status" v={label(listing.status)}/><Fact k="Category" v={[listing.category, listing.subcategory].filter(Boolean).join(' / ') || 'Not assigned'}/><Fact k="Price" v={listing.price == null ? 'Not provided' : `${listing.currency} ${new Intl.NumberFormat('en-LK').format(listing.price)}`}/><Fact k="Submitted" v={date(listing.submittedAt || listing.createdAt)}/></dl></Card>
        <Card title="Location" icon={<MapPin/>}><p className="text-sm font-semibold">{listing.location}</p>{listing.exactAddress && <p className="text-sm text-slate-600 mt-2">{listing.exactAddress}</p>}{listing.latitude != null && listing.longitude != null && <p className="text-xs font-mono text-slate-500 mt-2">{listing.latitude}, {listing.longitude}</p>}</Card>
        <Card title="Owner (staff-only)" icon={<User/>}><dl className="space-y-3"><Fact k="Name" v={listing.owner.fullName}/><Fact k="Email" v={showContact ? listing.owner.email : 'Hidden by contact privacy'}/><Fact k="Phone" v={showContact ? listing.owner.phone || 'Not provided' : 'Hidden by contact privacy'}/><Fact k="Member since" v={date(listing.owner.createdAt)}/></dl></Card>
        <button onClick={onOpenReports} className="w-full bg-white border border-rose-200 rounded-3xl p-5 text-left hover:bg-rose-50"><span className="flex gap-2 font-black text-rose-700"><AlertTriangle/>Reports ({listing.reports.length})</span><span className="text-xs text-slate-500">Open Admin Reports for full context</span></button>
      </aside>
    </div>
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 border-t p-3"><div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-end gap-2"><button disabled={listing.status !== 'pending'} onClick={() => {setDecision('request_changes');setReason('');}} className="px-4 py-3 rounded-xl bg-amber-50 text-amber-800 font-bold disabled:opacity-40">Request changes</button><button disabled={listing.status !== 'pending'} onClick={() => {setDecision('reject');setReason('');}} className="px-4 py-3 rounded-xl bg-rose-50 text-rose-700 font-bold disabled:opacity-40">Reject</button><button disabled={listing.status !== 'pending'} onClick={() => setDecision('approve')} className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-40"><CheckCircle2 className="inline w-4 h-4"/> Approve & publish</button></div></div>
    {decision && <div className="fixed inset-0 z-50 bg-[#041C43]/70 p-4 grid place-items-center"><div className="bg-white rounded-3xl p-6 w-full max-w-lg"><h2 className="text-xl font-black">{decision === 'approve' ? 'Approve this listing?' : decision === 'reject' ? 'Reject this listing' : 'Request listing changes'}</h2><p className="text-sm text-slate-600 mt-2">This secure action is audited and guarded against moderator races.</p>{decision !== 'approve' && <textarea autoFocus value={reason} onChange={e => setReason(e.target.value)} rows={5} placeholder="Enter clear, actionable instructions…" className="w-full mt-4 border rounded-xl p-3"/>}<div className="flex justify-end gap-2 mt-5"><button disabled={processing} onClick={() => setDecision(null)} className="px-4 py-2 border rounded-xl">Cancel</button><button disabled={processing || (decision !== 'approve' && !reason.trim())} onClick={() => void submit()} className="px-5 py-2 bg-[#1464F4] text-white font-bold rounded-xl disabled:opacity-40">{processing ? 'Saving…' : 'Confirm decision'}</button></div></div></div>}
  </div>;
};

const Card: React.FC<{title:string;icon:React.ReactNode;children:React.ReactNode}> = ({title,icon,children}) => <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6"><h2 className="font-black text-[#041C43] flex gap-2 mb-4 [&>svg]:w-5 [&>svg]:text-[#1464F4]">{icon}{title}</h2>{children}</section>;
const Fact: React.FC<{k:string;v:string}> = ({k,v}) => <div><dt className="text-[10px] uppercase font-bold text-slate-400">{k}</dt><dd className="text-sm font-semibold break-words">{v}</dd></div>;
const State: React.FC<{title:string;detail:string;back:()=>void}> = ({title,detail,back}) => <div className="bg-white border rounded-3xl p-8 text-center max-w-xl mx-auto my-10"><AlertCircle className="w-10 h-10 text-rose-500 mx-auto"/><h1 className="text-xl font-black mt-3">{title}</h1><p className="text-sm text-slate-600 mt-2">{detail}</p><button onClick={back} className="mt-5 px-5 py-3 bg-[#1464F4] text-white font-bold rounded-xl"><ArrowLeft className="inline w-4 h-4"/> Back to queue</button></div>;
