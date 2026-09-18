import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw, Search, Edit3 } from 'lucide-react';
import { StaffAccount } from '../../types/adminTypes';
import { AdminModerationService, AdminQueueListing } from '../../services/adminModerationService';
import { AdminListingEditModal, AdminEditableListing } from './AdminListingEditModal';

interface Props {
  staff: StaffAccount;
  initialTab?: 'all' | 'pending' | 'active' | 'rejected' | 'reported';
  onRefresh: () => void;
}

export const AdminListingsView: React.FC<Props> = ({ staff, initialTab = 'all', onRefresh }) => {
  const [status, setStatus] = useState(initialTab === 'reported' ? 'all' : initialTab);
  const [module, setModule] = useState('all');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<AdminQueueListing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingListing, setEditingListing] = useState<AdminQueueListing | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const result = await AdminModerationService.getGlobalListings({ status, module, search, page, pageSize: 25 });
    if (result.error) setError(result.error);
    setRows(result.rows);
    setTotal(result.total);
    setLoading(false);
  }, [status, module, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => { void load(); }, 200);
    return () => clearTimeout(timer);
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">Global Marketplace Listings</h2>
            <p className="text-xs text-slate-500">{total.toLocaleString()} live database rows</p>
          </div>
          <button
            onClick={() => { void load(); onRefresh(); }}
            className="rounded-xl border p-2"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-xs"
              placeholder="Search title"
            />
          </label>
          <select
            value={status}
            onChange={e => { setStatus(e.target.value as typeof status); setPage(1); }}
            className="rounded-xl border px-3 text-xs"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="changes_requested">Changes requested</option>
            <option value="rejected">Rejected</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={module}
            onChange={e => { setModule(e.target.value); setPage(1); }}
            className="rounded-xl border px-3 text-xs"
          >
            <option value="all">All modules</option>
            <option value="rental">Rentals</option>
            <option value="job">Jobs</option>
            <option value="service">Services</option>
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 font-semibold">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-3xl border bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase text-slate-500">
            <tr>
              <th className="p-4">Listing</th>
              <th className="p-4">Owner</th>
              <th className="p-4">Module</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map(row => (
              <tr key={row.id}>
                <td className="p-4">
                  <span className="block font-bold text-slate-900">{row.title}</span>
                  <span className="text-[10px] text-slate-500">{row.categoryName} · {row.provinceName}</span>
                </td>
                <td className="p-4">{row.ownerName}</td>
                <td className="p-4 capitalize">{row.module}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    {row.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">{new Date(row.createdAt).toLocaleString()}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => setEditingListing(row)}
                    className="inline-flex items-center gap-1 text-[#1464F4] hover:text-[#0c4bbd] font-bold hover:underline"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
                        try {
                          await AdminModerationService.deleteListing(row.id);
                          void load();
                          onRefresh();
                        } catch (err: any) {
                          setError(err.message);
                        }
                      }
                    }}
                    className="text-rose-600 hover:text-rose-700 font-bold hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-500">
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t p-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(value => value - 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            disabled={page * 25 >= total}
            onClick={() => setPage(value => value + 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {editingListing && (
        <AdminListingEditModal
          listing={editingListing}
          staff={staff}
          onClose={() => setEditingListing(null)}
          onSaved={() => {
            void load();
            onRefresh();
          }}
        />
      )}
    </div>
  );
};
