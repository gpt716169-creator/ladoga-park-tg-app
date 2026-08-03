import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fetchTLHistoricalData } from '../services/travelLineService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const HistoricalChart = () => {
  const { selectedProperty, selectedPeriod } = useApp();

  const formattedChartData = useMemo(() => {
    try {
      const rawData = [
        { month: 'Июль 25', revenue: 11.42 },
        { month: 'Авг 25', revenue: 8.81 },
        { month: 'Сен 25', revenue: 2.08 },
        { month: 'Окт 25', revenue: 1.11 },
        { month: 'Ноя 25', revenue: 0.89 },
        { month: 'Дек 25', revenue: 0.82 },
        { month: 'Янв 26', revenue: 1.57 },
        { month: 'Фев 26', revenue: 0.61 },
        { month: 'Мар 26', revenue: 0.73 },
        { month: 'Апр 26', revenue: 0.82 },
        { month: 'Май 26', revenue: 4.94 },
        { month: 'Июн 26', revenue: 7.12 },
        { month: 'Июл 26', revenue: 12.60 }
      ];

      return {
        labels: rawData.map(d => d.month),
        datasets: [
          {
            label: 'Выручка (млн ₽)',
            data: rawData.map(d => d.revenue),
            borderColor: '#c3f400',
            backgroundColor: 'rgba(195, 244, 0, 0.1)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointBackgroundColor: '#c3f400',
            pointRadius: 3
          }
        ]
      };
    } catch (e) {
      console.error('Error formatting chart data:', e);
      return { labels: [], datasets: [] };
    }
  }, [selectedProperty, selectedPeriod]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#141313',
        borderColor: '#c3f400',
        borderWidth: 1,
        titleFont: { family: 'Manrope', size: 13, weight: 'bold' },
        bodyFont: { family: 'Manrope', size: 12 },
        padding: 12,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' млн ₽';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#a3a6a6', font: { family: 'JetBrains Mono', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#a3a6a6',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (value) => value + 'M ₽'
        }
      }
    }
  };

  if (!formattedChartData || !formattedChartData.datasets || formattedChartData.datasets.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl p-5 shadow-glass space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c3f400]/15 pb-3">
        <div>
          <h3 className="font-['Syne'] font-extrabold text-[17px] text-white uppercase flex items-center gap-2 tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-pulse"></span>
            СРАВНЕНИЕ С ИСТОРИЕЙ (ВЫРУЧКА В МЛН ₽)
          </h3>
          <p className="font-['JetBrains_Mono'] text-[10px] text-[#a3a6a6] uppercase mt-0.5">
            // ОФИЦИАЛЬНАЯ ПОМЕСЯЧНАЯ ДИНАМИКА TRAVELLINE (2025–2026)
          </p>
        </div>
      </div>

      {/* Легенда графика */}
      <div className="flex flex-wrap items-center gap-4 text-[12px] font-['JetBrains_Mono'] pt-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#c3f400] shadow-[0_0_8px_#c3f400]"></span>
          <span className="text-white font-bold">Текущий период (2025–2026)</span>
        </div>
      </div>

      {/* График Chart.js */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <Line data={formattedChartData} options={options} />
      </div>
    </div>
  );
};
