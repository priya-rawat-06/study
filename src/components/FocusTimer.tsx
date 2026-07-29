import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Flame } from 'lucide-react';
import { soundEngine } from '../utils/sound';
import confetti from 'canvas-confetti';

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTaskTitle?: string;
  initialDurationMinutes?: number;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  isOpen,
  onClose,
  initialTaskTitle = 'Focused Study Session',
  initialDurationMinutes = 25
}) => {
  const [taskTitle, setTaskTitle] = useState(initialTaskTitle);
  const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(initialDurationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    setTaskTitle(initialTaskTitle);
    setDurationMinutes(initialDurationMinutes);
    setTimeLeftSeconds(initialDurationMinutes * 60);
    setIsRunning(false);
  }, [initialTaskTitle, initialDurationMinutes, isOpen]);

  useEffect(() => {
    let interval: any = null;

    if (isRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeftSeconds === 0) {
      setIsRunning(false);
      soundEngine.playTimerBeep();

      if (mode === 'focus') {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        setMode('break');
        setTimeLeftSeconds(5 * 60); // 5 min break
      } else {
        setMode('focus');
        setTimeLeftSeconds(durationMinutes * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeftSeconds, mode, durationMinutes]);

  if (!isOpen) return null;

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeftSeconds((mode === 'focus' ? durationMinutes : 5) * 60);
  };

  const mins = Math.floor(timeLeftSeconds / 60);
  const secs = timeLeftSeconds % 60;
  const totalSeconds = (mode === 'focus' ? durationMinutes : 5) * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeftSeconds) / totalSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#E07A5F]" />
            <h3 className="font-bold text-stone-900 text-sm">
              {mode === 'focus' ? 'Pomodoro Focus' : 'Break Time ☕'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Name */}
        <div className="space-y-1">
          <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">Active Objective</p>
          <p className="font-semibold text-stone-800 text-sm max-w-xs mx-auto truncate">{taskTitle}</p>
        </div>

        {/* Timer Display Circle */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center bg-stone-50 rounded-full border border-stone-200/90 shadow-inner">
          {/* Progress ring background */}
          <svg className="w-full h-full transform -rotate-90 p-2" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-stone-200 stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className={`${mode === 'focus' ? 'text-[#E07A5F]' : 'text-emerald-500'} stroke-current transition-all duration-500`}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={(2 * Math.PI * 42) * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold font-mono tracking-tight text-stone-900">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 mt-1 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              {mode === 'focus' ? 'Deep Work' : 'Rest'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={resetTimer}
            className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-xl font-semibold text-xs shadow-xs transition-all flex items-center gap-2 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#E07A5F] hover:bg-[#d0694e] text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current text-white" /> : <Play className="w-4 h-4 fill-current text-white" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};


