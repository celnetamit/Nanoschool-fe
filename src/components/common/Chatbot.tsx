'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Send, X, Bot, User, Loader2, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your NanoSchool AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nanoschool_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('nanoschool_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const clearChat = () => {
    const initialMessage: Message = { role: 'assistant', content: 'Hello! I am your NanoSchool AI assistant. How can I help you today?' };
    setMessages([initialMessage]);
    localStorage.removeItem('nanoschool_chat_history');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await res.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please check your API key." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hide on dashboard
  if (pathname.startsWith('/dashboard')) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        >
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20 group-hover:opacity-40"></div>
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] h-[580px] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 origin-bottom-right">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">NanoSchool AI</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Expert Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={clearChat}
                title="Clear Chat"
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
          >
            {messages.map((ms, i) => (
              <div key={i} className={`flex ${ms.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${ms.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${ms.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                    {ms.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm font-medium ${
                    ms.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    <ReactMarkdown 
                      components={{
                        a: ({node, ...props}) => (
                          <a 
                            {...props} 
                            className={`underline font-bold transition-colors ${ms.role === 'user' ? 'text-white/90 hover:text-white' : 'text-blue-600 hover:text-blue-800'}`} 
                          />
                        ),
                        p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                        ul: ({node, ...props}) => <ul {...props} className="list-disc ml-4 mb-2" />,
                        li: ({node, ...props}) => <li {...props} className="mb-1" />,
                        strong: ({node, ...props}) => <strong {...props} className="font-bold text-inherit" />
                      }}
                    >
                      {ms.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 items-center bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100/50">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about AI, Biotech..."
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner placeholder:text-slate-400 font-medium"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-slate-300"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="mt-4 text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">
              Powered by NanoSchool AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
