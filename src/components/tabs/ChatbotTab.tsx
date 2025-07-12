
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatbotTab = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const chatMessages: Message[] = [];
      data?.forEach((chat) => {
        chatMessages.push({
          id: `${chat.id}-user`,
          text: chat.message,
          isBot: false,
          timestamp: new Date(chat.created_at)
        });
        chatMessages.push({
          id: `${chat.id}-bot`,
          text: chat.response,
          isBot: true,
          timestamp: new Date(chat.created_at)
        });
      });

      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Generate AI response
      const botResponse = generateBotResponse(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Save to database
      await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          message: inputText,
          response: botResponse
        });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan');
    } finally {
      setLoading(false);
    }
  };

  const generateBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('jadwal')) {
      return 'Untuk mengelola jadwal kuliah, Anda bisa menggunakan menu Pengelola Kuliah > Jadwal & Kehadiran. Di sana Anda bisa menambah, edit, dan melihat jadwal kuliah Anda.';
    } else if (lowerMessage.includes('nilai')) {
      return 'Untuk melihat dan mengelola nilai, silakan buka menu Pengelola Kuliah > Nilai. Anda bisa input nilai tugas, UTS, UAS, dan sistem akan menghitung IPK secara otomatis.';
    } else if (lowerMessage.includes('keuangan') || lowerMessage.includes('uang') || lowerMessage.includes('rupiah')) {
      return 'Fitur Pengelola Keuangan membantu Anda mencatat transaksi harian dalam rupiah dan melihat statistik keuangan. Anda bisa input pemasukan dan pengeluaran dengan berbagai kategori seperti makanan, transport, buku, dll.';
    } else if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('hello')) {
      return `Halo ${user?.nama}! Saya adalah asisten AI Smart Campus yang siap membantu Anda dengan pertanyaan seputar sistem manajemen perkuliahan. Ada yang bisa saya bantu?`;
    } else if (lowerMessage.includes('bantuan') || lowerMessage.includes('help')) {
      return 'Saya bisa membantu Anda dengan:\n- Informasi tentang jadwal kuliah\n- Pengelolaan nilai dan IPK\n- Pengelolaan keuangan dalam rupiah\n- Fitur-fitur Smart Campus lainnya\n\nSilakan tanya apa yang ingin Anda ketahui!';
    } else if (lowerMessage.includes('smart campus')) {
      return 'Smart Campus adalah sistem informasi akademik berbasis web dengan chatbot AI. Sistem ini membantu mahasiswa mengelola jadwal kuliah, nilai, keuangan dalam rupiah, dan berbagai kebutuhan akademik lainnya dengan mudah dan efisien.';
    } else {
      return 'Terima kasih atas pertanyaan Anda! Saya adalah asisten AI Smart Campus yang siap membantu dengan informasi tentang jadwal, nilai, kehadiran, dan keuangan dalam rupiah. Ada yang spesifik yang ingin Anda tanyakan?';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">AI Chatbot</h1>
        <p className="text-gray-600">Tanyakan apa saja kepada asisten AI Smart Campus</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Chat dengan AI Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 h-96 mb-4" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Mulai percakapan dengan mengetik pesan di bawah</p>
                  <p className="text-sm mt-2">Tanya tentang jadwal, nilai, keuangan, atau fitur Smart Campus lainnya!</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isBot ? (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <p className="text-sm">Sedang mengetik...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              placeholder="Ketik pesan Anda..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading || !inputText.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotTab;
