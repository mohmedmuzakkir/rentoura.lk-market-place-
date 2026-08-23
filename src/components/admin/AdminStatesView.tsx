import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Flag, 
  Bell, 
  MessageSquare, 
  Star, 
  PieChart, 
  WifiOff, 
  Lock, 
  Inbox, 
  AlertTriangle, 
  CloudOff, 
  XCircle, 
  Server, 
  Clock, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles, 
  RotateCw, 
  ArrowLeft, 
  Plus, 
  SlidersHorizontal, 
  RefreshCw,
  FolderTree,
  FileText,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { StaffAccount } from '../../types/adminTypes';
import { EmptyState, ErrorState } from '../common/StateComponents';

interface AdminStatesViewProps {
  staff: StaffAccount;
  onNavigateSection?: (section: string) => void;
}

export const AdminStatesView: React.FC<AdminStatesViewProps> = ({ staff, onNavigateSection }) => {
  const [interactiveToast, setInteractiveToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setInteractiveToast(msg);
    setTimeout(() => setInteractiveToast(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      
      {/* Toast Feedback Banner */}
      {interactiveToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1464F4] text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 animate-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{interactiveToast}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Inbox className="w-6 h-6 text-[#1464F4]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Empty & Error States</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Consistent empty and error states across the admin panel.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <span className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-xs border border-slate-200">
            Page 40/40
          </span>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SECTION 1: EMPTY STATES                                   */}
      {/* ========================================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-[#1464F4] rounded-full" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Empty States
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. No Listings Found */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs hover:border-blue-300 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-[#1464F4]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Listings Found
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                There are no listings yet. Create a new listing to get started.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection ? onNavigateSection('all-listings') : triggerToast('Action: Add Listing triggered')}
              className="px-5 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Listing</span>
            </button>
          </div>

          {/* 2. No Users Found */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs hover:border-blue-300 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#1464F4]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Users Found
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                No users match your search or filters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection ? onNavigateSection('all-users') : triggerToast('Navigating to All Users')}
              className="px-5 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              View All Users
            </button>
          </div>

          {/* 3. No Reports Found */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs hover:border-blue-300 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <Flag className="w-8 h-8 text-[#1464F4]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Reports Found
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                No reports have been submitted. Great! Keep up the good work.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection ? onNavigateSection('reports') : triggerToast('Navigating to Reports')}
              className="px-5 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              View All Reports
            </button>
          </div>

          {/* 4. No Notifications */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs hover:border-blue-300 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-[#1464F4]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Notifications
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                You're all caught up! No new notifications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('All notifications loaded')}
              className="px-5 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              View All Notifications
            </button>
          </div>

          {/* 5. No Messages */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs hover:border-blue-300 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-[#1464F4]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Messages
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                No messages in your inbox. When you get messages, they will appear here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Navigating to Inbox')}
              className="px-5 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              Go to Inbox
            </button>
          </div>

          {/* 6. No Reviews Yet */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs hover:border-blue-300 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Reviews Yet
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                No reviews available at the moment. Reviews will appear here once users leave feedback.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection ? onNavigateSection('reviews') : triggerToast('Navigating to Reviews')}
              className="px-5 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              View Reviews
            </button>
          </div>

          {/* 7. No Data Available */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs hover:border-blue-300 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <PieChart className="w-8 h-8 text-[#1464F4]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Data Available
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                There is no data to display for the selected period.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Filters reset')}
              className="px-5 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              Change Filters
            </button>
          </div>

          {/* 8. No Search Results */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs hover:border-blue-300 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-[#1464F4]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Search Results
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                We couldn't find anything matching your search.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Search query cleared')}
              className="px-5 py-2.5 rounded-2xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              Clear Search
            </button>
          </div>

          {/* 9. No Internet Connection */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs transition-all">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
              <WifiOff className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Internet Connection
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                You are not connected to the internet. Please check your connection and try again.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Testing network connection...')}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-all flex items-center gap-2"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Try Again</span>
            </button>
          </div>

          {/* 10. No Permissions */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs transition-all">
            <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Permissions
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                You don't have permission to access this page or perform this action.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Returning to previous view')}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-all"
            >
              ← Go Back
            </button>
          </div>

          {/* 11. No Data Yet */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs transition-all">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                No Data Yet
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                This section is empty. Data will appear here once available.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Data reloaded')}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Refresh</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================== */}
      {/* SECTION 2: ERROR STATES                                   */}
      {/* ========================================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-rose-600 rounded-full" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Error States
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Something Went Wrong */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                Something Went Wrong
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                An unexpected error occurred. Please try again later.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Retrying operation...')}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>

          {/* 2. Failed to Load Data */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
              <CloudOff className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                Failed to Load Data
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                We couldn't load the data. Please try again.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Refetching query...')}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>

          {/* 3. Action Failed */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                Action Failed
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                We couldn't complete the action. Please try again.
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerToast('Retrying action...')}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>

          {/* 4. Server Error */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-between shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
              <Server className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mb-1.5">
                Server Error
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
                Internal server error. Our team has been notified.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateSection ? onNavigateSection('overview') : triggerToast('Navigating to Dashboard')}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              Go to Dashboard
            </button>
          </div>

        </div>

        {/* 404 & SESSION EXPIRED WIDE BANNERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          
          {/* 404 Card Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
            <div className="w-32 h-20 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
              <div className="flex items-center gap-1 absolute top-2 left-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-2xl font-black text-[#1464F4]">404</span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Oops! The page you're looking for doesn't exist or has been moved.
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Verify the address or navigate back to safety.
              </p>
              <button
                type="button"
                onClick={() => onNavigateSection ? onNavigateSection('overview') : triggerToast('Navigating to Dashboard')}
                className="mt-3 px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                <span>← Back to Dashboard</span>
              </button>
            </div>
          </div>

          {/* Session Expired Card Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Session Expired
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                Your session has expired for security reasons. Please login again to continue.
              </p>
              <button
                type="button"
                onClick={() => triggerToast('Redirecting to Admin Login...')}
                className="mt-3 px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                <span>→ Login Again</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================== */}
      {/* SECTION 3: BEST PRACTICES & HELPFUL TIP CARDS             */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* BEST PRACTICES (2 COLS) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 rounded-3xl border border-blue-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-3 max-w-md">
            <h3 className="font-black text-xs uppercase tracking-wider text-[#1464F4]">
              Best Practices
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-800 font-semibold">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1464F4] shrink-0" />
                <span>Use clear and friendly messages.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1464F4] shrink-0" />
                <span>Provide helpful actions for users.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1464F4] shrink-0" />
                <span>Keep illustrations consistent.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1464F4] shrink-0" />
                <span>Maintain positive and professional tone.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1464F4] shrink-0" />
                <span>Guide users to the next best step.</span>
              </li>
            </ul>
          </div>

          {/* Visual Sofa Illustration graphic */}
          <div className="w-48 h-36 bg-white/80 rounded-2xl border border-blue-100 p-4 flex flex-col items-center justify-center text-center shadow-2xs shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1464F4] flex items-center justify-center mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-bold text-slate-800">RENTOURA.LK</div>
            <div className="text-[10px] text-slate-500 font-medium">UX Design Resilience</div>
          </div>
        </div>

        {/* HELPFUL TIP (1 COL) */}
        <div className="bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 flex flex-col justify-between shadow-xs space-y-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1464F4] flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 mb-2">
              Helpful Tip
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Good empty and error states help users understand what's happening and what they can do next. This creates a better user experience and reduces confusion.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#1464F4]">
            <span>Admin UX Standard</span>
            <span>v1.0.0</span>
          </div>
        </div>

      </div>

      {/* FOOTER ACKNOWLEDGMENT */}
      <div className="text-center text-xs text-slate-400 font-medium pt-4">
        © 2025 RENTOURA.LK. All rights reserved. • System Resilience Module
      </div>

    </div>
  );
};
