import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { BookOpen, Search, Copy, Check, Sparkles, Lightbulb } from 'lucide-react';
import { StudyPlan } from '../types';

interface NotesViewProps {
  plan: StudyPlan;
  onAskTutor: (topicContext: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ plan, onAskTutor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(plan.notesMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredConcepts = plan.keyConcepts.filter(
    c => c.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
         c.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
         c.exampleOrAnalogy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E07A5F]" />
            AI Study Notes & Concepts Hub
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Structured study guide generated specifically for {plan.subject}.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/70 text-stone-700 text-xs font-semibold border border-stone-200 transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
            <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
          </button>

          <button
            onClick={() => onAskTutor(plan.notesMarkdown.slice(0, 500))}
            className="px-3.5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#d0694e] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Ask Tutor ELI5</span>
          </button>
        </div>
      </div>

      {/* Key Concepts Cards Section */}
      {plan.keyConcepts && plan.keyConcepts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              High-Yield Key Concepts ({plan.keyConcepts.length})
            </h4>

            {/* Search */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter concepts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#E07A5F] shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-stone-300 transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-stone-900 text-base">{concept.term}</h5>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-md border ${
                    concept.importance === 'critical'
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {concept.importance}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-normal">{concept.definition}</p>

                {concept.exampleOrAnalogy && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-start gap-2">
                    <span className="shrink-0 font-bold">💡 Analogy:</span>
                    <span>{concept.exampleOrAnalogy}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Markdown Study Notes */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 text-stone-800 shadow-xs">
        <div className="markdown-body space-y-4 text-sm leading-relaxed">
          <Markdown>{plan.notesMarkdown}</Markdown>
        </div>
      </div>
    </div>
  );
};


