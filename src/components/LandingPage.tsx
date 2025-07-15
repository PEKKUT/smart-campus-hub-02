
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Calendar, MessageCircle } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage = ({ onLoginClick }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
            Smart Campus
          </h1>
          <Button 
            onClick={onLoginClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-800 bg-clip-text text-transparent mb-6">
            Smart Campus
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 mb-3 font-medium">
            Sistem Informasi Akademik Berbasis Web
          </p>
          <p className="text-xl sm:text-2xl text-slate-600 mb-8 sm:mb-10 font-medium">
            Dengan Chatbot AI
          </p>
          <Button 
            onClick={onLoginClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Mulai Sekarang
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-16">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">Sistem Akademik</h3>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Kelola data akademik dengan mudah dan efisien
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">Jadwal Kuliah</h3>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Atur dan lihat jadwal Anda secara real-time
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">AI Chatbot</h3>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Bertanya kapan saja dengan bantuan AI
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-700 font-medium">Platform Aktif 24/7</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-md py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            © 2025 Smart Campus. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Dikembangkan dengan ❤️ untuk kemudahan akademik
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
