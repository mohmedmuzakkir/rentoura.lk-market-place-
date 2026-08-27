import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
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
  RotateCw, 
  ArrowLeft, 
  Plus, 
  Home, 
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

// ==========================================
// 1. REUSABLE EMPTY STATE COMPONENT
// ==========================================

export type EmptyStateVariant = 
  | 'no_listings'
  | 'no_users'
  | 'no_reports'
  | 'no_notifications'
  | 'no_messages'
  | 'no_reviews'
  | 'no_data'
  | 'no_search'
  | 'no_internet'
  | 'no_permissions'
  | 'no_data_yet'
  | 'general';

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: ReactNode;
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
  category?: 'rentals' | 'jobs' | 'services' | 'general' | 'admin';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'general',
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  compact = false,
  category = 'general',
  className = ''
}) => {
  // Preset defaults per variant matching Page 40 specification & reference image
  const getPreset = () => {
    switch (variant) {
      case 'no_listings':
        return {
          icon: <Search className="w-8 h-8 text-[#1464F4]" />,
          title: 'No Listings Found',
          description: 'There are no listings yet. Create a new listing to get started.',
          defaultAction: undefined
        };
      case 'no_users':
        return {
          icon: <Users className="w-8 h-8 text-[#1464F4]" />,
          title: 'No Users Found',
          description: 'No users match your search or filters.',
          defaultAction: undefined
        };
      case 'no_reports':
        return {
          icon: <Flag className="w-8 h-8 text-[#1464F4]" />,
          title: 'No Reports Found',
          description: 'No reports have been submitted. Great! Keep up the good work.',
          defaultAction: undefined
        };
      case 'no_notifications':
        return {
          icon: <Bell className="w-8 h-8 text-[#1464F4]" />,
          title: 'No Notifications',
          description: "You're all caught up! No new notifications.",
          defaultAction: undefined
        };
      case 'no_messages':
        return {
          icon: <MessageSquare className="w-8 h-8 text-[#1464F4]" />,
          title: 'No Messages',
          description: 'No messages in your inbox. When you get messages, they will appear here.',
          defaultAction: undefined
        };
      case 'no_reviews':
        return {
          icon: <Star className="w-8 h-8 text-amber-500" />,
          title: 'No Reviews Yet',
          description: 'No reviews available at the moment. Reviews will appear here once users leave feedback.',
          defaultAction: undefined
        };
      case 'no_data':
        return {
          icon: <PieChart className="w-8 h-8 text-[#1464F4]" />,
          title: 'No Data Available',
          description: 'There is no data to display for the selected period.',
          defaultAction: undefined
        };
      case 'no_search':
        return {
          icon: <Search className="w-8 h-8 text-[#1464F4]" />,
          title: 'No Search Results',
          description: "We couldn't find anything matching your search.",
          defaultAction: undefined
        };
      case 'no_internet':
        return {
          icon: <WifiOff className="w-8 h-8 text-rose-500" />,
          title: 'No Internet Connection',
          description: 'You are not connected to the internet. Please check your connection and try again.',
          defaultAction: { label: 'Try Again', onClick: () => window.location.reload() }
        };
      case 'no_permissions':
        return {
          icon: <Lock className="w-8 h-8 text-purple-600" />,
          title: 'No Permissions',
          description: "You don't have permission to access this page or perform this action.",
          defaultAction: { label: '← Go Back', onClick: () => window.history.back() }
        };
      case 'no_data_yet':
        return {
          icon: <Inbox className="w-8 h-8 text-emerald-600" />,
          title: 'No Data Yet',
          description: 'This section is empty. Data will appear here once available.',
          defaultAction: { label: 'Refresh', onClick: () => window.location.reload() }
        };
      default:
        return {
          icon: <Inbox className="w-8 h-8 text-[#1464F4]" />,
          title: 'Nothing Here Yet',
          description: 'No items are available in this view.',
          defaultAction: undefined
        };
    }
  };

  const preset = getPreset();
  const displayIcon = icon || preset.icon;
  const displayTitle = title || preset.title;
  const displayDescription = description || preset.description;
  const activePrimaryAction = primaryAction || preset.defaultAction;

  // Background icon circle color variant
  const getCircleBg = () => {
    if (variant === 'no_internet') return 'bg-rose-50 border-rose-100';
    if (variant === 'no_permissions') return 'bg-purple-50 border-purple-100';
    if (variant === 'no_data_yet') return 'bg-emerald-50 border-emerald-100';
    if (variant === 'no_reviews') return 'bg-amber-50 border-amber-100';
    if (category === 'jobs') return 'bg-emerald-50 border-emerald-100';
    if (category === 'services') return 'bg-orange-50 border-orange-100';
    return 'bg-blue-50 border-blue-100';
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-center shadow-xs transition-all ${
      compact ? 'py-8' : 'py-12'
    } ${className}`}>
      {/* Visual Circle Illustration */}
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 border shadow-2xs relative group transition-transform ${getCircleBg()}`}>
        {displayIcon}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300">
          <Sparkles className="w-2.5 h-2.5" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-1.5">
        {displayTitle}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed mb-5">
        {displayDescription}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {activePrimaryAction && (
          <button
            type="button"
            onClick={activePrimaryAction.onClick}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 ${
              variant === 'no_internet'
                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                : variant === 'no_permissions'
                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                : variant === 'no_data_yet'
                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                : 'bg-[#1464F4] hover:bg-blue-700 text-white'
            }`}
          >
            {activePrimaryAction.icon}
            <span>{activePrimaryAction.label}</span>
          </button>
        )}

        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-all"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 2. REUSABLE ERROR STATE COMPONENT
// ==========================================

export type ErrorStateVariant = 
  | 'something_went_wrong'
  | 'failed_to_load'
  | 'action_failed'
  | 'server_error'
  | '404'
  | 'session_expired';

export interface ErrorStateProps {
  variant?: ErrorStateVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'something_went_wrong',
  title,
  description,
  onRetry,
  retryLabel,
  secondaryAction,
  compact = false,
  className = ''
}) => {
  const getPreset = () => {
    switch (variant) {
      case 'something_went_wrong':
        return {
          icon: <AlertTriangle className="w-10 h-10 text-rose-600" />,
          title: 'Something Went Wrong',
          description: 'An unexpected error occurred. Please try again later.',
          actionLabel: retryLabel || 'Try Again',
          badgeBg: 'bg-rose-50 border-rose-100',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
      case 'failed_to_load':
        return {
          icon: <CloudOff className="w-10 h-10 text-rose-600" />,
          title: 'Failed to Load Data',
          description: "We couldn't load the data. Please try again.",
          actionLabel: retryLabel || 'Retry',
          badgeBg: 'bg-rose-50 border-rose-100',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
      case 'action_failed':
        return {
          icon: <XCircle className="w-10 h-10 text-rose-600" />,
          title: 'Action Failed',
          description: "We couldn't complete the action. Please try again.",
          actionLabel: retryLabel || 'Try Again',
          badgeBg: 'bg-rose-50 border-rose-100',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
      case 'server_error':
        return {
          icon: <Server className="w-10 h-10 text-rose-600" />,
          title: 'Server Error',
          description: 'Internal server error. Our team has been notified.',
          actionLabel: retryLabel || 'Go to Dashboard',
          badgeBg: 'bg-rose-50 border-rose-100',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
      case '404':
        return {
          icon: <HelpCircle className="w-10 h-10 text-rose-600" />,
          title: "Oops! The page you're looking for doesn't exist",
          description: 'or has been moved.',
          actionLabel: retryLabel || '← Back to Dashboard',
          badgeBg: 'bg-rose-50 border-rose-100',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
      case 'session_expired':
        return {
          icon: <Clock className="w-10 h-10 text-amber-600" />,
          title: 'Session Expired',
          description: 'Your session has expired for security reasons. Please login again to continue.',
          actionLabel: retryLabel || '→ Login Again',
          badgeBg: 'bg-amber-50 border-amber-100',
          btnBg: 'bg-amber-600 hover:bg-amber-700 text-white'
        };
      default:
        return {
          icon: <AlertTriangle className="w-10 h-10 text-rose-600" />,
          title: 'An Error Occurred',
          description: 'We encountered an error processing your request.',
          actionLabel: retryLabel || 'Try Again',
          badgeBg: 'bg-rose-50 border-rose-100',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
    }
  };

  const preset = getPreset();
  const displayTitle = title || preset.title;
  const displayDescription = description || preset.description;
  const btnText = retryLabel || preset.actionLabel;

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 p-6 text-center flex flex-col items-center justify-center shadow-xs transition-all ${
      compact ? 'py-8' : 'py-12'
    } ${className}`}>
      
      {/* Red / Warning Visual Circle */}
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 border shadow-2xs ${preset.badgeBg}`}>
        {preset.icon}
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-1.5">
        {displayTitle}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed mb-5">
        {displayDescription}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 ${preset.btnBg}`}
          >
            <RotateCw className="w-3.5 h-3.5 shrink-0" />
            <span>{btnText}</span>
          </button>
        )}

        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-all"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 3. PAGE 404 NOT FOUND PAGE / COMPONENT
// ==========================================

export interface Page404Props {
  onGoHome?: () => void;
  isAdmin?: boolean;
}

export const Page404: React.FC<Page404Props> = ({ onGoHome, isAdmin = false }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-8 text-center space-y-6">
        
        {/* Visual Browser Mockup with 404 */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="flex items-center gap-1.5 absolute top-3 left-4">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="pt-6">
            <div className="text-6xl font-black text-[#1464F4] tracking-tight">404</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Page Not Found</div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Oops! The page you're looking for doesn't exist
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
            The page you requested may have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onGoHome ? onGoHome() : (window.location.href = isAdmin ? '/admin/dashboard' : '/')}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isAdmin ? 'Back to Dashboard' : 'Back to Home'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. OFFLINE DETECTOR / STATE COMPONENT
// ==========================================

export const OfflineState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 max-w-md flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold">You are offline</div>
          <div className="text-[11px] text-slate-400">Previously loaded public content may remain available. Posting, messaging and account updates need an internet connection.</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setIsOnline(navigator.onLine);
          if (onRetry) onRetry();
        }}
        className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shrink-0"
      >
        Retry
      </button>
    </div>
  );
};


// ==========================================
// 5. SKELETON LOADING COMPONENTS
// ==========================================

export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-3xl border border-slate-200/80 p-4 space-y-3 animate-pulse">
    <div className="w-full h-44 bg-slate-100 rounded-2xl" />
    <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
    <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
    <div className="flex items-center justify-between pt-2">
      <div className="h-5 bg-slate-100 rounded-lg w-1/3" />
      <div className="h-8 bg-slate-100 rounded-xl w-20" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full space-y-3 animate-pulse p-4 bg-white rounded-3xl border border-slate-200">
    <div className="h-8 bg-slate-100 rounded-xl w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-12 bg-slate-50 rounded-xl w-full flex items-center gap-4 px-3">
        <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-1/6" />
      </div>
    ))}
  </div>
);

export const SkeletonDetail: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-6 bg-white rounded-3xl border border-slate-200">
    <div className="w-full h-72 bg-slate-100 rounded-3xl" />
    <div className="h-6 bg-slate-100 rounded-lg w-1/2" />
    <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
    <div className="space-y-2 pt-4">
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-5/6" />
      <div className="h-3 bg-slate-100 rounded w-4/6" />
    </div>
  </div>
);


// ==========================================
// 6. BUTTON SPINNER COMPONENT
// ==========================================

export const ButtonSpinner: React.FC<{ text?: string }> = ({ text = 'Processing...' }) => (
  <span className="inline-flex items-center gap-2">
    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
    <span>{text}</span>
  </span>
);


// ==========================================
// 7. GLOBAL REACT ERROR BOUNDARY CLASS
// ==========================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState = {
    hasError: false
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  setState(newState: Partial<ErrorBoundaryState>) {
    this.state = { ...this.state, ...newState };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RENTOURA.LK Error Boundary caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 max-w-lg mx-auto my-12">
          <ErrorState
            variant="something_went_wrong"
            title="Application Error"
            description="A rendering error occurred in this section. Click below to recover."
            onRetry={this.handleRetry}
            retryLabel="Reload Component"
          />
        </div>
      );
    }

    return this.props.children;
  }
}
