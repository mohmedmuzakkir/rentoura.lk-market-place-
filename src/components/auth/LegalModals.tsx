import React from 'react';
import { X, ShieldCheck, FileText, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'agreement' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  if (!isOpen) return null;

  const title = type === 'agreement' ? 'RENTOURA.LK User Agreement' : 'RENTOURA.LK Privacy Policy';
  const lastUpdated = 'August 2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#1464F4] flex items-center justify-center">
              {type === 'agreement' ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Effective Version: {lastUpdated}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 tap-bounce"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="py-4 space-y-4 overflow-y-auto text-xs text-slate-600 leading-relaxed pr-1">
          {type === 'agreement' ? (
            <>
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">Summary of Community Standards</h4>
                <p className="text-[11.5px] text-slate-600">
                  RENTOURA.LK connects renters, job seekers, and service providers across Sri Lanka. By creating an account, you agree to maintain honesty, respect safety protocols, and fulfill obligations.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">1. Account Registration & Safety</h4>
                <p>
                  You must provide accurate contact information including your full name, email, and valid Sri Lankan mobile number. Accounts are for individual or verified business use only.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-[#041C43] mb-1">2. Rental & Service Listings</h4>
                <p>
                  All listings submitted for publication must represent genuine items, jobs, or services available in Sri Lanka. Fraudulent listings, deceptive prices, or prohibited goods are strictly banned.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-[#041C43] mb-1">3. Safety & Payments</h4>
                <p>
                  Never make advance bank transfers before inspecting rental items, meeting owners in safe public locations, or verifying service identity. RENTOURA.LK does not collect forced advance fees on behalf of unverified sellers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-[#041C43] mb-1">4. Reviews & Rating System</h4>
                <p>
                  Reviews must reflect authentic marketplace interactions. Defamatory, offensive, or abusive content is subject to moderation and account suspension.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">Your Data Privacy Matters</h4>
                <p className="text-[11.5px] text-slate-600">
                  We handle your personal information responsibly and securely. We never sell your personal data or share passwords with third parties.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">1. Information We Collect</h4>
                <p>
                  When registering, we collect your Full Name, Email Address, Sri Lankan Mobile Number, and account activity (saved items, posted listings, messages) to power your marketplace experience.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">2. Password Security</h4>
                <p>
                  Your account password is encrypted and handled exclusively via Supabase Authentication infrastructure. Passwords are never stored in plain text or accessible to staff.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">3. Communication & Contact</h4>
                <p>
                  Your contact mobile number is displayed on active listings you explicitly choose to publish so renters or clients can reach you directly via call or WhatsApp.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">4. Cookies & Session Storage</h4>
                <p>
                  We use secure session storage and essential authentication tokens to keep you safely logged in across your browsing sessions.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#1464F4] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors tap-bounce flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>I Understand & Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
};
