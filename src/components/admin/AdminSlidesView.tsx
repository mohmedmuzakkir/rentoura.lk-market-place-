import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  MoveUp, 
  MoveDown, 
  Image as ImageIcon,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { StaffAccount, HomeSlideItem } from '../../types/adminTypes';
import { AdminService } from '../../services/adminService';

interface AdminSlidesViewProps {
  staff: StaffAccount;
}

export const AdminSlidesView: React.FC<AdminSlidesViewProps> = ({ staff }) => {
  const [slides, setSlides] = useState<HomeSlideItem[]>([]);
  const [placementFilter, setPlacementFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HomeSlideItem> | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const fetchSlides = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await AdminService.getHomeSlidesAsync(placementFilter);
      setSlides(data);
    } catch (err: any) {
      setErrorMsg('Failed to load marketplace hero slides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [placementFilter]);

  const handleOpenAddModal = () => {
    setEditingSlide({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      mobileImageUrl: '',
      placement: placementFilter === 'all' ? 'home' : placementFilter,
      module: placementFilter === 'all' ? 'home' : placementFilter,
      ctaText: 'Explore Now',
      ctaRoute: '/',
      displayOrder: slides.length + 1,
      durationMs: 5000,
      overlayStrength: 0.4,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: HomeSlideItem) => {
    setEditingSlide({ ...slide });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'mobileImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg(null);
    try {
      const result = await AdminService.uploadSiteAssetAsync(file, 'slides');
      if (result.error || !result.url) {
        throw new Error(result.error || 'Failed to upload slide image');
      }
      setEditingSlide(prev => prev ? ({ ...prev, [field]: result.url }) : null);
      setSuccessMsg('Slide image uploaded successfully to site-assets storage.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.title?.trim()) {
      setErrorMsg('Slide title is required.');
      return;
    }

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await AdminService.saveHomeSlideAsync(editingSlide, staff);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save slide');
      }
      setSuccessMsg(editingSlide.id ? 'Slide updated successfully.' : 'New slide created successfully.');
      setIsModalOpen(false);
      setEditingSlide(null);
      await fetchSlides();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Save failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (slide: HomeSlideItem) => {
    setActionLoading(true);
    try {
      const res = await AdminService.saveHomeSlideAsync({
        ...slide,
        isActive: !slide.isActive
      }, staff);
      if (res.success) {
        await fetchSlides();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!window.confirm('Are you sure you want to delete this marketplace slide?')) return;
    setActionLoading(true);
    try {
      const res = await AdminService.deleteHomeSlideAsync(slideId, staff);
      if (res.success) {
        setSuccessMsg('Slide deleted successfully.');
        await fetchSlides();
      } else {
        setErrorMsg(res.error || 'Failed to delete slide.');
      }
    } catch (e) {
      setErrorMsg('Delete failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReorder = async (slide: HomeSlideItem, action: 'up' | 'down' | 'first') => {
    setActionLoading(true);
    setErrorMsg(null);
    const result = await AdminService.reorderHomeSlideAsync(slide.id, action);
    if (!result.success) setErrorMsg(result.error || 'Reorder failed.');
    await fetchSlides();
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#00C2FF]" />
            <h2 className="text-lg font-black font-heading text-white">Marketplace Hero Slides Manager</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin control plane for Home, Rentals, Jobs, and Services hero carousels (`public.home_slides`).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-xs font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Placement Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {['all', 'home', 'rentals', 'jobs', 'services'].map(tab => (
          <button
            key={tab}
            onClick={() => setPlacementFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all whitespace-nowrap ${
              placementFilter === tab
                ? 'bg-[#1464F4] text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab === 'all' ? 'All Placements' : `${tab} Hero`}
          </button>
        ))}
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#1464F4]" />
          <p className="text-xs font-medium">Fetching hero slides from database...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-white">No slides configured for placement '{placementFilter}'</p>
          <p className="text-xs text-slate-400">Add a custom hero slide to enhance marketplace conversion.</p>
          <button
            onClick={handleOpenAddModal}
            className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
          >
            Create First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slides.map(slide => (
            <div 
              key={slide.id} 
              className={`bg-slate-900 border rounded-3xl overflow-hidden transition-all flex flex-col justify-between ${
                slide.isActive ? 'border-slate-800' : 'border-rose-900/50 opacity-60 bg-slate-950'
              }`}
            >
              {/* Card Banner Preview */}
              <div className="relative h-40 bg-slate-950 overflow-hidden">
                {slide.imageUrl ? (
                  <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-950 flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <div 
                  className="absolute inset-0 bg-slate-950" 
                  style={{ opacity: slide.overlayStrength ?? 0.4 }} 
                />
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-black uppercase text-cyan-400 border border-cyan-500/30">
                      {slide.placement || slide.module || 'home'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded">
                      Order: #{slide.displayOrder}
                    </span>
                  </div>
                  <div>
                    {slide.subtitle && (
                      <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">{slide.subtitle}</p>
                    )}
                    <h3 className="text-sm font-extrabold text-white truncate">{slide.title}</h3>
                  </div>
                </div>
              </div>

              {/* Card Details & Actions */}
              <div className="p-4 space-y-3 bg-slate-900 flex-1 flex flex-col justify-between">
                {slide.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{slide.description}</p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
                  <div>
                    <span className="font-semibold">CTA:</span>{' '}
                    <span className="text-slate-200 font-bold">{slide.ctaText || 'None'}</span>{' '}
                    <span className="text-slate-500">({slide.ctaRoute || '/'})</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button onClick={() => void handleReorder(slide, 'first')} disabled={actionLoading} className="p-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700" title="Make first"><MoveUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => void handleReorder(slide, 'up')} disabled={actionLoading} className="p-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700" title="Move up"><MoveUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => void handleReorder(slide, 'down')} disabled={actionLoading} className="p-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700" title="Move down"><MoveDown className="w-3.5 h-3.5" /></button>
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                        slide.isActive
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900'
                          : 'bg-rose-950/60 text-rose-400 border-rose-800/60 hover:bg-rose-900'
                      }`}
                      title="Toggle visibility"
                    >
                      {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{slide.isActive ? 'Active' : 'Disabled'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(slide)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                      title="Edit slide"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/60 transition-all"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Slide Modal */}
      {isModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-black font-heading text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00C2FF]" />
                <span>{editingSlide.id ? 'Edit Hero Slide' : 'Add New Hero Slide'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    Placement / Module *
                  </label>
                  <select
                    value={editingSlide.placement || 'home'}
                    onChange={e => setEditingSlide({ ...editingSlide, placement: e.target.value, module: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#1464F4]"
                  >
                    <option value="home">Home Page Hero</option>
                    <option value="rentals">Rentals Hero</option>
                    <option value="jobs">Jobs Hero</option>
                    <option value="services">Services Hero</option>
                  </select>
                </div>

                <div className="flex items-end text-xs text-slate-400">Ordering is normalized automatically. Use Move Up, Move Down, or Make First after saving.</div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">
                  Slide Title *
                </label>
                <input
                  type="text"
                  value={editingSlide.title || ''}
                  onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="e.g. Verified Vehicles & Properties Across Sri Lanka"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#1464F4]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    Subtitle Eyebrow
                  </label>
                  <input
                    type="text"
                    value={editingSlide.subtitle || ''}
                    onChange={e => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                    placeholder="e.g. TRUSTED MARKETPLACE"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#1464F4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={editingSlide.ctaText || ''}
                    onChange={e => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                    placeholder="e.g. Explore Listings"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#1464F4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">
                  CTA Navigation Route
                </label>
                <input
                  type="text"
                  value={editingSlide.ctaRoute || ''}
                  onChange={e => setEditingSlide({ ...editingSlide, ctaRoute: e.target.value })}
                  placeholder="e.g. /rentals or /jobs"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#1464F4]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editingSlide.description || ''}
                  onChange={e => setEditingSlide({ ...editingSlide, description: e.target.value })}
                  rows={2}
                  placeholder="Brief descriptive text for hero banner..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#1464F4]"
                />
              </div>

              {/* Desktop Image Upload */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-300">
                  Desktop Image URL or Storage Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingSlide.imageUrl || ''}
                    onChange={e => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#1464F4]"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#00C2FF]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'imageUrl')}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {/* Live Preview Section */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider mb-2">
                  Live Banner Preview
                </label>
                <div className="relative h-32 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 p-4 flex flex-col justify-end">
                  {editingSlide.imageUrl && (
                    <img src={editingSlide.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div 
                    className="absolute inset-0 bg-slate-950" 
                    style={{ opacity: editingSlide.overlayStrength ?? 0.4 }} 
                  />
                  <div className="relative z-10 text-white space-y-1">
                    {editingSlide.subtitle && (
                      <p className="text-[9px] font-bold text-cyan-300 uppercase">{editingSlide.subtitle}</p>
                    )}
                    <p className="text-xs font-extrabold">{editingSlide.title || 'Slide Title Preview'}</p>
                    {editingSlide.ctaText && (
                      <span className="inline-block px-3 py-1 bg-[#1464F4] text-white text-[10px] font-bold rounded-lg mt-1">
                        {editingSlide.ctaText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || uploadingImage}
                  className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Save Slide</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
