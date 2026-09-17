import React from 'react';
import Badge from '../common/Badge';

export const TopicAnalysis = ({ chapterAnalysis = [] }) => {
  if (!chapterAnalysis || chapterAnalysis.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Phân tích chi tiết theo 6 Chương học phần
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Đánh giá dựa trên tỷ lệ câu trả lời đúng của bạn trong từng chương môn OPP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapterAnalysis.map((item) => {
          const isGood = item.accuracy >= 80;
          const isNeedReview = item.accuracy < 70;

          return (
            <div
              key={item.chapter}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between transition-all hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {item.shortName || `Chương ${item.chapter}`}
                  </span>
                  <Badge
                    variant={isGood ? 'success' : isNeedReview ? 'danger' : 'primary'}
                    size="sm"
                  >
                    {isGood ? 'Tốt' : isNeedReview ? 'Cần ôn lại' : 'Đạt'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                  {item.name}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 my-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isGood ? 'bg-emerald-500' : isNeedReview ? 'bg-rose-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>
                    Đúng: <strong className="text-slate-700 dark:text-slate-200">{item.correct} / {item.total}</strong> câu
                  </span>
                  <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                    {item.accuracy}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicAnalysis;
