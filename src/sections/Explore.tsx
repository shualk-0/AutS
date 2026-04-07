import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Float, Text, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Info, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

// Sub-modules
import CelestialLearning from './CelestialLearning';
import StarMapExplorer from './StarMapExplorer';
import Academy from './Academy';
import NasaApod from '../components/NasaApod';
import { UserProfile } from '../types';

interface ExploreProps {
  profile: UserProfile | null;
  onUpdateProfile: (p: UserProfile) => void;
}

const Explore: React.FC<ExploreProps> = ({ profile, onUpdateProfile }) => {
  const [activeModule, setActiveModule] = useState<1 | 2 | 3 | 4>(1);

  return (
    <div className="h-full w-full relative">
      {/* Module Switcher */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex gap-2 p-1 glass-panel">
        {[
          { id: 1, label: '天体学习' },
          { id: 2, label: '星空探索' },
          { id: 3, label: '天文课程' },
          { id: 4, label: '宇宙画廊' }
        ].map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod.id as 1 | 2 | 3 | 4)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeModule === mod.id ? 'bg-cosmic-neon text-cosmic-bg' : 'text-slate-400 hover:text-white'
            }`}
          >
            {mod.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          {activeModule === 1 && <CelestialLearning />}
          {activeModule === 2 && <StarMapExplorer />}
          {activeModule === 3 && <Academy profile={profile} onUpdateProfile={onUpdateProfile} />}
          {activeModule === 4 && (
            <div className="h-full w-full overflow-y-auto p-8 pt-24 custom-scrollbar bg-cosmic-bg">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-display font-bold text-white tracking-tight">今日宇宙画廊</h2>
                  <p className="text-slate-400">来自 NASA 的每日天文影像，带你领略宇宙之美。</p>
                </div>
                <NasaApod />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Explore;
