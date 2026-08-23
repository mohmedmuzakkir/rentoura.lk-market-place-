import React from 'react';
import { ShieldCheck, Users, Zap, TrendingUp, Headphones } from 'lucide-react';

export const WhyPostWithUs: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      color: 'text-[#1464F4]',
      bgColor: 'bg-blue-50',
      title: 'Trusted Platform',
      desc: 'Transparent moderation & clear community standards'
    },
    {
      icon: Users,
      color: 'text-[#08A34F]',
      bgColor: 'bg-emerald-50',
      title: 'Island-wide Reach',
      desc: 'Reach seekers and businesses across all 9 provinces'
    },
    {
      icon: Zap,
      color: 'text-[#FF650A]',
      bgColor: 'bg-orange-50',
      title: 'Quick & Easy',
      desc: 'Smart step-by-step forms with automatic draft saving'
    },
    {
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      title: 'Direct Inquiries',
      desc: 'Get genuine phone calls, chats and WhatsApp leads'
    },
    {
      icon: Headphones,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      title: 'Local Support',
      desc: 'Dedicated assistance for Sri Lankan creators & hirers'
    }
  ];

  return (
    <section className="space-y-4">
      <div className="text-left">
        <h3 className="text-lg font-bold text-slate-900 font-heading">
          Why post with us?
        </h3>
        <p className="text-xs text-slate-500">
          Built specifically for Sri Lanka's rental, hiring and service ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {points.map((pt, index) => {
          const Icon = pt.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col items-start text-left hover:border-slate-300 transition-all"
            >
              <div className={`w-9 h-9 rounded-xl ${pt.bgColor} flex items-center justify-center mb-2.5`}>
                <Icon className={`w-5 h-5 ${pt.color}`} />
              </div>
              <h4 className="text-xs font-bold text-slate-800 leading-tight">
                {pt.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {pt.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
