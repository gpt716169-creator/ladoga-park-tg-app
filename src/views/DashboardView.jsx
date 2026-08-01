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

// Функция математического расчета показателей с двойным сравнением для ВСЕХ 4 КАРТОЧЕК (Доход, Ночероночи, Загрузка, ADR)
const getMetricsForSelected = (selectedDate, selectedYear, propertyId, period) => {
  const monthsList = Object.keys(DB.cottages.monthly);

  let revenue = 0;
  let prevRevenueMonth = 0;
  let prevRevenueYear = 0;

  let nightsSold = 0;
  let prevNightsMonth = 0;
  let prevNightsYear = 0;

  let guestArrivals = 0;

  let occupancy = 0;
  let prevOccMonth = 0;
  let prevOccYear = 0;

  let adr = 0;
  let prevAdrMonth = 0;
  let prevAdrYear = 0;

  let cottagesRev = 0;
  let beachRev = 0;
  let cottagesOcc = '0%';
  let beachOcc = '0%';
  let cottagesNights = 0;
  let beachNights = 0;

  if (period === 'day') {
    if (propertyId === 'cottages') {
      revenue = 453808.00;
      prevRevenueMonth = 410000.00;
      prevRevenueYear = 380000.00;
      nightsSold = 23;
      prevNightsMonth = 20;
      prevNightsYear = 18;
      guestArrivals = 29;
      occupancy = 96.0;
      prevOccMonth = 90.0;
      prevOccYear = 85.0;
      adr = 19730.78;
      prevAdrMonth = 18000.00;
      prevAdrYear = 17500.00;
      cottagesRev = 453808.00;
      cottagesOcc = '96.0%';
      cottagesNights = 23;
    } else if (propertyId === 'beach') {
      revenue = 372000.00;
      prevRevenueMonth = 310000.00;
      prevRevenueYear = 300000.00;
      nightsSold = 18;
      prevNightsMonth = 15;
      prevNightsYear = 14;
      guestArrivals = 25;
      occupancy = 88.0;
      prevOccMonth = 80.0;
      prevOccYear = 78.0;
      adr = 20666.66;
      prevAdrMonth = 19000.00;
      prevAdrYear = 18500.00;
      beachRev = 372000.00;
      beachOcc = '88.0%';
      beachNights = 18;
    } else {
      revenue = 825808.00;
      prevRevenueMonth = 720000.00;
      prevRevenueYear = 680000.00;
      nightsSold = 41;
      prevNightsMonth = 35;
      prevNightsYear = 32;
      guestArrivals = 54;
      occupancy = 92.0;
      prevOccMonth = 85.0;
      prevOccYear = 81.0;
      adr = 20141.65;
      prevAdrMonth = 18500.00;
      prevAdrYear = 18000.00;
      cottagesRev = 453808.00;
      beachRev = 372000.00;
      cottagesOcc = '96.0%';
      beachOcc = '88.0%';
      cottagesNights = 23;
      beachNights = 18;
    }
  } else if (period === 'month') {
    const monthKey = selectedDate;
    const currentIndex = monthsList.indexOf(monthKey);
    const prevMonthKey = currentIndex > 0 ? monthsList[currentIndex - 1] : monthKey;

    const [yearStr, mStr] = monthKey.split('-');
    const prevYearKey = `${parseInt(yearStr) - 1}-${mStr}`;

    const currentCottages = DB.cottages.monthly[monthKey] || DB.cottages.monthly['2026-07'];
    const currentBeach = DB.beach.monthly[monthKey] || DB.beach.monthly['2026-07'];

    const prevCottages = DB.cottages.monthly[prevMonthKey] || currentCottages;
    const prevBeach = DB.beach.monthly[prevMonthKey] || currentBeach;

    const yoyCottages = DB.cottages.monthly[prevYearKey] || { revenue: currentCottages.revenue * 0.9, soldNights: Math.round(currentCottages.soldNights * 0.9), occupancy: currentCottages.occupancy * 0.9, adr: currentCottages.adr * 0.9 };
    const yoyBeach = DB.beach.monthly[prevYearKey] || { revenue: currentBeach.revenue * 0.9, soldNights: Math.round(currentBeach.soldNights * 0.9), occupancy: currentBeach.occupancy * 0.9, adr: currentBeach.adr * 0.9 };

    if (propertyId === 'cottages') {
      revenue = currentCottages.revenue;
      prevRevenueMonth = prevCottages.revenue;
      prevRevenueYear = yoyCottages.revenue;

      nightsSold = currentCottages.soldNights;
      prevNightsMonth = prevCottages.soldNights;
      prevNightsYear = yoyCottages.soldNights;

      guestArrivals = currentCottages.guests;
      
      occupancy = currentCottages.occupancy;
      prevOccMonth = prevCottages.occupancy;
      prevOccYear = yoyCottages.occupancy;

      adr = currentCottages.adr;
      prevAdrMonth = prevCottages.adr;
      prevAdrYear = yoyCottages.adr;

      cottagesRev = currentCottages.revenue;
      cottagesOcc = `${currentCottages.occupancy}%`;
      cottagesNights = currentCottages.soldNights;
    } else if (propertyId === 'beach') {
      revenue = currentBeach.revenue;
      prevRevenueMonth = prevCottages.revenue;
      prevRevenueYear = yoyBeach.revenue;

      nightsSold = currentBeach.soldNights;
      prevNightsMonth = prevBeach.soldNights;
      prevNightsYear = yoyBeach.soldNights;

      guestArrivals = currentBeach.guests;

      occupancy = currentBeach.occupancy;
      prevOccMonth = prevBeach.occupancy;
      prevOccYear = yoyBeach.occupancy;

      adr = currentBeach.adr;
      prevAdrMonth = prevBeach.adr;
      prevAdrYear = yoyBeach.adr;

      beachRev = currentBeach.revenue;
      beachOcc = `${currentBeach.occupancy}%`;
      beachNights = currentBeach.soldNights;
    } else {
      revenue = currentCottages.revenue + currentBeach.revenue;
      prevRevenueMonth = prevCottages.revenue + prevBeach.revenue;
      prevRevenueYear = yoyCottages.revenue + yoyBeach.revenue;

      nightsSold = currentCottages.soldNights + currentBeach.soldNights;
      prevNightsMonth = prevCottages.soldNights + prevBeach.soldNights;
      prevNightsYear = yoyCottages.soldNights + yoyBeach.soldNights;

      guestArrivals = currentCottages.guests + currentBeach.guests;

      occupancy = parseFloat(((currentCottages.occupancy * currentCottages.totalRooms + currentBeach.occupancy * currentBeach.totalRooms) / (currentCottages.totalRooms + currentBeach.totalRooms)).toFixed(2));
      prevOccMonth = parseFloat(((prevCottages.occupancy * prevCottages.totalRooms + prevBeach.occupancy * prevBeach.totalRooms) / (prevCottages.totalRooms + prevBeach.totalRooms)).toFixed(2));
      prevOccYear = parseFloat(((yoyCottages.occupancy * yoyCottages.totalRooms + yoyBeach.occupancy * yoyBeach.totalRooms) / (yoyCottages.totalRooms + yoyBeach.totalRooms)).toFixed(2));

      adr = parseFloat((revenue / nightsSold).toFixed(2));
      prevAdrMonth = parseFloat((prevRevenueMonth / prevNightsMonth).toFixed(2));
      prevAdrYear = parseFloat((prevRevenueYear / prevNightsYear).toFixed(2));

      cottagesRev = currentCottages.revenue;
      beachRev = currentBeach.revenue;
      cottagesOcc = `${currentCottages.occupancy}%`;
      beachOcc = `${currentBeach.occupancy}%`;
      cottagesNights = currentCottages.soldNights;
      beachNights = currentBeach.soldNights;
    }
  } else if (period === 'year') {
    let yearMonths = [];
    if (selectedYear === '2026') {
      yearMonths = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'];
      prevRevenueMonth = 21500000.00;
      prevRevenueYear = 20000000.00;
      prevNightsMonth = 1900;
      prevNightsYear = 1800;
      prevOccMonth = 16.5;
      prevOccYear = 15.0;
      prevAdrMonth = 9500.00;
      prevAdrYear = 9000.00;
    } else if (selectedYear === '2025') {
      yearMonths = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];
      prevRevenueMonth = 20000000.00;
      prevRevenueYear = 18000000.00;
      prevNightsMonth = 1800;
      prevNightsYear = 1600;
      prevOccMonth = 18.0;
      prevOccYear = 16.0;
      prevAdrMonth = 9000.00;
      prevAdrYear = 8500.00;
    } else {
      yearMonths = monthsList;
      prevRevenueMonth = 43000000.00;
      prevRevenueYear = 40000000.00;
      prevNightsMonth = 4200;
      prevNightsYear = 4000;
      prevOccMonth = 20.0;
      prevOccYear = 18.0;
      prevAdrMonth = 9800.00;
      prevAdrYear = 9200.00;
    }

    let cSumRev = 0, cSumNights = 0, cSumGuests = 0;
    let bSumRev = 0, bSumNights = 0, bSumGuests = 0;

    yearMonths.forEach(m => {
      if (DB.cottages.monthly[m]) {
        cSumRev += DB.cottages.monthly[m].revenue;
        cSumNights += DB.cottages.monthly[m].soldNights;
        cSumGuests += DB.cottages.monthly[m].guests;
      }
      if (DB.beach.monthly[m]) {
        bSumRev += DB.beach.monthly[m].revenue;
        bSumNights += DB.beach.monthly[m].soldNights;
        bSumGuests += DB.beach.monthly[m].guests;
      }
    });

    if (propertyId === 'cottages') {
      revenue = cSumRev;
      nightsSold = cSumNights;
      guestArrivals = cSumGuests;
      occupancy = selectedYear === '2026' ? 27.5 : 32.2;
      adr = parseFloat((revenue / (nightsSold || 1)).toFixed(2));
      cottagesRev = cSumRev;
      cottagesOcc = `${occupancy}%`;
      cottagesNights = cSumNights;
    } else if (propertyId === 'beach') {
      revenue = bSumRev;
      nightsSold = bSumNights;
      guestArrivals = bSumGuests;
      occupancy = selectedYear === '2026' ? 11.2 : 12.4;
      adr = parseFloat((revenue / (nightsSold || 1)).toFixed(2));
      beachRev = bSumRev;
      beachOcc = `${occupancy}%`;
      beachNights = bSumNights;
    } else {
      revenue = cSumRev + bSumRev;
      nightsSold = cSumNights + bSumNights;
      guestArrivals = cSumGuests + bSumGuests;
      occupancy = selectedYear === '2026' ? 19.35 : 22.33;
      adr = parseFloat((revenue / (nightsSold || 1)).toFixed(2));
      cottagesRev = cSumRev;
      beachRev = bSumRev;
      cottagesOcc = selectedYear === '2026' ? '27.5%' : '32.2%';
      beachOcc = selectedYear === '2026' ? '11.2%' : '12.4%';
      cottagesNights = cSumNights;
      beachNights = bSumNights;
    }
  }

  // ВЫЧИСЛЕНИЕ ДИНАМИКИ MOM И YOY ДЛЯ ВСЕХ 4 КАРТОЧЕК
  const getDiff = (curr, prev) => {
    if (!prev || prev === 0) return { pct: '0%', isPositive: true };
    const pct = (((curr - prev) / prev) * 100).toFixed(1);
    return {
      pct: pct >= 0 ? `+${pct}%` : `${pct}%`,
      isPositive: pct >= 0
    };
  };

  const revMoM = getDiff(revenue, prevRevenueMonth);
  const revYoY = getDiff(revenue, prevRevenueYear);

  const nightsMoM = getDiff(nightsSold, prevNightsMonth);
  const nightsYoY = getDiff(nightsSold, prevNightsYear);

  const occMoM = getDiff(occupancy, prevOccMonth);
  const occYoY = getDiff(occupancy, prevOccYear);

  const adrMoM = getDiff(adr, prevAdrMonth);
  const adrYoY = getDiff(adr, prevAdrYear);

  const totalRev = (cottagesRev + beachRev) || 1;

  return {
    metrics: {
      revenue: {
        value: revenue,
        formatted: `${revenue.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`,
        momChange: revMoM.pct,
        momPositive: revMoM.isPositive,
        yoyChange: revYoY.pct,
        yoyPositive: revYoY.isPositive,
        isBest: propertyId === 'all' && (selectedDate === '2026-07' || selectedYear === 'all-time')
      },
      bookings: {
        value: nightsSold,
        formatted: nightsSold.toLocaleString('ru-RU'),
        momChange: nightsMoM.pct,
        momPositive: nightsMoM.isPositive,
        yoyChange: nightsYoY.pct,
        yoyPositive: nightsYoY.isPositive
      },
      repeatRate: {
        value: guestArrivals,
        formatted: guestArrivals.toLocaleString('ru-RU')
      },
      occupancy: {
        value: occupancy,
        formatted: `${occupancy}%`,
        momChange: occMoM.pct,
        momPositive: occMoM.isPositive,
        yoyChange: occYoY.pct,
        yoyPositive: occYoY.isPositive
      },
      adr: {
        value: adr,
        formatted: `${adr.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`,
        momChange: adrMoM.pct,
        momPositive: adrMoM.isPositive,
        yoyChange: adrYoY.pct,
        yoyPositive: adrYoY.isPositive
      }
    },
    breakdown: {
      cottagesRevenue: cottagesRev,
      beachRevenue: beachRev,
      totalRevenue: totalRev,
      cottagesShare: `${((cottagesRev / totalRev) * 100).toFixed(1)}%`,
      beachShare: `${((beachRev / totalRev) * 100).toFixed(1)}%`,
      cottagesOcc,
      beachOcc,
      cottagesNights,
      beachNights
    }
  };
};

export const DashboardView = () => {
  const { selectedProperty, selectedPeriod, setSelectedPeriod, selectedDate, setSelectedDate } = useApp();
  
  const [selectedYear, setSelectedYear] = useState('2026');

  const [data, setData] = useState(() => {
    return getMetricsForSelected(selectedDate, selectedYear, selectedProperty, selectedPeriod);
  });

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const freshData = getMetricsForSelected(selectedDate, selectedYear, selectedProperty, selectedPeriod);
    setData(freshData);

    fetchTLMetrics(selectedProperty, selectedPeriod, selectedDate).then((res) => {
      if (res && res.metrics && res.breakdown) {
        setData(res);
      }
    });
  }, [selectedProperty, selectedPeriod, selectedDate, selectedYear]);

  const currentPropertyObj = PROPERTIES[selectedProperty.toUpperCase()] || PROPERTIES.ALL;
  const currentMonthObj = AVAILABLE_MONTHS.find(m => m.id === selectedDate) || AVAILABLE_MONTHS[0];
  const currentYearObj = AVAILABLE_YEARS.find(y => y.id === selectedYear) || AVAILABLE_YEARS[0];

  const safeMetrics = data?.metrics || {};
  const safeBreakdown = data?.breakdown || {};

  return (
    <div className="space-y-6 pb-28">
      
      {/* Шапка Дашборда в стиле WIBE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#c3f400]/20">
        <div>
          <div className="flex items-center text-[#c3f400] font-['JetBrains_Mono'] text-[11px] uppercase gap-1.5 mb-1 font-bold">
            <span>// ДАШБОРД</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-white">{currentPropertyObj.name}</span>
          </div>
          <h2 className="font-['Syne'] font-extrabold text-[24px] sm:text-[32px] tracking-wide text-white uppercase">
            ПОКАЗАТЕЛИ В ДИНАМИКЕ
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

          {/* Интерактивный выпадающий список */}
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
                  ? AVAILABLE_YEARS.map((y) => (
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
                  : AVAILABLE_MONTHS.map((m) => (
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

        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Выручка */}
        <div className="glass-card acid-border rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
          {safeMetrics.revenue?.isBest && (
            <div className="absolute top-0 right-0 neon-badge px-3 py-1 rounded-bl-xl font-['JetBrains_Mono'] text-[10px] flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[13px]">emoji_events</span> ЛУЧШИЙ
            </div>
          )}
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase tracking-wider font-bold">
            // ДОХОД ЗА ПРОЖИВАНИЕ ({selectedPeriod === 'day' ? '1 АВГУСТА' : selectedPeriod === 'year' ? currentYearObj.label.toUpperCase() : currentMonthObj.label.toUpperCase()})
          </p>
          <div className="mt-3 space-y-1">
            <span className="font-['Manrope'] text-[26px] sm:text-[28px] font-extrabold text-[#c3f400] tracking-tight drop-shadow-[0_0_10px_rgba(195,244,0,0.3)] block">
              {safeMetrics.revenue?.formatted || '0,00 ₽'}
            </span>

            <div className="flex flex-col gap-0.5 pt-1 border-t border-[#c3f400]/15">
              <div className={`font-['Manrope'] text-[11px] flex items-center gap-1 font-bold ${safeMetrics.revenue?.momPositive ? 'text-[#c3f400]' : 'text-red-400'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {safeMetrics.revenue?.momPositive ? 'trending_up' : 'trending_down'}
                </span> 
                {safeMetrics.revenue?.momChange} к прош. месяцу (MoM)
              </div>

              {selectedPeriod === 'month' && (
                <div className={`font-['Manrope'] text-[11px] flex items-center gap-1 font-bold ${safeMetrics.revenue?.yoyPositive ? 'text-[#00f0ff]' : 'text-amber-400'}`}>
                  <span className="material-symbols-outlined text-[13px]">
                    {safeMetrics.revenue?.yoyPositive ? 'flight_takeoff' : 'flight_land'}
                  </span> 
                  {safeMetrics.revenue?.yoyChange} к тому же месяцу год назад (YoY)
                </div>
              )}
            </div>
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

            <div className="flex flex-col gap-0.5 pt-1 border-t border-[#c3f400]/15">
              <div className={`font-['Manrope'] text-[11px] flex items-center gap-1 font-bold ${safeMetrics.bookings?.momPositive ? 'text-[#00f0ff]' : 'text-red-400'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {safeMetrics.bookings?.momPositive ? 'trending_up' : 'trending_down'}
                </span> 
                {safeMetrics.bookings?.momChange} к прош. месяцу (MoM)
              </div>

              {selectedPeriod === 'month' && (
                <div className={`font-['Manrope'] text-[11px] flex items-center gap-1 font-bold ${safeMetrics.bookings?.yoyPositive ? 'text-[#00f0ff]' : 'text-amber-400'}`}>
                  <span className="material-symbols-outlined text-[13px]">
                    {safeMetrics.bookings?.yoyPositive ? 'flight_takeoff' : 'flight_land'}
                  </span> 
                  {safeMetrics.bookings?.yoyChange} к тому же месяцу год назад (YoY)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KPI 3: Заезд гостей */}
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
              {selectedPeriod === 'month' && (
                <div className={`font-['Manrope'] text-[10px] flex items-center gap-1 font-bold ${safeMetrics.occupancy?.momPositive ? 'text-[#c3f400]' : 'text-red-400'}`}>
                  <span>MoM: {safeMetrics.occupancy?.momChange}</span>
                  <span className="text-[#a3a6a6]">|</span>
                  <span className={safeMetrics.occupancy?.yoyPositive ? 'text-[#00f0ff]' : 'text-amber-400'}>YoY: {safeMetrics.occupancy?.yoyChange} год назад</span>
                </div>
              )}
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

            <div className="flex flex-col gap-0.5 pt-1 border-t border-[#c3f400]/15">
              <div className={`font-['Manrope'] text-[11px] flex items-center gap-1 font-bold ${safeMetrics.adr?.momPositive ? 'text-[#febf1a]' : 'text-red-400'}`}>
                <span className="material-symbols-outlined text-[13px]">analytics</span>
                {safeMetrics.adr?.momChange} к прош. месяцу (MoM)
              </div>

              {selectedPeriod === 'month' && (
                <div className={`font-['Manrope'] text-[11px] flex items-center gap-1 font-bold ${safeMetrics.adr?.yoyPositive ? 'text-[#00f0ff]' : 'text-amber-400'}`}>
                  <span className="material-symbols-outlined text-[13px]">
                    {safeMetrics.adr?.yoyPositive ? 'flight_takeoff' : 'flight_land'}
                  </span> 
                  {safeMetrics.adr?.yoyChange} к тому же месяцу год назад (YoY)
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Разделитель и Сравнение Мультиобъектов */}
      {selectedProperty === 'all' && (
        <div className="glass-card rounded-2xl p-6 shadow-glass space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#c3f400]/15 pb-3">
            <h3 className="font-['Syne'] font-extrabold text-[18px] text-white uppercase flex items-center gap-2 tracking-wide">
              <span className="material-symbols-outlined text-[#c3f400]">analytics</span>
              Сравнение объектов TravelLine ({selectedPeriod === 'day' ? '1 Августа' : selectedPeriod === 'year' ? currentYearObj.label : currentMonthObj.label}): Домики vs Пляж
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
                    Загрузка: {safeBreakdown.cottagesOcc || '27.5%'}
                  </span>
                  <span className="text-[#a3a6a6] text-[11px]">
                    ({safeBreakdown.cottagesNights || 1215} ночей)
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
                    Загрузка: {safeBreakdown.beachOcc || '11.2%'}
                  </span>
                  <span className="text-[#a3a6a6] text-[11px]">
                    ({safeBreakdown.beachNights || 1309} объектов)
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

        {/* Marketing Card: Расходы на рекламу = 0, Стоимость брони CAC = 0 */}
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
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Выручка от допуслуг</p>
              <p className="font-['Manrope'] text-[22px] font-extrabold text-[#00f0ff] tracking-tight mt-1">2 975 620 ₽</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
