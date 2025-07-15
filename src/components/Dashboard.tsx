
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import HomeTab from './tabs/HomeTab';
import KuliahTab from './tabs/KuliahTab';
import MahasiswaTab from './tabs/MahasiswaTab';
import KeuanganTab from './tabs/KeuanganTab';
import ChatbotTab from './tabs/ChatbotTab';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const isMobile = useIsMobile();

  const handleTabChange = (tab: string) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'kuliah':
        return <KuliahTab />;
      case 'mahasiswa':
        return <MahasiswaTab />;
      case 'keuangan':
        return <KeuanganTab />;
      case 'chatbot':
        return <ChatbotTab />;
      default:
        return <HomeTab />;
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-2">
            {renderContent()}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
