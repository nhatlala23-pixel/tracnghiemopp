import { storageService } from './storageService';
import { questionService } from './questionService';

export const statisticsService = {
  /**
   * Lấy dữ liệu tổng quan cho Dashboard & Statistics
   */
  getOverallStats() {
    const totalQuestions = questionService.getQuestionCount();
    const progress = storageService.getProgress();
    const history = storageService.getQuizHistory();
    const wrongQuestions = storageService.getWrongQuestions();
    const bookmarks = storageService.getBookmarks();

    const answeredCount = progress.totalAnswered || 0;
    const correctCount = progress.totalCorrect || 0;
    const accuracy = answeredCount > 0 ? Number(((correctCount / answeredCount) * 100).toFixed(1)) : 0;
    const progressPercent = totalQuestions > 0 ? Number(((answeredCount / totalQuestions) * 100).toFixed(1)) : 0;

    const scores = history.map(h => h.accuracy);
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const avgScore = scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;

    return {
      totalQuestions,
      answeredCount,
      correctCount,
      accuracy,
      progressPercent,
      totalTests: history.length,
      bestScore,
      avgScore,
      wrongCount: wrongQuestions.length,
      bookmarkCount: bookmarks.length,
    };
  },

  /**
   * Biểu đồ xu hướng điểm số theo thời gian
   */
  getAccuracyTrendChartData() {
    const history = storageService.getQuizHistory().slice().reverse();
    if (history.length === 0) return null;

    const labels = history.map((item, idx) => {
      const d = new Date(item.date);
      return `#${idx + 1} (${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })})`;
    });

    const accuracies = history.map(item => item.accuracy);

    return {
      labels,
      datasets: [
        {
          label: 'Tỷ lệ chính xác (%)',
          data: accuracies,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#2563eb',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  },

  /**
   * Thống kê theo 6 Chương học phần cho Bar Chart
   */
  getChapterProgressData() {
    const chapterStats = questionService.getChapterStatistics();

    const labels = chapterStats.map(ch => ch.shortName);
    const accuracyData = chapterStats.map(ch => ch.accuracy);
    const totalData = chapterStats.map(ch => ch.total);
    const answeredData = chapterStats.map(ch => ch.answered);

    return {
      chapterStats,
      chartData: {
        labels,
        datasets: [
          {
            label: 'Tỷ lệ chính xác (%)',
            data: accuracyData,
            backgroundColor: '#3b82f6',
            borderRadius: 8,
          },
        ],
      },
    };
  },
};
