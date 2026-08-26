import React, { useState } from 'react';
import { Lightbulb, ChevronRight, X, CheckCircle, Image, FileText, Phone, MapPin } from 'lucide-react';

export const ProTipBanner: React.FC = () => {
  const [showTipsModal, setShowTipsModal] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-left">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-[#1464F4] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1464F4]">
              Pro Tip for Higher Inquiries
            </span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
              Use clear original photos, specific model or role details, and genuine pricing for 3x faster response times.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTipsModal(true)}
          className="w-full sm:w-auto flex-shrink-0 py-2 px-4 rounded-xl bg-white border border-blue-200 text-[#1464F4] hover:bg-blue-50 text-xs font-bold flex items-center justify-center gap-1 shadow-sm tap-bounce"
        >
          <span>View Guidelines</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1464F4] flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Posting Best Practices
                </h3>
              </div>
              <button
                onClick={() => setShowTipsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center tap-bounce"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                <Image className="w-4 h-4 text-[#1464F4] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">High Quality Real Photos</h4>
                  <p>Upload at least 3-5 real photos showing different angles and real lighting. Listings with watermarked stock photos may be rejected.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <FileText className="w-4 h-4 text-[#08A34F] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">Clear & Specific Details</h4>
                  <p>Include exact dimensions, fuel types, work experience, advance terms, or working hours to avoid repetitive inquiries.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-orange-50/70 border border-orange-100">
                <MapPin className="w-4 h-4 text-[#FF650A] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">Accurate Location</h4>
                  <p>Select the exact City and District in Sri Lanka so nearby seekers searching by location find your listing immediately.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
                <Phone className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">Safe Contact & No Advance Pay</h4>
                  <p>Use clear, safe contact methods. Never make or request advance payments or deposits before physical inspection or contract verification.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTipsModal(false)}
              className="w-full py-3 rounded-xl bg-[#1464F4] text-white font-bold text-xs tap-bounce"
            >
              Got it, let's post!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
