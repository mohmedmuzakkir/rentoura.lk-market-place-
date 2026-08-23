import React, { useState } from 'react';
import { X, Bell, MessageSquare, Tag, Briefcase, Wrench, Shield, Check, Sparkles } from 'lucide-react';
import { NotificationPreferences } from '../../types/notificationTypes';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: NotificationPreferences;
  onSavePreferences: (prefs: NotificationPreferences) => void;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences
}) => {
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>(preferences);
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const toggle = (key: keyof NotificationPreferences) => {
    setLocalPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSavePreferences(localPrefs);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 900);
  };

  const prefItems: {
    key: keyof NotificationPreferences;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    color: string;
  }[] = [
    {
      key: 'messages',
      title: 'Messages & Inquiries',
      description: 'Receive instant alerts when buyers, sellers, or employers message you.',
      icon: MessageSquare,
      color: 'text-[#1464F4] bg-blue-50'
    },
    {
      key: 'listingUpdates',
      title: 'Listing Status & Approvals',
      description: 'Stay updated when your rental listings are approved, reviewed, or expiring.',
      icon: Tag,
      color: 'text-[#FF650A] bg-orange-50'
    },
    {
      key: 'jobUpdates',
      title: 'Job Alerts & Application Updates',
      description: 'Get notified about job matches that match your preferences and employer replies.',
      icon: Briefcase,
      color: 'text-[#08A34F] bg-emerald-50'
    },
    {
      key: 'serviceUpdates',
      title: 'Service Inquiries & Reviews',
      description: 'Alerts when customers request services or leave reviews.',
      icon: Wrench,
      color: 'text-[#1464F4] bg-blue-50'
    },
    {
      key: 'promotions',
      title: 'Promotions & Featured Deals',
      description: 'Exclusive discounts, promotional boosts, and featured placement offers.',
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      key: 'systemAnnouncements',
      title: 'System & Security Alerts',
      description: 'Important platform policy updates, terms changes, and security notices.',
      icon: Shield,
      color: 'text-slate-700 bg-slate-100'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Notification Preferences
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Choose what notifications you want to receive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 tap-bounce"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preferences List */}
        <div className="overflow-y-auto py-3 space-y-3 no-scrollbar flex-1">
          {prefItems.map((item) => {
            const Icon = item.icon;
            const isChecked = localPrefs[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggle(item.key)}
                className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/70 border border-slate-100 transition-all cursor-pointer select-none"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <div className="shrink-0 mt-1">
                  <div
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      isChecked ? 'bg-[#1464F4]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                        isChecked ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors tap-bounce"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-colors flex items-center justify-center gap-1.5 tap-bounce"
          >
            {showSavedToast ? <Check className="w-4 h-4 text-emerald-300" /> : null}
            <span>{showSavedToast ? 'Preferences Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
