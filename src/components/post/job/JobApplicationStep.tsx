import React, { useState } from 'react';
import { Mail, Phone, Globe, MessageSquare, Calendar, FileText, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { ListingDraft, validateSriLankanPhone } from '../../../types/postFormTypes';

interface JobApplicationStepProps {
  draft: ListingDraft;
  onChange: (updatedDraftPartial: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor?: string;
}

export const JobApplicationStep: React.FC<JobApplicationStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#08A34F'
}) => {
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const contactPrefs = draft.contactPreferences || {
    showPhone: true,
    phone: '0771234567',
    showWhatsApp: true,
    whatsappNumber: '0771234567',
    allowDirectChat: true,
    email: 'careers@company.lk',
    externalUrl: ''
  };

  const appMethods: string[] = Array.isArray(draft.formValues.appMethods)
    ? draft.formValues.appMethods
    : ['direct', 'phone', 'email'];

  const deadline = draft.formValues.deadline || '';
  const reqCv = draft.formValues.reqCv !== undefined ? draft.formValues.reqCv : true;
  const reqCoverLetter = draft.formValues.reqCoverLetter !== undefined ? draft.formValues.reqCoverLetter : false;
  const reqPortfolio = draft.formValues.reqPortfolio !== undefined ? draft.formValues.reqPortfolio : false;

  const screeningQuestions: string[] = Array.isArray(draft.formValues.screeningQuestions)
    ? draft.formValues.screeningQuestions
    : ['When is your earliest available joining date?'];

  const [newQuestionInput, setNewQuestionInput] = useState('');

  const updateFormValue = (key: string, val: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: val
      }
    });
  };

  const updateContactPrefs = (partialPrefs: Partial<typeof contactPrefs>) => {
    onChange({
      contactPreferences: {
        ...contactPrefs,
        ...partialPrefs
      }
    });
  };

  const toggleAppMethod = (method: string) => {
    if (appMethods.includes(method)) {
      if (appMethods.length === 1) {
        alert('At least one application method must remain selected.');
        return;
      }
      updateFormValue('appMethods', appMethods.filter(m => m !== method));
    } else {
      updateFormValue('appMethods', [...appMethods, method]);
    }
  };

  const handlePhoneBlur = (phoneVal: string) => {
    if (!phoneVal) return;
    const res = validateSriLankanPhone(phoneVal);
    if (!res.isValid) {
      setPhoneError(res.error || 'Invalid Sri Lankan mobile number');
    } else {
      setPhoneError(null);
      updateContactPrefs({ phone: res.formatted });
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestionInput.trim()) return;
    if (screeningQuestions.length >= 3) {
      alert('Maximum of 3 custom screening questions allowed.');
      return;
    }
    updateFormValue('screeningQuestions', [...screeningQuestions, newQuestionInput.trim()]);
    setNewQuestionInput('');
  };

  const handleRemoveQuestion = (idx: number) => {
    updateFormValue('screeningQuestions', screeningQuestions.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
            Step 6: Application Details
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            85% Completed
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Specify how candidates can submit applications, contact information, and required documents.
        </p>
      </div>

      {/* Main Form Content */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        {/* Application Methods */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Accepted Application Methods <span className="text-rose-500">*</span>
          </label>

          <div className="space-y-2.5">
            {/* Direct In-App Application */}
            <div
              onClick={() => toggleAppMethod('direct')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                appMethods.includes('direct')
                  ? 'bg-emerald-50/90 border-[#08A34F]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#08A34F] text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">RENTOURA Direct Application (In-App)</h4>
                  <p className="text-[11px] text-slate-500">Receive candidate CVs and applications directly in your RENTOURA dashboard</p>
                </div>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${appMethods.includes('direct') ? 'text-[#08A34F]' : 'text-slate-300'}`} />
            </div>

            {/* Phone Call */}
            <div
              onClick={() => toggleAppMethod('phone')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                appMethods.includes('phone')
                  ? 'bg-emerald-50/90 border-[#08A34F]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#08A34F] text-white">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Phone Call Inquiries</h4>
                  <p className="text-[11px] text-slate-500">Allow candidates to call your recruitment phone number directly</p>
                </div>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${appMethods.includes('phone') ? 'text-[#08A34F]' : 'text-slate-300'}`} />
            </div>

            {/* WhatsApp */}
            <div
              onClick={() => toggleAppMethod('whatsapp')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                appMethods.includes('whatsapp')
                  ? 'bg-emerald-50/90 border-[#08A34F]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">WhatsApp Messages</h4>
                  <p className="text-[11px] text-slate-500">Candidates can send CV or voice messages directly via WhatsApp</p>
                </div>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${appMethods.includes('whatsapp') ? 'text-[#08A34F]' : 'text-slate-300'}`} />
            </div>

            {/* Email */}
            <div
              onClick={() => toggleAppMethod('email')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                appMethods.includes('email')
                  ? 'bg-emerald-50/90 border-[#08A34F]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-600 text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Email Submission</h4>
                  <p className="text-[11px] text-slate-500">Receive application emails to your careers inbox</p>
                </div>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${appMethods.includes('email') ? 'text-[#08A34F]' : 'text-slate-300'}`} />
            </div>

            {/* External URL */}
            <div
              onClick={() => toggleAppMethod('website')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                appMethods.includes('website')
                  ? 'bg-emerald-50/90 border-[#08A34F]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-600 text-white">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">External Web Link / Careers Portal</h4>
                  <p className="text-[11px] text-slate-500">Redirect candidates to your external website application portal</p>
                </div>
              </div>
              <CheckCircle2 className={`w-5 h-5 ${appMethods.includes('website') ? 'text-[#08A34F]' : 'text-slate-300'}`} />
            </div>
          </div>
        </div>

        {/* Contact Input Fields */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
          <h4 className="text-xs font-bold text-slate-800">Recruitment Contact Information</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone Number */}
            {(appMethods.includes('phone') || appMethods.includes('whatsapp')) && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Sri Lankan Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={contactPrefs.phone}
                    onChange={(e) => updateContactPrefs({ phone: e.target.value })}
                    onBlur={(e) => handlePhoneBlur(e.target.value)}
                    placeholder="e.g. 077 123 4567"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {phoneError && <p className="text-[10px] text-rose-600 font-medium mt-0.5">{phoneError}</p>}
              </div>
            )}

            {/* Email */}
            {appMethods.includes('email') && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Careers Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={contactPrefs.email || ''}
                    onChange={(e) => updateContactPrefs({ email: e.target.value })}
                    placeholder="e.g. careers@yourcompany.lk"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Website URL */}
            {appMethods.includes('website') && (
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  External Application URL *
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={contactPrefs.externalUrl || ''}
                    onChange={(e) => updateContactPrefs({ externalUrl: e.target.value })}
                    placeholder="https://company.com/careers/apply/123"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Application Deadline */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" /> Application Deadline (Optional)
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => updateFormValue('deadline', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Required Application Documents */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Required Candidate Attachments
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => updateFormValue('reqCv', !reqCv)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                reqCv ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F]' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span>CV / Resume Mandatory</span>
              <CheckCircle2 className={`w-4 h-4 ${reqCv ? 'text-[#08A34F]' : 'text-slate-300'}`} />
            </button>

            <button
              type="button"
              onClick={() => updateFormValue('reqCoverLetter', !reqCoverLetter)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                reqCoverLetter ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F]' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span>Cover Letter Requested</span>
              <CheckCircle2 className={`w-4 h-4 ${reqCoverLetter ? 'text-[#08A34F]' : 'text-slate-300'}`} />
            </button>

            <button
              type="button"
              onClick={() => updateFormValue('reqPortfolio', !reqPortfolio)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                reqPortfolio ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F]' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span>Work Portfolio Required</span>
              <CheckCircle2 className={`w-4 h-4 ${reqPortfolio ? 'text-[#08A34F]' : 'text-slate-300'}`} />
            </button>
          </div>
        </div>

        {/* Custom Screening Questions */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Custom Screening Questions (Optional, max 3)
          </label>

          <div className="space-y-2 mb-3">
            {screeningQuestions.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800">
                <span>{idx + 1}. {q}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {screeningQuestions.length < 3 && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestionInput}
                onChange={(e) => setNewQuestionInput(e.target.value)}
                placeholder="e.g. Do you possess a valid Heavy Vehicle driving license?"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 text-[#08A34F] border border-emerald-200 font-bold text-xs flex items-center gap-1 hover:bg-emerald-100"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
