import React, { useEffect } from 'react';
import { Bookmark, HelpCircle } from 'lucide-react';
import AnswerOption from './AnswerOption';
import Badge from '../common/Badge';
import FormattedQuestion from './FormattedQuestion';

export const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  isBookmarked = false,
  onToggleBookmark,
  showResult = false,
  showExplanation = false,
}) => {
  if (!question) return null;

  // Hỗ trợ phím tắt A, B, C, D (hoặc 1, 2, 3, 4)
  useEffect(() => {
    if (showResult) return;

    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const keyMap = {
        '1': 'A',
        '2': 'B',
        '3': 'C',
        '4': 'D',
        'A': 'A',
        'B': 'B',
        'C': 'C',
        'D': 'D',
      };

      if (keyMap[key]) {
        onSelectAnswer(question.id, keyMap[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question.id, onSelectAnswer, showResult]);

  const difficultyVariant = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  }[question.difficulty] || 'neutral';

  const difficultyLabel = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó',
  }[question.difficulty] || 'Cơ bản';

  const options = question.options || {};
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft transition-all">
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="primary" size="sm">
            Chương {question.chapter || 1}
          </Badge>
          <Badge variant={difficultyVariant} size="sm">
            {difficultyLabel}
          </Badge>
          <span className="text-xs text-slate-400 font-mono font-semibold">
            {question.id}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark(question.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            isBookmarked
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
          title={isBookmarked ? 'Bỏ đánh dấu câu hỏi' : 'Đánh dấu xem lại'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          <span>{isBookmarked ? 'Đã đánh dấu' : 'Đánh dấu'}</span>
        </button>
      </div>

      {/* Question Content */}
      <div className="my-6">
        <FormattedQuestion
          questionText={question.question}
          questionNumber={questionNumber}
        />
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        {letters.map((letter) => {
          const optionText = options[letter];
          if (!optionText) return null;

          const isSelected = selectedAnswer === letter;
          const isCorrect = showResult ? letter === question.correctAnswer : null;

          return (
            <AnswerOption
              key={letter}
              letter={letter}
              text={optionText}
              isSelected={isSelected}
              isCorrect={isCorrect}
              showResult={showResult}
              onClick={() => onSelectAnswer(question.id, letter)}
              disabled={showResult}
            />
          );
        })}
      </div>

      {/* Explanation Box */}
      {showExplanation && (
        <div className="mt-6 p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-sm leading-relaxed animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200 mb-2">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Giải thích đáp án:</span>
            <span className="ml-auto px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-xs font-semibold">
              Đáp án đúng: {question.correctAnswer}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            {question.explanation ? question.explanation : 'Câu hỏi này không kèm giải thích từ dữ liệu.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
