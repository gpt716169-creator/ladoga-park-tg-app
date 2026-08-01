import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardView } from './views/DashboardView';
import { FinancesView } from './views/FinancesView';
import { BookingsView } from './views/BookingsView';
import { GuestsView } from './views/GuestsView';
import { SettingsView } from './views/SettingsView';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'finances':
        return <FinancesView />;
      case 'bookings':
        return <BookingsView />;
      case 'guests':
        return <GuestsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#191c1d] text-on-background dark:text-on-background antialiased selection:bg-primary/20">
      
      {/* TopAppBar */}
      <TopAppBar />

      {/* Основной контент */}
      <main className="flex-1 px-margin-mobile md:px-margin-desktop pt-md max-w-7xl w-full mx-auto">
        {renderTabContent()}
      </main>

      {/* BottomNavBar */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
