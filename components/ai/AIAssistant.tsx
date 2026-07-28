'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Loader2, MessageSquare, MapPin, Calendar, Briefcase } from 'lucide-react';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your Campus AI. How can I help you today? You can ask me about labs, study groups, or internships!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let response = "I'm looking into that for you...";
      const lowInput = input.toLowerCase();

      if (lowInput.includes('lab')) response = "Lab 3 is located on the 2nd floor of the CS wing, right next to the elevator.";
      else if (lowInput.includes('study group')) response = "There's an active React study group meeting at the Library at 4 PM today!";
      else if (lowInput.includes('internship')) response = "Google just posted 3 new SWE internship roles in the Placement Hub!";
      else if (lowInput.includes('event')) response = "The Annual Tech Fest starts tomorrow at 10 AM in the Main Auditorium.";

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 md:bottom-8 md:right-8 w-16 h-16 nav-active-gradient rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_10px_40px_rgba(99,102,241,0.4)] z-[100] border-4 border-white dark:border-slate-950"
      >
        <Sparkles size={28} className="animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[110]"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-8 right-8 w-[90vw] md:w-[400px] h-[600px] glass-card rounded-[2.5rem] z-[120] flex flex-col overflow-hidden border-white/40 shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 nav-active-gradient flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-white leading-tight">Campus AI</h3>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Always Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages Area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-950/30"
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-3xl ${
                      msg.role === 'user'
                        ? 'bg-brand-primary text-white rounded-tr-none shadow-lg'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-white/5 shadow-sm'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl rounded-tl-none border border-slate-100 dark:border-white/5 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce animate-delay-100" />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce animate-delay-200" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestions */}
              <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-white/5">
                {[
                  { label: 'Lab 3?', icon: MapPin },
                  { label: 'Study Groups', icon: Calendar },
                  { label: 'Internships', icon: Briefcase }
                ].map(s => (
                  <button
                    key={s.label}
                    onClick={() => { setInput(s.label); }}
                    className="flex-shrink-0 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary transition-all flex items-center gap-1.5"
                  >
                    <s.icon size={10} /> {s.label}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="relative flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 glass-input py-3.5 px-5 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="p-3.5 bg-brand-primary text-white rounded-2xl shadow-xl shadow-brand-primary/20 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
                  >
                    <Send size={18} strokeWidth={2.5} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
