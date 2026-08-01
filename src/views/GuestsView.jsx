import React from 'react';

export const GuestsView = () => {
  return (
    <div className="space-y-6 pb-28">
      <div className="border-b border-[#c3f400]/20 pb-3">
        <h2 className="font-['Syne'] font-extrabold text-[24px] sm:text-[32px] text-white uppercase tracking-wide">
          ГОСТИ & CRM
        </h2>
        <p className="font-['JetBrains_Mono'] text-[12px] text-[#a3a6a6]">
          // База клиентов TravelLine (16 104 заехавших гостя)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card acid-border rounded-2xl p-5 shadow-glass">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Всего гостей за период</p>
          <p className="font-['Syne'] text-[28px] font-extrabold text-[#c3f400] mt-1">16 104</p>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#c3f400] font-bold">12.4k Пляж | 3.6k Домики</span>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-glass">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Повторные брони</p>
          <p className="font-['Syne'] text-[28px] font-extrabold text-[#00f0ff] mt-1">24.2%</p>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#00f0ff] font-bold">Высокая лояльность</span>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-glass">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6] uppercase font-bold">Средний LTV гостя</p>
          <p className="font-['Syne'] text-[28px] font-extrabold text-white mt-1">48,500 ₽</p>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#a3a6a6]">3.2 визита в год</span>
        </div>
      </div>
    </div>
  );
};
