import React from 'react';
import { HelpCircle, CheckCircle2, AlertCircle, Bookmark } from 'lucide-react';
import Modal from '../common/Modal';

export const SubmitModal = ({
  isOpen,
  onClose,
  onSubmit,
  totalQuestions = 90,
  answeredCount = 0,
  unansweredCount = 0,
  markedCount = 0,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận nộp bài thi"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
          >
            Tiếp tục làm
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Nộp bài ngay
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Bạn có chắc chắn muốn kết thúc và nộp bài thi ngay bây giờ?
        </p>

        {/* Bảng thống kê tóm tắt trạng thái trước khi nộp */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold">Đã trả lời</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-white">
              {answeredCount} <span className="text-xs text-slate-400 font-normal">/ {totalQuestions}</span>
            </p>
          </div>

          <div className="text-center border-x border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-1 text-rose-600 dark:text-rose-400 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">Chưa làm</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-white">
              {unansweredCount} <span className="text-xs text-slate-400 font-normal">/ {totalQuestions}</span>
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-1">
              <Bookmark className="w-4 h-4" />
              <span className="text-xs font-semibold">Đã đánh dấu</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-white">
              {markedCount}
            </p>
          </div>
        </div>

        {unansweredCount > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            ⚠️ Lưu ý: Bạn vẫn còn <span className="font-bold">{unansweredCount} câu</span> chưa chọn đáp án. Các câu chưa làm sẽ được tính là sai.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default SubmitModal;
