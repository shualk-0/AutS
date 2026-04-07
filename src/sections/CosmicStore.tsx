import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Zap, Lock, Check, Sparkles, Award, X, Eye, ChevronLeft } from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import pifengImg from '../assets/image/pifeng.jpg';
import huihuiImg from '../assets/image/huihui.png';
import blakeImg from '../assets/image/blake.png';
import jingImg from '../assets/image/jing.png';
import mimiImg from '../assets/image/mimi.png';
import handImg from '../assets/image/hand.png';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'avatar' | 'badge' | 'theme';
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: 'item1',
    name: '星云披风',
    description: '一件由流动的星云织成的披风，散发着微弱的紫光。它能够根据穿戴者的心情改变颜色，是星际旅行者的身份象征。',
    price: 500,
    category: 'avatar',
    image: pifengImg,
    rarity: 'rare'
  },
  {
    id: 'item2',
    name: '超新星徽章',
    description: '象征着你对恒星演化的深刻理解。这枚徽章由超新星爆发后的残骸微粒打造，具有极高的收藏价值。',
    price: 200,
    category: 'badge',
    image: huihuiImg,
    rarity: 'common'
  },
  {
    id: 'item3',
    name: '黑洞视界皮肤',
    description: '让你的星球形象拥有深邃的黑洞边缘效果。光线在边缘发生强烈的引力红移，展现出极致的物理美感。',
    price: 1500,
    category: 'theme',
    image: blakeImg,
    rarity: 'legendary'
  },
  {
    id: 'item4',
    name: '量子护目镜',
    description: '能够看穿微观世界的量子涨落。这款护目镜内置了先进的波函数坍缩模拟器，让你洞察宇宙的微观奥秘。',
    price: 800,
    category: 'avatar',
    image: jingImg,
    rarity: 'epic'
  },
  {
    id: 'item5',
    name: '银河守护者名牌框',
    description: '只有最博学的星际探险家才能获得的荣誉。名牌框上刻有银河系的旋臂图案，流光溢彩。',
    price: 1000,
    category: 'badge',
    image: mimiImg,
    rarity: 'epic'
  },
  {
    id: 'item6',
    name: '脉冲星光环',
    description: '有节奏地闪烁，如同宇宙的灯塔。光环的闪烁频率与真实脉冲星同步，带给你最纯粹的星际体验。',
    price: 1200,
    category: 'theme',
    image: handImg,
    rarity: 'legendary'
  }
];

const CosmicStore: React.FC<{ 
  profile: UserProfile | null; 
  onUpdateProfile: (p: UserProfile) => void;
  onBack?: () => void;
}> = ({ profile, onUpdateProfile, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'avatar' | 'badge' | 'theme'>('all');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<StoreItem | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? STORE_ITEMS 
    : STORE_ITEMS.filter(item => item.category === selectedCategory);

  const handleRedeem = (item: StoreItem) => {
    if (!profile || profile.points < item.price || profile.redeemedItems.includes(item.id)) return;

    setRedeemingId(item.id);
    
    // Simulate network delay
    setTimeout(() => {
      const updatedProfile: UserProfile = {
        ...profile,
        points: profile.points - item.price,
        redeemedItems: [...profile.redeemedItems, item.id]
      };
      
      onUpdateProfile(updatedProfile);
      localStorage.setItem('auts_profile', JSON.stringify(updatedProfile));
      setRedeemingId(null);
      setPreviewItem(null);
    }, 1000);
  };

  const getRarityColor = (rarity: StoreItem['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-slate-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="h-full w-full bg-cosmic-bg overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <div>
              <h2 className="text-4xl font-display font-bold mb-2 neon-text">星际商店</h2>
              <p className="text-slate-400 max-w-md">
                使用你在学院和探索中获得的积分，兑换独特的装扮、徽章和主题。
              </p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-mono">当前积分</p>
              <p className="text-2xl font-display font-bold text-amber-500">{profile?.points || 0}</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'avatar', 'badge', 'theme'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={cn(
                "px-6 py-2 rounded-full border transition-all duration-300 whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-cosmic-neon/20 border-cosmic-neon text-cosmic-neon"
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/30"
              )}
            >
              {cat === 'all' ? '全部' : cat === 'avatar' ? '形象装扮' : cat === 'badge' ? '成就徽章' : '星球主题'}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isOwned = profile?.redeemedItems.includes(item.id);
            const canAfford = (profile?.points || 0) >= item.price;
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setPreviewItem(item)}
                className={cn(
                  "glass-panel p-6 border transition-all duration-300 flex flex-col cursor-pointer group hover:border-cosmic-neon/50",
                  isOwned ? "border-emerald-500/30" : "border-white/10"
                )}
              >
                <div className="relative aspect-square mb-6 rounded-xl overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-mono uppercase tracking-wider">
                    <span className={getRarityColor(item.rarity)}>{item.rarity}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-display font-bold text-lg group-hover:text-cosmic-neon transition-colors">{item.name}</h4>
                    <span className="text-xs font-mono text-slate-500">{item.category.toUpperCase()}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className={cn("font-mono font-bold", canAfford ? "text-white" : "text-rose-500")}>
                      {item.price}
                    </span>
                  </div>

                  <div className={cn(
                    "px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2",
                    isOwned 
                      ? "bg-emerald-500/20 text-emerald-500"
                      : !canAfford
                      ? "bg-white/5 text-slate-500"
                      : "bg-cosmic-neon text-black"
                  )}>
                    {isOwned ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    {isOwned ? '已拥有' : '兑换'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-2xl w-full border border-white/20 overflow-hidden relative"
            >
              <button 
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 aspect-square">
                  <img 
                    src={previewItem.image} 
                    alt={previewItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col">
                  <div className="mb-6">
                    <span className={cn("text-[10px] font-mono uppercase tracking-widest mb-2 block", getRarityColor(previewItem.rarity))}>
                      {previewItem.rarity} {previewItem.category}
                    </span>
                    <h3 className="text-3xl font-display font-bold mb-4">{previewItem.name}</h3>
                    <p className="text-slate-400 leading-relaxed">
                      {previewItem.description}
                    </p>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <span className="text-xl font-mono font-bold">{previewItem.price}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        当前余额: {profile?.points || 0}
                      </div>
                    </div>

                    <button
                      disabled={profile?.redeemedItems.includes(previewItem.id) || (profile?.points || 0) < previewItem.price || redeemingId === previewItem.id}
                      onClick={() => handleRedeem(previewItem)}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
                        profile?.redeemedItems.includes(previewItem.id)
                          ? "bg-emerald-500/20 text-emerald-500 cursor-default"
                          : (profile?.points || 0) < previewItem.price
                          ? "bg-white/5 text-slate-500 cursor-not-allowed"
                          : "bg-cosmic-neon text-black hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
                      )}
                    >
                      {redeemingId === previewItem.id ? (
                        <Sparkles className="w-5 h-5 animate-spin" />
                      ) : profile?.redeemedItems.includes(previewItem.id) ? (
                        <>
                          <Check className="w-5 h-5" />
                          已拥有此物品
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          立即兑换
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CosmicStore;
