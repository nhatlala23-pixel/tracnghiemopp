import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
  MinusCircle,
  HelpCircle,
  Home,
  RefreshCw,
} from 'lucide-react';
import ResultSummary from '../components/statistics/ResultSummary';
import ResultChart from '../components/statistics/ResultChart';
import TopicAnalysis from '../components/statistics/TopicAnalysis';
import QuestionCard from '../components/quiz/QuestionCard';
import { useQuiz } from '../context/QuizContext';
import { storageService } from '../services/storageService';
import { questionService } from '../services/questionService';
import { QUIZ_MODES } from '../utils/constants';

export const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startQuiz, retakeWrongQuestions } = useQuiz();

  const result = location.state?.result || storageService.getQuizHistory()[0] || null;

  const [filterMode, setFilterMode] = useState('all');
  const [bookmarks, setBookmarks] = useState(() => storageService.getBookmarks());

  if (!result) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Chưa có kết quả bài thi</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">Bạn chưa hoàn thành bài thi nào trong phiên làm việc này.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  const reviews = result.questionReviews || [];
  const wrongIds = result.wrongQuestionIds || [];

  const filteredReviews = reviews.filter((q) => {
    if (filterMode === 'wrong') return q.isWrong;
    if (filterMode === 'correct') return q.isCorrect;
    if (filterMode === 'skipped') return !q.isAnswered;
    return true;
  });

  const handleToggleBookmark = (id) => {
    const updated = storageService.toggleBookmark(id);
    setBookmarks(updated);
  };

  const handleRetakeWrong = () => {
    if (wrongIds.length > 0) {
      retakeWrongQuestions(wrongIds);
    }
  };

  const handleStartNewExam = () => {
    const total = questionService.getQuestionCount();
    if (total < 90) {
      alert(`Ngân hàng câu hỏi hiện có ${total} câu, chưa đủ 90 câu để tạo đề thi thử.`);
      return;
    }
    startQuiz({ mode: QUIZ_MODES.EXAM, count: 90 });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Tóm tắt điểm số */}
      <ResultSummary result={result} />

      {/* Action CTA Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
            Hành động tiếp theo
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Luyện lại các câu chưa chính xác hoặc xem lại chi tiết từng chương bên dưới.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {wrongIds.length > 0 && (
            <button
              onClick={handleRetakeWrong}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại {wrongIds.length} câu sai
            </button>
          )}

          <button
            onClick={handleStartNewExam}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Thi đề mới 90 câu
          </button>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>
        </div>
      </div>

      {/* 2. Biểu đồ Doughnut & Bar theo chương */}
      <ResultChart result={result} />

      {/* 3. Phân tích chi tiết theo 6 chương */}
      <TopicAnalysis chapterAnalysis={result.chapterAnalysis} />

      {/* 4. Xem lại toàn bộ câu hỏi (Review Answers) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Xem lại chi tiết bài làm</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                {reviews.length} câu
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Đối chiếu đáp án bạn đã chọn với đáp án chuẩn và lời giải chi tiết.
            </p>
          </div>

          {/* Bộ lọc Review: Tất cả, Đúng, Sai, Bỏ qua */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tất cả ({reviews.length})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'correct'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              Đúng ({result.correct})
            </button>
            <button
              onClick={() => setFilterMode('wrong')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'wrong'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              Sai ({result.wrong})
            </button>
            <button
              onClick={() => setFilterMode('skipped')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'skipped'
                  ? 'bg-slate-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bỏ qua ({result.skipped})
            </button>
          </div>
        </div>

        {/* Danh sách câu hỏi review */}
        <div className="space-y-6">
          {filteredReviews.map((q, idx) => {
            const isBookmarked = bookmarks.includes(q.id);

            return (
              <QuestionCard
                key={q.id}
                question={q}
                questionNumber={idx + 1}
                totalQuestions={filteredReviews.length}
                selectedAnswer={q.userAnswer}
                onSelectAnswer={() => {}}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark}
                showResult={true}
                showExplanation={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Result;
