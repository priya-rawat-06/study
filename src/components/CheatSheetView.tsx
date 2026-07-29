import React, { useState } from 'react';
import { Award, Copy, Check } from 'lucide-react';
import { StudyPlan } from '../types';

interface CheatSheetViewProps {
  plan: StudyPlan;
}

export const CheatSheetView: React.FC<CheatSheetViewProps> = ({ plan }) => {
  const items = plan.cheatSheet || [];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyItem = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#E07A5F]" />
            High-Yield Exam Cheat Sheet
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Essential formulas, core rules, and high-probability exam concepts for {plan.subject}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-stone-300 transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-stone-800 leading-relaxed font-medium">{item}</p>
            </div>

            <button
              onClick={() => handleCopyItem(item, idx)}
              className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 transition-all shrink-0"
              title="Copy to clipboard"
            >
              {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


