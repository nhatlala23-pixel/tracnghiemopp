import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, ArrowUpRight, History } from 'lucide-react';
import Badge from '../common/Badge';

export const RecentQuiz = ({ history = [] }) => {
  const recentTests = history.slice(0, 5);

  if (recentTests.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Bạn chưa hoàn thành bài thi nào</h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Hãy thử sức ngay với bài thi thử 90 câu để kiểm tra kiến thức OOP của mình!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Bài thi gần đây
        </h3>
        <Link
          to="/statistics"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {recentTests.map((item) => {
          const dateStr = new Date(item.date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
          const isPassed = item.accuracy >= 70;

          return (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {item.mode === 'wrong_retrial' ? 'Ôn lại câu sai' : 'Đề thi 90 câu'}
                  </span>
                  <Badge variant={isPassed ? 'success' : 'danger'} size="sm">
                    {item.accuracy}%
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-1">
                  <span>{dateStr}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.formattedTime || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item.correct}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                    <XCircle className="w-3.5 h-3.5" /> {item.wrong}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {item.correct} / {item.total} câu
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentQuiz;
