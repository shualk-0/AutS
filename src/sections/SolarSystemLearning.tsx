import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Line, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Camera, Hand } from 'lucide-react';
import * as THREE from 'three';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const PLANETS = [
  { 
    name: '水星', 
    distance: 4, 
    size: 0.4, 
    speed: 0.04, 
    color: '#A5A5A5', 
    description: '太阳系中最靠近太阳的行星，也是最小的行星。它几乎没有大气层来保留热量，导致昼夜温差极大。',
    image: 'https://img1.baidu.com/it/u=1917229165,2284724079&fm=253&app=138&f=JPEG?w=500&h=500',
    data: { 直径: '4,879 公里', 质量: '3.30 × 10^23 kg', 表面温度: '-173 到 427°C' }
  },
  { 
    name: '金星', 
    distance: 6, 
    size: 0.9, 
    speed: 0.015, 
    color: '#E3BB76', 
    description: '太阳系中最热的行星，拥有极厚且充满二氧化碳的大气层，产生了失控的温室效应。',
    image: 'https://miaobi-lite.bj.bcebos.com/miaobi/5mao/b%27LV8xNzM2MzY5NTcxLjk3MjU2Mw%3D%3D%27/0.png',
    data: { 直径: '12,104 公里', 质量: '4.87 × 10^24 kg', 表面温度: '462°C' }
  },
  { 
    name: '地球', 
    distance: 9, 
    size: 1, 
    speed: 0.01, 
    color: '#2277FF', 
    description: '我们的家园，目前已知唯一有生命存在的星球。拥有液态水、氮氧大气层和保护性的磁场。',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=800',
    data: { 直径: '12,742 公里', 质量: '5.972 × 10^24 kg', 温度范围: '-88 到 58°C' }
  },
  { 
    name: '火星', 
    distance: 12, 
    size: 0.5, 
    speed: 0.008, 
    color: '#FF4422', 
    description: '被称为“红色星球”，拥有太阳系中最大的火山——奥林匹斯山。其表面布满了氧化铁。',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800',
    data: { 直径: '6,779 公里', 质量: '6.39 × 10^23 kg', 温度范围: '-153 到 20°C' }
  },
  { 
    name: '木星', 
    distance: 18, 
    size: 2.2, 
    speed: 0.004, 
    color: '#D39C7E', 
    description: '太阳系中最大的行星，主要由氢和氦组成。它拥有著名的大红斑——一个持续了数百年的巨大风暴。',
    image: 'https://images.unsplash.com/photo-1630839437035-dac17da580d0?auto=format&fit=crop&q=80&w=800',
    data: { 直径: '139,820 公里', 质量: '1.898 × 10^27 kg', 表面温度: '-108°C' }
  },
  { 
    name: '土星', 
    distance: 24, 
    size: 1.8, 
    speed: 0.002, 
    color: '#C5AB6E', 
    description: '以其壮观的环系统而闻名，是太阳系中密度最低的行星。如果有一个足够大的海洋，它能浮起来。',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&q=80&w=800',
    data: { 直径: '116,460 公里', 质量: '5.68 × 10^26 kg', 表面温度: '-138°C' }
  },
  { 
    name: '天王星', 
    distance: 30, 
    size: 1.2, 
    speed: 0.001, 
    color: '#BBE1E4', 
    description: '一颗侧向自转的冰巨星，呈现出美丽的淡蓝色。它的自转轴几乎平行于轨道平面。',
    image: 'https://images.unsplash.com/photo-1614732484003-ef9881555dc3?auto=format&fit=crop&q=80&w=800',
    data: { 直径: '50,724 公里', 质量: '8.68 × 10^25 kg', 表面温度: '-197°C' }
  },
  { 
    name: '海王星', 
    distance: 36, 
    size: 1.2, 
    speed: 0.0008, 
    color: '#6081FF', 
    description: '太阳系中距离太阳最远的行星，拥有极速的风暴和深蓝色的外观。',
    image: 'https://d00.paixin.com/thumbs/1034598/35284691/staff_1024.jpg',
    data: { 直径: '49,244 公里', 质量: '1.02 × 10^26 kg', 表面温度: '-201°C' }
  },
];

const Planet = ({ planet, onSelect, handPos }: { planet: any, onSelect: (p: any) => void, handPos: THREE.Vector3 | null }) => {
  const meshRef = useRef<THREE.Points>(null);
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    setAngle((prev) => prev + planet.speed);
    if (meshRef.current) {
      const targetX = Math.cos(angle) * planet.distance;
      const targetZ = Math.sin(angle) * planet.distance;
      
      meshRef.current.position.x = targetX;
      meshRef.current.position.z = targetZ;
      meshRef.current.rotation.y += delta * 0.5;

      // React to hand position
      if (handPos) {
        const dist = meshRef.current.position.distanceTo(handPos);
        if (dist < 5) {
          meshRef.current.scale.setScalar(1 + (5 - dist) * 0.2);
        } else {
          meshRef.current.scale.setScalar(1);
        }
      }
    }
  });

  const points = useMemo(() => {
    const p = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const i3 = i * 3;
      const r = planet.size * Math.pow(Math.random(), 0.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i3] = r * Math.sin(phi) * Math.cos(theta);
      p[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [planet.size]);

  return (
    <group>
      <Line
        points={[...Array(128)].map((_, i) => {
          const a = (i / 128) * Math.PI * 2;
          return [Math.cos(a) * planet.distance, 0, Math.sin(a) * planet.distance];
        })}
        color="white"
        opacity={0.1}
        transparent
        lineWidth={1}
      />
      <Points 
        ref={meshRef} 
        positions={points}
        onClick={(e) => { e.stopPropagation(); onSelect(planet); }} 
        onPointerOver={() => document.body.style.cursor = 'pointer'} 
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <PointMaterial 
          transparent 
          color={planet.color} 
          size={0.05} 
          sizeAttenuation={true} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

import { useAppContext } from '../context/AppContext';

const SolarSystemLearning: React.FC = () => {
  const { setCurrentContext } = useAppContext();
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);
  const [handPos, setHandPos] = useState<THREE.Vector3 | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [zoom, setZoom] = useState(60);
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null);
  const lastPinchDistRef = useRef<number | null>(null);

  const handleSelect = (planet: any) => {
    setSelectedPlanet(planet);
    setCurrentContext(`太阳系探索：${planet.name}`);
  };

  useEffect(() => {
    const initDetector = async () => {
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: 'mediapipe' as const,
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        modelType: 'full' as const,
      };
      detectorRef.current = await handPoseDetection.createDetector(model, detectorConfig);
    };
    initDetector();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  useEffect(() => {
    let animationFrameId: number;
    const detect = async () => {
      if (detectorRef.current && videoRef.current && videoRef.current.readyState === 4) {
        const hands = await detectorRef.current.estimateHands(videoRef.current);
        if (hands.length > 0) {
          const hand = hands[0];
          const indexFinger = hand.keypoints.find(k => k.name === 'index_finger_tip');
          const thumb = hand.keypoints.find(k => k.name === 'thumb_tip');
          const middle = hand.keypoints.find(k => k.name === 'middle_finger_tip');
          const ring = hand.keypoints.find(k => k.name === 'ring_finger_tip');
          const pinky = hand.keypoints.find(k => k.name === 'pinky_tip');
          const wrist = hand.keypoints.find(k => k.name === 'wrist');

          if (indexFinger && wrist) {
            // Map camera coordinates to 3D space
            const x = (indexFinger.x / videoRef.current.videoWidth - 0.5) * 100;
            const y = -(indexFinger.y / videoRef.current.videoHeight - 0.5) * 60;
            setHandPos(new THREE.Vector3(x, y, 0));

            // Pinch detection for Zoom (Thumb and Index)
            if (thumb) {
              const dist = Math.sqrt(Math.pow(indexFinger.x - thumb.x, 2) + Math.pow(indexFinger.y - thumb.y, 2));
              
              // If middle, ring, and pinky are curled, treat as zoom gesture
              const isZoomGesture = middle.y > wrist.y && ring.y > wrist.y && pinky.y > wrist.y;
              
              if (isZoomGesture) {
                if (lastPinchDistRef.current !== null) {
                  const delta = dist - lastPinchDistRef.current;
                  setZoom(prev => Math.max(15, Math.min(150, prev - delta * 0.5)));
                }
                lastPinchDistRef.current = dist;
              } else {
                lastPinchDistRef.current = null;
              }

              // Selection pinch (quick pinch)
              if (dist < 30 && !isZoomGesture) {
                // Find closest planet logic could go here
              }
            }

            // Palm detection (All fingers extended)
            if (thumb && middle && ring && pinky) {
              const isPalm = indexFinger.y < wrist.y && middle.y < wrist.y && ring.y < wrist.y && pinky.y < wrist.y;
              if (isPalm && selectedPlanet) {
                setSelectedPlanet(null);
              }
            }
          }
        } else {
          setHandPos(null);
          lastPinchDistRef.current = null;
        }
      }
      animationFrameId = requestAnimationFrame(detect);
    };
    if (isCameraActive) detect();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCameraActive, selectedPlanet]);

  return (
    <div className="h-full w-full relative bg-cosmic-bg">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 40, zoom]} fov={45} />
        <OrbitControls maxDistance={150} minDistance={10} />
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffcc00" />

        <GalaxySun />

        {PLANETS.map((p) => (
          <Planet key={p.name} planet={p} onSelect={handleSelect} handPos={handPos} />
        ))}

        {/* Hand Visualizer in 3D */}
        {handPos && (
          <mesh position={handPos}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#00f3ff" transparent opacity={0.5} />
          </mesh>
        )}
      </Canvas>

      {/* Camera Feed Overlay */}
      <div className="absolute top-6 right-6 z-50 flex flex-col items-end gap-4">
        <div className="w-48 h-36 rounded-2xl overflow-hidden border-2 border-cosmic-neon/30 shadow-[0_0_20px_rgba(0,243,255,0.2)] bg-black relative">
          {!isCameraActive ? (
            <button 
              onClick={startCamera}
              className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group"
            >
              <Camera className="w-6 h-6 text-cosmic-neon group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-widest">开启手势控制</span>
            </button>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover flip-h opacity-70 grayscale" />
              <div className="absolute inset-0 border border-cosmic-neon/20 pointer-events-none" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] font-mono text-white/70 uppercase">Live Feed</span>
              </div>
            </>
          )}
        </div>
        
        {isCameraActive && (
          <div className="glass-panel p-3 border-cosmic-neon/20 text-[10px] space-y-2 w-48">
            <div className="flex items-center gap-2 text-cosmic-neon">
              <Hand className="w-3 h-3" />
              <span>手势指令</span>
            </div>
            <p className="text-slate-400">• <span className="text-white">捏合:</span> 选择星球</p>
            <p className="text-slate-400">• <span className="text-white">张开手掌:</span> 退出详情</p>
          </div>
        )}
      </div>

      <div className="absolute top-20 left-6 pointer-events-none">
        <h2 className="text-3xl font-display font-bold tracking-widest uppercase neon-text">太阳系探索</h2>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">交互式三维星系模拟</p>
      </div>

      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedPlanet(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-4xl w-full overflow-hidden border border-white/20 relative"
            >
              <button 
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto relative overflow-hidden">
                  <img 
                    src={selectedPlanet.image} 
                    alt={selectedPlanet.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r" />
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                    <h3 className="text-4xl font-display font-bold mb-1">{selectedPlanet.name}</h3>
                    <p className="text-cosmic-neon font-mono text-sm tracking-widest uppercase">已选行星</p>
                  </div>
                </div>

                <div className="p-8 md:p-10 space-y-8">
                  <section className="space-y-3">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">行星概览</h4>
                    <p className="text-slate-300 leading-relaxed">{selectedPlanet.description}</p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">核心数据</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedPlanet.data).map(([key, value]) => (
                        <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-[10px] text-slate-500 uppercase mb-1">{key}</p>
                          <p className="text-sm font-mono font-bold text-cosmic-neon">{value as string}</p>
                        </div>
                      ))}
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase mb-1">轨道距离</p>
                        <p className="text-sm font-mono font-bold text-cosmic-neon">{selectedPlanet.distance} AU</p>
                      </div>
                    </div>
                  </section>

                  <div className="pt-4">
                    <button 
                      onClick={() => setSelectedPlanet(null)}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold tracking-widest uppercase"
                    >
                      返回探索
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

const GalaxySun = () => {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;
      const r = 3 * Math.pow(Math.random(), 0.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i3] = r * Math.sin(phi) * Math.cos(theta);
      p[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, []);

  return (
    <Points positions={points}>
      <PointMaterial 
        transparent 
        color="#ffcc00" 
        size={0.1} 
        sizeAttenuation={true} 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default SolarSystemLearning;
