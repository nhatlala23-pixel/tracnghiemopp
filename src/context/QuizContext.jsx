import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { storageService } from '../services/storageService';
import { QUIZ_MODES, QUESTIONS_PER_TEST, QUIZ_DURATION } from '../utils/constants';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const navigate = useNavigate();

  // Phiên bài thi hiện tại
  const [activeSession, setActiveSession] = useState(() => {
    return quizService.getActiveQuiz();
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    return activeSession ? activeSession.currentQuestionIndex || 0 : 0;
  });

  const [userAnswers, setUserAnswers] = useState(() => {
    return activeSession ? activeSession.userAnswers || {} : {};
  });

  const [markedQuestions, setMarkedQuestions] = useState(() => {
    return activeSession ? activeSession.markedQuestions || [] : [];
  });

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // Đồng bộ lưu state bài thi vào localStorage mỗi khi có thay đổi đáp án / trạng thái
  useEffect(() => {
    if (activeSession && !activeSession.isSubmitted) {
      const updated = {
        ...activeSession,
        currentQuestionIndex: currentIndex,
        userAnswers,
        markedQuestions,
      };
      storageService.saveCurrentQuiz(updated);
    }
  }, [activeSession, currentIndex, userAnswers, markedQuestions]);

  /**
   * Bắt đầu một bài quiz mới
   */
  const startQuiz = useCallback(({
    mode = QUIZ_MODES.EXAM,
    count = QUESTIONS_PER_TEST,
    topic = 'all',
    questionIds = null,
    duration = QUIZ_DURATION,
  } = {}) => {
    const session = quizService.createQuiz({ mode, count, topic, questionIds, duration });
    setActiveSession(session);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedQuestions([]);
    setIsSubmitModalOpen(false);
    setLastResult(null);
    navigate('/quiz');
  }, [navigate]);

  /**
   * Tiếp tục bài thi dở dang
   */
  const resumeQuiz = useCallback(() => {
    const saved = quizService.getActiveQuiz();
    if (saved) {
      setActiveSession(saved);
      setCurrentIndex(saved.currentQuestionIndex || 0);
      setUserAnswers(saved.userAnswers || {});
      setMarkedQuestions(saved.markedQuestions || []);
      navigate('/quiz');
    }
  }, [navigate]);

  /**
   * Hủy bài thi dở dang
   */
  const discardQuiz = useCallback(() => {
    quizService.discardActiveQuiz();
    setActiveSession(null);
    setUserAnswers({});
    setMarkedQuestions([]);
    setCurrentIndex(0);
  }, []);

  /**
   * Chọn đáp án cho câu hỏi
   */
  const selectAnswer = useCallback((questionId, optionLetter) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionLetter,
    }));
  }, []);

  /**
   * Đánh dấu / bỏ đánh dấu xem lại câu hỏi
   */
  const toggleMarkQuestion = useCallback((questionId) => {
    setMarkedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      }
      return [...prev, questionId];
    });
  }, []);

  /**
   * Chuyển đến câu hỏi theo index
   */
  const goToQuestion = useCallback((index) => {
    if (!activeSession || !activeSession.questions) return;
    if (index >= 0 && index < activeSession.questions.length) {
      setCurrentIndex(index);
    }
  }, [activeSession]);

  const nextQuestion = useCallback(() => {
    if (!activeSession || !activeSession.questions) return;
    if (currentIndex < activeSession.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [activeSession, currentIndex]);

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  /**
   * Nộp bài thi
   */
  const submitQuiz = useCallback((timeSpentSeconds = null) => {
    if (!activeSession || !activeSession.questions) return;

    // Tính thời gian hoàn thành nếu không truyền
    const elapsed = timeSpentSeconds !== null
      ? timeSpentSeconds
      : Math.floor((Date.now() - (activeSession.startTime || Date.now())) / 1000);

    const result = quizService.calculateResult(activeSession.questions, userAnswers, elapsed);
    
    // Lưu kết quả
    quizService.saveQuizResult(result, activeSession.mode);

    setLastResult(result);
    setIsSubmitModalOpen(false);
    setActiveSession(null);

    // Chuyển hướng sang trang kết quả
    navigate('/result', { state: { result } });
  }, [activeSession, userAnswers, navigate]);

  /**
   * Tạo bài thi làm lại các câu sai từ kết quả vừa nộp
   */
  const retakeWrongQuestions = useCallback((wrongIds) => {
    if (!wrongIds || wrongIds.length === 0) return;
    startQuiz({
      mode: QUIZ_MODES.WRONG_RETRIAL,
      count: wrongIds.length,
      questionIds: wrongIds,
      duration: Math.min(wrongIds.length * 60, QUIZ_DURATION),
    });
  }, [startQuiz]);

  const questions = activeSession ? activeSession.questions : [];
  const currentQuestion = questions[currentIndex] || null;

  // Thống kê nhanh trạng thái hiện tại
  const answeredCount = useMemo(() => {
    return Object.keys(userAnswers).length;
  }, [userAnswers]);

  const unansweredCount = useMemo(() => {
    return questions.length - answeredCount;
  }, [questions.length, answeredCount]);

  const value = {
    activeSession,
    questions,
    currentQuestion,
    currentIndex,
    userAnswers,
    markedQuestions,
    answeredCount,
    unansweredCount,
    isSubmitModalOpen,
    lastResult,
    hasActiveQuiz: !!activeSession && !activeSession.isSubmitted,
    startQuiz,
    resumeQuiz,
    discardQuiz,
    selectAnswer,
    toggleMarkQuestion,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    setIsSubmitModalOpen,
    submitQuiz,
    retakeWrongQuestions,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
