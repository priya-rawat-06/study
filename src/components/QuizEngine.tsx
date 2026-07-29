import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle, RefreshCw, ArrowRight, BookOpen } from 'lucide-react';
import { StudyPlan } from '../types';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/sound';

interface QuizEngineProps {
  plan: StudyPlan;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ plan }) => {
  const quizQuestions = plan.quiz || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [index: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (quizQuestions.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-stone-200/90 shadow-sm rounded-3xl space-y-3">
        <HelpCircle className="w-8 h-8 text-[#E07A5F] mx-auto" />
        <p className="text-sm font-semibold text-stone-800">No quiz questions generated for this subject yet.</p>
      </div>
    );
  }

  const currentQ = quizQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    setIsAnswerSubmitted(true);
    setUserAnswers(prev => ({ ...prev, [currentIndex]: selectedOption }));

    if (selectedOption === currentQ.correctIndex) {
      soundEngine.playSuccessChime();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleResetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setUserAnswers({});
    setIsCompleted(false);
  };

  // Calculate score
  const correctCount = Object.keys(userAnswers).filter(
    qIdx => userAnswers[parseInt(qIdx)] === quizQuestions[parseInt(qIdx)].correctIndex
  ).length;
  const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-stone-200/90 text-stone-900 text-center space-y-6 shadow-sm animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 mx-auto flex items-center justify-center">
          <Award className="w-8 h-8 text-amber-700" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            Quiz Result
          </span>
          <h3 className="text-2xl font-bold text-stone-900 mt-3">
            {scorePercent >= 80 ? 'Outstanding Mastery! 🎉' : scorePercent >= 60 ? 'Good Effort! 👍' : 'Keep Reviewing! 📚'}
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-1">
            You answered <span className="text-[#E07A5F] font-bold">{correctCount}</span> out of <span className="font-bold text-stone-800">{quizQuestions.length}</span> questions correctly.
          </p>
        </div>

        {/* Score Card */}
        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 max-w-sm mx-auto space-y-3">
          <p className="text-4xl font-extrabold text-stone-900">
            {scorePercent}%
          </p>
          <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E07A5F] to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleResetQuiz}
            className="px-5 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#d0694e] text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-white" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Quiz Progress & Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E07A5F]" />
            {plan.subject} Practice Quiz
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Question {currentIndex + 1} of {quizQuestions.length}
          </p>
        </div>

        <div className="w-32 bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
          <div
            className="h-full bg-[#E07A5F] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 space-y-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-bold text-base sm:text-lg text-stone-900 leading-relaxed">
            {currentQ.question}
          </h4>
          {currentQ.category && (
            <span className="shrink-0 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {currentQ.category}
            </span>
          )}
        </div>

        {/* Hint trigger */}
        {currentQ.hint && !isAnswerSubmitted && (
          <div>
            {showHint ? (
              <p className="text-xs text-amber-900 bg-amber-100/80 p-3 rounded-xl border border-amber-200">
                💡 Hint: {currentQ.hint}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs text-stone-500 hover:text-amber-800 font-medium bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Need a hint?
              </button>
            )}
          </div>
        )}

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, optIdx) => {
            let optionStyle = 'bg-stone-50 border-stone-200/80 text-stone-800 hover:border-stone-300';

            if (selectedOption === optIdx) {
              optionStyle = 'bg-amber-50 border-[#E07A5F] text-stone-900 font-bold';
            }

            if (isAnswerSubmitted) {
              if (optIdx === currentQ.correctIndex) {
                optionStyle = 'bg-emerald-100/80 border-emerald-300 text-emerald-900 font-bold';
              } else if (selectedOption === optIdx && selectedOption !== currentQ.correctIndex) {
                optionStyle = 'bg-rose-100/80 border-rose-300 text-rose-900 font-bold';
              } else {
                optionStyle = 'bg-stone-50 opacity-60 border-stone-200 text-stone-400';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswerSubmitted}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center font-bold shrink-0 text-xs border border-stone-300">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-xs">{option}</span>
                </div>

                {isAnswerSubmitted && optIdx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && selectedOption === optIdx && selectedOption !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-2xl border text-xs font-normal leading-relaxed space-y-1 animate-fade-in ${
            selectedOption === currentQ.correctIndex
              ? 'bg-emerald-100/80 border-emerald-200 text-emerald-900'
              : 'bg-rose-100/80 border-rose-200 text-rose-900'
          }`}>
            <p className="font-bold uppercase text-xs flex items-center gap-1.5">
              {selectedOption === currentQ.correctIndex ? '✓ Correct Answer!' : '× Incorrect'}
            </p>
            <p>{currentQ.explanation}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-end">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                selectedOption !== null
                  ? 'bg-[#E07A5F] hover:bg-[#d0694e] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#d0694e] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>{currentIndex + 1 < quizQuestions.length ? 'Next Question' : 'View Results'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


