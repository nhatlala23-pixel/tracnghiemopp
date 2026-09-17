import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { useTimer } from '../hooks/useTimer';
import QuizHeader from '../components/quiz/QuizHeader';
import QuestionCard from '../components/quiz/QuestionCard';
import QuestionNavigator from '../components/quiz/QuestionNavigator';
import SubmitModal from '../components/quiz/SubmitModal';
import { questionService } from '../services/questionService';
import { QUIZ_MODES, QUIZ_DURATION } from '../utils/constants';

export const Quiz = () => {
  const navigate = useNavigate();
  const {
    activeSession,
    questions,
    currentQuestion,
    currentIndex,
    userAnswers,
    markedQuestions,
    answeredCount,
    unansweredCount,
    isSubmitModalOpen,
    startQuiz,
    selectAnswer,
    toggleMarkQuestion,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    setIsSubmitModalOpen,
    submitQuiz,
  } = useQuiz();

  const totalAvailable = questionService.getQuestionCount();

  const isExam = activeSession?.mode === QUIZ_MODES.EXAM;
  const initialDuration = activeSession?.duration || QUIZ_DURATION;

  const elapsedSeconds = activeSession?.startTime
    ? Math.max(0, Math.floor((Date.now() - activeSession.startTime) / 1000))
    : 0;
  const remainingSeconds = Math.max(0, initialDuration - elapsedSeconds);

  const {
    secondsRemaining,
    formattedTime,
  } = useTimer({
    initialSeconds: isExam ? remainingSeconds : 0,
    autoStart: isExam,
    onTimeUp: () => {
      alert('Đã hết thời gian làm bài! Hệ thống tự động nộp bài của bạn.');
      submitQuiz(initialDuration);
    },
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevQuestion();
      } else if (e.key === 'ArrowRight') {
        nextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevQuestion, nextQuestion]);

  // Nếu không có bài thi nào đang chạy
  if (!activeSession || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {totalAvailable < 90 ? 'Chưa đủ 90 câu để tạo bài thi thử' : 'Không có bài thi nào đang hoạt động'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {totalAvailable < 90
            ? `Ngân hàng câu hỏi hiện có ${totalAvailable} câu. Bạn có thể thêm câu hỏi thật vào các file chapter01.json → chapter06.json hoặc vào phần "Ôn tập 6 Chương" để làm bài.`
            : 'Bạn có thể bắt đầu bài thi thử 90 câu chuẩn kỳ thi OPP hoặc quay lại trang chủ.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Về trang chủ
          </button>
          {totalAvailable >= 90 ? (
            <button
              onClick={() => startQuiz({ mode: QUIZ_MODES.EXAM, count: 90 })}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md"
            >
              Bắt đầu thi 90 câu
            </button>
          ) : (
            <button
              onClick={() => navigate('/practice')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Ôn tập {totalAvailable} câu hiện có
            </button>
          )}
        </div>
      </div>
    );
  }

  const isBookmarked = markedQuestions.includes(currentQuestion?.id);
  const selectedAnswer = userAnswers[currentQuestion?.id];

  const handleConfirmSubmit = () => {
    const timeSpent = isExam ? (initialDuration - secondsRemaining) : elapsedSeconds;
    submitQuiz(timeSpent);
  };

  return (
    <div className="animate-fade-in">
      {/* Header bài thi */}
      <QuizHeader
        title={
          activeSession.mode === QUIZ_MODES.EXAM
            ? 'Đề thi trắc nghiệm OPP (90 câu - 90 phút)'
            : activeSession.mode === QUIZ_MODES.WRONG_RETRIAL
            ? 'Làm lại các câu hỏi sai'
            : activeSession.chapter && activeSession.chapter !== 'all'
            ? `Ôn tập Chương ${activeSession.chapter}`
            : 'Luyện tập câu hỏi OPP'
        }
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        formattedTime={formattedTime}
        secondsRemaining={secondsRemaining}
        hasTimer={isExam}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
      />

      {/* Main Quiz Area: Question Card + Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={selectAnswer}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleMarkQuestion}
            showResult={false}
            showExplanation={false}
          />

          {/* Navigation Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <button
              type="button"
              onClick={() => toggleMarkQuestion(currentQuestion?.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}</span>
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Nộp bài</span>
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={nextQuestion}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={questions}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            markedQuestions={markedQuestions}
            onSelectIndex={goToQuestion}
          />
        </div>
      </div>

      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleConfirmSubmit}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        markedCount={markedQuestions.length}
      />
    </div>
  );
};

export default Quiz;
