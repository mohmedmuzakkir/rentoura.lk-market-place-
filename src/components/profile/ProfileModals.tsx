import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Wallet, 
  Flag, 
  Lock, 
  HelpCircle, 
  Crown, 
  LogOut, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  ExternalLink,
  AlertTriangle,
  UploadCloud
} from 'lucide-react';
import { UserReviewItem, UserReportItem, UserProfile } from '../../types/profileTypes';

interface ProfileModalsProps {
  activeModal: string | null;
  onClose: () => void;
  profile: UserProfile;
  reviews: UserReviewItem[];
  reports: UserReportItem[];
  onConfirmLogout?: () => void;
  onUpdatePassword?: (oldPass: string, newPass: string) => boolean;
}

export const ProfileModals: React.FC<ProfileModalsProps> = ({
  activeModal,
  onClose,
  profile,
  reviews,
  reports,
  onConfirmLogout,
  onUpdatePassword
}) => {
  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Verification Request State
  const [nicNumber, setNicNumber] = useState('');
  const [idType, setIdType] = useState('NIC');
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  // Logout State
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  const handleConfirmLogoutClick = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setSignOutError('');
    try {
      if (onConfirmLogout) {
        await onConfirmLogout();
      }
      onClose();
    } catch (err: any) {
      setSignOutError(err.message || 'Failed to sign out. Please check your network connection and try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. REVIEWS MODAL */}
        {activeModal === 'reviews' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  My Reviews & Ratings
                </h3>
                <p className="text-xs text-slate-500">
                  {reviews.length} feedback from verified users
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center">
                <Star className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800">No Reviews Received Yet</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  When clients or renters leave reviews on your active listings, their feedback and ratings will appear here.
                </p>
              </div>
            ) : (
              <>
                {/* Rating Summary Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-4 flex items-center justify-around text-center">
                  <div>
                    <div className="text-2xl font-black text-slate-900 font-heading">
                      {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center text-amber-400 gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Average Score</div>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <div>
                    <div className="text-2xl font-black text-slate-900 font-heading">{reviews.length}</div>
                    <div className="text-xs font-bold text-emerald-600 mt-0.5">Total Reviews</div>
                    <div className="text-[10px] text-slate-500 mt-1">Received</div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-[#1464F4] flex items-center justify-center text-xs font-bold">
                            {rev.reviewerName[0]}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{rev.reviewerName}</span>
                        </div>
                        <div className="flex items-center text-amber-400 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[180px] text-slate-500 font-medium">Re: {rev.listingTitle}</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 2. VERIFICATION MODAL */}
        {activeModal === 'verification' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#08A34F] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Identity Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Account trust verification
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-extrabold text-slate-900 font-heading">Verification System Coming Soon</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                The identity verification badge workflow for NIC and Passport validation will be enabled in an upcoming release.
              </p>
            </div>
          </div>
        )}

        {/* 3. PAYMENTS & ADS MODAL */}
        {activeModal === 'payments' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Payments & Promotions
                </h3>
                <p className="text-xs text-slate-500">
                  Manage listing boosts & ad placements
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Active Promotions
              </div>
              <p className="text-xs text-slate-600 mt-2">
                No active listing promotions or paid ad boosts currently running on your account.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
              <strong className="font-bold">Paid Ad Promotions Coming Soon:</strong> Featured listing highlights and priority placements across Sri Lanka will be available in the upcoming billing module.
            </div>
          </div>
        )}

        {/* 4. REPORTS MODAL */}
        {activeModal === 'reports' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  My Reports & Inquiries
                </h3>
                <p className="text-xs text-slate-500">
                  Track safety flags submitted by you
                </p>
              </div>
            </div>

            {reports.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                You haven't reported any suspicious listings.
              </p>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                        {rep.targetListingTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">
                      <strong className="text-slate-800">Reason:</strong> {rep.reason}
                    </p>
                    {rep.resolutionNote && (
                      <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600">
                        <strong className="text-[#1464F4]">Resolution:</strong> {rep.resolutionNote}
                      </div>
                    )}
                    <div className="mt-2 text-[10px] text-slate-400 text-right">
                      {rep.submittedDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. SECURITY MODAL */}
        {activeModal === 'security' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Account Security
                </h3>
                <p className="text-xs text-slate-500">
                  Update password & authentication
                </p>
              </div>
            </div>

            {passwordSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#08A34F] mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-900">Password Updated Successfully</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Your new password is now active for future logins.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPassword || newPassword.length < 6) {
                    setPasswordError('New password must be at least 6 characters.');
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setPasswordError('Passwords do not match.');
                    return;
                  }
                  setPasswordError('');
                  if (onUpdatePassword) {
                    onUpdatePassword(oldPassword, newPassword);
                  }
                  setPasswordSuccess(true);
                }}
                className="space-y-3"
              >
                {passwordError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1464F4] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1464F4] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1464F4] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1464F4] text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        )}

        {/* 6. HELP & SUPPORT MODAL */}
        {activeModal === 'help' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  Help & Support
                </h3>
                <p className="text-xs text-slate-500">
                  Sri Lanka 24/7 customer service
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="tel:+94112345678"
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3 transition-colors text-left block"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF650A] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Helpline Phone</div>
                  <div className="text-xs font-mono text-slate-600 mt-0.5">+94 11 234 5678 (24 Hours)</div>
                </div>
              </a>

              <a
                href="mailto:support@rentoura.lk"
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3 transition-colors text-left block"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1464F4] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Email Support</div>
                  <div className="text-xs font-mono text-slate-600 mt-0.5">support@rentoura.lk</div>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* 8. LOGOUT MODAL */}
        {activeModal === 'logout' && (
          <div>
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <LogOut className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Log Out of Account?
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Are you sure you want to sign out of your RENTOURA.LK session on this device?
              </p>

              {signOutError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2 text-left">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{signOutError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={onClose}
                  disabled={isSigningOut}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Stay Logged In
                </button>
                <button
                  onClick={handleConfirmLogoutClick}
                  disabled={isSigningOut}
                  className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSigningOut ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing out...</span>
                    </>
                  ) : (
                    <span>Log Out</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
