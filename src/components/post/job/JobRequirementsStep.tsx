import React, { useState } from 'react';
import { Award, GraduationCap, CheckCircle2, Plus, X, AlertCircle } from 'lucide-react';
import { ListingDraft } from '../../../types/postFormTypes';
import { getCategoryFormSchema } from '../../../data/formSchemas/categorySchemas';
import { DynamicFieldRenderer } from '../DynamicFieldRenderer';

interface JobRequirementsStepProps {
  draft: ListingDraft;
  onChange: (updatedDraftPartial: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  accentColor?: string;
}

export const JobRequirementsStep: React.FC<JobRequirementsStepProps> = ({
  draft,
  onChange,
  errors,
  accentColor = '#08A34F'
}) => {
  const [customSkillInput, setCustomSkillInput] = useState('');

  const educationLevel = draft.formValues.educationLevel || 'diploma';
  const skillsList: string[] = Array.isArray(draft.formValues.skills) ? draft.formValues.skills : [];
  const selectedLanguages: string[] = Array.isArray(draft.formValues.languages) ? draft.formValues.languages : ['English', 'Sinhala'];

  // Resolve category-specific schema
  const schema = getCategoryFormSchema('jobs', draft.categoryId, draft.subcategoryId, draft.categoryName, draft.subcategoryName);

  const updateFormValue = (key: string, val: any) => {
    onChange({
      formValues: {
        ...draft.formValues,
        [key]: val
      }
    });
  };

  const handleDynamicFieldChange = (fieldId: string, value: any) => {
    updateFormValue(fieldId, value);
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const skill = customSkillInput.trim();
    if (!skillsList.includes(skill)) {
      updateFormValue('skills', [...skillsList, skill]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateFormValue('skills', skillsList.filter(s => s !== skillToRemove));
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      updateFormValue('languages', selectedLanguages.filter(l => l !== lang));
    } else {
      updateFormValue('languages', [...selectedLanguages, lang]);
    }
  };

  const educationOptions = [
    { id: 'none', label: 'No Formal Educational Qualification Required' },
    { id: 'ol', label: 'G.C.E. O/L Completed' },
    { id: 'al', label: 'G.C.E. A/L Completed' },
    { id: 'cert', label: 'Vocational Certificate / NVQ Level 3' },
    { id: 'diploma', label: 'Diploma / NVQ Level 4-5' },
    { id: 'higher-diploma', label: 'Higher National Diploma (HND)' },
    { id: 'degree', label: 'Bachelor\'s Degree' },
    { id: 'postgrad', label: 'Master\'s / Postgraduate / Doctorate' },
    { id: 'prof-qual', label: 'Professional Qualification (CIMA, ACCA, CIM, SLMC, Bar)' }
  ];

  const commonSkillTags = [
    'Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Customer Handling',
    'Microsoft Excel', 'Data Entry', 'Leadership', 'Negotiation', 'Attention to Detail'
  ];

  const availableLanguages = ['English', 'Sinhala', 'Tamil', 'Arabic', 'Japanese', 'German', 'Mandarin'];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
            Step 4: Requirements & Qualifications
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            56% Completed
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Specify role-specific criteria, minimum education, skills, and language expectations.
        </p>
      </div>

      {/* Role-Specific Dynamic Questions Section */}
      {schema && schema.fields && schema.fields.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#08A34F]" />
              {schema.title || `${draft.categoryName} Technical Specifications`}
            </h3>
            {schema.description && (
              <p className="text-[11px] text-slate-500 mt-0.5">{schema.description}</p>
            )}
          </div>

          <DynamicFieldRenderer
            fields={schema.fields}
            formValues={draft.formValues}
            errors={errors}
            onChangeField={handleDynamicFieldChange}
            accentColor={accentColor}
          />
        </div>
      )}

      {/* Education Level & General Skills */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        {/* Education Level */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-slate-500" /> Minimum Education Qualification
          </label>
          <select
            value={educationLevel}
            onChange={(e) => updateFormValue('educationLevel', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {educationOptions.map(e => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
        </div>

        {/* Skills Tag Input */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Required Skills & Competencies
          </label>
          
          {/* Active Skills Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3 min-h-[36px] p-2 bg-slate-50 rounded-xl border border-slate-200/80">
            {skillsList.length === 0 ? (
              <span className="text-[11px] text-slate-400 italic font-medium p-1">No skills added yet. Click tags below or type custom skills.</span>
            ) : (
              skillsList.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#08A34F] text-white shadow-xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Custom Skill Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill(); } }}
              placeholder="Type custom skill and press Enter..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 text-[#08A34F] border border-emerald-200 font-bold text-xs flex items-center gap-1 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Suggested Skills */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Quick Add Popular Skills:</span>
            <div className="flex flex-wrap gap-1.5">
              {commonSkillTags.map((tag) => {
                const isAdded = skillsList.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!isAdded) updateFormValue('skills', [...skillsList, tag]);
                    }}
                    disabled={isAdded}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isAdded
                        ? 'bg-slate-100 text-slate-400 cursor-default'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-500 hover:text-emerald-700'
                    }`}
                  >
                    + {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Working Languages */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Required Working Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map((lang) => {
              const isSelected = selectedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all tap-bounce flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-50 border-[#08A34F] text-[#08A34F] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#08A34F]" />}
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
