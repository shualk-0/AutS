import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Points, PointMaterial, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Camera } from 'lucide-react';
import * as THREE from 'three';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const GALAXY_OBJECTS = [
  { 
    name: '人马座 A*', 
    type: '超大质量黑洞', 
    description: '银河系中心明亮且非常紧凑的天文射电源，被广泛认为是银河系中心的超大质量黑洞。', 
    color: '#ffffff',
    image: 'https://gips3.baidu.com/it/u=3817838897,2843894413&fm=3074&app=3074&f=JPEG?w=960&h=718&type=normal&func=',
    data: { 质量: '约400万太阳质量', 距离: '约2.6万光年', 视界半径: '约1200万公里' }
  },
  { 
    name: '猎户臂', 
    type: '螺旋臂', 
    description: '银河系的一个次要螺旋臂，宽度约为3500光年，长度约为10000光年。我们的太阳系就位于这个旋臂上。', 
    color: '#3b82f6',
    image: 'https://q0.itc.cn/images01/20240801/2625c59e747348e8a0b7edf5ce651729.png',
    data: { 长度: '约1万光年', 宽度: '约3500光年', 包含天体: '太阳系、猎户座星云' }
  },
  { 
    name: '英仙臂', 
    type: '螺旋臂', 
    description: '银河系两条主要螺旋臂之一，距离银河中心约13000光年。', 
    color: '#8b5cf6',
    image: 'https://img1.baidu.com/it/u=4124950071,2989900882&fm=253&fmt=auto&app=138&f=JPEG?w=808&h=500',
    data: { 距离中心: '约1.3万光年', 类型: '主要旋臂', 特征: '大量恒星形成区' }
  },
  { 
    name: '银河核球', 
    type: '核心区域', 
    description: '较大星系形成中紧密堆积的一组恒星。在银河系中，核球是一个巨大的、大致呈椭球形的恒星群。', 
    color: '#ffcc00',
    image: 'https://pic.rmb.bdstatic.com/bjh/news/1a9f71c77a1400442447d4f9238cc819.png',
    data: { 直径: '约1万光年', 恒星密度: '极高', 年龄: '多为老年恒星' }
  },
];

const GalaxyParticles = ({ handPos }: { handPos: THREE.Vector3 | null }) => {
  const points = useMemo(() => {
    const p = new Float32Array(15000 * 3);
    const colors = new Float32Array(15000 * 3);
    
    for (let i = 0; i < 15000; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 50;
      const spinAngle = radius * 0.2;
      const branchAngle = (i % 3) * ((Math.PI * 2) / 3);
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;

      p[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      p[i3 + 1] = randomY;
      p[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Colors
      const mixedColor = new THREE.Color('#3b82f6').lerp(new THREE.Color('#ffcc00'), radius / 50);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    return { positions: p, colors };
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;

      if (handPos) {
        // Particles react to hand position
        const dist = pointsRef.current.position.distanceTo(handPos);
        if (dist < 20) {
          pointsRef.current.rotation.y += delta * 0.2;
        }
      }
    }
  });

  return (
    <Points ref={pointsRef} positions={points.positions} colors={points.colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

import { useAppContext } from '../context/AppContext';

const GalaxyLearning: React.FC = () => {
  const { setCurrentContext } = useAppContext();
  const [selected, setSelected] = useState<any>(null);
  const [handPos, setHandPos] = useState<THREE.Vector3 | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [zoom, setZoom] = useState(80);
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null);
  const lastPinchDistRef = useRef<number | null>(null);

  const handleSelect = (obj: any) => {
    setSelected(obj);
    setCurrentContext(`银河系探索：${obj.name}`);
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
            const x = (indexFinger.x / videoRef.current.videoWidth - 0.5) * 120;
            const y = -(indexFinger.y / videoRef.current.videoHeight - 0.5) * 80;
            setHandPos(new THREE.Vector3(x, y, 0));

            // Zoom pinch
            if (thumb) {
              const dist = Math.sqrt(Math.pow(indexFinger.x - thumb.x, 2) + Math.pow(indexFinger.y - thumb.y, 2));
              const isZoomGesture = middle.y > wrist.y && ring.y > wrist.y && pinky.y > wrist.y;

              if (isZoomGesture) {
                if (lastPinchDistRef.current !== null) {
                  const delta = dist - lastPinchDistRef.current;
                  setZoom(prev => Math.max(20, Math.min(200, prev - delta * 0.5)));
                }
                lastPinchDistRef.current = dist;
              } else {
                lastPinchDistRef.current = null;
              }
            }

            if (thumb && middle && ring && pinky) {
              const isPalm = indexFinger.y < wrist.y && middle.y < wrist.y && ring.y < wrist.y && pinky.y < wrist.y;
              if (isPalm && selected) {
                setSelected(null);
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
  }, [isCameraActive, selected]);

  return (
    <div className="h-full w-full relative bg-cosmic-bg">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 40, zoom]} />
        <OrbitControls maxDistance={200} minDistance={20} />
        <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <GalaxyParticles handPos={handPos} />
        
        {/* Interactive Points */}
        {GALAXY_OBJECTS.map((obj, i) => (
          <mesh 
            key={obj.name} 
            position={[Math.cos(i) * 20, 0, Math.sin(i) * 20]}
            onClick={() => handleSelect(obj)}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={obj.color} transparent opacity={0.6} />
            <Html distanceFactor={15}>
              <div className="text-[8px] font-bold uppercase tracking-widest text-white/50 whitespace-nowrap">
                {obj.name}
              </div>
            </Html>
          </mesh>
        ))}

        {handPos && (
          <mesh position={handPos}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#ff00f3" transparent opacity={0.5} />
          </mesh>
        )}
      </Canvas>

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
      </div>

      <div className="absolute top-20 left-6 pointer-events-none">
        <h2 className="text-3xl font-display font-bold tracking-widest uppercase neon-text">银河系探索</h2>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">星系级尺度模拟</p>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-4xl w-full overflow-hidden border border-white/20 relative"
            >
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto relative overflow-hidden">
                  <img 
                    src={selected.image} 
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r" />
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                    <h3 className="text-4xl font-display font-bold mb-1">{selected.name}</h3>
                    <p className="text-cosmic-neon font-mono text-sm tracking-widest uppercase">{selected.type}</p>
                  </div>
                </div>

                <div className="p-8 md:p-10 space-y-8">
                  <section className="space-y-3">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">区域详述</h4>
                    <p className="text-slate-300 leading-relaxed">{selected.description}</p>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">核心数据</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(selected.data).map(([key, value]) => (
                        <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                          <p className="text-[10px] text-slate-500 uppercase">{key}</p>
                          <p className="text-sm font-mono font-bold text-cosmic-neon">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="pt-4">
                    <button 
                      onClick={() => setSelected(null)}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold tracking-widest uppercase"
                    >
                      返回银河
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

export default GalaxyLearning;
