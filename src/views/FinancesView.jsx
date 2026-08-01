import React from 'react';
import { useApp } from '../context/AppContext';

export const FinancesView = () => {
  return (
    <div className="space-y-6 pb-28">
      <div className="border-b border-[#c3f400]/20 pb-3">
        <h2 className="font-['Syne'] font-extrabold text-[24px] sm:text-[32px] text-white uppercase tracking-wide">
          ФИНАНСЫ & P&L (TRAVELLINE)
        </h2>
        <p className="font-['JetBrains_Mono'] text-[12px] text-[#a3a6a6]">
          // Официальные системные отчеты TravelLine (01.07.2025 – 31.07.2026)
        </p>
      </div>

      {/* Сводные финансовые карточки - Четкие шрифты Manrope */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card acid-border rounded-2xl p-5 shadow-glass">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Доход за проживание / аренду</p>
          <p className="font-['Manrope'] text-[24px] font-extrabold text-[#c3f400] tracking-tight mt-2">53 517 980,54 ₽</p>
          <span className="font-['Manrope'] text-[12px] text-[#c3f400] font-bold">Домики: 30.39M ₽ | Пляж: 23.12M ₽</span>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-glass">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Дополнительные услуги</p>
          <p className="font-['Manrope'] text-[24px] font-extrabold text-[#febf1a] tracking-tight mt-2">2 975 620,00 ₽</p>
          <span className="font-['Manrope'] text-[12px] text-[#a3a6a6]">Парковка, Чаны, Бани, BBQ</span>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-glass">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Совокупный валовой доход</p>
          <p className="font-['Manrope'] text-[24px] font-extrabold text-[#00f0ff] tracking-tight mt-2">56 493 600,54 ₽</p>
          <span className="font-['Manrope'] text-[12px] text-[#00f0ff] font-bold">Итого за 13 месяцев (07.25-07.26)</span>
        </div>
      </div>

      {/* Блок допуслуг со скриншота */}
      <div className="glass-card rounded-2xl p-6 shadow-glass space-y-4">
        <div className="flex justify-between items-center border-b border-[#c3f400]/15 pb-3">
          <h3 className="font-['Syne'] font-extrabold text-[18px] text-white uppercase flex items-center gap-2 tracking-wide">
            <span className="material-symbols-outlined text-[#febf1a]">local_activity</span>
            Допуслуги - Сводный отчет TravelLine
          </h3>
          <span className="neon-badge font-['Manrope'] text-[12px] px-3 py-1 rounded-lg font-extrabold">
            Итого: 2 975 620,00 ₽
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[13px] font-['Manrope'] p-3 bg-[#141313] rounded-xl border border-[#c3f400]/20">
              <span className="text-[#e5e2e1] font-medium">🚗 Парковка а/м (Пляжные объекты)</span>
              <span className="font-extrabold text-[#c3f400]">1 217 170,00 ₽</span>
            </div>
            <div className="flex justify-between text-[13px] font-['Manrope'] p-3 bg-[#141313] rounded-xl border border-[#c3f400]/20">
              <span className="text-[#e5e2e1] font-medium">♨️ Сибирский горячий чан</span>
              <span className="font-extrabold text-[#c3f400]">471 750,00 ₽</span>
            </div>
            <div className="flex justify-between text-[13px] font-['Manrope'] p-3 bg-[#141313] rounded-xl border border-[#c3f400]/20">
              <span className="text-[#e5e2e1] font-medium">🐾 Проживание с домашними животными</span>
              <span className="font-extrabold text-[#c3f400]">322 000,00 ₽</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[13px] font-['Manrope'] p-3 bg-[#141313] rounded-xl border border-[#00f0ff]/20">
              <span className="text-[#e5e2e1] font-medium">⏳ Ранний заезд / поздний выезд</span>
              <span className="font-extrabold text-[#00f0ff]">257 935,00 ₽</span>
            </div>
            <div className="flex justify-between text-[13px] font-['Manrope'] p-3 bg-[#141313] rounded-xl border border-[#00f0ff]/20">
              <span className="text-[#e5e2e1] font-medium">🛖 Автодом / Парковка спецтехники</span>
              <span className="font-extrabold text-[#00f0ff]">115 900,00 ₽</span>
            </div>
            <div className="flex justify-between text-[13px] font-['Manrope'] p-3 bg-[#141313] rounded-xl border border-[#00f0ff]/20">
              <span className="text-[#e5e2e1] font-medium">🔥 Мангал, дрова, веники дубовые</span>
              <span className="font-extrabold text-[#00f0ff]">165 000,00 ₽</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
