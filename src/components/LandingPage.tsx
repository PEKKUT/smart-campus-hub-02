
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Calendar, MessageCircle } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage = ({ onLoginClick }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Simplified without navigation */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Smart Campus</h1>
          <Button 
            onClick={onLoginClick}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm sm:text-base"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Smart Campus</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">Sistem Informasi Akademik Berbasis Web</p>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">Dengan Chatbot AI</p>
          <Button 
            onClick={onLoginClick}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg"
          >
            Login
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-16">
          <Card className="bg-gray-200 border-0">
            <CardContent className="p-6 sm:p-8 text-center">
              <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Sistem Akademik</h3>
              <p className="text-sm sm:text-base text-gray-600 italic">Kelola data akademik dengan mudah</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-200 border-0">
            <CardContent className="p-6 sm:p-8 text-center">
              <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Jadwal Kuliah</h3>
              <p className="text-sm sm:text-base text-gray-600 italic">Atur dan lihat jadwal Anda secara real-time</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-200 border-0 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6 sm:p-8 text-center">
              <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">AI Chatbot</h3>
              <p className="text-sm sm:text-base text-gray-600 italic">Bertanya kapan saja dengan bantuan AI</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base text-gray-600 italic">© 2025 Smart Campus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
