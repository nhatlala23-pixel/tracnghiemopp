import React from 'react';
import { AlertCircle, Play, Trash2 } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

export const ResumeQuizBanner = () => {
  const { activeSession, hasActiveQuiz, resumeQuiz, discardQuiz } = useQuiz();

  if (!hasActiveQuiz || !activeSession) return null;

  const answeredCount = Object.keys(activeSession.userAnswers || {}).length;
  const total = activeSession.questions ? activeSession.questions.length : 90;

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-sm transition-all animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-200">
              Bạn có một bài thi chưa hoàn thành!
            </h4>
            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 mt-0.5">
              Tiến độ làm bài: <span className="font-semibold">{answeredCount} / {total} câu</span> • Thời gian bắt đầu:{' '}
              {new Date(activeSession.startTime).toLocaleTimeString('vi-VN')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={resumeQuiz}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Tiếp tục làm
          </button>
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn hủy bài thi đang làm dở dang không?')) {
                discardQuiz();
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 font-medium text-sm transition-colors cursor-pointer"
            title="Hủy bài thi"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Hủy bài thi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeQuizBanner;
