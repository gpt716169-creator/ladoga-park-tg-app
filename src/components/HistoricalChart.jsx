import React, { useState, useEffect } from 'react';
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
  const [metric, setMetric] = useState('revenue');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const data = fetchTLHistoricalData(selectedProperty, metric, selectedPeriod);
    setChartData(data);
  }, [selectedProperty, metric, selectedPeriod]);

  if (!chartData) return null;

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
              if (metric === 'revenue') {
                label += context.parsed.y + ' млн ₽';
              } else if (metric === 'bookings') {
                label += context.parsed.y + ' ночей';
              } else {
                label += context.parsed.y + '%';
              }
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
          callback: (value) => {
            if (metric === 'revenue') return value + 'M ₽';
            if (metric === 'bookings') return value;
            return value + '%';
          }
        }
      }
    }
  };

  const getMetricTitle = () => {
    if (metric === 'revenue') return 'ВЫРУЧКА';
    if (metric === 'bookings') return 'ПРОДАНО НОЧЕЙ';
    return '% ЗАГРУЗКИ ФОНДА';
  };

  return (
    <div className="glass-card rounded-2xl p-5 shadow-glass space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c3f400]/15 pb-3">
        <div>
          <h3 className="font-['Syne'] font-extrabold text-[17px] text-white uppercase flex items-center gap-2 tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-pulse"></span>
            СРАВНЕНИЕ С ИСТОРИЕЙ ({getMetricTitle()})
          </h3>
          <p className="font-['JetBrains_Mono'] text-[10px] text-[#a3a6a6] uppercase mt-0.5">
            // ОФИЦИАЛЬНАЯ ПОМЕСЯЧНАЯ ДИНАМИКА TRAVELLINE (2025–2026)
          </p>
        </div>

        {/* Интерактивные кнопки переключения метрик Выручка / Брони / Загрузка */}
        <div className="flex bg-[#141313] p-1 rounded-xl border border-[#c3f400]/20 font-['JetBrains_Mono'] text-[11px]">
          <button
            onClick={() => setMetric('revenue')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metric === 'revenue'
                ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                : 'text-[#a3a6a6] hover:text-white'
            }`}
          >
            Выручка
          </button>
          <button
            onClick={() => setMetric('bookings')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metric === 'bookings'
                ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                : 'text-[#a3a6a6] hover:text-white'
            }`}
          >
            Брони
          </button>
          <button
            onClick={() => setMetric('occupancy')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metric === 'occupancy'
                ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                : 'text-[#a3a6a6] hover:text-white'
            }`}
          >
            Загрузка
          </button>
        </div>
      </div>

      {/* Легенда графика */}
      <div className="flex flex-wrap items-center gap-4 text-[12px] font-['JetBrains_Mono'] pt-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#c3f400] shadow-[0_0_8px_#c3f400]"></span>
          <span className="text-white font-bold">Текущий период (2025–2026)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#febf1a]"></span>
          <span className="text-[#a3a6a6]">Среднее (3 года)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#6f7881]"></span>
          <span className="text-[#a3a6a6]">Прошлый год (2024–2025)</span>
        </div>
      </div>

      {/* График Chart.js */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
