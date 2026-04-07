import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Maximize2, ChevronLeft, Target, MapPin, Info, Compass, Plus, Minus, RotateCcw, Globe, Star, Layers, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { STAR_MAP_DATA, OverviewRegion, SubRegion, Hotspot } from '../data/starMapData';

// --- Components ---

const StarMapExplorer: React.FC = () => {
  const [activeOverview, setActiveOverview] = useState<OverviewRegion | null>(null);
  const [activeSubRegion, setActiveSubRegion] = useState<SubRegion | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const handleOverviewClick = (overview: OverviewRegion) => {
    if (isDragging) return;
    setActiveOverview(overview);
    setActiveSubRegion(null);
    setSelectedHotspot(null);
    setZoomScale(1);
  };

  const handleSubRegionClick = (sub: SubRegion) => {
    if (isDragging) return;
    setActiveSubRegion(sub);
    setSelectedHotspot(null);
    setZoomScale(1);
  };

  const handleBack = () => {
    if (activeSubRegion) {
      setActiveSubRegion(null);
      setSelectedHotspot(null);
      setZoomScale(1);
    } else if (activeOverview) {
      setActiveOverview(null);
      setSelectedHotspot(null);
      setZoomScale(1);
    }
  };

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.2, 5.0));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.2, 0.3));
  const handleResetZoom = () => setZoomScale(1);

  const handleWheel = (e: React.WheelEvent) => {
    if (!activeOverview) return;
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Breadcrumbs or current location text
  const getLocationText = () => {
    if (activeSubRegion) return `${activeOverview?.name} > ${activeSubRegion.name}`;
    if (activeOverview) return activeOverview.name;
    return '星空探索总览';
  };

  return (
    <div className="h-full w-full bg-cosmic-bg relative overflow-hidden flex flex-col">
      {/* Background Stars Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Header Info */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <motion.div
          key={getLocationText()}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md flex items-center gap-2"
        >
          <Compass className="w-3.5 h-3.5 text-cosmic-neon animate-pulse" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em]">
            {getLocationText()}
          </span>
        </motion.div>
      </div>

      {/* Main Map Container */}
      <div 
        className={cn(
          "flex-1 relative overflow-hidden",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onWheel={handleWheel}
      >
        <motion.div
          className="absolute inset-0"
          drag
          dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
          animate={{
            scale: activeSubRegion ? 3 * zoomScale : (activeOverview ? 2 * zoomScale : 1),
            x: activeSubRegion ? `${50 - activeSubRegion.x}%` : (activeOverview ? `${50 - activeOverview.x}%` : '0%'),
            y: activeSubRegion ? `${50 - activeSubRegion.y}%` : (activeOverview ? `${50 - activeOverview.y}%` : '0%'),
          }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 120,
            x: isDragging ? { duration: 0 } : undefined,
            y: isDragging ? { duration: 0 } : undefined
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {/* Level 1: Overview Regions */}
              {!activeOverview && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative max-w-5xl max-h-[600px] mx-auto"
                >
                  {STAR_MAP_DATA.map((overview) => (
                    <motion.button
                      key={overview.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleOverviewClick(overview)}
                      className="absolute group"
                      style={{ left: `${overview.x}%`, top: `${overview.y}%` }}
                    >
                      <div className="relative flex flex-col items-center">
                        <div 
                          className="w-20 h-20 rounded-full border-2 border-dashed animate-[spin_15s_linear_infinite] opacity-30 group-hover:opacity-100 transition-opacity"
                          style={{ borderColor: overview.color }}
                        />
                        <div 
                          className="absolute inset-0 m-auto w-6 h-6 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                          style={{ backgroundColor: overview.color }}
                        />
                        <div className="mt-4 px-3 py-1 bg-black/60 border border-white/10 rounded-lg backdrop-blur-sm group-hover:border-cosmic-neon transition-colors">
                          <span className="text-xs font-bold text-white whitespace-nowrap">{overview.name}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Level 2: Sub Regions */}
              {activeOverview && !activeSubRegion && (
                <motion.div 
                  key="subregions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <div 
                    className="absolute inset-0 opacity-10 blur-[120px] rounded-full pointer-events-none"
                    style={{ backgroundColor: activeOverview.color }}
                  />
                  {activeOverview.subRegions.map((sub) => (
                    <motion.button
                      key={sub.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleSubRegionClick(sub)}
                      className="absolute group"
                      style={{ left: `${sub.x}%`, top: `${sub.y}%` }}
                    >
                      <div className="relative flex flex-col items-center">
                        <div 
                          className="w-12 h-12 rounded-full border border-white/20 animate-[spin_8s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity"
                          style={{ borderColor: sub.color }}
                        />
                        <div 
                          className="absolute inset-0 m-auto w-3 h-3 rounded-full"
                          style={{ backgroundColor: sub.color }}
                        />
                        <div className="mt-3 px-2 py-1 bg-black/40 border border-white/5 rounded-lg backdrop-blur-sm group-hover:border-white/20 transition-colors">
                          <span className="text-[10px] font-bold text-slate-200 whitespace-nowrap">{sub.name}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Level 3: Hotspots */}
              {activeSubRegion && (
                <motion.div 
                  key="hotspots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <div 
                    className="absolute inset-0 opacity-20 blur-[100px] rounded-full pointer-events-none"
                    style={{ backgroundColor: activeSubRegion.color }}
                  />
                  {activeSubRegion.hotspots.map((spot) => (
                    <motion.button
                      key={spot.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => setSelectedHotspot(spot)}
                      className="absolute group z-10"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    >
                      <div className="relative flex flex-col items-center">
                        <div className={cn(
                          "w-4 h-4 rounded-full transition-all duration-300",
                          selectedHotspot?.id === spot.id 
                            ? "bg-white scale-150 shadow-[0_0_20px_#fff]" 
                            : "bg-cosmic-neon group-hover:bg-white group-hover:scale-125"
                        )} />
                        <div className={cn(
                          "mt-2 px-2 py-1 rounded text-[10px] font-bold transition-all flex flex-col items-center gap-0.5",
                          selectedHotspot?.id === spot.id
                            ? "bg-cosmic-neon text-cosmic-bg"
                            : "bg-black/60 text-slate-300 group-hover:text-white backdrop-blur-sm border border-white/10"
                        )}>
                          <span>{spot.name}</span>
                          <span className="opacity-70 font-normal text-[8px] whitespace-nowrap">
                            {spot.distance} | {spot.magnitude}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* UI Controls */}
      <div className="absolute bottom-10 left-10 z-30 flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {activeOverview && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={handleBack}
              className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                返回{activeSubRegion ? activeOverview.name : '总览星图'}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {!activeOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-3 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md max-w-xs"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-cosmic-neon" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">探索指南</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              点击星图上的总览区域，深入探索子区域，最终发现具体的天体热点。
            </p>
          </motion.div>
        )}
      </div>

      {/* Knowledge Card Panel */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-24 right-10 w-96 z-40"
          >
            <div className="glass-panel p-6 relative overflow-hidden group max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Decorative Glow */}
              <div className="absolute -right-16 -top-16 w-40 h-40 bg-cosmic-neon/10 rounded-full blur-3xl" />
              
              <button 
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-3 inline-flex px-2 py-0.5 bg-cosmic-neon/20 border border-cosmic-neon/30 rounded text-[10px] font-bold text-cosmic-neon uppercase tracking-widest">
                {selectedHotspot.type}
              </div>

              <h3 className="text-2xl font-display font-bold text-white mb-2">
                {selectedHotspot.name}
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/10">
                  <MapPin className="w-3 h-3 text-cosmic-neon" />
                  距离：{selectedHotspot.distance}
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/10">
                  <Eye className="w-3 h-3 text-cosmic-neon" />
                  视星等：{selectedHotspot.magnitude}
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {selectedHotspot.description}
              </p>

              <div className="aspect-video rounded-xl overflow-hidden mb-6 border border-white/10 relative">
                <img 
                  src={selectedHotspot.image} 
                  alt={selectedHotspot.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-cosmic-neon uppercase tracking-widest mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    核心知识点
                  </div>
                  <div className="space-y-2.5">
                    {selectedHotspot.facts.map((fact, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cosmic-neon shrink-0 shadow-[0_0_5px_#00f2ff]" />
                        <span className="text-xs text-slate-300 leading-relaxed">{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedHotspot.mythology && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                      <Globe className="w-3.5 h-3.5" />
                      文化与神话
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-amber-400/30 pl-3">
                      {selectedHotspot.mythology}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">观测推荐指数</span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={cn("w-3 h-1 rounded-full", i <= 4 ? "bg-cosmic-neon" : "bg-white/10")} />
                    ))}
                  </div>
                </div>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2">
                  <Maximize2 className="w-3 h-3" />
                  深度观测
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction Hint & Zoom Controls */}
      <div className="absolute bottom-10 right-10 z-30 flex flex-col items-end gap-4">
        <AnimatePresence>
          {activeOverview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-2 pointer-events-auto"
            >
              <div className="flex flex-col bg-black/60 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden">
                <button 
                  onClick={handleZoomIn}
                  className="p-3 hover:bg-white/10 transition-colors text-slate-300 hover:text-white border-b border-white/5"
                  title="放大"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleZoomOut}
                  className="p-3 hover:bg-white/10 transition-colors text-slate-300 hover:text-white border-b border-white/5"
                  title="缩小"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleResetZoom}
                  className="p-3 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
                  title="重置缩放"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="px-3 py-1 bg-cosmic-neon/20 border border-cosmic-neon/30 rounded-lg text-center">
                <span className="text-[10px] font-bold text-cosmic-neon">
                  {Math.round(zoomScale * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-full backdrop-blur-sm">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">
            {!activeOverview ? '点击区域或拖动探索' : (activeSubRegion ? '点击热点或拖动星图' : '点击子区域或拖动星图')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StarMapExplorer;
