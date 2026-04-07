import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2, Info, Mic, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const Tutor: React.FC = () => {
  const { currentContext } = useAppContext();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>(() => {
    const saved = localStorage.getItem('tutor_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error('Failed to start recognition:', e);
        }
      } else {
        alert('您的浏览器不支持语音识别功能。');
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    localStorage.setItem('tutor_messages', JSON.stringify(messages));
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const systemInstruction = `你是一位资深的天文学导师和AI助手。当前的教学背景是：${currentContext}。
      
      核心指令：
      1. 请根据当前的教学背景以及用户的提问，提供通俗易懂但科学准确的解释。
      2. 语气要亲切、富有启发性且专业。
      3. 回答要简洁明了，富有信息量。
      4. 请务必使用中文回答。
      5. 如果用户问关于天文课程的问题，请结合课程内容回答。`;

      const contents = [
        { role: 'user', parts: [{ text: systemInstruction }] },
        ...messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ];

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
      });

      const text = response.text || "抱歉，我无法处理该请求。";
      
      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (error: any) {
      console.error('AI Assistant Error:', error);
      const errorMessage = error.message || "目前的宇宙连接较弱，请稍后再试。";
      setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full w-full bg-cosmic-bg flex flex-col p-6 pb-24">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col glass-panel overflow-hidden border-white/5">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cosmic-neon/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-cosmic-neon" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI 宇宙助手</h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] uppercase text-cosmic-neon font-mono tracking-widest">在线 • 宇宙智能</p>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                  <Info className="w-2.5 h-2.5 text-slate-500" />
                  <span className="text-[9px] text-slate-400 font-mono">背景: {currentContext}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-50">
              <Sparkles className="w-12 h-12 text-cosmic-neon" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">向我提问关于宇宙的任何问题</h3>
                <p className="text-sm max-w-xs">从黑洞到大爆炸，我在这里引导你的宇宙之旅。</p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                {[
                  "恒星是如何形成的？",
                  "什么是暗物质？",
                  "向我介绍一下詹姆斯·韦伯望远镜"
                ].map(q => (
                  <button 
                    key={q}
                    onClick={() => setInput(q)}
                    className="p-3 text-xs bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  m.role === 'user' ? 'bg-cosmic-neon text-cosmic-bg' : 'bg-white/10 text-cosmic-neon'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-cosmic-neon/10 border border-cosmic-neon/20 text-slate-200' 
                    : 'bg-white/5 border border-white/5 text-slate-300'
                }`}>
                  <div className="markdown-body prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cosmic-neon" />
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="flex gap-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-cosmic-neon rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-cosmic-neon rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-cosmic-neon rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-white/5 bg-white/5">
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "正在倾听..." : "向你的助手提问..."}
                className={`w-full bg-cosmic-bg border ${isListening ? 'border-cosmic-neon shadow-[0_0_15px_rgba(0,255,255,0.2)]' : 'border-white/10'} rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:border-cosmic-neon/50 transition-all text-sm`}
              />
              <button 
                onClick={toggleListening}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                  isListening ? 'bg-cosmic-neon text-cosmic-bg animate-pulse' : 'text-slate-500 hover:bg-white/5'
                }`}
                title={isListening ? "停止录音" : "语音输入"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-4 bg-cosmic-neon text-cosmic-bg rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
