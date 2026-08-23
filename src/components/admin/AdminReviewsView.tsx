import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  Trash2, 
  Filter, 
  MessageSquare, 
  X 
} from 'lucide-react';
import { ReviewService } from '../../services/reviewService';
import { StaffAccount } from '../../types/adminTypes';
import { AdminService } from '../../services/adminService';
import { CanonicalReview } from '../../types/reviewTypes';

interface AdminReviewsViewProps {
  staff: StaffAccount;
  onRefresh: () => void;
}

export const AdminReviewsView: React.FC<AdminReviewsViewProps> = ({ staff, onRefresh }) => {
  const [reviews, setReviews] = useState<CanonicalReview[]>(() => ReviewService.getAllReviews());
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const refreshReviews = () => {
    setReviews(ReviewService.getAllReviews());
    onRefresh();
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Delete this review permanently?')) {
      AdminService.deleteReview(reviewId, staff);
      refreshReviews();
    }
  };

  const filteredReviews = reviews.filter(rev => {
    const matchesQuery = !searchQuery.trim() ||
      rev.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.targetTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.body.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = ratingFilter === 'all' || Math.round(rev.overallRating).toString() === ratingFilter;

    return matchesQuery && matchesRating;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            <span>Marketplace Reviews & Feedback</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Monitor ratings and user comments across Rentals, Jobs, and Services. Moderate inappropriate feedback.
          </p>
        </div>

        <div className="bg-amber-50 text-amber-800 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-amber-200">
          Total Reviews: {reviews.length}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reviewer, title, comment..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1464F4]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-500">Rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Reviewer</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Listing Title</th>
                <th className="py-3.5 px-4">Comment</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No reviews found matching search filters.
                  </td>
                </tr>
              ) : (
                filteredReviews.map(rev => (
                  <tr key={rev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                          alt={rev.authorName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <span className="font-bold text-slate-900">{rev.authorName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-black">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{rev.overallRating}.0</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                      {rev.targetTitle}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-md">
                      "{rev.body}"
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {rev.createdAt}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
