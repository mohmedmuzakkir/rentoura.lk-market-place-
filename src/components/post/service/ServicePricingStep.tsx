import React, { useState } from 'react';
import { DollarSign, Tag, Plus, Trash2, CheckCircle2, AlertCircle, PackageCheck } from 'lucide-react';
import { ListingDraft, normalizeNumericPrice } from '../../../types/postFormTypes';

interface ServicePricingStepProps {
  draft: ListingDraft;
  onChange: (updated: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor: string;
}

export const ServicePricingStep: React.FC<ServicePricingStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#FF650A'
}) => {
  const pricingModel = draft.formValues.pricingModel || 'hourly';
  const priceValue = draft.formValues.price !== undefined ? draft.formValues.price : 0;

  const updateFormValue = (key: string, value: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: value
      }
    });
  };

  const handlePriceChange = (raw: string) => {
    const { amount } = normalizeNumericPrice(raw);
    updateFormValue('price', amount);
  };

  // Optional Packages
  const packages: Array<{ name: string; price: number; description: string }> = Array.isArray(draft.formValues.servicePackages)
    ? draft.formValues.servicePackages
    : [];

  const addPackage = () => {
    const newPkg = { name: 'New Service Package', price: 3000, description: 'Package description' };
    updateFormValue('servicePackages', [...packages, newPkg]);
  };

  const removePackage = (index: number) => {
    const updated = packages.filter((_: any, i: number) => i !== index);
    updateFormValue('servicePackages', updated);
  };

  const updatePackage = (index: number, key: string, val: any) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [key]: val };
    updateFormValue('servicePackages', updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 5 of 8</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Pricing & Service Packages</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Define clear rates, call-out fees, or customizable packages for your service.
        </p>
      </div>

      {/* Pricing Model Selector */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Pricing Model <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'hourly', label: 'Per Hour', icon: '⏱️' },
            { id: 'visit', label: 'Per Visit / Call-out', icon: '🚗' },
            { id: 'day', label: 'Per Day', icon: '☀️' },
            { id: 'fixed', label: 'Per Job (Fixed)', icon: '💼' },
            { id: 'sqft', label: 'Per Sq. Ft.', icon: '📐' },
            { id: 'starting_from', label: 'Starting From', icon: '🏷️' },
            { id: 'contact', label: 'Contact for Quote', icon: '📞' }
          ].map(m => {
            const isSelected = pricingModel === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => updateFormValue('pricingModel', m.id)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'border-[#FF650A] bg-amber-50/50 ring-2 ring-[#FF650A]/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-[#FF650A]' : 'text-slate-800'}`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Primary Price Input */}
        {pricingModel !== 'contact' ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Primary Rate (LKR / Rs.) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-600">
                Rs. {Number(priceValue || 0).toLocaleString('en-US')}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs.</span>
              <input
                type="text"
                value={priceValue}
                onChange={e => handlePriceChange(e.target.value)}
                placeholder="2500"
                className={`w-full pl-10 pr-4 py-2.5 text-xs font-extrabold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                  errors.price ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.price && (
              <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.price}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900">
            <span className="font-bold block">Contact for Custom Quote Selected</span>
            Your listing will display <strong className="text-amber-700">“Contact for Price / Free Inspection Quote”</strong> instead of a fixed amount.
          </div>
        )}
      </div>

      {/* Inspection & Call-out Surcharges */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Call-out Fee & Additional Rates
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Inspection / Call-out Fee (LKR)
            </label>
            <input
              type="text"
              value={draft.formValues.inspectionFee || ''}
              onChange={e => updateFormValue('inspectionFee', e.target.value)}
              placeholder="e.g. 1500 (Deducted if job is accepted)"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Emergency Surcharge (LKR)
            </label>
            <input
              type="text"
              value={draft.formValues.emergencySurcharge || ''}
              onChange={e => updateFormValue('emergencySurcharge', e.target.value)}
              placeholder="e.g. 1000 for after-hours / night calls"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Service Packages Builder */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-amber-600" /> Service Packages / Tiers
            </h3>
            <p className="text-[11px] text-slate-500">
              Optional package tiers (Basic, Standard, Premium)
            </p>
          </div>
          <button
            type="button"
            onClick={addPackage}
            className="px-3 py-1.5 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-all flex items-center gap-1 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Package
          </button>
        </div>

        <div className="space-y-3">
          {packages.map((pkg: any, idx: number) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={pkg.name}
                  onChange={e => updatePackage(idx, 'name', e.target.value)}
                  placeholder="Package Name (e.g. Basic Wiring Check)"
                  className="px-2.5 py-1 text-xs font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 w-full sm:w-1/2"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Rs.</span>
                  <input
                    type="number"
                    value={pkg.price}
                    onChange={e => updatePackage(idx, 'price', Number(e.target.value))}
                    className="w-24 px-2 py-1 text-xs font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => removePackage(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={pkg.description}
                onChange={e => updatePackage(idx, 'description', e.target.value)}
                placeholder="What is included in this package?"
                className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
