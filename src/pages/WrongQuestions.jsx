import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { questionService } from '../services/questionService';
import { storageService } from '../services/storageService';
import { useQuiz } from '../context/QuizContext';
import { QUIZ_MODES } from '../utils/constants';
import QuestionCard from '../components/quiz/QuestionCard';
import EmptyState from '../components/common/EmptyState';

export const WrongQuestions = () => {
  const navigate = useNavigate();
  const { startQuiz } = useQuiz();

  const [wrongQuestions, setWrongQuestions] = useState(() => questionService.getWrongQuestions());
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(() => storageService.getBookmarks());

  const chapters = questionService.getChapters();

  const handleRetakeAll = () => {
    if (wrongQuestions.length === 0) return;
    startQuiz({
      mode: QUIZ_MODES.WRONG_RETRIAL,
      count: wrongQuestions.length,
      questionIds: wrongQuestions.map(q => q.id),
      duration: Math.min(wrongQuestions.length * 60, 5400),
    });
  };

  const handleRemoveWrong = (questionId) => {
    const updated = storageService.removeWrongQuestion(questionId);
    const updatedSet = new Set(updated.map(id => String(id).toUpperCase()));
    setWrongQuestions(questionService.getAllQuestions().filter(q => updatedSet.has(String(q.id).toUpperCase())));
  };

  const handleClearAllWrong = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách câu hỏi sai?')) {
      storageService.clearWrongQuestions();
      setWrongQuestions([]);
    }
  };

  const handleToggleBookmark = (questionId) => {
    const updated = storageService.toggleBookmark(questionId);
    setBookmarks(updated);
  };

  // Lọc theo chương & từ khóa tìm kiếm
  const filtered = wrongQuestions.filter((q) => {
    if (selectedChapter !== 'all' && Number(q.chapter) !== Number(selectedChapter)) {
      return false;
    }
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase();
      return (
        q.question.toLowerCase().includes(s) ||
        (q.explanation && q.explanation.toLowerCase().includes(s)) ||
        String(q.id).toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              Ngân hàng câu hỏi sai
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hệ thống tự động lưu các câu bạn từng làm sai từ các bài thi để ôn luyện lại.
            </p>
          </div>

          {wrongQuestions.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRetakeAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Làm lại tất cả ({wrongQuestions.length} câu)
              </button>

              <button
                onClick={handleClearAllWrong}
                className="p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Xóa toàn bộ câu sai"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {wrongQuestions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Lọc theo chương
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả các chương</option>
                {chapters.map(ch => (
                  <option key={ch.chapter} value={String(ch.chapter)}>{ch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tìm kiếm câu hỏi
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập nội dung hoặc mã ID (ví dụ CH1-Q001)..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {wrongQuestions.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="Bạn chưa có câu hỏi sai"
          description="Bạn chưa trả lời sai câu hỏi nào hoặc đã ôn tập và xóa hết các câu sai khỏi danh sách."
          action={
            <button
              onClick={() => navigate('/practice')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              Ôn tập các câu hỏi
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          {filtered.map((q, idx) => {
            const isBookmarked = bookmarks.includes(q.id);

            return (
              <div key={q.id} className="relative">
                <QuestionCard
                  question={q}
                  questionNumber={idx + 1}
                  totalQuestions={filtered.length}
                  selectedAnswer={null}
                  onSelectAnswer={() => {}}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={handleToggleBookmark}
                  showResult={true}
                  showExplanation={true}
                />

                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleRemoveWrong(q.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã hiểu rõ câu này (Xóa khỏi danh sách sai)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WrongQuestions;
