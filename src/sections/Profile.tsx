import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Calendar, BookOpen, ChevronRight, Zap, Palette, Sparkles, User, History } from 'lucide-react';
import { cn } from '../lib/utils';
import CharacterCreator from './CharacterCreator';
import CosmicStore from './CosmicStore';
import { ShoppingBag } from 'lucide-react';

const Profile: React.FC<{ 
  profile: UserProfile | null;
  onUpdateProfile: (p: UserProfile) => void;
}> = ({ profile, onUpdateProfile }) => {
  const [showCreator, setShowCreator] = useState(false);
  const [showStore, setShowStore] = useState(false);

  if (showCreator) {
    return <CharacterCreator profile={profile} onUpdateProfile={onUpdateProfile} onBack={() => setShowCreator(false)} />;
  }

  if (showStore) {
    return <CosmicStore profile={profile} onUpdateProfile={onUpdateProfile} onBack={() => setShowStore(false)} />;
  }

  if (!profile) return null;

  const stats = [
    { label: '积分', value: profile.points, icon: Star, color: 'text-yellow-400' },
    { label: '等级', value: profile.level, icon: Trophy, color: 'text-cosmic-neon' },
    { label: '连续登录', value: `${profile.streak} 天`, icon: Zap, color: 'text-orange-400' },
    { label: '已学章节', value: profile.completedChapters.length, icon: BookOpen, color: 'text-blue-400' },
  ];

  return (
    <div className="h-full w-full bg-cosmic-bg overflow-y-auto p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowCreator(true)}
            className="relative cursor-pointer group"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cosmic-neon to-cosmic-purple p-1">
              <div className="w-full h-full rounded-full bg-cosmic-bg flex items-center justify-center overflow-hidden relative">
                <img 
                  src={profile.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${profile.uid}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-cosmic-neon text-cosmic-bg text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              等级 {profile.level}
            </div>
          </motion.div>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-display font-bold">{profile.displayName}</h1>
            <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">实习天文学家</p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <button 
                onClick={() => setShowCreator(true)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-neon/10 border border-cosmic-neon/20 text-xs text-cosmic-neon hover:bg-cosmic-neon/20 transition-colors"
              >
                <Palette className="w-3 h-3" />
                <span>定制星球拟人形象</span>
              </button>
              <button 
                onClick={() => setShowStore(true)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 hover:bg-purple-500/20 transition-colors"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>星际商店</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-panel p-6 space-y-2 border-white/5">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-[10px] uppercase text-slate-500 tracking-widest">{stat.label}</p>
                <p className="text-2xl font-display font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-cosmic-neon" />
            宇宙成就与收藏
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 space-y-4 border-white/5">
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold">学院进度</p>
                <p className="text-xs text-cosmic-neon font-mono">{Math.min(100, (profile.completedChapters.length / 10) * 100)}%</p>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (profile.completedChapters.length / 10) * 100)}%` }}
                  className="h-full bg-cosmic-neon shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                />
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">完成 10 个章节即可升至 2 级</p>
            </div>

            <div className="glass-panel p-6 flex items-center justify-between border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cosmic-neon/10 flex items-center justify-center">
                  <History className="w-6 h-6 text-cosmic-neon" />
                </div>
                <div>
                  <p className="text-sm font-bold">我的收藏</p>
                  <p className="text-xs text-slate-500">已兑换 {profile.redeemedItems.length} 件珍品</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Virtual Showcase / Collection Browsing */}
        <AnimatePresence>
          {profile.redeemedItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cosmic-neon" />
                我的陈列柜
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {profile.redeemedItems.map((itemId) => (
                  <motion.div 
                    key={itemId}
                    whileHover={{ y: -5 }}
                    className="shrink-0 w-32 h-40 glass-panel p-4 flex flex-col items-center justify-center gap-2 border-cosmic-neon/20"
                  >
                    <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=100`} 
                        alt="Item"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-center">{itemId === 'item1' ? '星云披风' : itemId === 'item2' ? '超新星徽章' : itemId === 'item3' ? '黑洞视界皮肤' : '珍贵藏品'}</p>
                    <div className="w-full h-1 bg-cosmic-neon/20 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-cosmic-neon" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default Profile;
