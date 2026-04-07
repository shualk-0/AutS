import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Info, ExternalLink, Loader2 } from 'lucide-react';

interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
  copyright?: string;
}

const NasaApod: React.FC = () => {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        // Using the user provided API Key as default
        const apiKey = process.env.NASA_API_KEY || 'Ux6bhUE9ddK8WUX16Em2ETQKNRcbpsNPm0xFEE0o';
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
        
        if (!response.ok) {
          throw new Error('无法连接到 NASA 宇宙画廊');
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        console.error('NASA APOD Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApod();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center glass-panel rounded-3xl border-white/10">
        <Loader2 className="w-8 h-8 text-cosmic-neon animate-spin mb-4" />
        <p className="text-slate-400 text-sm">正在穿越星际获取今日影像...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 glass-panel rounded-3xl border-red-500/20 bg-red-500/5 text-center">
        <p className="text-red-400 text-sm mb-2">宇宙连接中断</p>
        <p className="text-slate-500 text-xs">{error || '未知错误'}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel overflow-hidden rounded-3xl border-white/10 group"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={data.url} 
          alt={data.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-bg via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cosmic-neon text-cosmic-bg text-[10px] font-bold uppercase tracking-widest">
              NASA APOD
            </span>
            <span className="text-[10px] text-slate-300 font-mono">{data.date}</span>
          </div>
          <h3 className="text-xl font-bold text-white leading-tight">{data.title}</h3>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cosmic-neon flex-shrink-0 mt-1" />
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
            {data.explanation}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-[10px] text-slate-500 italic">
            {data.copyright ? `© ${data.copyright}` : 'Public Domain'}
          </span>
          <a 
            href={data.hdurl || data.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-cosmic-neon hover:underline"
          >
            查看高清原图
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NasaApod;
