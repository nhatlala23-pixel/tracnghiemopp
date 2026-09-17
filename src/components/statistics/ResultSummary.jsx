import React from 'react';
import { Award, CheckCircle2, XCircle, MinusCircle, Clock } from 'lucide-react';
import Badge from '../common/Badge';

export const ResultSummary = ({ result }) => {
  if (!result) return null;

  const { total, correct, wrong, skipped, accuracy, formattedTime } = result;
  const isPassed = accuracy >= 70;

  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
              Kết quả bài thi
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              {isPassed ? '🎉 Đạt yêu cầu' : '⚠️ Cần cố gắng thêm'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
            {correct} / {total} câu
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Tỷ lệ làm đúng đạt <span className="font-bold text-white text-lg">{accuracy}%</span>
          </p>
        </div>

        {/* 4 Stat badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
          <div className="text-center px-2">
            <div className="flex items-center justify-center gap-1 text-emerald-300 text-xs font-semibold mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
            </div>
            <span className="text-xl font-bold">{correct}</span>
          </div>

          <div className="text-center px-2">
            <div className="flex items-center justify-center gap-1 text-rose-300 text-xs font-semibold mb-0.5">
              <XCircle className="w-3.5 h-3.5" /> Sai
            </div>
            <span className="text-xl font-bold">{wrong}</span>
          </div>

          <div className="text-center px-2">
            <div className="flex items-center justify-center gap-1 text-amber-200 text-xs font-semibold mb-0.5">
              <MinusCircle className="w-3.5 h-3.5" /> Bỏ trống
            </div>
            <span className="text-xl font-bold">{skipped}</span>
          </div>

          <div className="text-center px-2">
            <div className="flex items-center justify-center gap-1 text-blue-200 text-xs font-semibold mb-0.5">
              <Clock className="w-3.5 h-3.5" /> Thời gian
            </div>
            <span className="text-lg font-bold font-mono">{formattedTime || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
