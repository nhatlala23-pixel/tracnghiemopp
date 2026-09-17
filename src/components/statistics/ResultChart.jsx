import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

export const ResultChart = ({ result }) => {
  const { isDark } = useTheme();

  if (!result) return null;

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? '#334155' : '#f1f5f9';

  // 1. Doughnut Chart
  const doughnutData = {
    labels: ['Câu đúng', 'Câu sai', 'Bỏ trống'],
    datasets: [
      {
        data: [result.correct, result.wrong, result.skipped],
        backgroundColor: [
          '#10b981', // Emerald
          '#f43f5e', // Rose
          '#94a3b8', // Slate
        ],
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff',
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 12 },
          padding: 16,
          usePointStyle: true,
        },
      },
    },
    cutout: '70%',
  };

  // 2. Bar Chart theo 6 chương
  const chapters = result.chapterAnalysis || [];
  const barData = {
    labels: chapters.map(c => c.shortName || `Chương ${c.chapter}`),
    datasets: [
      {
        label: 'Tỷ lệ đúng (%)',
        data: chapters.map(c => c.accuracy),
        backgroundColor: chapters.map(c =>
          c.accuracy >= 80 ? '#10b981' : c.accuracy < 70 ? '#f43f5e' : '#3b82f6'
        ),
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Đúng: ${context.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: { family: 'Inter', size: 11 },
          maxRotation: 0,
        },
        grid: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: textColor,
          callback: (value) => `${value}%`,
          stepSize: 20,
        },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Doughnut Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 self-start mb-2">
          Tỷ lệ trả lời
        </h3>
        <div className="w-full h-64 relative flex items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div className="absolute flex flex-col items-center justify-center pointer-events-none mb-6">
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {result.accuracy}%
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Độ chính xác</span>
          </div>
        </div>
      </div>

      {/* Bar Chart by Chapter */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
          Kết quả theo từng Chương học phần (%)
        </h3>
        <div className="w-full h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default ResultChart;
