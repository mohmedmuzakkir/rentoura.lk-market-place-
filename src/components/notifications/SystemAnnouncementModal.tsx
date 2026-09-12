import React from 'react';
import { X, Megaphone } from 'lucide-react';
import { AppNotification } from '../../types/notificationTypes';

interface SystemAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: AppNotification | null;
}

export const SystemAnnouncementModal: React.FC<SystemAnnouncementModalProps> = ({
  isOpen,
  onClose,
  notification
}) => {
  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#1464F4] flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {notification.title.replace('📢 ', '')}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {notification.createdAt}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 tap-bounce"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 overflow-y-auto no-scrollbar text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
          {notification.body}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors tap-bounce"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
