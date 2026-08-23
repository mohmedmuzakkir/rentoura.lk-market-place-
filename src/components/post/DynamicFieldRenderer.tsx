import React from 'react';
import { FieldSchema } from '../../types/postFormTypes';
import { HelpCircle, Check, AlertCircle } from 'lucide-react';

interface DynamicFieldRendererProps {
  fields?: FieldSchema[];
  field?: FieldSchema;
  formValues?: Record<string, any>;
  value?: any;
  errors?: Record<string, string>;
  error?: string;
  onChangeField?: (fieldId: string, value: any) => void;
  onChange?: (fieldId: string, value: any) => void;
  accentColor?: string;
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  fields,
  field,
  formValues = {},
  value: singleValue,
  errors = {},
  error: singleError,
  onChangeField,
  onChange,
  accentColor = '#1464F4'
}) => {
  const handleChange = onChangeField || onChange || (() => {});
  const safeFields = fields ? fields : (field ? [field] : []);
  const safeErrors = { ...errors };
  if (field && singleError) {
    safeErrors[field.id] = singleError;
  }
  const safeFormValues = { ...formValues };
  if (field && singleValue !== undefined) {
    safeFormValues[field.id] = singleValue;
  }
  // Checks if a field's dependency condition is satisfied
  const isFieldVisible = (field: FieldSchema): boolean => {
    if (!field.dependsOn) return true;

    const { fieldId, value, condition } = field.dependsOn;
    const parentVal = safeFormValues[fieldId];

    if (condition === 'truthy') {
      return Boolean(parentVal);
    }
    if (condition === 'equals') {
      return parentVal === value;
    }
    if (condition === 'not_equals') {
      return parentVal !== value;
    }
    if (condition === 'includes') {
      return Array.isArray(parentVal) && parentVal.includes(value);
    }
    return true;
  };

  const renderControl = (field: FieldSchema) => {
    const value = safeFormValues[field.id] !== undefined ? safeFormValues[field.id] : (field.defaultValue !== undefined ? field.defaultValue : '');
    const hasError = Boolean(safeErrors[field.id]);

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type === 'phone' ? 'tel' : (field.type === 'email' ? 'email' : 'text')}
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
              hasError ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
            }`}
          />
        );

      case 'number':
        return (
          <div className="relative">
            <input
              type="number"
              id={field.id}
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value === '' ? '' : Number(e.target.value))}
              placeholder={field.placeholder}
              min={field.validation?.min}
              max={field.validation?.max}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
                field.suffix ? 'pr-16' : ''
              } ${hasError ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'}`}
            />
            {field.suffix && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                {field.suffix}
              </span>
            )}
          </div>
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
              Rs.
            </span>
            <input
              type="number"
              id={field.id}
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value === '' ? '' : Number(e.target.value))}
              placeholder={field.placeholder || '0'}
              min={0}
              className={`w-full pl-10 px-3.5 py-2.5 rounded-xl bg-white border text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
                field.suffix ? 'pr-20' : ''
              } ${hasError ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'}`}
            />
            {field.suffix && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 pointer-events-none">
                {field.suffix}
              </span>
            )}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            rows={4}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs leading-relaxed ${
              hasError ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
            }`}
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
              hasError ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
            }`}
          >
            <option value="">-- Choose {field.label} --</option>
            {field.options?.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {field.options?.map((opt) => {
              const isChecked = value === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleChange(field.id, opt.id)}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all tap-bounce text-left flex items-center justify-between ${
                    isChecked
                      ? 'bg-blue-50/90 border-[#1464F4] text-[#1464F4] font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-[#1464F4] stroke-[3]" />}
                </button>
              );
            })}
          </div>
        );

      case 'multi-select':
      case 'tags': {
        const selectedArr = Array.isArray(value) ? value : [];
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {field.options?.map((opt) => {
              const isSelected = selectedArr.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    const next = isSelected
                      ? selectedArr.filter((id: string) => id !== opt.id)
                      : [...selectedArr, opt.id];
                    handleChange(field.id, next);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all tap-bounce text-left flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        );
      }

      case 'toggle':
        return (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-800">{field.label}</p>
              {field.helpText && (
                <p className="text-[10px] text-slate-500 leading-tight">{field.helpText}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleChange(field.id, !value)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                value ? 'bg-[#1464F4]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  value ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs ${
              hasError ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
            }`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
      {safeFields.filter(isFieldVisible).map((field) => {
        const isFullWidth = field.gridCols !== 2 || field.type === 'textarea' || field.type === 'toggle' || field.type === 'multi-select';
        const hasError = Boolean(safeErrors[field.id]);

        return (
          <div
            key={field.id}
            className={`space-y-1.5 ${isFullWidth ? 'sm:col-span-2' : 'sm:col-span-1'}`}
          >
            {field.type !== 'toggle' && (
              <label
                htmlFor={field.id}
                className="text-xs font-bold text-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-1">
                  <span>{field.label}</span>
                  {field.required && <span className="text-rose-500">*</span>}
                </div>
                {field.helpText && (
                  <span className="text-[10px] text-slate-400 font-normal">
                    {field.helpText}
                  </span>
                )}
              </label>
            )}

            {renderControl(field)}

            {hasError && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors[field.id]}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
