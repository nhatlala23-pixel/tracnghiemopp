export const QUESTIONS_PER_TEST = 90;
export const QUIZ_DURATION = 90 * 60; // 90 phút = 5400 giây
export const TOTAL_CHAPTERS = 6;

export const STORAGE_KEYS = {
  PROGRESS: 'opp_questions_progress',
  HISTORY: 'opp_quiz_history',
  WRONG_QUESTIONS: 'opp_wrong_questions',
  BOOKMARKS: 'opp_bookmarks',
  CURRENT_QUIZ: 'opp_current_quiz',
  STATISTICS: 'opp_statistics',
  THEME: 'opp_theme',
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
