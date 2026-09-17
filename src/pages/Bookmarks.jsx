import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Play, Search } from 'lucide-react';
import { questionService } from '../services/questionService';
import { storageService } from '../services/storageService';
import { useQuiz } from '../context/QuizContext';
import { QUIZ_MODES } from '../utils/constants';
import QuestionCard from '../components/quiz/QuestionCard';
import EmptyState from '../components/common/EmptyState';

export const Bookmarks = () => {
  const navigate = useNavigate();
  const { startQuiz } = useQuiz();

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(() =>
    questionService.getBookmarkedQuestions()
  );
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const chapters = questionService.getChapters();

  const handlePracticeBookmarks = () => {
    if (bookmarkedQuestions.length === 0) return;
    startQuiz({
      mode: QUIZ_MODES.BOOKMARK_PRACTICE,
      count: bookmarkedQuestions.length,
      questionIds: bookmarkedQuestions.map(q => q.id),
      duration: null,
    });
  };

  const handleToggleBookmark = (questionId) => {
    const updated = storageService.toggleBookmark(questionId);
    const updatedSet = new Set(updated.map(id => String(id).toUpperCase()));
    setBookmarkedQuestions(
      questionService.getAllQuestions().filter(q => updatedSet.has(String(q.id).toUpperCase()))
    );
  };

  const filtered = bookmarkedQuestions.filter((q) => {
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Bookmark className="w-6 h-6 text-amber-500 fill-current" />
              Câu hỏi đã đánh dấu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Danh sách các câu hỏi bạn đã lưu lại để xem lại và ghi nhớ.
            </p>
          </div>

          {bookmarkedQuestions.length > 0 && (
            <button
              onClick={handlePracticeBookmarks}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Luyện tập {bookmarkedQuestions.length} câu đã lưu
            </button>
          )}
        </div>

        {bookmarkedQuestions.length > 0 && (
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
                Tìm kiếm
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

      {bookmarkedQuestions.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Chưa có câu hỏi nào được đánh dấu"
          description="Trong quá trình ôn tập hoặc thi thử, hãy bấm vào nút Đánh dấu để lưu các câu hỏi quan trọng vào đây."
          action={
            <button
              onClick={() => navigate('/practice')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              Đi đến trang Ôn tập
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          {filtered.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              questionNumber={idx + 1}
              totalQuestions={filtered.length}
              selectedAnswer={null}
              onSelectAnswer={() => {}}
              isBookmarked={true}
              onToggleBookmark={handleToggleBookmark}
              showResult={true}
              showExplanation={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
