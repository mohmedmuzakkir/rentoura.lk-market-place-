import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2,
  Server
} from 'lucide-react';
import { AppRoute } from '../../types';
import { AuthService } from '../../services/authService';
import { isStaff, isActiveAccount } from '../../utils/roleUtils';
import { RentouraLogo } from '../../components/RentouraLogo';

interface AdminLoginPageProps {
  onNavigate: (route: AppRoute) => void;
  onSuccess?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onNavigate,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Exclude staff gateway from search indexing
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
      created = true;
    }
    const prevContent = metaRobots.getAttribute('content');
    metaRobots.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (created) {
        metaRobots?.remove();
      } else if (prevContent) {
        metaRobots?.setAttribute('content', prevContent);
      } else {
        metaRobots?.removeAttribute('content');
      }
    };
  }, []);

  // Forgot Password Mode within Staff Portal
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your staff email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Authenticate with Supabase Auth
      const { user, profile } = await AuthService.login(email.trim(), password, rememberMe);

      if (!user || !profile) {
        throw new Error('Authentication failed. Please verify your credentials.');
      }

      // 2. Server-Authoritative Role & Account Status Verification
      if (!isStaff(profile)) {
        // Immediately sign out non-staff user to prevent unprivileged session creation
        await AuthService.logout();
        throw new Error('Access denied. This account does not possess staff or moderator privileges.');
      }

      if (!isActiveAccount(profile.accountStatus)) {
        await AuthService.logout();
        throw new Error(`Staff access denied. Account status is '${profile.accountStatus || 'inactive'}'.`);
      }

      setSuccessMsg('Staff credentials verified. Access granted.');
      
      // Delay briefly for user feedback before navigation
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onNavigate('/admin');
        }
      }, 500);

    } catch (err: any) {
      console.warn('[StaffGateway] Auth attempt failed:', err?.message);
      setErrorMsg(err?.message || 'Invalid staff credentials or unauthorized account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your staff email address.');
      return;
    }

    setIsForgotSubmitting(true);
    setErrorMsg(null);

    try {
      await AuthService.sendPasswordReset(forgotEmail.trim());
      setForgotSuccess(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send reset link. Please check the email provided.');
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#041C43] text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Background Decorative Atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1464F4]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Staff Gateway Banner Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Marketplace</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <RentouraLogo variant="header" theme="dark" className="scale-90" />
          <span className="px-2.5 py-1 rounded-md bg-[#1464F4]/20 border border-[#1464F4]/40 text-[#00C2FF] text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
            Staff Portal
          </span>
        </div>
      </header>

      {/* Main Staff Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 py-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative space-y-6">
          
          {/* Header Shield Branding */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1464F4] to-cyan-500 p-0.5 mx-auto shadow-lg shadow-blue-500/25">
              <div className="w-full h-full bg-[#041C43] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-[#00C2FF]" />
              </div>
            </div>

            <h1 className="text-xl font-black tracking-tight font-heading text-white">
              Staff & Management Gateway
            </h1>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
              Authorized access point for RENTOURA.LK moderation, review, and platform operations.
            </p>
          </div>

          {/* Forgot Password Mode View */}
          {isForgotMode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                  Staff Password Recovery
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setErrorMsg(null);
                  }}
                  className="text-xs text-[#00C2FF] hover:underline font-bold"
                >
                  Back to Sign In
                </button>
              </div>

              {forgotSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-bold">Recovery Email Sent</p>
                  <p className="text-emerald-300/80 text-[11px] leading-relaxed">
                    If <span className="font-bold text-white">{forgotEmail}</span> matches an active staff account, password recovery instructions have been dispatched.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setForgotSuccess(false);
                      setErrorMsg(null);
                    }}
                    className="mt-2 w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleStaffPasswordReset} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                      Staff Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="staff@rentoura.lk"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1464F4]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isForgotSubmitting}
                    className="w-full py-3 bg-[#1464F4] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    {isForgotSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>Send Password Recovery Link</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Standard Staff Login Form */
            <form onSubmit={handleStaffLogin} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <div className="font-bold">{successMsg}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                  Staff Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@rentoura.lk"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1464F4] transition-all"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-300">
                    Staff Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setErrorMsg(null);
                    }}
                    className="text-[11px] font-bold text-[#00C2FF] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1464F4] transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-[#1464F4] focus:ring-0 cursor-pointer"
                  />
                  <span>Keep staff session active</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1464F4] hover:bg-blue-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 tap-bounce"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate Staff Credentials</span>
                  </>
                )}
              </button>

            </form>
          )}

          {/* Security Disclaimer Box */}
          <div className="pt-4 border-t border-slate-800/80 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold">
              <Server className="w-3 h-3 text-[#1464F4]" />
              <span>Server-Authoritative RBAC Security</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Unauthorized access attempts are monitored and recorded. Access restricted strictly to authorized RENTOURA personnel.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-[11px] text-slate-500 font-medium border-t border-slate-800/60 bg-slate-900/20">
        © {new Date().getFullYear()} RENTOURA.LK — Internal Staff & Operations Portal
      </footer>

    </div>
  );
};
