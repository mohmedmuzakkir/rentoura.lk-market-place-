import React from 'react';
import { VehicleFilterData } from '../../types/filterTypes';
import { 
  FUEL_TYPES, 
  TRANSMISSION_TYPES, 
  VEHICLE_TYPES, 
  VEHICLE_BRANDS 
} from '../../data/advancedFilterConfig';

interface VehicleFiltersSectionProps {
  vehicle: VehicleFilterData;
  onChange: (vehicle: VehicleFilterData) => void;
  primaryColor: string;
}

export const VehicleFiltersSection: React.FC<VehicleFiltersSectionProps> = ({
  vehicle,
  onChange,
  primaryColor
}) => {
  const toggleFuel = (fuel: string) => {
    const current = vehicle.fuelType || [];
    const updated = current.includes(fuel)
      ? current.filter(f => f !== fuel)
      : [...current, fuel];
    onChange({ ...vehicle, fuelType: updated });
  };

  const toggleTransmission = (trans: string) => {
    const current = vehicle.transmission || [];
    const updated = current.includes(trans)
      ? current.filter(t => t !== trans)
      : [...current, trans];
    onChange({ ...vehicle, transmission: updated });
  };

  return (
    <div className="space-y-4">
      {/* 1. Fuel Type */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Fuel Type
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {FUEL_TYPES.map(fuel => {
            const isSelected = vehicle.fuelType?.includes(fuel);
            return (
              <button
                key={fuel}
                type="button"
                onClick={() => toggleFuel(fuel)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] ring-1 ring-[#1464F4]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {fuel}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Transmission */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Transmission
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TRANSMISSION_TYPES.map(trans => {
            const isSelected = vehicle.transmission?.includes(trans);
            return (
              <button
                key={trans}
                type="button"
                onClick={() => toggleTransmission(trans)}
                className={`py-2.5 px-3 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] ring-1 ring-[#1464F4]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {trans}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Driver Mode */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Driver Option
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {['Self Drive', 'With Driver', 'Both'].map(mode => {
            const isSelected = (vehicle.driverMode || 'Both') === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onChange({ ...vehicle, driverMode: mode as any })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] ring-1 ring-[#1464F4]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Seats */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Number of Seats
        </label>
        <div className="grid grid-cols-5 gap-1">
          {['Any', '2', '4-5', '7-8', '10+'].map(seats => {
            const isSelected = (vehicle.seats || 'Any') === seats;
            return (
              <button
                key={seats}
                type="button"
                onClick={() => onChange({ ...vehicle, seats })}
                className={`py-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] ring-1 ring-[#1464F4]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {seats}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
