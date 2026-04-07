import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2, Info, Mic, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';

// ===== DeepSeek / 火山方舟配置 =====
// 这里先直接写死，方便你测试
// 真正上线不要这样放前端
const DEEPSEEK_CONFIG = {
  apiKey: '1123b457-ced6-4f8c-8d73-4e66502464d1',
  base_url: 'https://ark.cn-beijing.volces.com/api/v3',
  model: 'ep-20260405155245-wnxh7'
};

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const Tutor: React.FC = () => {
  const { currentContext } = useAppContext();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tutor_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 语音识别初始化
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + transcript);
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

  // 自动滚动 + 本地存储
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    localStorage.setItem('tutor_messages', JSON.stringify(messages));
  }, [messages, isTyping]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!recognitionRef.current) {
      alert('当前设备或 WebView 不支持语音识别。');
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
    }
  };

  // 把前端消息格式转换成 DeepSeek 所需格式
  const buildDeepSeekMessages = (userMessage: string) => {
    const systemPrompt = `
你是一位专业、耐心、表达清晰的天文学导师，也是“AI宇宙助手”。

当前教学背景：${currentContext || '通用天文学'}

回答要求：
1. 必须使用中文回答。
2. 只回答天文、宇宙、观测、行星、恒星、星系、黑洞、宇宙学等相关问题。
3. 如果用户问题明显偏离天文主题，请礼貌提醒这是天文助手，并尽量把话题引回天文。
4. 解释要通俗易懂，但内容要科学准确。
5. 回答不要太空泛，尽量有知识点。
6. 适合学生阅读，语气自然，不要太生硬。
7. 结合当前背景回答，必要时分点说明。
`.trim();

    const history = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    return [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage }
    ];
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const response = await fetch(`${DEEPSEEK_CONFIG.base_url}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEEPSEEK_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          model: DEEPSEEK_CONFIG.model,
          messages: buildDeepSeekMessages(userMessage),
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', response.status, errorText);

        let msg = '请求失败，请检查 API 配置或网络连接。';

        if (response.status === 401) {
          msg = 'API 密钥无效或未正确传递。';
        } else if (response.status === 403) {
          msg = '当前接口无访问权限，请检查模型或平台配置。';
        } else if (response.status === 429) {
          msg = '请求过于频繁，请稍后再试。';
        } else if (response.status >= 500) {
          msg = '模型服务暂时不可用，请稍后重试。';
        }

        setMessages((prev) => [...prev, { role: 'model', content: msg }]);
        return;
      }

      const data = await response.json();
      console.log('DeepSeek response:', data);

      const text =
        data?.choices?.[0]?.message?.content?.trim() ||
        '我暂时没有获取到有效回复，请稍后再试。';

      setMessages((prev) => [...prev, { role: 'model', content: text }]);
    } catch (error: any) {
      console.error('AI Assistant Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: '网络连接失败，或当前应用没有成功访问模型接口。'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('tutor_messages');
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
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] uppercase text-cosmic-neon font-mono tracking-widest">
                  在线 • 宇宙智能
                </p>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                  <Info className="w-2.5 h-2.5 text-slate-500" />
                  <span className="text-[9px] text-slate-400 font-mono">
                    背景: {currentContext || '通用天文学'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={clearMessages}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors"
            title="清空对话"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <Sparkles className="w-12 h-12 text-cosmic-neon" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">向我提问关于宇宙的任何问题</h3>
                <p className="text-sm max-w-xs text-slate-400">
                  从恒星形成到黑洞演化，我会尽量用清楚易懂的方式回答你。
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                {[
                  '恒星是如何形成的？',
                  '什么是暗物质？',
                  '黑洞真的会吞掉一切吗？'
                ].map((q) => (
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

          {messages.map((m, i) => {
            const isUser = m.role === 'user';

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 border ${
                    isUser
                      ? 'bg-cosmic-neon/10 border-cosmic-neon/30 text-white'
                      : 'bg-white/5 border-white/10 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isUser ? (
                      <User className="w-4 h-4 text-cosmic-neon" />
                    ) : (
                      <Bot className="w-4 h-4 text-cosmic-neon" />
                    )}
                    <span className="text-xs text-slate-400">
                      {isUser ? '我' : 'AI宇宙助手'}
                    </span>
                  </div>

                  <div className="prose prose-invert prose-sm max-w-none break-words">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-2xl px-4 py-3 border bg-white/5 border-white/10 text-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-cosmic-neon" />
                  <span className="text-xs text-slate-400">AI宇宙助手</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-cosmic-neon rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-cosmic-neon rounded-full animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-2 h-2 bg-cosmic-neon rounded-full animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="向你的助手提问..."
                className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 pr-24 text-white placeholder:text-slate-500 outline-none focus:border-cosmic-neon/50"
                disabled={isTyping}
              />

              <button
                onClick={toggleListening}
                type="button"
                className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                title={isListening ? '停止语音输入' : '开始语音输入'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={handleSend}
                type="button"
                disabled={isTyping || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-cosmic-neon text-cosmic-bg flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                title="发送"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-3 px-1">
            
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tutor;