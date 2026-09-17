import React, { useState } from 'react';
import { Bookmark, ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react';

export const QuestionNavigator = ({
  questions = [],
  currentIndex = 0,
  userAnswers = {},
  markedQuestions = [],
  onSelectIndex,
  reviewData = null, // Khi ở chế độ xem lại kết quả
}) => {
  const [isCollapsedMobile, setIsCollapsedMobile] = useState(true);
  const totalQuestions = questions.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft sticky top-20">
      {/* Header + Mobile Toggle */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Danh sách câu hỏi ({totalQuestions})
          </h3>
        </div>
        <button
          onClick={() => setIsCollapsedMobile(!isCollapsedMobile)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Thu gọn/Mở rộng danh sách"
        >
          {isCollapsedMobile ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {/* Legend chú thích */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-4 px-1">
        {reviewData ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500"></span> Đúng
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500"></span> Sai
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-700"></span> Bỏ qua
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-blue-600"></span> Đã làm
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"></span> Chưa làm
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400"></span> Đã dấu
            </span>
          </>
        )}
      </div>

      {/* Grid danh sách câu hỏi */}
      <div
        className={`grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 gap-2 max-h-[460px] overflow-y-auto pr-1 transition-all duration-200 ${
          isCollapsedMobile ? 'hidden lg:grid' : 'grid'
        }`}
      >
        {questions.map((q, idx) => {
          const num = idx + 1;
          const isCurrent = currentIndex === idx;
          const isMarked = markedQuestions.includes(q.id);

          let buttonStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';

          if (reviewData) {
            const review = reviewData[idx];
            if (!review || !review.isAnswered) {
              buttonStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500';
            } else if (review.isCorrect) {
              buttonStyle = 'bg-emerald-500 text-white shadow-xs';
            } else {
              buttonStyle = 'bg-rose-500 text-white shadow-xs';
            }
          } else {
            const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
            if (isAnswered) {
              buttonStyle = 'bg-blue-600 text-white font-bold shadow-xs';
            }
          }

          const currentRing = isCurrent
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 font-extrabold scale-105 z-10'
            : '';

          return (
            <button
              key={q.id}
              onClick={() => onSelectIndex(idx)}
              className={`relative h-10 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${buttonStyle} ${currentRing}`}
              title={`Chuyển đến câu ${num}`}
            >
              <span>{num < 10 ? `0${num}` : num}</span>
              {isMarked && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] text-amber-900">
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;
