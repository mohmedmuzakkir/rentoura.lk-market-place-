import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Heart, 
  Phone, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Building2, 
  Send, 
  Calendar,
  MessageCircle,
  Car,
  Bed,
  Bath,
  Users,
  Snowflake,
  Star
} from 'lucide-react';
import { FeaturedListingItem, JobItem, ServiceItem } from '../types';

// ==================== RENTAL DETAIL MODAL ====================
interface RentalModalProps {
  listing: FeaturedListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const RentalDetailModal: React.FC<RentalModalProps> = ({
  listing,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave
}) => {
  const [booked, setBooked] = useState(false);

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Image & Top Controls */}
        <div className="relative h-60 w-full bg-slate-900 shrink-0">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 tap-bounce"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#1464F4] text-white text-[11px] font-bold uppercase tracking-wide">
              {listing.badgeType}
            </span>
            <span className="px-2 py-1 rounded-full bg-white/90 text-slate-800 text-[10.5px] font-bold">
              {listing.categoryType}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-lg font-extrabold font-heading">{listing.title}</h3>
            <div className="flex items-center gap-1 text-xs text-blue-100 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{listing.location}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 flex-1">
          {/* Price Box */}
          <div className="flex items-center justify-between bg-blue-50/80 p-3.5 rounded-2xl border border-blue-100">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Rental Rate</span>
              <div className="text-xl font-black text-[#1464F4] font-heading">
                {listing.price} <span className="text-xs font-semibold text-slate-600">{listing.pricePeriod}</span>
              </div>
            </div>
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(listing.id)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
              </button>
            )}
          </div>

          {/* Specifications */}
          {listing.tags && listing.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Key Specifications</h4>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, i) => (
                  <div key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Owner verification */}
          <div className="p-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                Verified Lankan Host
              </h5>
              <p className="text-[11px] text-slate-600">ID & Ownership Documents verified by RENTOURA</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <a
              href="tel:+94771234567"
              className="flex-1 py-3 bg-[#1464F4] hover:bg-blue-600 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-1.5 tap-bounce shadow-md shadow-blue-500/20"
            >
              <Phone className="w-4 h-4" /> Call Host
            </a>
            <a
              href={`https://wa.me/94771234567?text=Hi,%20I%20am%20interested%20in%20your%20rental%20listing:%20${encodeURIComponent(listing.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-1.5 tap-bounce shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== JOB DETAIL & APPLY MODAL ====================
interface JobModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobModalProps> = ({
  job,
  isOpen,
  onClose
}) => {
  const [applied, setApplied] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');

  if (!isOpen || !job) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div className="flex-1 pr-4">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#08A34F] text-[10.5px] font-bold uppercase tracking-wider">
              {job.jobType}
            </span>
            <h3 className="text-base font-extrabold text-slate-900 font-heading mt-1.5">
              {job.title}
            </h3>
            <p className="text-xs font-semibold text-slate-600">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 tap-bounce shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 flex-1">
          {/* Salary Card */}
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">Offered Salary</span>
              <div className="text-base font-black text-[#08A34F] font-heading">
                {job.salary} <span className="text-xs font-normal text-slate-500">{job.salaryPeriod || '/ Month'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{job.location}</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">Required Skills & Experience</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Job Overview */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-1.5">Job Overview</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {job.description || 'Join our fast-growing team in Sri Lanka. Opportunity for career advancement, modern hybrid workspace, and competitive benefits.'}
            </p>
          </div>

          {/* Apply Form / Status */}
          {applied ? (
            <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-200 animate-in zoom-in-95">
              <CheckCircle2 className="w-10 h-10 text-[#08A34F] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">Application Submitted!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Your profile was sent directly to <strong>{job.company}</strong> hiring department.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">Quick Easy Apply</h4>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#08A34F]"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number (+94 ...)"
                value={candidatePhone}
                onChange={(e) => setCandidatePhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#08A34F]"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#08A34F] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 tap-bounce"
              >
                <Send className="w-4 h-4" /> Submit Application
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== SERVICE DETAIL MODAL ====================
interface ServiceModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceModalProps> = ({
  service,
  isOpen,
  onClose
}) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Image */}
        <div className="relative h-56 w-full bg-slate-900 shrink-0">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 tap-bounce"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4">
            <span className="px-2.5 py-1 rounded-full bg-[#FF650A] text-white text-[11px] font-bold uppercase tracking-wide">
              {service.categoryTag}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-lg font-extrabold font-heading">{service.title}</h3>
            <div className="flex items-center gap-1.5 text-xs text-orange-200 mt-1">
              <span className="font-bold text-white">{service.providerName}</span>
              {service.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 flex-1">
          {/* Rate & Rating */}
          <div className="flex items-center justify-between bg-orange-50/70 p-3.5 rounded-2xl border border-orange-100">
            <div>
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">Service Charge</span>
              <div className="text-lg font-black text-[#FF650A] font-heading">
                {service.price} <span className="text-xs font-semibold text-slate-600">{service.priceUnit}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-black text-slate-900">{service.rating}</span>
              <span className="text-[11px] text-slate-400">({service.reviewsCount})</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <MapPin className="w-4 h-4 text-[#FF650A] shrink-0" />
            <span>Serving: <strong>{service.location}</strong></span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-1.5">Service Details</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {service.description || 'Experienced certified Lankan technician available for on-demand dispatch with warranty and quality guarantee.'}
            </p>
          </div>

          {/* Direct WhatsApp & Call Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <a
              href={`https://wa.me/${service.whatsappNumber || '94771234567'}?text=Hi%20${encodeURIComponent(service.providerName)},%20I%20saw%20your%20service%20on%20RENTOURA:%20${encodeURIComponent(service.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-1.5 tap-bounce shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Chat
            </a>
            <a
              href={`tel:${service.phone || '+94771234567'}`}
              className="flex-1 py-3 bg-[#FF650A] hover:bg-orange-600 text-white font-bold rounded-xl text-center text-xs flex items-center justify-center gap-1.5 tap-bounce shadow-md shadow-orange-500/20"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
