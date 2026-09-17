import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Timer,
  AlertTriangle,
  Award,
  CheckCircle,
  BarChart,
  HelpCircle,
  Compass,
  Layers,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ProgressCard from '../components/dashboard/ProgressCard';
import ResumeQuizBanner from '../components/dashboard/ResumeQuizBanner';
import RecentQuiz from '../components/dashboard/RecentQuiz';
import Badge from '../components/common/Badge';
import { statisticsService } from '../services/statisticsService';
import { storageService } from '../services/storageService';
import { questionService } from '../services/questionService';
import { useQuiz } from '../context/QuizContext';
import { QUIZ_MODES } from '../utils/constants';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { startQuiz } = useQuiz();
  const [stats, setStats] = useState(() => statisticsService.getOverallStats());
  const [chapterStats, setChapterStats] = useState(() => questionService.getChapterStatistics());
  const [history, setHistory] = useState(() => storageService.getQuizHistory());

  useEffect(() => {
    setStats(statisticsService.getOverallStats());
    setChapterStats(questionService.getChapterStatistics());
    setHistory(storageService.getQuizHistory());
  }, []);

  const totalQuestions = questionService.getQuestionCount();

  const handleStartExam = () => {
    if (totalQuestions < 90) {
      alert(`Ngân hàng câu hỏi hiện có ${totalQuestions} câu, chưa đủ 90 câu để tạo bài thi thử. Bạn có thể thêm câu hỏi thật vào các file chapter01.json -> chapter06.json hoặc vào phần "Ôn tập 6 Chương" để làm các câu hiện có.`);
      return;
    }
    startQuiz({ mode: QUIZ_MODES.EXAM, count: 90 });
  };

  const handleRetakeWrong = () => {
    const wrongQuestions = storageService.getWrongQuestions();
    if (wrongQuestions.length > 0) {
      startQuiz({
        mode: QUIZ_MODES.WRONG_RETRIAL,
        count: wrongQuestions.length,
        questionIds: wrongQuestions,
      });
    } else {
      navigate('/wrong-questions');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Resume Banner nếu có bài dở dang */}
      <ResumeQuizBanner />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white p-6 sm:p-10 shadow-xl shadow-blue-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Hệ thống luyện thi trắc nghiệm OPP – 6 Chương học phần</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Ôn tập OPP – Sẵn sàng cho kỳ thi
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
            Ngân hàng {totalQuestions} câu hỏi – luyện tập thông minh theo từng chương – theo dõi tiến độ chính xác.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => navigate('/practice')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-all hover:scale-105 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Ôn tập 6 Chương
            </button>

            <button
              onClick={handleStartExam}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-500/40 hover:bg-blue-500/60 border border-white/20 text-white font-bold text-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
            >
              <Timer className="w-4 h-4" />
              Thi thử 90 câu
            </button>

            {stats.wrongCount > 0 && (
              <button
                onClick={handleRetakeWrong}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/30 hover:bg-amber-500/50 border border-amber-300/30 text-amber-100 font-bold text-sm backdrop-blur-sm transition-all cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                Ôn {stats.wrongCount} câu sai
              </button>
            )}
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-24 top-0 w-48 h-48 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tổng số câu hỏi"
          value={stats.totalQuestions}
          subtext="6 chương học phần OPP"
          icon={HelpCircle}
          color="blue"
        />

        <StatCard
          title="Số câu đã làm"
          value={`${stats.answeredCount} / ${stats.totalQuestions}`}
          subtext={`${stats.progressPercent}% ngân hàng`}
          icon={Compass}
          color="indigo"
        />

        <StatCard
          title="Số câu đúng"
          value={stats.correctCount}
          subtext={`Trên ${stats.answeredCount} câu đã làm`}
          icon={CheckCircle}
          color="emerald"
        />

        <StatCard
          title="Độ chính xác"
          value={`${stats.accuracy}%`}
          subtext={stats.totalTests > 0 ? `${stats.totalTests} bài thi đã làm` : 'Chưa có bài thi'}
          icon={Award}
          color="amber"
        />
      </div>

      {/* Progress Card */}
      <ProgressCard
        answered={stats.answeredCount}
        total={stats.totalQuestions}
        percent={stats.progressPercent}
      />

      {/* Thống kê chi tiết theo 6 Chương môn OPP */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Thống kê học tập theo 6 Chương OPP
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Phân tích tỷ lệ câu làm đúng và tiến độ học cho từng chương học phần.
            </p>
          </div>

          <Link
            to="/practice"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Vào ôn tập <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapterStats.map((ch) => {
            const isFinished = ch.total > 0 && ch.answered >= ch.total;

            return (
              <div
                key={ch.chapter}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {ch.shortName}
                    </span>
                    <Badge variant={ch.accuracy >= 80 ? 'success' : ch.accuracy > 0 ? 'warning' : 'neutral'} size="sm">
                      {ch.accuracy}% chính xác
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
                    {ch.name}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Đã làm: <strong>{ch.answered} / {ch.total}</strong></span>
                    <span>Đúng: <strong className="text-emerald-600">{ch.correct}</strong> • Sai: <strong className="text-rose-600">{ch.wrong}</strong></span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${ch.total > 0 ? (ch.answered / ch.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Tests Section */}
      <RecentQuiz history={history} />
    </div>
  );
};

export default Dashboard;
