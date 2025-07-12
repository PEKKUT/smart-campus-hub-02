
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import HomeTab from './tabs/HomeTab';
import KuliahTab from './tabs/KuliahTab';
import MahasiswaTab from './tabs/MahasiswaTab';
import KeuanganTab from './tabs/KeuanganTab';
import ChatbotTab from './tabs/ChatbotTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
