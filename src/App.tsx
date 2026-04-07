import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, loginWithGoogle } from './firebase';
import { UserProfile } from './types';
import { 
  Compass, 
  GraduationCap, 
  Map as MapIcon, 
  MessageSquare, 
  User as UserIcon,
  Search,
  LogOut,
  Star,
  Home as HomeIcon,
  Menu,
  X,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-cosmic-bg p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-slate-400 mb-8 max-w-md">
            The application encountered an unexpected error. This might be due to a connection issue or a system glitch.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-cosmic-neon text-cosmic-bg font-bold rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reload Application
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-black/50 rounded-lg text-left text-xs text-red-400 overflow-auto max-w-full">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Section Components (to be implemented)
import Explore from './sections/Explore';
import Academy from './sections/Academy';
import Guide from './sections/Guide';
import Tutor from './sections/Tutor';
import Profile from './sections/Profile';
import CosmicStore from './sections/CosmicStore';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('auts_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
    return {
      uid: 'guest',
      displayName: '探索者',
      email: '',
      points: 0,
      level: 1,
      completedChapters: [],
      achievements: [],
      streak: 0,
      lastLogin: new Date().toISOString(),
      redeemedItems: []
    };
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'home' | 'explore' | 'guide' | 'tutor' | 'profile'>('home');

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-cosmic-bg">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cosmic-neon border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const navItems = [
    { id: 'home', icon: HomeIcon, label: '首页' },
    { id: 'explore', icon: Compass, label: '探索' },
    { id: 'guide', icon: MapIcon, label: '指南' },
    { id: 'tutor', icon: MessageSquare, label: 'AI助手' },
    { id: 'profile', icon: UserIcon, label: '我的' },
  ] as const;

  return (
    <div className="h-screen w-screen flex flex-col bg-cosmic-bg text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 z-50 bg-cosmic-bg/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-cosmic-neon" />
          <span className="text-xl font-display font-bold tracking-wider neon-text">AutS</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-cosmic-neon animate-pulse" />
            <span className="text-xs font-mono text-cosmic-neon">{profile?.points} 积分</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {activeSection === 'home' && <Home onEnter={() => setActiveSection('explore')} />}
            {activeSection === 'explore' && <Explore profile={profile} onUpdateProfile={setProfile} />}
            {activeSection === 'guide' && <Guide />}
            {activeSection === 'tutor' && <Tutor />}
            {activeSection === 'profile' && <Profile profile={profile} onUpdateProfile={setProfile} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="h-20 border-t border-white/5 bg-cosmic-bg/80 backdrop-blur-md flex items-center justify-around px-2 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeSection === item.id ? 'text-cosmic-neon' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${
              activeSection === item.id ? 'bg-cosmic-neon/10' : ''
            }`}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">{item.label}</span>
            {activeSection === item.id && (
              <motion.div 
                layoutId="nav-indicator"
                className="w-1 h-1 rounded-full bg-cosmic-neon mt-1"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Home Component with Galaxy Wave
const Home: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="h-full w-full relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 20] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <GalaxyWave />
        </Canvas>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center space-y-8 max-w-2xl px-6"
      >
        <h1 className="text-7xl font-display font-bold bg-gradient-to-r from-white via-cosmic-neon to-white bg-clip-text text-transparent tracking-tighter">
          AutS
        </h1>
        <p className="text-slate-400 text-xl font-light tracking-widest">
        探索无尽星空 · 领略宇宙奥秘
        <br />
        <span className="uppercase text-sm opacity-80">
         Astro-Universe-Time-Space
        </span>
</p>
        <button 
          onClick={onEnter}
          className="px-12 py-4 glass-panel hover:bg-white/10 transition-all text-lg font-bold tracking-[0.2em] uppercase group relative overflow-hidden"
        >
          <span className="relative z-10">开启探索之旅</span>
          <motion.div 
            className="absolute inset-0 bg-cosmic-neon/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
          />
        </button>
      </motion.div>
    </div>
  );
};

const GalaxyWave = () => {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;
      p[i3] = (Math.random() - 0.5) * 40;
      p[i3 + 1] = (Math.random() - 0.5) * 40;
      p[i3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      ref.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 2000; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        positions[i3 + 1] = Math.sin(x * 0.2 + state.clock.getElapsedTime()) * 2 + 
                           Math.cos(z * 0.2 + state.clock.getElapsedTime()) * 2;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={points}>
      <PointMaterial
        transparent
        color="#00f2ff"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

import { AppProvider } from './context/AppContext';

export default function Root() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  );
}
