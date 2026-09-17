import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Filter,
  Play,
  Bookmark,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { questionService } from '../services/questionService';
import { storageService } from '../services/storageService';
import { useQuiz } from '../context/QuizContext';
import { QUIZ_MODES } from '../utils/constants';
import QuestionCard from '../components/quiz/QuestionCard';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export const Practice = () => {
  const navigate = useNavigate();
  const { startQuiz } = useQuiz();

  const [selectedChapter, setSelectedChapter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCount, setSelectedCount] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [viewMode, setViewMode] = useState('cards');
  const [localAnswers, setLocalAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [bookmarks, setBookmarks] = useState(() => storageService.getBookmarks());

  const chapters = questionService.getChapters();

  // Lọc danh sách câu hỏi
  const filteredQuestions = useMemo(() => {
    return questionService.filterQuestions({
      chapter: selectedChapter,
      status: selectedStatus,
      difficulty: selectedDifficulty,
      searchQuery,
    });
  }, [selectedChapter, selectedStatus, selectedDifficulty, searchQuery]);

  const questionsToTake = useMemo(() => {
    if (selectedCount === 'all') return filteredQuestions;
    return filteredQuestions.slice(0, Number(selectedCount));
  }, [filteredQuestions, selectedCount]);

  const handleStartPracticeQuiz = () => {
    if (questionsToTake.length === 0) return;

    startQuiz({
      mode: QUIZ_MODES.PRACTICE,
      count: questionsToTake.length,
      chapter: selectedChapter,
      questionIds: questionsToTake.map(q => q.id),
      duration: null,
    });
  };

  const handleSelectLocalAnswer = (questionId, optionLetter) => {
    const q = questionService.getQuestionById(questionId);
    if (!q) return;

    const isCorrect = String(optionLetter).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();
    setLocalAnswers(prev => ({ ...prev, [questionId]: optionLetter }));
    setShowExplanations(prev => ({ ...prev, [questionId]: true }));

    storageService.updateProgress(questionId, optionLetter, isCorrect);
    if (!isCorrect) {
      storageService.addWrongQuestions([questionId]);
    } else {
      storageService.removeWrongQuestion(questionId);
    }
  };

  const handleToggleBookmark = (questionId) => {
    const updated = storageService.toggleBookmark(questionId);
    setBookmarks(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Ôn tập theo 6 Chương OPP
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Số lượng câu hỏi được tự động cập nhật từ các chương trong hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartPracticeQuiz}
              disabled={questionsToTake.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Bắt đầu ôn tập ({questionsToTake.length} câu)
            </button>
          </div>
        </div>

        {/* 6 Chapters Badges Preview (Section 9) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 my-5">
          {chapters.map((ch) => {
            const isSelected = selectedChapter === String(ch.chapter) || selectedChapter === ch.chapter;

            return (
              <button
                key={ch.chapter}
                onClick={() => setSelectedChapter(isSelected ? 'all' : String(ch.chapter))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-300'
                }`}
              >
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  {ch.shortName}
                </span>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5 block">
                  {ch.count} câu
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Lọc theo Chương */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Chương học phần
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả 6 chương ({questionService.getQuestionCount()} câu)</option>
              {chapters.map(ch => (
                <option key={ch.chapter} value={String(ch.chapter)}>
                  {ch.name} ({ch.count} câu)
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo Trạng thái */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Trạng thái câu hỏi
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="unanswered">Chưa làm</option>
              <option value="answered">Đã làm</option>
              <option value="wrong">Làm sai</option>
              <option value="bookmarked">Đã đánh dấu</option>
            </select>
          </div>

          {/* Lọc theo Độ khó */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Mức độ khó
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>

          {/* Số lượng câu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Số câu muốn làm
            </label>
            <select
              value={selectedCount}
              onChange={(e) => setSelectedCount(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả câu tìm thấy ({filteredQuestions.length})</option>
              <option value={10}>10 câu</option>
              <option value={20}>20 câu</option>
              <option value={30}>30 câu</option>
              <option value={50}>50 câu</option>
              <option value={90}>90 câu</option>
            </select>
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nội dung câu hỏi, mã ID (ví dụ CH1-Q001)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Hiển thị danh sách */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
          Tìm thấy <span className="text-blue-600 dark:text-blue-400 font-bold">{filteredQuestions.length}</span> câu hỏi
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Thẻ chi tiết
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Rút gọn
          </button>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <EmptyState
          title="Không tìm thấy câu hỏi"
          description="Hãy thử chọn chương khác hoặc đặt lại bộ lọc tìm kiếm."
          action={
            <button
              onClick={() => {
                setSelectedChapter('all');
                setSelectedStatus('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Đặt lại bộ lọc
            </button>
          }
        />
      ) : viewMode === 'cards' ? (
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const userAnswer = localAnswers[q.id];
            const hasAnswered = !!userAnswer;
            const isBookmarked = bookmarks.includes(q.id);

            return (
              <QuestionCard
                key={q.id}
                question={q}
                questionNumber={idx + 1}
                totalQuestions={filteredQuestions.length}
                selectedAnswer={userAnswer}
                onSelectAnswer={handleSelectLocalAnswer}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark}
                showResult={hasAnswered}
                showExplanation={hasAnswered || showExplanations[q.id]}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {filteredQuestions.map((q, idx) => (
            <div key={q.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-xs font-bold text-slate-400 font-mono mt-0.5">{q.id}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                    {q.question}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="primary" size="sm">Chương {q.chapter}</Badge>
                    <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'} size="sm">
                      {q.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleToggleBookmark(q.id)}
                className={`p-2 rounded-xl text-xs ${
                  bookmarks.includes(q.id) ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-400'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Practice;
