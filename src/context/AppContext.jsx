import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTLConfig, saveTLConfig } from '../services/travelLineService';

const AppContext = createContext();

export const AVAILABLE_MONTHS = [
  { id: '2026-07', label: 'Июль 2026 (Пик сезона)' },
  { id: '2026-06', label: 'Июнь 2026' },
  { id: '2026-05', label: 'Май 2026' },
  { id: '2026-04', label: 'Апрель 2026' },
  { id: '2026-03', label: 'Март 2026' },
  { id: '2026-02', label: 'Февраль 2026' },
  { id: '2026-01', label: 'Январь 2026' },
  { id: '2025-12', label: 'Декабрь 2025' },
  { id: '2025-11', label: 'Ноябрь 2025' },
  { id: '2025-10', label: 'Октябрь 2025' },
  { id: '2025-09', label: 'Сентябрь 2025' },
  { id: '2025-08', label: 'Август 2025' },
  { id: '2025-07', label: 'Июль 2025' }
];

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ladoga_theme') || 'dark';
  });

  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDate, setSelectedDate] = useState('2026-07');

  const [tlConfig, setTlConfig] = useState(getTLConfig);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ladoga_theme', theme);
  }, [theme]);

  // Безопасный вызов Telegram WebApp (совместимость с версии 6.0)
  useEffect(() => {
    try {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        // Защита от ошибок версии Telegram 6.0
        if (typeof tg.setHeaderColor === 'function') {
          try {
            tg.setHeaderColor('#0e0d0d');
          } catch (err) {
            console.log('Telegram WebApp v6.0 setHeaderColor not supported');
          }
        }
      }
    } catch (e) {
      console.log('Telegram WebApp init bypass', e);
    }
  }, [theme]);

  const triggerHaptic = (type = 'light') => {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        const haptic = window.Telegram.WebApp.HapticFeedback;
        if (type === 'light' || type === 'medium' || type === 'heavy') {
          haptic.impactOccurred(type);
        } else if (type === 'selection') {
          haptic.selectionChanged();
        }
      }
    } catch (e) {}
  };

  const toggleTheme = () => {
    triggerHaptic('selection');
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateTLConfig = (newConfig) => {
    saveTLConfig(newConfig);
    setTlConfig(getTLConfig());
    triggerHaptic('success');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        selectedProperty,
        setSelectedProperty: (prop) => {
          triggerHaptic('selection');
          setSelectedProperty(prop);
        },
        selectedPeriod,
        setSelectedPeriod: (per) => {
          triggerHaptic('selection');
          setSelectedPeriod(per);
        },
        selectedDate,
        setSelectedDate: (d) => {
          triggerHaptic('selection');
          setSelectedDate(d);
        },
        tlConfig,
        updateTLConfig,
        triggerHaptic
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
