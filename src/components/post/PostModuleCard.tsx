import React from 'react';
import { Home, Briefcase, Wrench, Check, Plus, ArrowRight } from 'lucide-react';
import { AppRoute } from '../../types';

export interface PostModuleConfig {
  id: 'rentals' | 'jobs' | 'services';
  route: AppRoute;
  badge?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  icon: React.ElementType;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  features: string[];
  ctaText: string;
  primaryColor: string;
  secondaryBg: string;
  borderColor: string;
  hoverBorderColor: string;
  buttonBg: string;
  iconBg: string;
  iconColor: string;
  checkColor: string;
}

export const POST_MODULES_CONFIG: PostModuleConfig[] = [
  {
    id: 'rentals',
    route: '/post/rental',
    badge: '★ MOST POPULAR',
    badgeBg: 'bg-[#1464F4]',
    badgeTextColor: 'text-white',
    icon: Home,
    titlePrefix: 'Post a',
    titleHighlight: 'Rental',
    subtitle: 'List your property, vehicle, equipment or any item for rent.',
    features: [
      'Houses, Rooms, Apartments & Land',
      'Vehicles, Cars, Bikes & Boats',
      'Event Items, Party & Sound Gear',
      'Electronics, Tools & Furniture'
    ],
    ctaText: 'Add Rental Listing',
    primaryColor: '#1464F4',
    secondaryBg: 'bg-blue-50/70',
    borderColor: 'border-blue-200/80',
    hoverBorderColor: 'hover:border-[#1464F4]',
    buttonBg: 'bg-[#1464F4] hover:bg-blue-700 shadow-blue-500/25',
    iconBg: 'bg-blue-100 text-[#1464F4]',
    iconColor: '#1464F4',
    checkColor: 'text-[#1464F4] bg-blue-100/70'
  },
  {
    id: 'jobs',
    route: '/post/job',
    icon: Briefcase,
    titlePrefix: 'Post a',
    titleHighlight: 'Job',
    subtitle: 'Find the right talent for your company or business.',
    features: [
      'Full Time, Part Time & Contract Roles',
      'Any Industry, Any Qualification Level',
      'Local & 100% Remote Opportunities',
      'Direct Candidate Applications'
    ],
    ctaText: 'Post a Job Opportunity',
    primaryColor: '#08A34F',
    secondaryBg: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200/80',
    hoverBorderColor: 'hover:border-[#08A34F]',
    buttonBg: 'bg-[#08A34F] hover:bg-emerald-700 shadow-emerald-500/25',
    iconBg: 'bg-emerald-100 text-[#08A34F]',
    iconColor: '#08A34F',
    checkColor: 'text-[#08A34F] bg-emerald-100/70'
  },
  {
    id: 'services',
    route: '/post/service',
    icon: Wrench,
    titlePrefix: 'Offer your',
    titleHighlight: 'Service',
    subtitle: 'Offer your skills or services and grow your business.',
    features: [
      'Home Services, Electrical & Plumbing',
      'Design, Digital & Creative Work',
      'Tutoring, Coaching & Lessons',
      'Events, Wellness, Moving & More'
    ],
    ctaText: 'Offer a Service / Skill',
    primaryColor: '#FF650A',
    secondaryBg: 'bg-orange-50/70',
    borderColor: 'border-orange-200/80',
    hoverBorderColor: 'hover:border-[#FF650A]',
    buttonBg: 'bg-[#FF650A] hover:bg-orange-700 shadow-orange-500/25',
    iconBg: 'bg-orange-100 text-[#FF650A]',
    iconColor: '#FF650A',
    checkColor: 'text-[#FF650A] bg-orange-100/70'
  }
];

interface PostModuleCardProps {
  config: PostModuleConfig;
  onSelect: (route: AppRoute) => void;
}

export const PostModuleCard: React.FC<PostModuleCardProps> = ({ config, onSelect }) => {
  const Icon = config.icon;

  return (
    <div 
      onClick={() => onSelect(config.route)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(config.route);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${config.titlePrefix} ${config.titleHighlight}`}
      className={`relative flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 border-2 ${config.borderColor} ${config.hoverBorderColor} shadow-md hover:shadow-xl transition-all duration-200 group text-left cursor-pointer active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-[#1464F4]`}
    >
      {/* Popular Badge if defined */}
      {config.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${config.badgeBg} ${config.badgeTextColor} shadow-md`}>
            {config.badge}
          </span>
        </div>
      )}

      {/* Top Header & Icon */}
      <div>
        <div className="flex items-center justify-center mb-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${config.iconBg} shadow-inner transition-transform group-hover:scale-105 duration-200`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
            {config.titlePrefix}{' '}
            <span style={{ color: config.primaryColor }}>{config.titleHighlight}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2 px-2 leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Features Bullet List */}
        <div className="my-5 space-y-2.5 pt-2 border-t border-slate-100">
          {config.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-left">
              <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${config.checkColor} mt-0.5`}>
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className="text-xs font-medium text-slate-700 leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-3">
        <button
          tabIndex={-1}
          className={`w-full py-3.5 px-5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg ${config.buttonBg} transition-all duration-150 tap-bounce active:scale-[0.98] pointer-events-none`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{config.ctaText}</span>
          <ArrowRight className="w-4 h-4 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
};
