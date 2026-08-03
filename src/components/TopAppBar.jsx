import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROPERTIES } from '../services/travelLineService';

export const TopAppBar = () => {
  const { theme, toggleTheme, selectedProperty, setSelectedProperty } = useApp();
  const [showPropertyMenu, setShowPropertyMenu] = useState(false);

  const currentPropertyObj = PROPERTIES[selectedProperty?.toUpperCase()] || PROPERTIES.ALL;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0e0d0d]/95 backdrop-blur-xl border-b border-[#c3f400]/20 transition-all duration-300">
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 min-h-14 max-w-7xl mx-auto">
        
        {/* Бренд + Селектор Объекта в стиле WIBE */}
        <div className="relative flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setShowPropertyMenu(!showPropertyMenu)}
            className="flex items-center gap-2 sm:gap-3 text-left p-1.5 rounded-xl hover:bg-[#1c1b1b] border border-transparent hover:border-[#c3f400]/30 transition-all group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/40 text-[#c3f400] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(195,244,0,0.15)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">{currentPropertyObj.icon || 'domain'}</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h1 className="font-['Syne'] font-extrabold text-[15px] sm:text-[17px] tracking-wider text-white uppercase group-hover:text-[#c3f400] transition-colors leading-none">
                  ЛАДОГА ПАРК
                </h1>
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-[#c3f400] transition-transform duration-200" style={{ transform: showPropertyMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </div>
              <p className="font-['JetBrains_Mono'] text-[10px] sm:text-[11px] text-[#a3a6a6] tracking-tight truncate max-w-[160px] sm:max-w-none mt-0.5">
                {currentPropertyObj.name}
              </p>
            </div>
          </button>

          {/* Выпадающее неоновое меню объектов */}
          {showPropertyMenu && (
            <div className="absolute top-14 left-0 w-72 max-w-[85vw] bg-[#141313]/98 backdrop-blur-2xl border border-[#c3f400]/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 p-2 space-y-1">
              <div className="px-3 py-2 font-['JetBrains_Mono'] text-[10px] text-[#c3f400] uppercase tracking-widest font-bold border-b border-[#c3f400]/15 mb-1">
                // ВЫБОР ОБЪЕКТА БИЗНЕСА
              </div>
              {Object.values(PROPERTIES).map((prop) => (
                <button
                  key={prop.id}
                  onClick={() => {
                    setSelectedProperty(prop.id);
                    setShowPropertyMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                    selectedProperty === prop.id
                      ? 'bg-[#c3f400]/15 text-[#c3f400] font-bold border border-[#c3f400]/40 shadow-[0_0_15px_rgba(195,244,0,0.15)]'
                      : 'text-[#e5e2e1] hover:bg-[#262424] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{prop.icon || 'domain'}</span>
                  <div className="flex-1">
                    <div className="text-[12px] sm:text-[13px] font-bold">{prop.name}</div>
                    <div className="font-['JetBrains_Mono'] text-[9px] opacity-70">
                      {prop.id === 'all' ? 'Сводный отчет по комплексу' : `ID: ${prop.hotelId}`}
                    </div>
                  </div>
                  {selectedProperty === prop.id && (
                    <span className="material-symbols-outlined text-[16px] text-[#c3f400]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Статус синхронизации с TravelLine и Смена темы */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 neon-badge px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-['JetBrains_Mono'] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse shadow-[0_0_8px_#c3f400]"></span>
            <span>TL LIVE</span>
          </div>

          <button 
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode" 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-[#1c1b1b] border border-[#c3f400]/20 hover:border-[#c3f400] text-[#c3f400] transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
