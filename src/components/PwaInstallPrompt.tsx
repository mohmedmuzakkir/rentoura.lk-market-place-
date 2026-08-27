import React, { useEffect, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

export const PwaInstallPrompt: React.FC = () => {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone);
  const [dismissed, setDismissed] = useState(false);
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    const beforeInstall = (event: Event) => { event.preventDefault(); setPromptEvent(event as InstallPromptEvent); };
    const appInstalled = () => { setInstalled(true); setPromptEvent(null); };
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', appInstalled);
    return () => { window.removeEventListener('beforeinstallprompt', beforeInstall); window.removeEventListener('appinstalled', appInstalled); };
  }, []);

  if (installed || dismissed || (!promptEvent && !isIos)) return null;
  return <aside className="fixed bottom-24 left-3 right-3 z-40 mx-auto max-w-md rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl lg:bottom-6" aria-label="Install RENTOURA.LK">
    <button type="button" onClick={() => setDismissed(true)} className="absolute right-2 top-2 rounded-lg p-1 text-slate-500" aria-label="Dismiss install information"><X className="h-4 w-4" /></button>
    <div className="flex gap-3 pr-6"><div className="rounded-xl bg-blue-50 p-2 text-[#1464F4]">{isIos ? <Share2 className="h-5 w-5" /> : <Download className="h-5 w-5" />}</div><div className="min-w-0 flex-1"><h2 className="text-sm font-black text-slate-900">Install RENTOURA.LK</h2><p className="mt-1 text-xs text-slate-600">Access rentals, jobs and services faster from your home screen.</p>{isIos && !promptEvent ? <p className="mt-2 text-xs font-semibold text-slate-700">Tap Share, then Add to Home Screen.</p> : <button type="button" className="mt-3 rounded-xl bg-[#1464F4] px-4 py-2 text-xs font-bold text-white" onClick={async () => { if (!promptEvent) return; await promptEvent.prompt(); await promptEvent.userChoice; setPromptEvent(null); }}>Install</button>}</div></div>
  </aside>;
};
