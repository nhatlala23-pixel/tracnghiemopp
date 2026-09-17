import React from 'react';
import { HelpCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = HelpCircle,
  title = 'Chưa có dữ liệu',
  description = 'Không tìm thấy mục nào phù hợp.',
  action = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
