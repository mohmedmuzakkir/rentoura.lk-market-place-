import React from 'react';
import { Send, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const WhatHappensNext: React.FC = () => {
  const steps = [
    {
      step: '1',
      icon: Send,
      title: 'Submit Details',
      statusTag: 'draft ➔ pending',
      color: 'text-[#1464F4]',
      bgColor: 'bg-blue-50/80 border-blue-100',
      desc: 'Complete key listing details, upload images, and submit your post for review.'
    },
    {
      step: '2',
      icon: Clock,
      title: 'Staff Moderation',
      statusTag: 'pending',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50/80 border-amber-100',
      desc: 'Our staff team reviews content for quality, safety, and community guidelines.'
    },
    {
      step: '3',
      icon: CheckCircle2,
      title: 'Live & Discoverable',
      statusTag: 'active',
      color: 'text-[#08A34F]',
      bgColor: 'bg-emerald-50/80 border-emerald-100',
      desc: 'Once approved, your listing goes live across Sri Lanka for interested seekers.'
    },
    {
      step: '4',
      icon: ShieldAlert,
      title: 'Feedback & Updates',
      statusTag: 'changes_requested / rejected',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50/80 border-purple-100',
      desc: 'If revisions are needed, staff provide feedback so you can update and resubmit.'
    }
  ];

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm text-left space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
          What happens next?
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Understanding the RENTOURA.LK listing moderation workflow and status lifecycle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className={`rounded-2xl p-3.5 border ${s.bgColor} flex flex-col justify-between space-y-2.5`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200/60">
                  Step {s.step}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-1.5 border-t border-slate-200/50">
                <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                  Status: <span className="font-bold text-slate-800">{s.statusTag}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
