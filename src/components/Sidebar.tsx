
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BookOpen, 
  User, 
  Wallet, 
  MessageCircle, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'kuliah', label: 'Pengelola Kuliah', icon: GraduationCap },
    { id: 'mahasiswa', label: 'Info Mahasiswa', icon: User },
    { id: 'keuangan', label: 'Pengelola Keuangan', icon: Wallet },
    { id: 'chatbot', label: 'AI Chatbot', icon: MessageCircle },
  ];

  const handleTabClick = (itemId: string) => {
    console.log('Menu item clicked:', itemId);
    onTabChange(itemId);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    logout();
  };

  if (isMobile) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 w-full sticky top-0 z-50">
        {/* Header with user info */}
        <div className="p-3 border-b border-gray-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800">Smart Campus</h1>
              <p className="text-xs text-gray-500">Academic Management</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="px-2 py-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* User info */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200/50">
          <p className="text-sm font-medium text-gray-800 truncate">{user?.nama}</p>
          <p className="text-xs text-gray-500">NIM: {user?.nim}</p>
        </div>

        {/* Horizontal scrollable menu */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex p-2 space-x-2 min-w-max">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "flex-shrink-0 px-3 py-2 text-xs whitespace-nowrap transition-all duration-200",
                  activeTab === item.id 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700" 
                    : "hover:bg-blue-50 hover:text-blue-700"
                )}
                onClick={() => handleTabClick(item.id)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-48 sm:w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 h-screen flex flex-col sticky top-0 shadow-xl">
      <div className="p-4 sm:p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-800">Smart Campus</h1>
            <p className="text-sm text-gray-500">Academic Management</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <nav className="space-y-1 sm:space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-xs sm:text-sm px-2 sm:px-3 py-2 transition-all duration-200",
                activeTab === item.id 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700" 
                  : "hover:bg-blue-50 hover:text-blue-700"
              )}
              onClick={() => handleTabClick(item.id)}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-2 sm:p-4 border-t border-gray-200/50">
        <div className="mb-2 sm:mb-4 hidden sm:block">
          <p className="text-sm font-medium text-gray-800 truncate">{user?.nama}</p>
          <p className="text-xs text-gray-500">NIM: {user?.nim}</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-xs sm:text-sm px-2 sm:px-3 py-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
