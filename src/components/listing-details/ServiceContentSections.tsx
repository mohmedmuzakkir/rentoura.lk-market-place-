import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Users, 
  Wrench, 
  Sparkles, 
  Zap, 
  Calendar, 
  AlertCircle, 
  Info,
  ChevronRight,
  ExternalLink,
  Award,
  FileCheck
} from 'lucide-react';
import { ServiceListingDetail } from '../../types/listingDetailsTypes';

interface ServiceContentSectionsProps {
  service: ServiceListingDetail;
  onOpenMap: () => void;
  onOpenPortfolioLightbox?: () => void;
}

export const ServiceContentSections: React.FC<ServiceContentSectionsProps> = ({
  service,
  onOpenMap,
  onOpenPortfolioLightbox
}) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Primary Service Details Header Card (Image 3) */}
      <div className="bg-white rounded-3xl border border-orange-100 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {service.title}
            </h1>
            {service.postedDateStr && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {service.postedDateStr}
              </span>
            )}
          </div>

          {service.isVerified && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[#FF650A] text-xs font-bold border border-orange-200/80">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>VERIFIED LISTING</span>
            </div>
          )}
        </div>

        {/* Location Row */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-[#FF650A] shrink-0" />
            <span className="truncate">{service.location.city}, {service.location.district}, {service.location.province}</span>
          </div>
          <button
            onClick={onOpenMap}
            className="text-[#FF650A] font-bold flex items-center gap-0.5 hover:underline shrink-0"
          >
            <span>View on Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Starting Price Banner */}
        <div className="bg-orange-50/60 rounded-2xl border border-orange-100 p-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#FF650A]">
              Rs. {service.startingPrice.amount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-600">
              / {service.startingPrice.unit.replace('Per ', '')}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            Starting Price <Info className="w-3 h-3 text-slate-400" />
          </span>
        </div>
      </div>

      {/* 8-Matrix Service Details Grid (Image 3) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF650A]" />
          <span>Service Details</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <Wrench className="w-3 h-3 text-[#FF650A]" />
              <span>Service Type</span>
            </div>
            <div className="font-bold text-slate-900 truncate">{service.serviceType}</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <Award className="w-3 h-3 text-[#FF650A]" />
              <span>Experience</span>
            </div>
            <div className="font-bold text-slate-900">{service.experienceYears}</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <MapPin className="w-3 h-3 text-[#FF650A]" />
              <span>Service Mode</span>
            </div>
            <div className="font-bold text-slate-900">{service.serviceMode}</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <Calendar className="w-3 h-3 text-[#FF650A]" />
              <span>Availability</span>
            </div>
            <div className="font-bold text-slate-900">{service.availabilityDays}</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <Clock className="w-3 h-3 text-[#FF650A]" />
              <span>Response Time</span>
            </div>
            <div className="font-bold text-slate-900">{service.responseTime || 'Within 2 Hours'}</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <Users className="w-3 h-3 text-[#FF650A]" />
              <span>Team Size</span>
            </div>
            <div className="font-bold text-slate-900">{service.teamSize || '1-3 Staff'}</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <Wrench className="w-3 h-3 text-[#FF650A]" />
              <span>Equipment</span>
            </div>
            <div className="font-bold text-slate-900">{service.equipmentProvided ? 'Provided' : 'Client Provided'}</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
              <Zap className="w-3 h-3 text-[#FF650A]" />
              <span>Emergency</span>
            </div>
            <div className="font-bold text-slate-900">{service.emergencyService ? 'Yes (24/7)' : 'No'}</div>
          </div>
        </div>
      </div>

      {/* 3-Column Bento: Description, Service Pricing, and Available Days & Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* About This Service */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#FF650A]" />
              <span>About This Service</span>
            </h4>
            <p className={`text-xs text-slate-600 leading-relaxed ${!isDescExpanded ? 'line-clamp-4' : ''}`}>
              {service.description}
            </p>
          </div>
          {service.description.length > 120 && (
            <button
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="text-[#FF650A] font-bold text-xs mt-2 self-start hover:underline tap-bounce"
            >
              {isDescExpanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Service Pricing Packages */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col">
          <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF650A]" />
            <span>Service Pricing</span>
          </h4>

          <div className="space-y-2 text-xs flex-1">
            {service.packages?.map((pkg, idx) => (
              <div key={idx} className="flex justify-between items-center pb-1 border-b border-slate-50">
                <span className="text-slate-600 font-medium">{pkg.title}</span>
                <span className="font-bold text-slate-900">
                  {pkg.price} <span className="text-[10px] text-slate-400 font-normal">{pkg.unit}</span>
                </span>
              </div>
            ))}
          </div>

          <p className="text-[9.5px] text-slate-400 italic mt-2">
            * Prices may vary based on size & condition.
          </p>
        </div>

        {/* Available Days & Time */}
        <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF650A]" />
              <span>Available Days & Time</span>
            </h4>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Monday - Friday</span>
                <span className="font-semibold text-slate-800">6:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Saturday</span>
                <span className="font-semibold text-slate-800">7:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sunday</span>
                <span className="font-semibold text-slate-800">8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {service.sameDayBooking && (
            <div className="mt-3 p-2 rounded-xl bg-orange-50 text-center font-bold text-[11px] text-[#FF650A] border border-orange-200/80">
              Same Day Booking Available
            </div>
          )}
        </div>
      </div>

      {/* Service Provider Credentials Card (Image 3) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Identity */}
          <div className="flex items-center gap-3">
            <img
              src={service.provider.photoUrl}
              alt={service.provider.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-100"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-slate-900">
                  {service.provider.name}
                </h4>
                {service.provider.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-[#FF650A]" />
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Professional Cleaning Services
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal">
                    (128 Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges 4-Grid */}
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">Business Registered</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">Background Checked</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">ID Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">Insurance Covered</span>
            </div>
          </div>
        </div>

        {/* Provider Stats Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
          <div>
            <div className="text-xs font-black text-slate-900">256+</div>
            <div className="text-[10px] text-slate-400 font-medium">Completed Jobs</div>
          </div>
          <div>
            <div className="text-xs font-black text-emerald-600">98%</div>
            <div className="text-[10px] text-slate-400 font-medium">Positive Reviews</div>
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">{service.experienceYears}</div>
            <div className="text-[10px] text-slate-400 font-medium">Experience</div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Recent Work / Portfolio & Customer Reviews (Image 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Work Portfolio */}
        {service.portfolioImages && service.portfolioImages.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900">Recent Work</span>
              <button 
                onClick={onOpenPortfolioLightbox}
                className="text-[11px] font-bold text-[#FF650A] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {service.portfolioImages.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={onOpenPortfolioLightbox}
                  className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={img}
                    alt={`Portfolio work ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews */}
        {service.customerReviews && (
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Customer Reviews</span>
              <button className="text-[11px] font-bold text-[#FF650A] hover:underline">
                View All
              </button>
            </div>

            {service.customerReviews.featuredReview && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{service.customerReviews.featuredReview.comment}"
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-800 ml-1">
                      {service.customerReviews.featuredReview.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {service.customerReviews.featuredReview.avatarUrl && (
                      <img
                        src={service.customerReviews.featuredReview.avatarUrl}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span className="text-xs font-bold text-slate-800">
                      {service.customerReviews.featuredReview.author}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
