import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Tag, 
  User, 
  FileText, 
  Image as ImageIcon, 
  History, 
  AlertTriangle, 
  ExternalLink, 
  Check, 
  Send, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Briefcase, 
  Wrench, 
  Calendar, 
  Phone, 
  Mail, 
  Award, 
  Info, 
  DollarSign, 
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';
import { StaffAccount } from '../../types/adminTypes';
import { UserListingItem } from '../../types/profileTypes';
import { ProfileService } from '../../services/profileService';
import { AdminService } from '../../services/adminService';
import { ReportService } from '../../services/reportService';

interface AdminListingReviewProps {
  listingId: string;
  staff: StaffAccount;
  onBackToQueue: () => void;
  onNavigateToListing: (listingId: string) => void;
  onRefresh: () => void;
}

export const AdminListingReview: React.FC<AdminListingReviewProps> = ({
  listingId,
  staff,
  onBackToQueue,
  onNavigateToListing,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'location' | 'user' | 'history' | 'reports'>('details');
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
  // Action Modals State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestChangesModalOpen, setRequestChangesModalOpen] = useState(false);
  const [requestChangesNote, setRequestChangesNote] = useState('');
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Single Source of Truth
  const allListings = ProfileService.getUserListings();
  const allReports = ReportService.getReports();
  const auditLogs = AdminService.getAuditLogs();

  const listing = allListings.find(l => l.id === listingId);

  // Pending Queue for Prev/Next switcher
  const pendingQueue = allListings.filter(l => l.status === 'pending');
  const currentIndex = pendingQueue.findIndex(l => l.id === listingId);
  const totalPending = pendingQueue.length;

  if (!listing) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 my-8">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Listing Not Found</h2>
        <p className="text-xs text-slate-500">The requested listing (ID: {listingId}) could not be located in the system.</p>
        <button
          onClick={onBackToQueue}
          className="px-5 py-2.5 bg-[#1464F4] text-white font-bold text-xs rounded-xl shadow-md"
        >
          Back to Moderation Queue
        </button>
      </div>
    );
  }

  // Reports associated with this listing
  const listingReports = allReports.filter(r => r.targetId === listing.id);

  // Audit logs associated with this listing
  const listingHistory = auditLogs.filter(a => a.targetId === listing.id);

  // Similar active listings in same category for pricing/anti-spam comparison
  const similarActiveListings = allListings.filter(l => 
    l.id !== listing.id && 
    l.status === 'active' && 
    (l.category === listing.category || l.module === listing.module)
  ).slice(0, 3);

  // Dummy gallery photos based on module
  const galleryPhotos = [
    listing.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
  ];

  // Action Handlers
  const handleApproveSubmit = () => {
    const res = AdminService.approveListing(listing.id, staff);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: 'Listing approved & published to active marketplace!' });
      setApproveConfirmOpen(false);
      onRefresh();
      setTimeout(() => {
        onBackToQueue();
      }, 1500);
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'Failed to approve listing.' });
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;

    const res = AdminService.rejectListing(listing.id, rejectionReason.trim(), staff);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: 'Listing rejected. Notification sent to owner.' });
      setRejectModalOpen(false);
      onRefresh();
      setTimeout(() => {
        onBackToQueue();
      }, 1500);
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'Failed to reject listing.' });
    }
  };

  const handleRequestChangesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestChangesNote.trim()) return;

    const res = AdminService.requestListingChanges(listing.id, requestChangesNote.trim(), staff);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: 'Changes requested. Instructions sent to owner.' });
      setRequestChangesModalOpen(false);
      onRefresh();
      setTimeout(() => {
        onBackToQueue();
      }, 1500);
    } else {
      setFeedbackMessage({ type: 'error', text: res.error || 'Failed to request changes.' });
    }
  };

  return (
    <div className="space-y-6">

      {/* Alert Feedback Toast */}
      {feedbackMessage && (
        <div className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between animate-fadeIn ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="text-xs font-bold">{feedbackMessage.text}</p>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER BAR (PAGE 35) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToQueue}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Queue</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Listing Review Workspace</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                ID: {listing.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Review all details carefully before taking approval or moderation action.
            </p>
          </div>
        </div>

        {/* Queue Prev/Next Switcher */}
        {totalPending > 0 && currentIndex !== -1 && (
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold self-start md:self-auto">
            <button
              type="button"
              disabled={currentIndex <= 0}
              onClick={() => onNavigateToListing(pendingQueue[currentIndex - 1].id)}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-slate-600 font-mono">
              {currentIndex + 1} of {totalPending} Pending
            </span>

            <button
              type="button"
              disabled={currentIndex >= totalPending - 1}
              onClick={() => onNavigateToListing(pendingQueue[currentIndex + 1].id)}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* HERO LISTING CARD (PAGE 35 REFERENCE IMAGE) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-6">
          
          {/* Main Photo Preview */}
          <div className="w-full lg:w-72 h-52 lg:h-auto rounded-2xl bg-slate-100 overflow-hidden relative shrink-0">
            <img 
              src={galleryPhotos[selectedPhotoIndex]} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo {selectedPhotoIndex + 1} of {galleryPhotos.length}</span>
            </div>

            <div className="absolute top-3 left-3 flex items-center gap-2">
              {listing.module === 'rentals' && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-[#1464F4] text-white shadow-sm">
                  RENTAL
                </span>
              )}
              {listing.module === 'jobs' && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-emerald-600 text-white shadow-sm">
                  JOB
                </span>
              )}
              {listing.module === 'services' && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-amber-600 text-white shadow-sm">
                  SERVICE
                </span>
              )}
            </div>
          </div>

          {/* Hero Details Content */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1464F4] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {listing.category}
                  </span>
                  {listing.subcategory && (
                    <span className="text-slate-500 font-semibold">› {listing.subcategory}</span>
                  )}
                </div>

                <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  Status: {listing.status === 'pending' ? 'Pending Moderation Review' : listing.status.toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {listing.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-[#1464F4]" />
                  <span className="font-semibold text-slate-800">{listing.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-[#1464F4]">{listing.price}</span>
                  {listing.pricePeriod && (
                    <span className="text-slate-500 font-semibold">{listing.pricePeriod}</span>
                  )}
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Negotiable
                  </span>
                </div>
              </div>

              {/* Contextual Specs Bar */}
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                {listing.module === 'rentals' && (
                  <>
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-[#1464F4]" /> 3 Bedrooms</span>
                    <span>•</span>
                    <span>2 Bathrooms</span>
                    <span>•</span>
                    <span>1,500 sqft</span>
                    <span>•</span>
                    <span className="text-emerald-600">✓ Parking Available</span>
                  </>
                )}
                {listing.module === 'jobs' && (
                  <>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Full Time</span>
                    <span>•</span>
                    <span>On-site</span>
                    <span>•</span>
                    <span>3 Vacancies</span>
                    <span>•</span>
                    <span className="text-emerald-600">✓ Degree Required</span>
                  </>
                )}
                {listing.module === 'services' && (
                  <>
                    <span className="flex items-center gap-1"><Wrench className="w-3.5 h-3.5 text-amber-600" /> Emergency Service</span>
                    <span>•</span>
                    <span>Advance Booking</span>
                    <span>•</span>
                    <span>5+ Yrs Experience</span>
                  </>
                )}
              </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Submitted By</span>
                <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  {listing.companyName || listing.providerName || 'Kasun Kalhara'}
                  <span className="text-emerald-600 text-[10px] font-black">✓</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Submitted Date</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{listing.postedDate}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Listing Category</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{listing.category}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Listing Type</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{listing.subcategory || 'Standard'}</span>
              </div>
            </div>

          </div>

        </div>

        {/* REVIEW TABS BAR (PAGE 35 REFERENCE IMAGE) */}
        <div className="px-6 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-600">
          
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'details' ? 'border-[#1464F4] text-[#1464F4]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Listing Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'photos' ? 'border-[#1464F4] text-[#1464F4]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photos ({galleryPhotos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('location')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'location' ? 'border-[#1464F4] text-[#1464F4]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Location & Map</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('user')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'user' ? 'border-[#1464F4] text-[#1464F4]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>User Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'history' ? 'border-[#1464F4] text-[#1464F4]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History ({listingHistory.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reports' ? 'border-rose-600 text-rose-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Reports ({listingReports.length})</span>
          </button>

        </div>

      </div>

      {/* TWO COLUMN CONTENT AREA (DETAILS / CHECKLIST SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT 2 COLS - TAB CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB 1: LISTING DETAILS */}
          {activeTab === 'details' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              
              {/* Description */}
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Description</h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                  {listing.description || 'No detailed description was provided by the user for this listing.'}
                </div>
              </div>

              {/* Amenities & Features */}
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">Amenities & Features</h3>
                <div className="flex flex-wrap gap-2">
                  {['Furnished', 'Air Conditioning', 'WiFi Included', 'Modern Kitchen', 'Vehicle Parking', 'Garden Area', 'Hot Water', 'Balcony', 'Backup Generator', '24/7 Security'].map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200/80 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Category-Aware Specifications Grid */}
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">Specifications Grid</h3>
                <div className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-200/80 text-xs">
                  
                  {listing.module === 'rentals' && (
                    <>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Property Type</span>
                        <span className="font-bold text-slate-900">{listing.subcategory || 'Residential House'}</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Rental Period</span>
                        <span className="font-bold text-slate-900">{listing.pricePeriod || 'Monthly'}</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Security Deposit</span>
                        <span className="font-bold text-slate-900">2 Months Rent (Rs. 240,000)</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Minimum Stay</span>
                        <span className="font-bold text-slate-900">6 Months</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Available From</span>
                        <span className="font-bold text-slate-900">Immediately</span>
                      </div>
                    </>
                  )}

                  {listing.module === 'jobs' && (
                    <>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Company Name</span>
                        <span className="font-bold text-slate-900">{listing.companyName || 'Registered Employer'}</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Employment Type</span>
                        <span className="font-bold text-slate-900">Full Time</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Work Mode</span>
                        <span className="font-bold text-slate-900">On-site (Office)</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Vacancies</span>
                        <span className="font-bold text-slate-900">3 Open Positions</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Experience Required</span>
                        <span className="font-bold text-slate-900">2 - 4 Years</span>
                      </div>
                    </>
                  )}

                  {listing.module === 'services' && (
                    <>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Provider Name</span>
                        <span className="font-bold text-slate-900">{listing.providerName || 'Certified Technician'}</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Service Area</span>
                        <span className="font-bold text-slate-900">{listing.location}</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Emergency Service</span>
                        <span className="font-bold text-emerald-600">✓ 24/7 Available</span>
                      </div>
                      <div className="p-3.5 grid grid-cols-2">
                        <span className="font-bold text-slate-500">Warranty Provided</span>
                        <span className="font-bold text-slate-900">6 Months Service Guarantee</span>
                      </div>
                    </>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Photo Gallery ({galleryPhotos.length})</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryPhotos.map((url, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`h-40 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedPhotoIndex === idx ? 'border-[#1464F4] ring-2 ring-[#1464F4]/20' : 'border-transparent hover:opacity-90'
                    }`}
                  >
                    <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LOCATION & MAP */}
          {activeTab === 'location' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Location & Address Verification</h3>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <MapPin className="w-4 h-4 text-[#1464F4]" />
                  <span>Address: {listing.location}</span>
                </div>
                <p className="text-slate-500 font-medium">District: Kandy • Province: Central Province • Postal Code: 20000</p>
              </div>

              <div className="h-64 rounded-2xl bg-slate-100 border border-slate-200 relative flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
                  alt="Map Location" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                  <div className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xl flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1464F4]" />
                    <span>Location Verified: {listing.location}</span>
                  </div>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          )}

          {/* TAB 4: USER INFORMATION */}
          {activeTab === 'user' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Listing Owner Information</h3>
              
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" alt="Owner" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Kasun Kalhara
                    <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded font-extrabold border border-emerald-200">
                      ✓ Verified Account
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">kasun.kalhara@gmail.com • +94 77 123 4567</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">Member since Feb 2025 • Account Type: Individual</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Listing Event Trail</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Listing Created & Submitted</span>
                    <p className="text-slate-500">Owner submitted listing for moderation approval.</p>
                  </div>
                  <span className="font-mono text-slate-400">{listing.postedDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Community Reports</h3>
              
              {listingReports.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No community reports found for this listing. It looks completely safe!</span>
                </div>
              ) : (
                listingReports.map(rep => (
                  <div key={rep.id} className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs space-y-1">
                    <span className="font-bold text-rose-900">Report Reason: {rep.reasonLabel}</span>
                    <p className="text-rose-700">Submitted by community member on {rep.createdAt}</p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* RIGHT 1 COL - VERIFICATION CHECKLIST & ACTION PANEL */}
        <div className="space-y-6">

          {/* VERIFICATION CHECKLIST CARD */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-5 h-5 text-[#1464F4]" />
              <h3 className="text-sm font-black text-slate-900">Verification Checklist</h3>
            </div>

            <ul className="space-y-2.5 text-xs">
              {[
                'Title & Headline',
                'Detailed Description',
                'Price & Currency (LKR)',
                'Location & Address',
                'Photo Quality & Authenticity',
                'Owner Contact Phone (+94)',
                'Category & Subcategory Match',
                'Terms & Safety Compliance'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60 font-semibold text-slate-700">
                  <span>{item}</span>
                  <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Looks Good
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* SIMILAR ACTIVE LISTINGS COMPARISON */}
          {similarActiveListings.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Similar Active Listings
              </h3>

              <div className="space-y-3">
                {similarActiveListings.map(sim => (
                  <div key={sim.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                    <img src={sim.imageUrl} alt={sim.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{sim.title}</h4>
                      <p className="text-[11px] font-black text-[#1464F4]">{sim.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* BOTTOM ACTION PANEL (PAGE 35) */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">Take Moderation Action</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Staff: {staff.fullName}</span>
        </div>

        {/* Optional Moderator Internal Notes */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Moderator Internal Notes (Optional)
          </label>
          <input
            type="text"
            value={moderatorNotes}
            onChange={(e) => setModeratorNotes(e.target.value)}
            placeholder="Add internal notes about this review for staff audit logs..."
            className="w-full p-3 bg-slate-800 border border-slate-700 text-xs text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
          />
        </div>

        {/* MAIN ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          
          <button
            type="button"
            onClick={() => setApproveConfirmOpen(true)}
            className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Approve & Publish Listing</span>
          </button>

          <button
            type="button"
            onClick={() => { setRequestChangesModalOpen(true); setRequestChangesNote(''); }}
            className="py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Request Changes</span>
          </button>

          <button
            type="button"
            onClick={() => { setRejectModalOpen(true); setRejectionReason(''); }}
            className="py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            <span>Reject Listing</span>
          </button>

        </div>

      </div>

      {/* APPROVE CONFIRMATION MODAL */}
      {approveConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Confirm Approval & Publish</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Are you sure you want to approve “<span className="font-bold text-slate-900">{listing.title}</span>”? It will immediately become active on the public marketplace.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApproveConfirmOpen(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApproveSubmit}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Approve & Go Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL WITH MANDATORY REASON */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleRejectSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Reject Listing</h3>
                  <p className="text-xs text-slate-500 font-medium">Rejection reason is mandatory for owner notification</p>
                </div>
              </div>
              <button type="button" onClick={() => setRejectModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Rejection Reason <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State clearly why this listing was rejected (e.g. safety clearance certificate missing, invalid contact details)..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!rejectionReason.trim()}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit Rejection</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REQUEST CHANGES MODAL */}
      {requestChangesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <form onSubmit={handleRequestChangesSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Request Changes</h3>
                  <p className="text-xs text-slate-500 font-medium">Send instructions to owner to edit and resubmit</p>
                </div>
              </div>
              <button type="button" onClick={() => setRequestChangesModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Feedback Instructions <span className="text-blue-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={requestChangesNote}
                onChange={(e) => setRequestChangesNote(e.target.value)}
                placeholder="Specify what changes are needed (e.g. please upload higher resolution photos, fix title spelling)..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRequestChangesModalOpen(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!requestChangesNote.trim()}
                className="w-1/2 py-2.5 bg-[#1464F4] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send Instructions</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
