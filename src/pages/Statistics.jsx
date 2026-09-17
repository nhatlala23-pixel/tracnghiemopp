import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  History,
  Layers,
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { statisticsService } from '../services/statisticsService';
import { storageService } from '../services/storageService';
import { questionService } from '../services/questionService';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/dashboard/StatCard';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export const Statistics = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState(() => statisticsService.getOverallStats());
  const [history, setHistory] = useState(() => storageService.getQuizHistory());
  const [trendChartData, setTrendChartData] = useState(() => statisticsService.getAccuracyTrendChartData());
  const [chapterProgress, setChapterProgress] = useState(() => statisticsService.getChapterProgressData());
  const [chapterStats, setChapterStats] = useState(() => questionService.getChapterStatistics());

  const refreshData = () => {
    setStats(statisticsService.getOverallStats());
    setHistory(storageService.getQuizHistory());
    setTrendChartData(statisticsService.getAccuracyTrendChartData());
    setChapterProgress(statisticsService.getChapterProgressData());
    setChapterStats(questionService.getChapterStatistics());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleResetData = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ đặt lại toàn bộ tiến độ ôn tập, câu hỏi sai và lịch sử thi về 0. Bạn có chắc chắn không?')) {
      storageService.clearAllUserData();
      refreshData();
      alert('Đã xóa toàn bộ dữ liệu học tập thành công!');
    }
  };

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? '#334155' : '#f1f5f9';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: textColor, font: { family: 'Inter' } },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } },
        grid: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: textColor,
          callback: (v) => `${v}%`,
        },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Thống kê học tập cá nhân
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi sự tiến bộ, điểm số và tần suất luyện tập trắc nghiệm 6 chương OPP của bạn.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          Đặt lại toàn bộ dữ liệu
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tổng câu đã làm"
          value={stats.answeredCount}
          subtext={`Trên tổng số ${stats.totalQuestions} câu hiện có`}
          icon={TrendingUp}
          color="blue"
        />

        <StatCard
          title="Độ chính xác chung"
          value={`${stats.accuracy}%`}
          subtext={`${stats.correctCount} câu trả lời đúng`}
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Điểm cao nhất"
          value={`${stats.bestScore}%`}
          subtext="Trong các bài thi thử"
          icon={Award}
          color="amber"
        />

        <StatCard
          title="Điểm trung bình"
          value={`${stats.avgScore}%`}
          subtext={`${stats.totalTests} lần hoàn thành bài thi`}
          icon={Clock}
          color="indigo"
        />
      </div>

      {/* Biểu đồ xu hướng và tiến độ theo 6 chương */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Accuracy theo thời gian */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Xu hướng tỷ lệ chính xác qua các bài thi (%)
          </h3>
          <p className="text-xs text-slate-400 mb-4">Theo dõi điểm số từng lần thi thử gần nhất</p>
          <div className="w-full h-72">
            {trendChartData ? (
              <Line data={trendChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Chưa đủ dữ liệu bài thi để hiển thị biểu đồ đường
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart: Tiến độ theo 6 chương */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Độ chính xác theo 6 Chương học phần (%)
          </h3>
          <p className="text-xs text-slate-400 mb-4">Mức độ hiểu bài trong từng chương môn OPP</p>
          <div className="w-full h-72">
            {chapterProgress?.chartData ? (
              <Bar data={chapterProgress.chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu chương
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bảng chi tiết 6 Chương (Section 10) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Chi tiết kết quả học tập từng Chương
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Chương</th>
                <th className="px-4 py-3 text-center">Tổng số câu</th>
                <th className="px-4 py-3 text-center">Đã làm</th>
                <th className="px-4 py-3 text-center">Đúng</th>
                <th className="px-4 py-3 text-center">Sai</th>
                <th className="px-4 py-3 text-center">Chưa làm</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Độ chính xác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {chapterStats.map((ch) => (
                <tr key={ch.chapter} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold">
                    <div>{ch.shortName}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{ch.name}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">{ch.total}</td>
                  <td className="px-4 py-3 text-center">{ch.answered}</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-bold">{ch.correct}</td>
                  <td className="px-4 py-3 text-center text-rose-600 font-bold">{ch.wrong}</td>
                  <td className="px-4 py-3 text-center text-slate-400">{ch.unanswered}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant={ch.accuracy >= 80 ? 'success' : ch.accuracy > 0 ? 'warning' : 'neutral'} size="sm">
                      {ch.accuracy}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch sử thi Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Lịch sử các lần làm bài ({history.length})
          </h3>
        </div>

        {history.length === 0 ? (
          <EmptyState
            title="Bạn chưa hoàn thành bài thi nào"
            description="Hãy bắt đầu một đề thi để ghi nhận kết quả đầu tiên của bạn vào bảng lịch sử."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Ngày thi</th>
                  <th className="px-4 py-3">Chế độ</th>
                  <th className="px-4 py-3 text-center">Số câu</th>
                  <th className="px-4 py-3 text-center">Đúng</th>
                  <th className="px-4 py-3 text-center">Sai</th>
                  <th className="px-4 py-3 text-center">Accuracy</th>
                  <th className="px-4 py-3 text-right rounded-r-xl">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {history.map((item) => {
                  const d = new Date(item.date);
                  const isPassed = item.accuracy >= 70;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        {d.toLocaleDateString('vi-VN')} {d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold">
                          {item.mode === 'wrong_retrial' ? 'Làm lại câu sai' : 'Đề thi 90 câu'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">{item.total}</td>
                      <td className="px-4 py-3 text-center text-emerald-600 font-bold">{item.correct}</td>
                      <td className="px-4 py-3 text-center text-rose-600 font-bold">{item.wrong}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={isPassed ? 'success' : 'danger'} size="sm">
                          {item.accuracy}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs">{item.formattedTime || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
