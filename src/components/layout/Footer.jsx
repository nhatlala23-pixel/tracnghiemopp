import React from 'react';
import { ShieldCheck, Heart, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">OPP QUIZ</span>
            <span>•</span>
            <span>Hệ thống Ôn tập & Thi thử Trắc nghiệm Lập trình Hướng đối tượng</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Client-Side LocalStorage
            </span>
            <span>400 Câu hỏi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
