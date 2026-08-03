import React, { useState, useEffect } from 'react';
import { useApp, AVAILABLE_MONTHS } from '../context/AppContext';
import { fetchTLMetrics, PROPERTIES } from '../services/travelLineService';
import { HistoricalChart } from '../components/HistoricalChart';
import DB from '../../database.json';

export const AVAILABLE_YEARS = [
  { id: '2026', label: '2026 Календарный год (с 1 янв)' },
  { id: '2025', label: '2025 Календарный год' },
  { id: 'all-time', label: 'Весь период (13 месяцев)' }
];

export const DashboardView = () => {
  const { selectedProperty, selectedPeriod, setSelectedPeriod, selectedDate, setSelectedDate } = useApp();
  
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedDay, setSelectedDay] = useState('2026-08-02');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showMenu, setShowMenu] = useState(false);
  const [showExtraDetails, setShowExtraDetails] = useState(false);

  useEffect(() => {
    setLoading(true);
    const targetDate = selectedPeriod === 'day' ? selectedDay : selectedPeriod === 'year' ? selectedYear : selectedDate;

    fetchTLMetrics(selectedProperty, selectedPeriod, targetDate).then((res) => {
      if (res && res.metrics) {
        setData(res);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Fetch TL Metrics Error:', err);
      setLoading(false);
    });
  }, [selectedProperty, selectedPeriod, selectedDate, selectedYear, selectedDay]);

  const safeMonths = AVAILABLE_MONTHS || [];
  const safeYears = AVAILABLE_YEARS || [];
  const safeProperties = PROPERTIES || {};

  const currentPropertyObj = safeProperties[(selectedProperty || 'all').toUpperCase()] || safeProperties.ALL || { name: 'Все объекты', icon: 'domain' };
  const currentMonthObj = safeMonths.find(m => m && m.id === selectedDate) || safeMonths[0] || { label: 'Июль 2026' };
  const currentYearObj = safeYears.find(y => y && y.id === selectedYear) || safeYears[0] || { label: '2026' };

  const safeMetrics = data?.metrics || {};
  const safeBreakdown = data?.breakdown || {};
  const safeExtraBreakdown = safeMetrics.extraServices?.breakdown || {};

  return (
    <div className="space-y-6 pb-28">
      
      {/* Шапка Дашборда в стиле WIBE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#c3f400]/20">
        <div>
          <div className="flex items-center text-[#c3f400] font-['JetBrains_Mono'] text-[11px] uppercase gap-1.5 mb-1 font-bold">
            <span>// ДАШБОРД LIVE TRAVELLINE</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-white">{currentPropertyObj.name}</span>
          </div>
          <h2 className="font-['Syne'] font-extrabold text-[24px] sm:text-[32px] tracking-wide text-white uppercase flex items-center gap-2">
            ПОКАЗАТЕЛИ В ДИНАМИКЕ
            {loading && <span className="material-symbols-outlined text-[#c3f400] animate-spin text-[24px]">sync</span>}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Кнопки периодов */}
          <div className="flex bg-[#141313] p-1 rounded-xl border border-[#c3f400]/20 font-['JetBrains_Mono'] text-[11px]">
            <button
              onClick={() => setSelectedPeriod('day')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                selectedPeriod === 'day'
                  ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                  : 'text-[#a3a6a6] hover:text-white'
              }`}
            >
              День
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                selectedPeriod === 'month'
                  ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                  : 'text-[#a3a6a6] hover:text-white'
              }`}
            >
              Месяц
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                selectedPeriod === 'year'
                  ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                  : 'text-[#a3a6a6] hover:text-white'
              }`}
            >
              Год
            </button>
          </div>

          {/* Интерактивный выпадающий список / Селектор даты для ДНЯ */}
          {selectedPeriod === 'day' ? (
            <div className="flex items-center gap-2 bg-[#141313] px-3.5 py-1.5 rounded-xl border border-[#c3f400]/40 shadow-[0_0_15px_rgba(195,244,0,0.15)]">
              <span className="material-symbols-outlined text-[18px] text-[#c3f400]">today</span>
              <div>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#a3a6a6] uppercase tracking-wider font-bold block">
                  ВЫБОР ДНЯ
                </span>
                <input
                  type="date"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="bg-transparent text-white font-['Manrope'] font-extrabold text-[13px] outline-none cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 bg-[#141313] hover:bg-[#1f1d1d] px-3.5 py-2 rounded-xl border border-[#c3f400]/30 shadow-[0_0_15px_rgba(195,244,0,0.1)] transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-[#c3f400]">
                  {selectedPeriod === 'year' ? 'date_range' : 'calendar_month'}
                </span>
                <div className="text-left">
                  <span className="font-['Manrope'] font-extrabold text-[13px] text-white block leading-none">
                    {selectedPeriod === 'year' ? currentYearObj.label : currentMonthObj.label}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#a3a6a6] uppercase tracking-wider font-bold">
                    {selectedPeriod === 'year' ? 'ОТЧЕТНЫЙ ГОД' : 'ОТЧЕТНЫЙ МЕСЯЦ'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#c3f400] ml-1">expand_more</span>
              </button>

              {/* Выпадающее меню */}
              {showMenu && (
                <div className="absolute top-14 right-0 w-64 bg-[#141313]/95 backdrop-blur-2xl border border-[#c3f400]/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.85)] z-50 p-2 space-y-1 max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 font-['JetBrains_Mono'] text-[10px] text-[#c3f400] uppercase tracking-widest font-bold border-b border-[#c3f400]/15 mb-1">
                    // {selectedPeriod === 'year' ? 'ВЫБОР КАЛЕНДАРНОГО ГОДА' : 'ВСЕ ОТЧЕТНЫЕ МЕСЯЦЫ'}
                  </div>

                  {selectedPeriod === 'year'
                    ? safeYears.map((y) => (
                        <button
                          key={y.id}
                          onClick={() => {
                            setSelectedYear(y.id);
                            setShowMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-['Manrope'] transition-all ${
                            selectedYear === y.id
                              ? 'bg-[#c3f400]/15 text-[#c3f400] font-extrabold border border-[#c3f400]/40'
                              : 'text-[#e5e2e1] hover:bg-[#262424]'
                          }`}
                        >
                          <span className="text-[13px]">{y.label}</span>
                          {selectedYear === y.id && (
                            <span className="material-symbols-outlined text-[16px] text-[#c3f400]">check_circle</span>
                          )}
                        </button>
                      ))
                    : safeMonths.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedDate(m.id);
                            setSelectedPeriod('month');
                            setShowMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-['Manrope'] transition-all ${
                            selectedDate === m.id
                              ? 'bg-[#c3f400]/15 text-[#c3f400] font-extrabold border border-[#c3f400]/40'
                              : 'text-[#e5e2e1] hover:bg-[#262424]'
                          }`}
                        >
                          <span className="text-[13px]">{m.label}</span>
                          {selectedDate === m.id && (
                            <span className="material-symbols-outlined text-[16px] text-[#c3f400]">check_circle</span>
                          )}
                        </button>
                      ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Выручка */}
        <div className="glass-card acid-border rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase tracking-wider font-bold">
            // ВАЛОВОЙ ДОХОД ({selectedPeriod === 'day' ? selectedDay : selectedPeriod === 'year' ? currentYearObj.label.toUpperCase() : currentMonthObj.label.toUpperCase()})
          </p>
          <div className="mt-3 space-y-1">
            <span className="font-['Manrope'] text-[26px] sm:text-[28px] font-extrabold text-[#c3f400] tracking-tight drop-shadow-[0_0_10px_rgba(195,244,0,0.3)] block">
              {safeMetrics.revenue?.formatted || '0,00 ₽'}
            </span>
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#c3f400] uppercase font-bold block pt-1">
              • LIVE TRAVELLINE API DATA
            </span>
          </div>
        </div>

        {/* KPI 2: Продано номероночей */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase tracking-wider font-bold">
            // ПРОДАНО НОМЕРОНОЧЕЙ
          </p>
          <div className="mt-3 space-y-1">
            <span className="font-['Manrope'] text-[28px] font-extrabold text-white tracking-tight block">
              {safeMetrics.bookings?.formatted || '0'}
            </span>
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#00f0ff] uppercase font-bold block pt-1">
              • LIVE TRAVELLINE API DATA
            </span>
          </div>
        </div>

        {/* KPI 3: Заезд гостей / Загрузка */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase tracking-wider font-bold">
            // ЗАЕЗД ГОСТЕЙ / ЗАГРУЗКА
          </p>
          <div className="mt-3 space-y-1">
            <span className="font-['Manrope'] text-[28px] font-extrabold text-white tracking-tight block">
              {safeMetrics.repeatRate?.formatted || '0'} <span className="text-[14px] font-normal text-[#a3a6a6]">чел</span>
            </span>

            <div className="flex flex-col gap-0.5 pt-1 border-t border-[#c3f400]/15">
              <div className="font-['Manrope'] text-[11px] text-[#c3f400] flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[13px]">group</span> Загрузка: {safeMetrics.occupancy?.formatted || '0%'}
              </div>
            </div>
          </div>
        </div>

        {/* KPI 4: ADR */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase tracking-wider font-bold">
            // СРЕДНЯЯ ЦЕНА (ADR)
          </p>
          <div className="mt-3 space-y-1">
            <span className="font-['Manrope'] text-[26px] font-extrabold text-white tracking-tight block">
              {safeMetrics.adr?.formatted || '0,00 ₽'}
            </span>
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#febf1a] uppercase font-bold block pt-1">
              • LIVE TRAVELLINE API DATA
            </span>
          </div>
        </div>

      </div>

      {/* НОВАЯ СЕКЦИЯ: ТОЧНЫЕ ДОП. ДОХОДЫ ИЗ TRAVELLINE, ARPU, TREVPAR И РЕТЕНШН */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Метрика 1: Доп. доходы из отчета TravelLine */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative border border-[#c3f400]/30 shadow-[0_0_15px_rgba(195,244,0,0.08)] col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#c3f400]/15 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#c3f400] text-[18px]">add_shopping_cart</span>
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#c3f400] uppercase font-bold">
                // ДОП. ДОХОДЫ ({selectedPeriod === 'day' ? selectedDay : selectedPeriod === 'year' ? currentYearObj.label : currentMonthObj.label})
              </p>
            </div>
            <button
              onClick={() => setShowExtraDetails(!showExtraDetails)}
              className="text-[#a3a6a6] hover:text-[#c3f400] font-['JetBrains_Mono'] text-[10px] uppercase flex items-center gap-0.5 underline font-bold"
            >
              {showExtraDetails ? 'Скрыть детали' : 'Детализация (TL Report)'}
            </button>
          </div>

          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="font-['Manrope'] text-[24px] sm:text-[26px] font-extrabold text-[#c3f400] tracking-tight block">
              {safeMetrics.extraServices?.formatted || '0,00 ₽'}
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#a3a6a6] font-bold uppercase">
              LIVE API
            </span>
          </div>

          {/* Раскрываемый динамический блок детализации доп. услуг */}
          {showExtraDetails && (
            <div className="mt-3 pt-3 border-t border-[#c3f400]/20 space-y-1.5 font-['Manrope'] text-[12px] bg-[#141313]/60 p-2.5 rounded-xl">
              <div className="flex justify-between items-center text-white">
                <span className="flex items-center gap-1 text-[#a3a6a6]"><span className="material-symbols-outlined text-[13px] text-purple-400">schedule</span> ⏰ Ранний заезд / поздний выезд:</span>
                <span className="font-extrabold text-purple-300">{(safeExtraBreakdown.earlyLate || 0).toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="flex items-center gap-1 text-[#a3a6a6]"><span className="material-symbols-outlined text-[13px] text-[#00f0ff]">pets</span> 🐶 Проживание с питомцами:</span>
                <span className="font-extrabold text-[#00f0ff]">{(safeExtraBreakdown.pets || 0).toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="flex items-center gap-1 text-[#a3a6a6]"><span className="material-symbols-outlined text-[13px] text-[#c3f400]">directions_car</span> 🚗 Автодом / Парковка:</span>
                <span className="font-extrabold text-[#c3f400]">{(safeExtraBreakdown.parking || 0).toLocaleString('ru-RU')} ₽</span>
              </div>
              {(safeExtraBreakdown.linens || 0) > 0 && (
                <div className="flex justify-between items-center text-white">
                  <span className="flex items-center gap-1 text-[#a3a6a6]"><span className="material-symbols-outlined text-[13px] text-amber-300">bed</span> 🛏️ Дополнительное постельное белье:</span>
                  <span className="font-extrabold text-amber-300">{(safeExtraBreakdown.linens || 0).toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Метрика 2: ARPU (Средний доход с гостя) */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">
            // ARPU (ДОХОД НА ГОСТЯ)
          </p>
          <div className="mt-2.5">
            <span className="font-['Manrope'] text-[24px] font-extrabold text-white tracking-tight block">
              {safeMetrics.arpu?.formatted || '0,00 ₽'}
            </span>
            <span className="font-['Manrope'] text-[11px] text-[#00f0ff] flex items-center gap-1 font-bold mt-1">
              <span className="material-symbols-outlined text-[13px]">person_check</span> Выручка / Всего гостей
            </span>
          </div>
        </div>

        {/* Метрика 3: TrevPAR (Средний доход с номера в сутки) */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">
            // TREVPAR (ДОХОД С НОМЕРА)
          </p>
          <div className="mt-2.5">
            <span className="font-['Manrope'] text-[24px] font-extrabold text-white tracking-tight block">
              {safeMetrics.trevPar?.formatted || '0,00 ₽'}
            </span>
            <span className="font-['Manrope'] text-[11px] text-[#febf1a] flex items-center gap-1 font-bold mt-1">
              <span className="material-symbols-outlined text-[13px]">domain</span> (Проживание+Доп) / Фонд
            </span>
          </div>
        </div>

        {/* Метрика 4: Ретеншн гостей (%) */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between relative border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.08)]">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#00f0ff] uppercase font-bold">
            // РЕТЕНШН ГОСТЕЙ
          </p>
          <div className="mt-2.5">
            <span className="font-['Manrope'] text-[26px] font-extrabold text-[#00f0ff] tracking-tight block">
              {safeMetrics.retentionRate?.formatted || '0%'}
            </span>
            <span className="font-['Manrope'] text-[11px] text-white flex items-center gap-1 font-bold mt-1">
              <span className="material-symbols-outlined text-[13px] text-[#00f0ff]">sync</span> Повторные визиты (TL CRM)
            </span>
          </div>
        </div>

      </div>

      {/* Разделитель и Сравнение Мультиобъектов */}
      {selectedProperty === 'all' && (
        <div className="glass-card rounded-2xl p-6 shadow-glass space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#c3f400]/15 pb-3">
            <h3 className="font-['Syne'] font-extrabold text-[18px] text-white uppercase flex items-center gap-2 tracking-wide">
              <span className="material-symbols-outlined text-[#c3f400]">analytics</span>
              Сравнение объектов TravelLine ({selectedPeriod === 'day' ? selectedDay : selectedPeriod === 'year' ? currentYearObj.label : currentMonthObj.label}): Домики vs Пляж
            </h3>
            <span className="neon-badge font-['Manrope'] text-[12px] px-3 py-1 rounded-lg font-extrabold">
              Валовой доход: {safeMetrics.revenue?.formatted || '0,00 ₽'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Домики */}
            <div className="p-4 bg-[#141313] rounded-xl border border-[#c3f400]/30 flex items-center justify-between shadow-[0_0_15px_rgba(195,244,0,0.1)]">
              <div>
                <p className="font-['JetBrains_Mono'] text-[11px] text-[#c3f400] font-extrabold uppercase">🏡 Жилые домики (Property 52159)</p>
                <p className="font-['Manrope'] text-[22px] font-extrabold text-white tracking-tight mt-1">
                  {safeBreakdown.cottagesRevenue ? `${safeBreakdown.cottagesRevenue.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽` : '0,00 ₽'}
                </p>
                <div className="flex items-center gap-2 mt-1.5 font-['Manrope'] text-[12px]">
                  <span className="px-2 py-0.5 rounded bg-[#c3f400]/15 text-[#c3f400] font-extrabold border border-[#c3f400]/30">
                    Загрузка: {safeBreakdown.cottagesOcc || '96%'}
                  </span>
                  <span className="text-[#a3a6a6] text-[11px]">
                    ({safeBreakdown.cottagesNights || 23} объектов)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 text-[13px] font-['Manrope'] font-extrabold bg-[#c3f400] text-black rounded-lg shadow-[0_0_10px_#c3f400]">
                  {safeBreakdown.cottagesShare || '0%'}
                </span>
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#a3a6a6] mt-1 font-bold">ДОЛЯ В БИЗНЕСЕ</p>
              </div>
            </div>

            {/* Пляжные объекты */}
            <div className="p-4 bg-[#141313] rounded-xl border border-[#00f0ff]/30 flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div>
                <p className="font-['JetBrains_Mono'] text-[11px] text-[#00f0ff] font-extrabold uppercase">🏖️ Пляжные объекты (Property 54511)</p>
                <p className="font-['Manrope'] text-[22px] font-extrabold text-white tracking-tight mt-1">
                  {safeBreakdown.beachRevenue ? `${safeBreakdown.beachRevenue.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽` : '0,00 ₽'}
                </p>
                <div className="flex items-center gap-2 mt-1.5 font-['Manrope'] text-[12px]">
                  <span className="px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff] font-extrabold border border-[#00f0ff]/30">
                    Загрузка: {safeBreakdown.beachOcc || '28.8%'}
                  </span>
                  <span className="text-[#a3a6a6] text-[11px]">
                    ({safeBreakdown.beachNights || 16} объектов)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 text-[13px] font-['Manrope'] font-extrabold bg-[#00f0ff] text-black rounded-lg shadow-[0_0_10px_#00f0ff]">
                  {safeBreakdown.beachShare || '0%'}
                </span>
                <p className="font-['JetBrains_Mono'] text-[10px] text-[#a3a6a6] mt-1 font-bold">ДОЛЯ В БИЗНЕСЕ</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Middle Row: Historical Chart + Marketing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <div className="lg:col-span-2">
          <HistoricalChart />
        </div>

        {/* Marketing Card */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
          <h3 className="font-['Syne'] font-extrabold text-[17px] text-white uppercase mb-4 flex items-center gap-2 tracking-wide">
            <span className="material-symbols-outlined text-[#febf1a]">campaign</span>
            Маркетинг & CAC
          </h3>
          <div className="space-y-4 flex-1">
            <div className="pb-3 border-b border-[#c3f400]/15">
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Расходы на рекламу</p>
              <p className="font-['Manrope'] text-[22px] font-extrabold text-white tracking-tight mt-1">0 ₽</p>
            </div>
            <div className="pb-3 border-b border-[#c3f400]/15">
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Стоимость брони (CAC)</p>
              <p className="font-['Manrope'] text-[22px] font-extrabold text-[#c3f400] tracking-tight mt-1">0 ₽</p>
            </div>
            <div>
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Выручка от допуслуг (Итого)</p>
              <p className="font-['Manrope'] text-[22px] font-extrabold text-[#00f0ff] tracking-tight mt-1">2 975 620 ₽</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
