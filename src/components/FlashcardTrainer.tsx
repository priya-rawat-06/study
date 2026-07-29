import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, RotateCw, CheckCircle2, XCircle, HelpCircle, Shuffle } from 'lucide-react';
import { StudyPlan } from '../types';
import { soundEngine } from '../utils/sound';
import confetti from 'canvas-confetti';

interface FlashcardTrainerProps {
  plan: StudyPlan;
  onUpdatePlan: (updated: StudyPlan) => void;
}

export const FlashcardTrainer: React.FC<FlashcardTrainerProps> = ({ plan, onUpdatePlan }) => {
  const cards = plan.flashcards || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredCards = cards.filter(c => difficultyFilter === 'all' || c.difficulty === difficultyFilter);

  if (filteredCards.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-stone-200/90 shadow-sm rounded-3xl space-y-3">
        <Layers className="w-8 h-8 text-[#E07A5F] mx-auto" />
        <p className="text-sm font-semibold text-stone-800">No flashcards match the selected filter.</p>
        <button
          onClick={() => setDifficultyFilter('all')}
          className="px-4 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#d0694e] text-white text-xs font-semibold shadow-sm transition-all"
        >
          Reset Filter
        </button>
      </div>
    );
  }

  const safeIndex = Math.min(currentIndex, filteredCards.length - 1);
  const currentCard = filteredCards[safeIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const markStatus = (status: 'mastered' | 'reviewing') => {
    const updatedCards = cards.map(c => {
      if (c.id === currentCard.id) {
        return { ...c, status };
      }
      return c;
    });

    if (status === 'mastered') {
      soundEngine.playSuccessChime();
      const masteredCount = updatedCards.filter(c => c.status === 'mastered').length;
      if (masteredCount === cards.length) {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      }
    }

    onUpdatePlan({ ...plan, flashcards: updatedCards });
    handleNext();
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    onUpdatePlan({ ...plan, flashcards: shuffled });
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  // Stats
  const masteredCount = cards.filter(c => c.status === 'mastered').length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E07A5F]" />
            Interactive Flashcards
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Card {safeIndex + 1} of {filteredCards.length} | Mastered: <span className="text-emerald-700 font-bold">{masteredCount}/{cards.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => { setDifficultyFilter(d); setCurrentIndex(0); setIsFlipped(false); }}
                className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold transition-all ${
                  difficultyFilter === d ? 'bg-[#E07A5F] text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={shuffleCards}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-all"
            title="Shuffle Deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Flashcard 3D Perspective Box */}
      <div className="perspective-1000 min-h-[300px] sm:min-h-[340px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id + (isFlipped ? '-back' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleFlip}
            className={`w-full min-h-[300px] sm:min-h-[340px] p-8 rounded-3xl border cursor-pointer select-none shadow-md flex flex-col justify-between transition-all ${
              isFlipped
                ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 text-stone-900'
                : 'bg-white border-stone-200/90 text-stone-900 hover:border-stone-300'
            }`}
          >
            {/* Top info badge */}
            <div className="flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-semibold">
                {currentCard.category || plan.subject}
              </span>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-bold uppercase">
                  {currentCard.difficulty}
                </span>
                <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                  {isFlipped ? 'ANSWER' : 'QUESTION'}
                </span>
              </div>
            </div>

            {/* Main Question or Answer text */}
            <div className="my-auto py-6 text-center space-y-4">
              <p className="font-bold tracking-tight leading-relaxed text-xl sm:text-2xl text-stone-900">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>

              {!isFlipped && currentCard.hint && (
                <div className="pt-2">
                  {showHint ? (
                    <p className="text-xs text-amber-900 bg-amber-100/80 border border-amber-200 px-4 py-2 rounded-xl inline-block font-medium">
                      💡 Hint: {currentCard.hint}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowHint(true); }}
                      className="text-xs text-stone-500 hover:text-amber-800 font-medium bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1 mx-auto transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      Show Hint
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Flip prompt */}
            <div className="flex items-center justify-center text-xs text-stone-400 gap-1.5 font-medium">
              <RotateCw className="w-4 h-4 text-[#E07A5F]" />
              <span>Click card to flip ({isFlipped ? 'Back to Question' : 'Reveal Answer'})</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation & Status Rating Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
          <button
            onClick={handlePrev}
            className="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs transition-all"
          >
            ← Prev
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs transition-all"
          >
            Next →
          </button>
        </div>

        {/* Leitner Box Rating */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
          <button
            onClick={() => markStatus('reviewing')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200/80 text-rose-900 border border-rose-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Still Learning</span>
          </button>

          <button
            onClick={() => markStatus('mastered')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Know It!</span>
          </button>
        </div>
      </div>
    </div>
  );
};


