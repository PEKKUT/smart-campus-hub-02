
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

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'kuliah', label: 'Pengelola Kuliah', icon: GraduationCap },
    { id: 'mahasiswa', label: 'Info Mahasiswa', icon: User },
    { id: 'keuangan', label: 'Pengelola Keuangan', icon: Wallet },
    { id: 'chatbot', label: 'AI Chatbot', icon: MessageCircle },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Akademik</h1>
            <p className="text-sm text-gray-500">Management</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id && "bg-blue-600 text-white"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-800">{user?.nama}</p>
          <p className="text-xs text-gray-500">NIM: {user?.nim}</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Keluar
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
