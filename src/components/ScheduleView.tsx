import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Play, Sparkles } from 'lucide-react';
import { StudyPlan, TaskItem } from '../types';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/sound';

interface ScheduleViewProps {
  plan: StudyPlan;
  onUpdatePlan: (updated: StudyPlan) => void;
  onStartFocus: (taskTitle: string, durationMinutes: number) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  plan,
  onUpdatePlan,
  onStartFocus
}) => {
  // Calculate countdown to deadline
  const [timeLeftStr, setTimeLeftStr] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(plan.deadline).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeftStr('Exam Day Reached!');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeftStr(`${days}d ${hours}h ${mins}m left`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [plan.deadline]);

  // Overall progress math
  const allTasks: TaskItem[] = plan.schedule.flatMap(d => d.tasks || []);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleTask = (dayNumber: number, taskId: string) => {
    const updatedSchedule = plan.schedule.map(day => {
      if (day.dayNumber !== dayNumber) return day;

      const updatedTasks = day.tasks.map(t => {
        if (t.id === taskId) {
          const nextVal = !t.completed;
          if (nextVal) {
            soundEngine.playSuccessChime();
          }
          return { ...t, completed: nextVal };
        }
        return t;
      });

      const allDayTasksCompleted = updatedTasks.every(t => t.completed);

      if (allDayTasksCompleted && !day.completed) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }

      return {
        ...day,
        completed: allDayTasksCompleted,
        tasks: updatedTasks
      };
    });

    const updatedPlan: StudyPlan = {
      ...plan,
      schedule: updatedSchedule
    };

    onUpdatePlan(updatedPlan);
  };

  const toggleDayComplete = (dayNumber: number) => {
    const updatedSchedule = plan.schedule.map(day => {
      if (day.dayNumber !== dayNumber) return day;

      const nextVal = !day.completed;
      if (nextVal) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        soundEngine.playSuccessChime();
      }

      const updatedTasks = day.tasks.map(t => ({ ...t, completed: nextVal }));

      return {
        ...day,
        completed: nextVal,
        tasks: updatedTasks
      };
    });

    onUpdatePlan({ ...plan, schedule: updatedSchedule });
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 text-stone-900 shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Calendar className="w-40 h-40 text-[#E07A5F]" />
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-900 border border-amber-200">
                {plan.subject}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-rose-100/80 text-rose-900 border border-rose-200">
                ⚡ {plan.intensity} Mode
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                🎯 {plan.dailyHours} hrs / day
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {plan.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">{plan.summary}</p>

            <div className="pt-2 flex items-center gap-2 text-xs italic text-amber-900 font-medium bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20 w-max max-w-full">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">"{plan.motivationQuote}"</span>
            </div>
          </div>

          {/* Progress Ring & Countdown Card */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 bg-stone-50 p-5 rounded-2xl border border-stone-200 text-stone-900 shrink-0 min-w-[250px] shadow-xs">
            <div className="w-full space-y-2 text-center">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1 text-stone-500">
                <span>Plan Progress</span>
                <span className="text-[#E07A5F] font-black text-lg">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#E07A5F] via-[#E0A96D] to-emerald-500 rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] font-medium text-stone-500 pt-1">
                <span className="text-stone-900 font-bold">{completedTasks}</span> of <span className="text-stone-900 font-bold">{totalTasks}</span> tasks completed
              </p>
            </div>

            <div className="w-full pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-stone-500 font-semibold">
                <Clock className="w-4 h-4 text-amber-600" />
                Exam Launch:
              </span>
              <span className="font-mono font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-xl border border-amber-200 shadow-xs">
                {timeLeftStr || 'Upcoming'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Timeline Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E07A5F] rounded-full"></span>
            Milestone Study Schedule
          </h3>
          <p className="text-xs text-stone-500 font-medium">Structured daily objectives leading to your exam.</p>
        </div>
      </div>

      {/* Schedule Days Grid */}
      <div className="space-y-4">
        {plan.schedule.map((day) => {
          const dayCompletedTasks = day.tasks.filter(t => t.completed).length;
          const totalDayTasks = day.tasks.length;
          const isFullyDone = day.completed || (totalDayTasks > 0 && dayCompletedTasks === totalDayTasks);

          return (
            <div
              key={day.dayNumber}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isFullyDone
                  ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                  : 'bg-white border-stone-200/90 shadow-xs hover:border-stone-300'
              }`}
            >
              {/* Day Header Bar */}
              <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs ${
                    isFullyDone ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-stone-200/70 text-stone-700 border-stone-300'
                  }`}>
                    D{day.dayNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">{day.title}</h4>
                      {isFullyDone && (
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                          ✓ Done
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 font-medium">
                      Focus: <span className="text-stone-800 font-semibold">{day.focusTopic}</span>
                    </p>
                  </div>
                </div>

                {/* Day Details Pill & Complete Toggle */}
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-amber-800 font-medium bg-amber-100/80 px-3 py-1 rounded-lg border border-amber-200">
                      💡 {day.technique}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleDayComplete(day.dayNumber)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isFullyDone
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 border border-stone-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isFullyDone ? 'Completed' : 'Complete Day'}</span>
                  </button>
                </div>
              </div>

              {/* Day Tasks List */}
              <div className="p-4 sm:p-5 space-y-2.5">
                {day.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      task.completed
                        ? 'bg-stone-50/50 border-stone-200/60 opacity-70'
                        : 'bg-stone-50/80 border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(day.dayNumber, task.id)}
                        className="mt-0.5 shrink-0 text-stone-400 hover:text-[#E07A5F]"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-400 hover:text-[#E07A5F]" />
                        )}
                      </button>

                      <div>
                        <p className={`text-xs font-semibold ${task.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-[#C85A38] border border-amber-200">
                            {task.type}
                          </span>
                          <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {task.durationMinutes} mins
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Launch Pomodoro Focus timer for task */}
                    <button
                      onClick={() => onStartFocus(task.title, task.durationMinutes)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-[#E07A5F] border border-stone-200 text-xs font-medium transition-all flex items-center gap-1 shrink-0 shadow-2xs"
                      title="Start Pomodoro Focus Timer"
                    >
                      <Play className="w-3 h-3 fill-current text-[#E07A5F]" />
                      <span>Focus</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

