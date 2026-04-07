import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Palette, ChevronLeft, ChevronRight, Save, RotateCcw } from 'lucide-react';
import { UserProfile } from '../types';

const PLANET_THEMES = [
  { id: 'sun', name: '太阳', color: '#FFD700', accent: '#FF4500', seed: 'sun' },
  { id: 'mercury', name: '水星', color: '#A5A5A5', accent: '#707070', seed: 'mercury' },
  { id: 'venus', name: '金星', color: '#E3BB76', accent: '#B8860B', seed: 'venus' },
  { id: 'earth', name: '地球', color: '#2277FF', accent: '#4ade80', seed: 'earth' },
  { id: 'mars', name: '火星', color: '#FF4422', accent: '#f87171', seed: 'mars' },
  { id: 'jupiter', name: '木星', color: '#D39C7E', accent: '#fbbf24', seed: 'jupiter' },
  { id: 'saturn', name: '土星', color: '#C5AB6E', accent: '#facc15', seed: 'saturn' },
  { id: 'uranus', name: '天王星', color: '#B0E0E6', accent: '#87CEEB', seed: 'uranus' },
  { id: 'neptune', name: '海王星', color: '#6081FF', accent: '#60a5fa', seed: 'neptune' },
  { id: 'pluto', name: '冥王星', color: '#E7E7E7', accent: '#9CA3AF', seed: 'pluto' },
  { id: 'moon', name: '月球', color: '#F5F5F5', accent: '#D1D5DB', seed: 'moon' },
  { id: 'blackhole', name: '黑洞', color: '#000000', accent: '#8B5CF6', seed: 'blackhole' },
];

const FEMALE_HAIR = [
  'long01', 'long02', 'long03', 'long04', 'long05', 'long06', 'long07', 'long08', 'long09', 'long10',
  'long11', 'long12', 'long13', 'long14', 'long15', 'long16', 'long17', 'long18', 'long19'
];

const MALE_HAIR = [
  'short01', 'short02', 'short03', 'short04', 'short05', 'short06', 'short07', 'short08', 'short09', 'short10'
];

const CharacterCreator: React.FC<{ 
  profile: UserProfile | null;
  onUpdateProfile: (p: UserProfile) => void;
  onBack: () => void;
}> = ({ profile, onUpdateProfile, onBack }) => {
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [theme, setTheme] = useState(PLANET_THEMES[3]); // Default Earth
  const [isAnimeForm, setIsAnimeForm] = useState(false);
  const [hairStyle, setHairStyle] = useState(0);
  const [eyeStyle, setEyeStyle] = useState(0);
  const [outfitStyle, setOutfitStyle] = useState(0);

  const randomize = () => {
    const newGender = Math.random() > 0.5 ? 'male' : 'female';
    setGender(newGender);
    setTheme(PLANET_THEMES[Math.floor(Math.random() * PLANET_THEMES.length)]);
    setHairStyle(Math.floor(Math.random() * (newGender === 'female' ? FEMALE_HAIR.length : MALE_HAIR.length)));
    setEyeStyle(Math.floor(Math.random() * 10));
    setOutfitStyle(Math.floor(Math.random() * 10));
    setIsAnimeForm(true);
  };

  const nextStyle = (setter: React.Dispatch<React.SetStateAction<number>>, current: number, max: number) => {
    setter((current + 1) % max);
  };

  const prevStyle = (setter: React.Dispatch<React.SetStateAction<number>>, current: number, max: number) => {
    setter((current - 1 + max) % max);
  };

  // Generate Dicebear URL for anime style
  const getAvatarUrl = () => {
    const hair = gender === 'female' ? FEMALE_HAIR[hairStyle % FEMALE_HAIR.length] : MALE_HAIR[hairStyle % MALE_HAIR.length];
    const base = `https://api.dicebear.com/7.x/adventurer/svg?seed=${theme.seed}-${gender}&hair=${hair}&eyes=variant${(eyeStyle % 10 + 1).toString().padStart(2, '0')}&mouth=variant${(outfitStyle % 10 + 1).toString().padStart(2, '0')}`;
    return base;
  };

  return (
    <div className="h-full w-full bg-cosmic-bg overflow-hidden flex flex-col">
      {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">返回个人中心</span>
          </button>
          <h2 className="text-xl font-display font-bold tracking-widest uppercase neon-text">星球拟人 · 觉醒形态</h2>
          <button 
            onClick={randomize}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 hover:text-white hover:border-white/30 transition-all"
          >
            <Sparkles className="w-3 h-3 text-cosmic-neon" />
            随机生成
          </button>
        </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1 relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)]">
          
          {/* Form Toggle */}
          <div className="absolute top-8 flex gap-4 z-20">
            <button 
              onClick={() => setIsAnimeForm(false)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${!isAnimeForm ? 'bg-cosmic-neon text-black' : 'bg-white/5 text-slate-400'}`}
            >
              原始星体
            </button>
            <button 
              onClick={() => setIsAnimeForm(true)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isAnimeForm ? 'bg-cosmic-neon text-black' : 'bg-white/5 text-slate-400'}`}
            >
              拟人觉醒
            </button>
          </div>

          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isAnimeForm ? (
                <motion.div
                  key="planet"
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
                  className="relative w-48 h-48 md:w-64 md:h-64 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border-4 border-white/10"
                  style={{ 
                    background: `radial-gradient(circle at 30% 30%, ${theme.color}, #000)`,
                    boxShadow: `0 0 60px ${theme.color}44`
                  }}
                >
                  {/* Texture Overlay */}
                  <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
                  {/* Atmospheric Glow */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.8)]" />
                  
                  {theme.id === 'saturn' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-4 border-4 border-white/20 rounded-[100%] rotate-12" />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="anime"
                  initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {/* Magic Circle Background */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-full border-2 border-dashed border-cosmic-neon/20 rounded-full"
                  />
                  
                  <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden glass-panel border-cosmic-neon/30 p-2">
                    <img 
                      src={getAvatarUrl()} 
                      alt="Anime Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Elemental Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          y: [0, -100],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                        className="absolute w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: theme.accent,
                          left: `${Math.random() * 100}%`,
                          top: '80%'
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Character Info Label */}
          <div className="mt-12 text-center">
            <h3 className="text-3xl font-display font-bold text-white tracking-widest">{theme.name} · {isAnimeForm ? '觉醒态' : '原始态'}</h3>
            <p className="text-cosmic-neon text-xs font-mono uppercase tracking-[0.3em] mt-2">
              {gender === 'female' ? 'Female' : 'Male'} / Level 01 / {theme.id.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Controls Area */}
        <div className="w-full md:w-96 bg-black/40 backdrop-blur-xl border-l border-white/10 p-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {/* Gender Selection */}
            <section>
              <h4 className="text-[10px] font-mono uppercase text-slate-500 tracking-widest mb-4">选择性别</h4>
              <div className="flex gap-4">
                {(['female', 'male'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-3 rounded-xl border transition-all ${
                      gender === g 
                        ? 'bg-cosmic-neon/20 border-cosmic-neon text-cosmic-neon' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{g === 'female' ? '女性' : '男性'}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Theme Selection */}
            <section>
              <h4 className="text-[10px] font-mono uppercase text-slate-500 tracking-widest mb-4">星球主题 (八大行星)</h4>
              <div className="grid grid-cols-3 gap-3">
                {PLANET_THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`py-2 rounded-lg border transition-all text-[10px] font-bold ${
                      theme.id === t.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Customization Sliders */}
            <section className="space-y-6">
              <h4 className="text-[10px] font-mono uppercase text-slate-500 tracking-widest mb-4">细节定制</h4>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest">发型</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => prevStyle(setHairStyle, hairStyle, gender === 'female' ? FEMALE_HAIR.length : MALE_HAIR.length)} className="p-1 hover:text-cosmic-neon"><ChevronLeft className="w-5 h-5" /></button>
                  <span className="text-xs font-mono w-4 text-center">{hairStyle + 1}</span>
                  <button onClick={() => nextStyle(setHairStyle, hairStyle, gender === 'female' ? FEMALE_HAIR.length : MALE_HAIR.length)} className="p-1 hover:text-cosmic-neon"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest">五官</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => prevStyle(setEyeStyle, eyeStyle, 10)} className="p-1 hover:text-cosmic-neon"><ChevronLeft className="w-5 h-5" /></button>
                  <span className="text-xs font-mono w-4 text-center">{eyeStyle + 1}</span>
                  <button onClick={() => nextStyle(setEyeStyle, eyeStyle, 10)} className="p-1 hover:text-cosmic-neon"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest">装扮</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => prevStyle(setOutfitStyle, outfitStyle, 10)} className="p-1 hover:text-cosmic-neon"><ChevronLeft className="w-5 h-5" /></button>
                  <span className="text-xs font-mono w-4 text-center">{outfitStyle + 1}</span>
                  <button onClick={() => nextStyle(setOutfitStyle, outfitStyle, 10)} className="p-1 hover:text-cosmic-neon"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="pt-8 flex gap-4">
              <button 
                onClick={() => {
                  if (profile) {
                    onUpdateProfile({
                      ...profile,
                      avatarUrl: getAvatarUrl()
                    });
                  }
                  alert('形象已保存并同步至您的星际档案！');
                  onBack();
                }}
                className="flex-1 py-4 bg-cosmic-neon text-black rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                <Save className="w-4 h-4" />
                保存形象
              </button>
              <button 
                onClick={() => {
                  setHairStyle(0);
                  setEyeStyle(0);
                  setOutfitStyle(0);
                  setGender('female');
                  setTheme(PLANET_THEMES[3]);
                }}
                className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
