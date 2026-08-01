import React, { useState } from 'react';
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
import { fetchTLHistoricalData } from '../services/travelLineService';
import { useApp } from '../context/AppContext';

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
  const [activeMetric, setActiveMetric] = useState('revenue');

  const chartData = fetchTLHistoricalData(selectedProperty, activeMetric, selectedPeriod);

  // Настройка кислотного стиля WIBE
  chartData.datasets[0].borderColor = '#c3f400';
  chartData.datasets[0].backgroundColor = 'rgba(195, 244, 0, 0.12)';
  chartData.datasets[0].pointBackgroundColor = '#c3f400';
  chartData.datasets[0].pointBorderColor = '#141313';
  chartData.datasets[0].pointRadius = 5;

  chartData.datasets[1].borderColor = '#febf1a'; // Золотой
  chartData.datasets[2].borderColor = '#6f7881';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(20, 19, 19, 0.95)',
        titleColor: '#c3f400',
        bodyColor: '#e5e2e1',
        borderColor: 'rgba(195, 244, 0, 0.4)',
        borderWidth: 1,
        padding: 12,
        titleFont: { family: 'Syne', size: 13, weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        callbacks: {
          label: function (context) {
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
        grid: { color: 'rgba(195, 244, 0, 0.05)' },
        ticks: {
          color: '#a3a6a6',
          font: { family: 'JetBrains Mono', size: 11 }
        }
      },
      y: {
        grid: { color: 'rgba(195, 244, 0, 0.08)' },
        ticks: {
          color: '#a3a6a6',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (value) => value + 'M'
        }
      }
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col min-h-[380px] shadow-glass">
      
      {/* Шапка графика */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] shadow-[0_0_10px_#c3f400]"></span>
            <h3 className="font-['Syne'] font-extrabold text-[17px] text-white tracking-wide uppercase">
              Сравнение с историей ({activeMetric === 'revenue' ? 'Выручка' : activeMetric === 'bookings' ? 'Брони' : 'Загрузка'})
            </h3>
          </div>
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6]">
            // ОФИЦИАЛЬНАЯ ПОМЕСЯЧНАЯ ДИНАМИКА TRAVELLINE (2025–2026)
          </p>
        </div>

        {/* Переключатель метрики */}
        <div className="flex bg-[#141313] p-1 rounded-xl border border-[#c3f400]/20 font-['JetBrains_Mono'] text-[11px]">
          <button
            onClick={() => setActiveMetric('revenue')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'revenue'
                ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                : 'text-[#a3a6a6] hover:text-white'
            }`}
          >
            Выручка
          </button>
          <button
            onClick={() => setActiveMetric('bookings')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'bookings'
                ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                : 'text-[#a3a6a6] hover:text-white'
            }`}
          >
            Брони
          </button>
          <button
            onClick={() => setActiveMetric('occupancy')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'occupancy'
                ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                : 'text-[#a3a6a6] hover:text-white'
            }`}
          >
            Загрузка
          </button>
        </div>
      </div>

      {/* Легенда */}
      <div className="flex flex-wrap gap-4 font-['JetBrains_Mono'] text-[11px] mb-3">
        <span className="flex items-center gap-2 text-[#c3f400] font-bold">
          <span className="w-3 h-3 rounded-full bg-[#c3f400] shadow-[0_0_8px_#c3f400]"></span> Текущий период (2025–2026)
        </span>
        <span className="flex items-center gap-2 text-[#febf1a]">
          <span className="w-3 h-3 rounded-full bg-[#febf1a]"></span> Среднее (3 года)
        </span>
        <span className="flex items-center gap-2 text-[#6f7881]">
          <span className="w-3 h-3 rounded-full bg-[#6f7881]"></span> Прошлый год (2024–2025)
        </span>
      </div>

      {/* Холст графика */}
      <div className="flex-1 w-full relative min-h-[250px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
