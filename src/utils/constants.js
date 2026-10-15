export const QUESTIONS_PER_TEST = 90;
export const QUIZ_DURATION = 90 * 60; // 90 phút = 5400 giây
export const TOTAL_CHAPTERS = 6;

export const STORAGE_KEYS = {
  PROGRESS: 'oop_questions_progress',
  HISTORY: 'oop_quiz_history',
  WRONG_QUESTIONS: 'oop_wrong_questions',
  BOOKMARKS: 'oop_bookmarks',
  CURRENT_QUIZ: 'oop_current_quiz',
  STATISTICS: 'oop_statistics',
  THEME: 'oop_theme',
};

export const QUIZ_MODES = {
  PRACTICE: 'practice',
  EXAM: 'exam',
  WRONG_RETRIAL: 'wrong_retrial',
  BOOKMARK_PRACTICE: 'bookmark_practice',
};

export const QUESTION_STATUS = {
  UNANSWERED: 'unanswered',
  ANSWERED: 'answered',
  CURRENT: 'current',
  BOOKMARKED: 'bookmarked',
};
