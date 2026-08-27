import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthService, getProfileCompletionState, normalizeSriLankanPhone } from '../services/authService';
import { UserProfile } from '../types/profileTypes';

interface Props { profile: UserProfile; onComplete: (profile: UserProfile) => void; }

export const CompleteProfilePage: React.FC<Props> = ({ profile, onComplete }) => {
  const initial = getProfileCompletionState(profile);
  const [fullName, setFullName] = useState(profile.fullName || AuthService.getCurrentUser()?.user_metadata?.full_name || AuthService.getCurrentUser()?.user_metadata?.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [accepted, setAccepted] = useState(!initial.missing.includes('agreement'));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (fullName.trim().length < 2) return setError('Please enter your full name.');
    const checkedPhone = normalizeSriLankanPhone(phone);
    if (!checkedPhone.isValid) return setError(checkedPhone.error || 'Enter a valid Sri Lankan mobile number.');
    if (!accepted) return setError('You must accept the current User Agreement and Privacy Policy.');
    setSaving(true);
    try { onComplete(await AuthService.completeProfile(fullName, checkedPhone.normalized, initial.missing.includes('agreement'))); }
    catch (e: any) { setError(e.message || 'Profile could not be completed.'); }
    finally { setSaving(false); }
  };

  return <main className="min-h-screen bg-slate-50 px-4 py-12">
    <form onSubmit={submit} className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
      <CheckCircle2 className="mb-4 h-10 w-10 text-[#1464F4]" />
      <h1 className="text-2xl font-black text-[#041C43]">Complete your profile</h1>
      <p className="mt-2 text-sm text-slate-600">Add the details required to safely use marketplace actions.</p>
      {error && <div className="mt-5 flex gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}
      <label className="mt-6 block text-sm font-bold text-slate-700">Full name</label>
      <input value={fullName} onChange={e=>setFullName(e.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
      <label className="mt-5 block text-sm font-bold text-slate-700">Sri Lankan mobile</label>
      <input value={phone} onChange={e=>setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="07XXXXXXXX" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
      {initial.missing.includes('agreement') && <label className="mt-5 flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1" /><span>I accept the current User Agreement and Privacy Policy.</span></label>}
      <button disabled={saving} className="mt-7 w-full rounded-xl bg-[#1464F4] px-4 py-3 font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save and continue'}</button>
      <p className="mt-5 text-center text-xs text-slate-500">Need help? rentoura.lk@gmail.com · 0725656545</p>
    </form>
  </main>;
};
