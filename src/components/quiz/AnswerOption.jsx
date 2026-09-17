import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const AnswerOption = ({
  letter,
  text,
  isSelected = false,
  isCorrect = null, // true | false | null
  showResult = false,
  onClick,
  disabled = false,
}) => {
  // Xác định màu sắc và viền dựa trên trạng thái
  let containerStyles = 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20';
  let badgeStyles = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-700';
  let statusIcon = null;

  if (showResult) {
    if (isCorrect === true) {
      containerStyles = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100';
      badgeStyles = 'bg-emerald-500 text-white';
      statusIcon = <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    } else if (isSelected && isCorrect === false) {
      containerStyles = 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100';
      badgeStyles = 'bg-rose-500 text-white';
      statusIcon = <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
    } else {
      containerStyles = 'border-slate-200 dark:border-slate-800 opacity-60';
    }
  } else if (isSelected) {
    containerStyles = 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-950 dark:text-blue-50 shadow-xs';
    badgeStyles = 'bg-blue-600 text-white shadow-xs';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all duration-150 cursor-pointer disabled:cursor-default ${containerStyles}`}
    >
      <div
        className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 transition-colors ${badgeStyles}`}
      >
        {letter}
      </div>

      <div className="flex-1 text-sm sm:text-base font-normal pt-1 text-slate-800 dark:text-slate-200 leading-relaxed">
        {text}
      </div>

      {statusIcon}
    </button>
  );
};

export default AnswerOption;
