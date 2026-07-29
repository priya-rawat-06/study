import React from 'react';
import { Sparkles, Plus, Flame, CheckCircle2 } from 'lucide-react';
import { StudyPlan } from '../types';

interface NavbarProps {
  plans: StudyPlan[];
  activePlanId: string;
  onSelectPlan: (id: string) => void;
  onOpenCreateModal: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  plans,
  activePlanId,
  onSelectPlan,
  onOpenCreateModal,
  completedTasksCount,
  totalTasksCount,
  streakDays
}) => {
  const activePlan = plans.find(p => p.id === activePlanId);

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-stone-200/80 text-stone-800 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => activePlan && onSelectPlan(activePlan.id)}>
            <div className="w-10 h-10 bg-gradient-to-tr from-[#E07A5F] via-[#E0A96D] to-[#D4A373] rounded-2xl flex items-center justify-center shadow-md border border-white/40 group-hover:scale-105 transition-transform">
              <span className="text-white text-lg font-black tracking-tight">T</span>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none text-stone-900 flex items-center gap-2">
                <span>THE MIGHTY THINK TANK</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-stone-100 text-[#E07A5F] border border-stone-200">AI</span>
              </h1>
              <p className="text-[11px] text-stone-500 font-medium tracking-wide mt-1">
                Aesthetic Exam & Study Copilot
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="md:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E07A5F] hover:bg-[#d0694e] text-white font-bold text-xs transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>

        {/* Plan Selector & Stats */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-center md:justify-end">
          {/* Active Plans Pills */}
          <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-2xl border border-stone-200/80 max-w-full overflow-x-auto no-scrollbar">
            {plans.map(plan => {
              const isActive = plan.id === activePlanId;
              return (
                <button
                  key={plan.id}
                  onClick={() => onSelectPlan(plan.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-stone-900 border border-stone-200 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: plan.colorTheme || '#E07A5F' }}
                  />
                  <span className="max-w-[130px] truncate">{plan.subject}</span>
                </button>
              );
            })}
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold" title="Daily Study Streak">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>{streakDays}d Streak 🔥</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold" title="Completed Tasks">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{completedTasksCount}/{totalTasksCount} Done</span>
            </div>

            {/* Create New Plan Button */}
            <button
              onClick={onOpenCreateModal}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#d0694e] text-white font-bold text-xs transition-all shadow-sm hover:scale-102 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ New Plan</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


