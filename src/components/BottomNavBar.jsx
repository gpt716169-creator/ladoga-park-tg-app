import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNavBar = ({ activeTab, setActiveTab }) => {
  const { triggerHaptic } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'ОБЗОР', icon: 'dashboard' },
    { id: 'finances', label: 'ФИНАНСЫ', icon: 'payments' },
    { id: 'bookings', label: 'БРОНИ', icon: 'event_available' },
    { id: 'guests', label: 'ГОСТИ', icon: 'group' },
    { id: 'settings', label: 'ОПЦИИ', icon: 'settings' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-[#0e0d0d]/90 backdrop-blur-2xl border-t border-[#c3f400]/20">
      <div className="flex justify-around items-center h-16 px-2 pb-safe max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center transition-all duration-200 w-16 h-full ${
                isActive
                  ? 'scale-105'
                  : 'opacity-60 hover:opacity-100 hover:text-[#c3f400]'
              }`}
            >
              <div 
                className={`flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-[#c3f400] text-[#141313] rounded-xl px-3 py-1 font-bold shadow-[0_0_15px_rgba(195,244,0,0.4)]' 
                    : 'text-[#e5e2e1]'
                }`}
              >
                <span 
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {tab.icon}
                </span>
              </div>
              <span className={`font-['JetBrains_Mono'] text-[9px] tracking-wider mt-1 ${isActive ? 'text-[#c3f400] font-extrabold' : 'text-[#a3a6a6]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
