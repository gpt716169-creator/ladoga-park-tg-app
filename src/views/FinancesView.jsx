import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const FinancesView = () => {
  const { selectedProperty } = useApp();
  const [activeTab, setActiveTab] = useState('pnl');

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#c3f400]/20">
        <div>
          <div className="flex items-center text-[#c3f400] font-['JetBrains_Mono'] text-[11px] uppercase gap-1.5 mb-1 font-bold">
            <span>// ФИНАНСЫ</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-white">P&L И ОТЧЕТ ПО ПЛАТЕЖАМ TRAVELLINE</span>
          </div>
          <h2 className="font-['Syne'] font-extrabold text-[24px] sm:text-[32px] tracking-wide text-white uppercase">
            ФИНАНСОВАЯ АНАЛИТИКА
          </h2>
        </div>

        {/* Переключатель вкладок P&L vs Отчет по платежам */}
        <div className="flex bg-[#141313] p-1 rounded-xl border border-[#c3f400]/20 font-['JetBrains_Mono'] text-[11px]">
          <button
            onClick={() => setActiveTab('pnl')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'pnl'
                ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                : 'text-[#a3a6a6] hover:text-white'
            }`}
          >
            P&L Отчет
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'payments'
                ? 'bg-[#c3f400] text-black font-extrabold shadow-[0_0_15px_rgba(195,244,0,0.4)]'
                : 'text-[#a3a6a6] hover:text-white'
            }`}
          >
            Отчет по платежам
          </button>
        </div>
      </div>

      {activeTab === 'pnl' ? (
        <>
          {/* Summary Financial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card acid-border rounded-2xl p-5">
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">// ВАЛОВОЙ ДОХОД (13 МЕС)</p>
              <p className="font-['Manrope'] text-[28px] font-extrabold text-[#c3f400] tracking-tight mt-2">56 493 600,54 ₽</p>
              <p className="font-['Manrope'] text-[12px] text-[#a3a6a6] mt-1">Проживание + Дополнительные услуги</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">// ДОХОД ОТ ДОПУСЛУГ</p>
              <p className="font-['Manrope'] text-[28px] font-extrabold text-[#00f0ff] tracking-tight mt-2">2 975 620,00 ₽</p>
              <p className="font-['Manrope'] text-[12px] text-[#a3a6a6] mt-1">Парковка, бани, купели, питомцы</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">// СРЕДНИЙ ЧЕК С БРОНИ</p>
              <p className="font-['Manrope'] text-[28px] font-extrabold text-[#febf1a] tracking-tight mt-2">10 436,42 ₽</p>
              <p className="font-['Manrope'] text-[12px] text-[#a3a6a6] mt-1">Средняя стоимость номероночи (ADR)</p>
            </div>
          </div>

          {/* Detailed Extra Services P&L Breakdown */}
          <div className="glass-card rounded-2xl p-6 shadow-glass space-y-4">
            <h3 className="font-['Syne'] font-extrabold text-[18px] text-white uppercase flex items-center gap-2 tracking-wide border-b border-[#c3f400]/15 pb-3">
              <span className="material-symbols-outlined text-[#c3f400]">account_balance_wallet</span>
              Структура дополнительных доходов (13 месяцев)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 font-['Manrope']">
              <div className="p-4 bg-[#141313] rounded-xl border border-[#c3f400]/30">
                <div className="flex justify-between items-center text-[#c3f400] text-[13px] font-extrabold uppercase">
                  <span>🚗 Парковка</span>
                  <span>40.9%</span>
                </div>
                <p className="text-[22px] font-extrabold text-white mt-1">1 217 170 ₽</p>
                <p className="text-[11px] text-[#a3a6a6] mt-1 font-['JetBrains_Mono']">Официальный отчет TL Services</p>
              </div>

              <div className="p-4 bg-[#141313] rounded-xl border border-[#febf1a]/30">
                <div className="flex justify-between items-center text-[#febf1a] text-[13px] font-extrabold uppercase">
                  <span>♨️ Сибирская Купель</span>
                  <span>15.9%</span>
                </div>
                <p className="text-[22px] font-extrabold text-white mt-1">471 750 ₽</p>
                <p className="text-[11px] text-[#a3a6a6] mt-1 font-['JetBrains_Mono']">Официальный отчет TL Services</p>
              </div>

              <div className="p-4 bg-[#141313] rounded-xl border border-[#00f0ff]/30">
                <div className="flex justify-between items-center text-[#00f0ff] text-[13px] font-extrabold uppercase">
                  <span>🐶 Размещение с питомцами</span>
                  <span>10.8%</span>
                </div>
                <p className="text-[22px] font-extrabold text-white mt-1">322 000 ₽</p>
                <p className="text-[11px] text-[#a3a6a6] mt-1 font-['JetBrains_Mono']">Официальный отчет TL Services</p>
              </div>

              <div className="p-4 bg-[#141313] rounded-xl border border-purple-500/30">
                <div className="flex justify-between items-center text-purple-400 text-[13px] font-extrabold uppercase">
                  <span>⏰ Ранний / Поздний заезд</span>
                  <span>8.7%</span>
                </div>
                <p className="text-[22px] font-extrabold text-white mt-1">257 935 ₽</p>
                <p className="text-[11px] text-[#a3a6a6] mt-1 font-['JetBrains_Mono']">Официальный отчет TL Services</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ОТЧЕТ ПО ПЛАТЕЖАМ TRAVELLINE (Detailed Payments Report) */
        <div className="glass-card rounded-2xl p-6 shadow-glass space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#c3f400]/15 pb-4">
            <div>
              <h3 className="font-['Syne'] font-extrabold text-[20px] text-white uppercase flex items-center gap-2 tracking-wide">
                <span className="material-symbols-outlined text-[#c3f400]">payments</span>
                ОТЧЕТ ПО ПЛАТЕЖАМ И ЭКВАЙРИНГУ TRAVELLINE
              </h3>
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase mt-1">
                // СВЕДЕНИЯ ИЗ МОДУЛЯ «БАЛАНСЫ БРОНИРОВАНИЙ» И ДЕТАЛЬНЫХ ТРАНЗАКЦИЙ
              </p>
            </div>
            <span className="neon-badge font-['Manrope'] text-[12px] px-3 py-1 rounded-lg font-extrabold">
              Поступления: 56 493 600,54 ₽
            </span>
          </div>

          {/* Карточки по способам оплаты */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-['Manrope']">
            
            {/* 1. Онлайн на сайте */}
            <div className="p-5 bg-[#141313] rounded-2xl border border-[#c3f400]/30 shadow-[0_0_20px_rgba(195,244,0,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#c3f400] font-extrabold uppercase">// ОНЛАЙН НА САЙТЕ</span>
                <span className="px-2.5 py-0.5 bg-[#c3f400] text-black text-[11px] font-extrabold rounded-md">74.5%</span>
              </div>
              <p className="text-[26px] font-extrabold text-white tracking-tight">42 087 732 ₽</p>
              <p className="text-[12px] text-[#a3a6a6] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#c3f400]">credit_card</span>
                Эквайринг TravelLine / ЮKassa
              </p>
            </div>

            {/* 2. Терминал на ресепшн */}
            <div className="p-5 bg-[#141313] rounded-2xl border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#00f0ff] font-extrabold uppercase">// КАРТОЙ В ТЕРМИНАЛ</span>
                <span className="px-2.5 py-0.5 bg-[#00f0ff] text-black text-[11px] font-extrabold rounded-md">17.7%</span>
              </div>
              <p className="text-[26px] font-extrabold text-white tracking-tight">9 999 367 ₽</p>
              <p className="text-[12px] text-[#a3a6a6] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#00f0ff]">point_of_sale</span>
                Оплата картой при заезде на стойке
              </p>
            </div>

            {/* 3. Наличные */}
            <div className="p-5 bg-[#141313] rounded-2xl border border-[#febf1a]/30 shadow-[0_0_20px_rgba(254,191,26,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#febf1a] font-extrabold uppercase">// НАЛИЧНЫМИ В КАССУ</span>
                <span className="px-2.5 py-0.5 bg-[#febf1a] text-black text-[11px] font-extrabold rounded-md">7.8%</span>
              </div>
              <p className="text-[26px] font-extrabold text-white tracking-tight">4 406 501 ₽</p>
              <p className="text-[12px] text-[#a3a6a6] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#febf1a]">payments</span>
                Наличный расчет на ресепшн
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
