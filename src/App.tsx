import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Layers, Award, Sparkles, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { StudyPlan } from './types';
import { PRESET_STUDY_PLANS } from './data/presets';
import { Navbar } from './components/Navbar';
import { PlanCreatorModal } from './components/PlanCreatorModal';
import { ScheduleView } from './components/ScheduleView';
import { NotesView } from './components/NotesView';
import { FlashcardTrainer } from './components/FlashcardTrainer';
import { QuizEngine } from './components/QuizEngine';
import { CheatSheetView } from './components/CheatSheetView';
import { FocusTimer } from './components/FocusTimer';
import { AITutorChat } from './components/AITutorChat';

export default function App() {
  // Load plans from localStorage or fallback to initial preset
  const [plans, setPlans] = useState<StudyPlan[]>(() => {
    try {
      const saved = localStorage.getItem('pulseprep_plans');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return PRESET_STUDY_PLANS;
  });

  const [activePlanId, setActivePlanId] = useState<string>(() => {
    return plans[0]?.id || PRESET_STUDY_PLANS[0].id;
  });

  const [activeTab, setActiveTab] = useState<'schedule' | 'notes' | 'flashcards' | 'quiz' | 'cheatsheet'>('schedule');

  // Modals & Panels
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<{ title: string; duration: number }>({
    title: 'Focused Study Session',
    duration: 25
  });
  const [isTutorChatOpen, setIsTutorChatOpen] = useState(false);
  const [tutorContext, setTutorContext] = useState('');

  // Persist plans on change
  useEffect(() => {
    try {
      localStorage.setItem('pulseprep_plans', JSON.stringify(plans));
    } catch (e) {
      console.error(e);
    }
  }, [plans]);

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];

  const handleSelectPlan = (id: string) => {
    setActivePlanId(id);
  };

  const handlePlanCreated = (newPlan: StudyPlan) => {
    setPlans(prev => [newPlan, ...prev]);
    setActivePlanId(newPlan.id);
  };

  const handleUpdatePlan = (updated: StudyPlan) => {
    setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeletePlan = (id: string) => {
    if (plans.length <= 1) {
      alert("You need at least one study plan!");
      return;
    }
    if (confirm("Are you sure you want to delete this study plan?")) {
      const remaining = plans.filter(p => p.id !== id);
      setPlans(remaining);
      if (activePlanId === id) {
        setActivePlanId(remaining[0].id);
      }
    }
  };

  const handleStartFocus = (taskTitle: string, durationMinutes: number) => {
    setFocusTask({ title: taskTitle, duration: durationMinutes });
    setIsFocusTimerOpen(true);
  };

  const handleAskTutor = (contextStr: string) => {
    setTutorContext(contextStr);
    setIsTutorChatOpen(true);
  };

  // Stats calculation across all plans
  const allTasks = plans.flatMap(p => p.schedule.flatMap(d => d.tasks || []));
  const completedTasksCount = allTasks.filter(t => t.completed).length;
  const totalTasksCount = allTasks.length;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans selection:bg-rose-200 selection:text-stone-900 flex flex-col relative overflow-hidden">
      {/* Background Soft Pinterest Warm Ambient Glows */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-rose-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed top-1/2 -left-40 w-96 h-96 bg-amber-200/25 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed -bottom-40 right-1/3 w-96 h-96 bg-orange-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Bar */}
      <Navbar
        plans={plans}
        activePlanId={activePlanId}
        onSelectPlan={handleSelectPlan}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        streakDays={3}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 relative z-10">
        
        {activePlan ? (
          <>
            {/* Active Plan Tab Bar & Plan Action Options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl border border-stone-200/90 overflow-x-auto no-scrollbar shadow-sm">
                {[
                  { id: 'schedule', label: 'Schedule & Tasks', icon: Calendar },
                  { id: 'notes', label: 'Study Notes', icon: BookOpen },
                  { id: 'flashcards', label: 'Flashcards', icon: Layers, badge: activePlan.flashcards?.length },
                  { id: 'quiz', label: 'Practice Quiz', icon: Award, badge: activePlan.quiz?.length },
                  { id: 'cheatsheet', label: 'Cheat Sheet', icon: Sparkles }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-[#E07A5F] text-white shadow-sm font-bold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                      <span>{tab.label}</span>
                      {tab.badge !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Auxiliary Quick Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 justify-end">
                <button
                  onClick={() => handleStartFocus('Deep Work Focus', 25)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm hover:border-amber-400/60"
                >
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Focus Timer</span>
                </button>

                <button
                  onClick={() => handleAskTutor('')}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm hover:border-rose-400/60"
                >
                  <MessageSquare className="w-4 h-4 text-[#E07A5F]" />
                  <span>AI Coach</span>
                </button>

                <button
                  onClick={() => handleDeletePlan(activePlan.id)}
                  className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-stone-200 text-stone-400 hover:text-rose-500 transition-colors shadow-sm"
                  title="Delete Study Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active View Display */}
            <div className="pt-2">
              {activeTab === 'schedule' && (
                <ScheduleView
                  plan={activePlan}
                  onUpdatePlan={handleUpdatePlan}
                  onStartFocus={handleStartFocus}
                />
              )}

              {activeTab === 'notes' && (
                <NotesView
                  plan={activePlan}
                  onAskTutor={handleAskTutor}
                />
              )}

              {activeTab === 'flashcards' && (
                <FlashcardTrainer
                  plan={activePlan}
                  onUpdatePlan={handleUpdatePlan}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizEngine
                  plan={activePlan}
                />
              )}

              {activeTab === 'cheatsheet' && (
                <CheatSheetView
                  plan={activePlan}
                />
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16 space-y-4 bg-white rounded-3xl border border-stone-200/90 shadow-sm">
            <p className="text-base text-stone-600 font-semibold">No study plans created yet.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#d0694e] text-white font-semibold text-xs shadow-md transition-all"
            >
              + Create Your First Plan
            </button>
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => handleAskTutor('')}
          className="w-12 h-12 rounded-2xl bg-[#E07A5F] hover:bg-[#d0694e] text-white shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center group border border-white/30"
          title="Open AI Study Coach"
        >
          <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
        </button>

        <button
          onClick={() => handleStartFocus('Deep Study Session', 25)}
          className="w-12 h-12 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          title="Open Pomodoro Focus Timer"
        >
          <Clock className="w-5 h-5 text-amber-600" />
        </button>
      </div>

      {/* Modals & Slide-over Drawer */}
      <PlanCreatorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPlanCreated={handlePlanCreated}
      />

      <FocusTimer
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        initialTaskTitle={focusTask.title}
        initialDurationMinutes={focusTask.duration}
      />

      <AITutorChat
        plan={activePlan}
        topicContext={tutorContext}
        isOpen={isTutorChatOpen}
        onClose={() => setIsTutorChatOpen(false)}
      />
    </div>
  );
}

