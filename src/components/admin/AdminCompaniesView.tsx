import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Star,
  Globe,
  Briefcase
} from 'lucide-react';
import { StaffAccount, JobCompanyItem } from '../../types/adminTypes';
import { AdminService } from '../../services/adminService';

interface AdminCompaniesViewProps {
  staff: StaffAccount;
}

export const AdminCompaniesView: React.FC<AdminCompaniesViewProps> = ({ staff }) => {
  const [companies, setCompanies] = useState<JobCompanyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<Partial<JobCompanyItem>>({});
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);

  const fetchCompanies = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await AdminService.getJobCompaniesAsync();
      setCompanies(data);
    } catch (err: any) {
      setErrorMsg('Failed to load hiring companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCompany({
      name: '',
      slug: '',
      logoUrl: '',
      websiteUrl: '',
      shortDescription: '',
      subtitle: 'Hiring Partner',
      brandKey: 'custom',
      isFeatured: true,
      displayOrder: companies.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company: JobCompanyItem) => {
    setEditingCompany({ ...company });
    setIsModalOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setErrorMsg(null);
    try {
      const result = await AdminService.uploadSiteAssetAsync(file, 'logos');
      if (result.error || !result.url) {
        throw new Error(result.error || 'Failed to upload logo image');
      }
      setEditingCompany(prev => ({ ...prev, logoUrl: result.url }));
      setSuccessMsg('Company logo uploaded to site-assets storage.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Logo upload failed.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany.name?.trim()) {
      setErrorMsg('Company name is required.');
      return;
    }

    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await AdminService.saveJobCompanyAsync(editingCompany, staff);
      if (!res.success) {
        throw new Error(res.error || 'Failed to save hiring company.');
      }
      setSuccessMsg(editingCompany.id ? 'Company profile updated.' : 'New hiring company added.');
      setIsModalOpen(false);
      setEditingCompany({});
      await fetchCompanies();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Save failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (company: JobCompanyItem) => {
    setActionLoading(true);
    try {
      const res = await AdminService.saveJobCompanyAsync({
        ...company,
        isActive: !company.isActive
      }, staff);
      if (res.success) {
        await fetchCompanies();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    setActionLoading(true);
    try {
      const res = await AdminService.deleteJobCompanyAsync(companyId, staff);
      if (res.success) {
        setSuccessMsg('Company deleted successfully.');
        await fetchCompanies();
      } else {
        setErrorMsg(res.error || 'Failed to delete company.');
      }
    } catch (e) {
      setErrorMsg('Delete failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#08A34F]" />
            <h2 className="text-lg font-black font-heading text-white">Top Hiring Companies Manager</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin control plane for Jobs Marketplace hiring partners (`public.job_companies`).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#08A34F] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
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

      {/* Companies Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#08A34F]" />
          <p className="text-xs font-medium">Loading hiring companies from database...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-white">No hiring companies registered yet</p>
          <p className="text-xs text-slate-400">Add featured corporate employers to display on the Jobs Marketplace.</p>
          <button
            onClick={handleOpenAddModal}
            className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
          >
            Create First Company
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(company => (
            <div 
              key={company.id}
              className={`bg-slate-900 border rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all ${
                company.isActive ? 'border-slate-800' : 'border-rose-900/50 opacity-60 bg-slate-950'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-slate-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {company.isFeatured && (
                      <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      #{company.displayOrder}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-white">{company.name}</h3>
                  {company.subtitle && (
                    <p className="text-xs text-[#08A34F] font-bold">{company.subtitle}</p>
                  )}
                  {company.shortDescription && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{company.shortDescription}</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {company.websiteUrl ? (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-bold"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate max-w-[120px]">Website</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-600">No URL</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(company)}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                      company.isActive
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                        : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                    }`}
                  >
                    {company.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(company)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/60 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-black font-heading text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#08A34F]" />
                <span>{editingCompany.id ? 'Edit Hiring Company' : 'Add Hiring Company'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={editingCompany.name || ''}
                  onChange={e => setEditingCompany({ ...editingCompany, name: e.target.value })}
                  placeholder="e.g. Virtusa Sri Lanka"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#08A34F]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    Industry Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingCompany.subtitle || ''}
                    onChange={e => setEditingCompany({ ...editingCompany, subtitle: e.target.value })}
                    placeholder="e.g. Enterprise IT Services"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#08A34F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingCompany.displayOrder ?? 0}
                    onChange={e => setEditingCompany({ ...editingCompany, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#08A34F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={editingCompany.websiteUrl || ''}
                  onChange={e => setEditingCompany({ ...editingCompany, websiteUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#08A34F]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">
                  Short Description
                </label>
                <textarea
                  value={editingCompany.shortDescription || ''}
                  onChange={e => setEditingCompany({ ...editingCompany, shortDescription: e.target.value })}
                  rows={2}
                  placeholder="Brief overview of company and hiring domain..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#08A34F]"
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-300">
                  Logo URL or Storage Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCompany.logoUrl || ''}
                    onChange={e => setEditingCompany({ ...editingCompany, logoUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#08A34F]"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#08A34F]" />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-extrabold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCompany.isFeatured ?? false}
                    onChange={e => setEditingCompany({ ...editingCompany, isFeatured: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-[#08A34F] focus:ring-0"
                  />
                  <span>Feature on Jobs Page</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-extrabold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCompany.isActive ?? true}
                    onChange={e => setEditingCompany({ ...editingCompany, isActive: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-[#08A34F] focus:ring-0"
                  />
                  <span>Active & Visible</span>
                </label>
              </div>

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
                  disabled={actionLoading || uploadingLogo}
                  className="px-5 py-2.5 bg-[#08A34F] hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Save Company</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
