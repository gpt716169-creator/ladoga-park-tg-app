import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const SettingsView = () => {
  const { tlConfig, updateTLConfig, triggerHaptic } = useApp();

  const [apiKey, setApiKey] = useState(tlConfig.apiKey);
  const [cottagesHotelId, setCottagesHotelId] = useState(tlConfig.cottagesHotelId);
  const [beachHotelId, setBeachHotelId] = useState(tlConfig.beachHotelId);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveTL = (e) => {
    e.preventDefault();
    updateTLConfig({ apiKey, cottagesHotelId, beachHotelId });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-28">
      
      <div className="mb-4">
        <h2 className="font-['Syne'] font-extrabold text-[24px] sm:text-[32px] text-white uppercase tracking-wide">
          НАСТРОЙКИ & ИНТЕГРАЦИЯ
        </h2>
        <p className="font-['JetBrains_Mono'] text-[12px] text-[#a3a6a6]">
          // Конфигурация TravelLine API Keys и параметров уведомлений
        </p>
      </div>

      <div className="space-y-6">

        <section>
          <h3 className="font-['JetBrains_Mono'] text-[12px] text-[#c3f400] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            СИНХРОНИЗАЦИЯ С TRAVELLINE API
          </h3>
          <div className="glass-card rounded-2xl p-6 space-y-4 shadow-glass">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#c3f400]/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#c3f400]">cloud_done</span>
                <div>
                  <span className="font-['Syne'] font-bold text-[15px] text-white">Статус подключения TravelLine</span>
                  <p className="font-['JetBrains_Mono'] text-[11px] text-[#c3f400] flex items-center gap-1 font-bold mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#c3f400] inline-block animate-pulse"></span>
                    Live Connected (52159 + 54511)
                  </p>
                </div>
              </div>
              <span className="neon-badge font-['JetBrains_Mono'] text-[11px] px-3 py-1 rounded-full font-bold">
                ПОДКЛЮЧЕНО
              </span>
            </div>

            <form onSubmit={handleSaveTL} className="space-y-4 pt-1">
              
              <div>
                <label className="block font-['JetBrains_Mono'] text-[11px] font-bold text-[#c3f400] mb-1">
                  API KEY / TOKEN TRAVELLINE
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#141313] border border-[#c3f400]/30 rounded-xl p-3 font-['JetBrains_Mono'] text-[13px] text-white focus:border-[#c3f400] focus:shadow-[0_0_15px_rgba(195,244,0,0.3)] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-['JetBrains_Mono'] text-[11px] font-bold text-white mb-1">
                    HOTEL ID #1 (🏡 Домики)
                  </label>
                  <input
                    type="text"
                    value={cottagesHotelId}
                    onChange={(e) => setCottagesHotelId(e.target.value)}
                    className="w-full bg-[#141313] border border-[#c3f400]/30 rounded-xl p-3 font-['JetBrains_Mono'] text-[13px] text-white focus:border-[#c3f400] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-['JetBrains_Mono'] text-[11px] font-bold text-white mb-1">
                    HOTEL ID #2 (🏖️ Пляж & Бани)
                  </label>
                  <input
                    type="text"
                    value={beachHotelId}
                    onChange={(e) => setBeachHotelId(e.target.value)}
                    className="w-full bg-[#141313] border border-[#c3f400]/30 rounded-xl p-3 font-['JetBrains_Mono'] text-[13px] text-white focus:border-[#c3f400] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#c3f400] hover:bg-[#b0dc00] text-black font-['Syne'] font-extrabold py-3 px-6 rounded-xl transition-all shadow-[0_0_25px_rgba(195,244,0,0.4)] flex items-center justify-center gap-2 text-[15px] uppercase"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Сохранить и проверить синхронизацию</span>
              </button>

              {savedSuccess && (
                <div className="p-3 bg-[#c3f400]/15 border border-[#c3f400]/40 text-[#c3f400] rounded-xl text-[12px] font-['JetBrains_Mono'] text-center font-bold">
                  ✓ Ключи TravelLine успешно обновлены!
                </div>
              )}

            </form>

          </div>
        </section>

      </div>
    </div>
  );
};
