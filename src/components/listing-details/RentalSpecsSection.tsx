import React from 'react';
import { ShieldCheck, Truck, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { RentalListingDetail } from '../../types/listingDetailsTypes';

interface RentalSpecsSectionProps {
  listing: RentalListingDetail;
}

export const RentalSpecsSection: React.FC<RentalSpecsSectionProps> = ({ listing }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Availability & Booking Policy */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Clock className="w-4 h-4 text-[#1464F4]" />
          <span>Rental Policy & Minimum Term</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {listing.minRentalDuration 
            ? `Minimum rental period is ${listing.minRentalDuration}.`
            : 'Flexible rental duration available. Early return and extension policies apply.'}
        </p>
        <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold pt-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Instant Availability for Booking</span>
        </div>
      </div>

      {/* Security Deposit & Delivery */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-[#1464F4]" />
          <span>Security & Handover</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {listing.depositRequired
            ? `Refundable security deposit: ${listing.depositRequired}.`
            : 'Refundable security deposit is collected upon handover with valid National ID.'}
        </p>
        <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold pt-1">
          <Truck className="w-3.5 h-3.5" />
          <span>{listing.deliveryAvailable ? 'Delivery & Pickup Available' : 'Self-pickup at verified location'}</span>
        </div>
      </div>
    </div>
  );
};
