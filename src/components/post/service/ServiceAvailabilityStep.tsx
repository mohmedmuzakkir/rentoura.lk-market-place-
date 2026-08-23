import React from 'react';
import { Clock, Calendar, Zap, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ListingDraft } from '../../../types/postFormTypes';

interface ServiceAvailabilityStepProps {
  draft: ListingDraft;
  onChange: (updated: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor: string;
}

export const ServiceAvailabilityStep: React.FC<ServiceAvailabilityStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#FF650A'
}) => {
  const defaultSchedule: Record<string, { enabled: boolean; start: string; end: string }> = {
    monday: { enabled: true, start: '08:00', end: '18:00' },
    tuesday: { enabled: true, start: '08:00', end: '18:00' },
    wednesday: { enabled: true, start: '08:00', end: '18:00' },
    thursday: { enabled: true, start: '08:00', end: '18:00' },
    friday: { enabled: true, start: '08:00', end: '18:00' },
    saturday: { enabled: true, start: '08:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '15:00' }
  };

  const schedule = draft.formValues.weeklySchedule || defaultSchedule;

  const updateFormValue = (key: string, value: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: value
      }
    });
  };

  const updateDaySchedule = (day: string, field: 'enabled' | 'start' | 'end', val: any) => {
    const updated = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: val
      }
    };
    updateFormValue('weeklySchedule', updated);
  };

  const applyPreset = (preset: 'weekdays' | 'weekends' | 'all' | '24_7' | 'appointment') => {
    let newSched = { ...schedule };

    if (preset === 'weekdays') {
      newSched = {
        monday: { enabled: true, start: '08:00', end: '18:00' },
        tuesday: { enabled: true, start: '08:00', end: '18:00' },
        wednesday: { enabled: true, start: '08:00', end: '18:00' },
        thursday: { enabled: true, start: '08:00', end: '18:00' },
        friday: { enabled: true, start: '08:00', end: '18:00' },
        saturday: { enabled: false, start: '09:00', end: '17:00' },
        sunday: { enabled: false, start: '09:00', end: '17:00' }
      };
      updateFormValue('is24Seven', false);
    } else if (preset === 'weekends') {
      newSched = {
        monday: { enabled: false, start: '08:00', end: '18:00' },
        tuesday: { enabled: false, start: '08:00', end: '18:00' },
        wednesday: { enabled: false, start: '08:00', end: '18:00' },
        thursday: { enabled: false, start: '08:00', end: '18:00' },
        friday: { enabled: false, start: '08:00', end: '18:00' },
        saturday: { enabled: true, start: '08:00', end: '18:00' },
        sunday: { enabled: true, start: '08:00', end: '18:00' }
      };
      updateFormValue('is24Seven', false);
    } else if (preset === 'all') {
      newSched = {
        monday: { enabled: true, start: '08:00', end: '18:00' },
        tuesday: { enabled: true, start: '08:00', end: '18:00' },
        wednesday: { enabled: true, start: '08:00', end: '18:00' },
        thursday: { enabled: true, start: '08:00', end: '18:00' },
        friday: { enabled: true, start: '08:00', end: '18:00' },
        saturday: { enabled: true, start: '08:00', end: '18:00' },
        sunday: { enabled: true, start: '08:00', end: '18:00' }
      };
      updateFormValue('is24Seven', false);
    } else if (preset === '24_7') {
      Object.keys(newSched).forEach(day => {
        newSched[day] = { enabled: true, start: '00:00', end: '23:59' };
      });
      updateFormValue('is24Seven', true);
    } else if (preset === 'appointment') {
      updateFormValue('byAppointmentOnly', true);
    }

    updateFormValue('weeklySchedule', newSched);
  };

  const dayLabels: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 4 of 8</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Working Hours & Availability</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Set your regular weekly schedule so customers know when you are open for work or inquiries.
        </p>
      </div>

      {/* Presets */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-600" /> Quick Presets
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('weekdays')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all"
          >
            📅 Weekdays Only (Mon-Fri)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('all')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all"
          >
            📆 All 7 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset('24_7')}
            className="px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-all"
          >
            ⚡ 24/7 Service
          </button>
          <button
            type="button"
            onClick={() => applyPreset('appointment')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all"
          >
            📌 By Appointment Only
          </button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Weekly Schedule Details
        </label>

        <div className="space-y-2.5">
          {Object.keys(dayLabels).map(day => {
            const dayData = schedule[day] || { enabled: true, start: '08:00', end: '18:00' };

            return (
              <div
                key={day}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  dayData.enabled ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-50/20 border-slate-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateDaySchedule(day, 'enabled', !dayData.enabled)}
                    className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                      dayData.enabled ? 'bg-amber-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
                        dayData.enabled ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-extrabold text-slate-800 w-24">{dayLabels[day]}</span>
                </div>

                {dayData.enabled ? (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <input
                      type="time"
                      value={dayData.start}
                      onChange={e => updateDaySchedule(day, 'start', e.target.value)}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-400 font-bold">to</span>
                    <input
                      type="time"
                      value={dayData.end}
                      onChange={e => updateDaySchedule(day, 'end', e.target.value)}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400 italic">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency & Advance Booking Options */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Booking & Notice Options
        </label>

        <div className="space-y-3">
          {/* Emergency Support Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Emergency & Urgent Call-outs Supported</span>
                <span className="text-[11px] text-slate-500 block">Available for sudden electrical, plumbing or breakdown emergencies</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFormValue('emergencyAvailable', !draft.formValues.emergencyAvailable)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                draft.formValues.emergencyAvailable ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
                  draft.formValues.emergencyAvailable ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Minimum Advance Notice */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Minimum Advance Notice Required
            </label>
            <select
              value={draft.formValues.minAdvanceNotice || '1-hour'}
              onChange={e => updateFormValue('minAdvanceNotice', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
            >
              <option value="immediate">Immediate / Same Hour Booking</option>
              <option value="1-hour">1 Hour Advance Notice</option>
              <option value="3-hours">3 Hours Advance Notice</option>
              <option value="12-hours">12 Hours (Half Day) Notice</option>
              <option value="1-day">1 Day Notice</option>
              <option value="2-days">2 Days Notice</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
