import React from 'react';
import { Send } from 'lucide-react';
import QuizTimer from './QuizTimer';

export const QuizHeader = ({
  title = 'Đề thi OPP',
  currentIndex = 0,
  totalQuestions = 90,
  formattedTime,
  secondsRemaining,
  hasTimer = true,
  onSubmitClick,
}) => {
  const currentNumber = currentIndex + 1;
  const progressPercent = totalQuestions > 0 ? (currentNumber / totalQuestions) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tiêu đề & Thông tin câu */}
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
            Câu {currentNumber} / {totalQuestions}
          </p>
        </div>

        {/* Timer & Nút Nộp bài */}
        <div className="flex items-center gap-3">
          {hasTimer && (
            <QuizTimer
              formattedTime={formattedTime}
              secondsRemaining={secondsRemaining}
            />
          )}

          <button
            type="button"
            onClick={onSubmitClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Nộp bài</span>
          </button>
        </div>
      </div>

      {/* Mini Progress bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default QuizHeader;
