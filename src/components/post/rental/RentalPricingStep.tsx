import React from 'react';
import { RentalPricingState } from '../../../types/postFormTypes';
import { DollarSign, ShieldAlert, Calendar, Percent, Check, AlertCircle } from 'lucide-react';

interface RentalPricingStepProps {
  pricing: RentalPricingState;
  errors: Record<string, string>;
  onChangePricing: (newPricing: RentalPricingState) => void;
  accentColor?: string;
}

export const RentalPricingStep: React.FC<RentalPricingStepProps> = ({
  pricing,
  errors,
  onChangePricing,
  accentColor = '#1464F4'
}) => {
  const ratePeriods = [
    { id: 'day', label: 'Per Day', badge: 'Most Popular' },
    { id: 'month', label: 'Per Month', badge: 'Long Term' },
    { id: 'week', label: 'Per Week' },
    { id: 'hour', label: 'Per Hour' },
    { id: 'event', label: 'Per Event / Fixed' }
  ];

  const minDurations = [
    '1 day',
    '2 days',
    '3 days',
    '1 week',
    '2 weeks',
    '1 month',
    '3 months',
    '6 months',
    '1 year'
  ];

  return (
    <div className="space-y-5 text-left animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <DollarSign className="w-5 h-5 text-[#1464F4] flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-slate-900">Step 3: Pricing, Deposit & Availability</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Set clear rates in Sri Lankan Rupees (LKR). Specify refundable deposit requirements, minimum rental periods, and optional long-term discounts.
          </p>
        </div>
      </div>

      {/* Primary Pricing Rate */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
          Primary Rental Rate
        </h3>

        {/* Rate Period Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>Billing Rate Period</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ratePeriods.map((period) => {
              const isSelected = pricing.ratePeriod === period.id;
              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => onChangePricing({ ...pricing, ratePeriod: period.id as any })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all tap-bounce ${
                    isSelected
                      ? 'border-[#1464F4] bg-blue-50 text-[#1464F4] shadow-xs ring-1 ring-blue-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{period.label}</span>
                  {period.badge && (
                    <span className="block text-[9px] font-normal text-slate-400">
                      {period.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Amount Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>Rental Rate Amount (LKR)</span>
              <span className="text-rose-500">*</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Billed {pricing.ratePeriod === 'day' ? 'daily' : (pricing.ratePeriod === 'month' ? 'monthly' : `per ${pricing.ratePeriod}`)}
            </span>
          </label>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
              Rs.
            </span>
            <input
              type="number"
              value={pricing.rate || ''}
              onChange={(e) => onChangePricing({ ...pricing, rate: Number(e.target.value) })}
              placeholder="e.g. 12500"
              min={0}
              className={`w-full pl-10 pr-24 py-2.5 rounded-xl bg-white border text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
                errors.rate ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none capitalize">
              / {pricing.ratePeriod}
            </span>
          </div>

          {errors.rate && (
            <p className="text-[10px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.rate}
            </p>
          )}
        </div>

        {/* Secondary Rate (Optional Toggle) */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Add Alternative Rate (e.g. Monthly Package)</p>
              <p className="text-[10px] text-slate-500">Provide both daily and monthly rates for flexibility</p>
            </div>
            <input
              type="checkbox"
              checked={pricing.hasSecondaryRate || false}
              onChange={(e) => onChangePricing({ ...pricing, hasSecondaryRate: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
          </label>

          {pricing.hasSecondaryRate && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Secondary Rate Amount (Rs.)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rs.</span>
                  <input
                    type="number"
                    value={pricing.secondaryRate || ''}
                    onChange={(e) => onChangePricing({ ...pricing, secondaryRate: Number(e.target.value) })}
                    placeholder="e.g. 180000"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Secondary Period</label>
                <select
                  value={pricing.secondaryPeriod || 'month'}
                  onChange={(e) => onChangePricing({ ...pricing, secondaryPeriod: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800"
                >
                  <option value="month">Per Month</option>
                  <option value="week">Per Week</option>
                  <option value="day">Per Day</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Deposit & Guarantees */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#1464F4]" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
            Refundable Security Deposit
          </h3>
        </div>

        {/* Deposit Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
          <div>
            <p className="text-xs font-bold text-slate-900">Require Refundable Caution Deposit?</p>
            <p className="text-[10px] text-slate-500">Returned to renter upon damage-free return</p>
          </div>
          <button
            type="button"
            onClick={() => onChangePricing({ ...pricing, depositRequired: !pricing.depositRequired })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
              pricing.depositRequired ? 'bg-[#1464F4]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                pricing.depositRequired ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {pricing.depositRequired && (
          <div className="space-y-3 pt-1 animate-in fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Security Deposit Amount (LKR)</span>
                <span className="text-[10px] text-slate-400 font-normal">e.g. Rs. 25,000</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  Rs.
                </span>
                <input
                  type="number"
                  value={pricing.depositAmount || ''}
                  onChange={(e) => onChangePricing({ ...pricing, depositAmount: Number(e.target.value) })}
                  placeholder="25000"
                  min={0}
                  className="w-full pl-10 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Deposit Return Policy & Conditions
              </label>
              <input
                type="text"
                value={pricing.depositTerms || ''}
                onChange={(e) => onChangePricing({ ...pricing, depositTerms: e.target.value })}
                placeholder="e.g. 100% refunded immediately after inspection upon item return"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Rental Duration & Booking Type */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#1464F4]" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
            Rental Duration & Booking Mode
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Minimum Rental Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Minimum Rental Period</label>
            <select
              value={pricing.minRentalDuration || '1 day'}
              onChange={(e) => onChangePricing({ ...pricing, minRentalDuration: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
            >
              {minDurations.map((dur) => (
                <option key={dur} value={dur}>
                  {dur}
                </option>
              ))}
            </select>
          </div>

          {/* Booking Confirmation Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Booking Confirmation</label>
            <select
              value={pricing.bookingType || 'inquire'}
              onChange={(e) => onChangePricing({ ...pricing, bookingType: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
            >
              <option value="inquire">Inquire / Request to Book First</option>
              <option value="instant">Instant Booking Allowed</option>
            </select>
          </div>
        </div>

        {/* Long Term Discount Option */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">Offer Long-Term Rental Discounts</p>
                <p className="text-[10px] text-slate-500">Attract renters for 7+ days or monthly rentals</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={pricing.offerLongTermDiscount || false}
              onChange={(e) => onChangePricing({ ...pricing, offerLongTermDiscount: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
          </label>

          {pricing.offerLongTermDiscount && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 animate-in fade-in">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700">7+ Days Discount (%)</label>
                <input
                  type="number"
                  value={pricing.discountWeek || 10}
                  onChange={(e) => onChangePricing({ ...pricing, discountWeek: Number(e.target.value) })}
                  placeholder="10"
                  min={1}
                  max={50}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700">30+ Days Discount (%)</label>
                <input
                  type="number"
                  value={pricing.discountMonth || 20}
                  onChange={(e) => onChangePricing({ ...pricing, discountMonth: Number(e.target.value) })}
                  placeholder="20"
                  min={1}
                  max={60}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
