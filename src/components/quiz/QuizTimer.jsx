import React from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

export const QuizTimer = ({ formattedTime = '00:00', secondsRemaining = 0 }) => {
  const isUrgent = secondsRemaining > 0 && secondsRemaining < 300; // Dưới 5 phút
  const isCritical = secondsRemaining > 0 && secondsRemaining < 60; // Dưới 1 phút

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm sm:text-base font-bold transition-all ${
        isCritical
          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-700 animate-pulse'
          : isUrgent
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
      }`}
    >
      <Timer className={`w-4 h-4 ${isCritical ? 'text-rose-600' : 'text-blue-600 dark:text-blue-400'}`} />
      <span>{formattedTime}</span>
    </div>
  );
};

export default QuizTimer;
