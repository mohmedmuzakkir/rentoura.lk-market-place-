import React from 'react';
import { AppRoute } from '../../types';

interface Props {
  required: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onNavigate?: (route: AppRoute) => void;
}

export const PostAgreementCheckpoint: React.FC<Props> = ({ required, checked, onCheckedChange, onNavigate }) => {
  if (!required) return null;
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-slate-800">
      <label className="flex cursor-pointer items-start gap-3 font-semibold">
        <input
          type="checkbox"
          checked={checked}
          onChange={event => onCheckedChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 focus-visible:ring-2 focus-visible:ring-amber-500"
        />
        <span>
          I accept the current RENTOURA.LK User Agreement for posting this listing.{' '}
          <button type="button" onClick={() => onNavigate?.('/user-agreement')} className="font-bold text-blue-700 underline">
            Read the agreement
          </button>
        </span>
      </label>
    </div>
  );
};
