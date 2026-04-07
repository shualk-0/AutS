import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, CheckCircle2, Lightbulb, HelpCircle, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { ACADEMY_CONTENT, Chapter, ContentBlock } from '../data/academyContent';

// --- Sub-components for Content Blocks ---

const TitleBlock: React.FC<{ content: string }> = ({ content }) => (
  <h2 className="text-3xl font-display font-bold text-white mb-6 mt-8 border-l-4 border-cosmic-neon pl-4">
    {content}
  </h2>
);

const TextBlock: React.FC<{ content: string }> = ({ content }) => (
  <p className="text-slate-300 leading-relaxed mb-6 text-lg">
    {content}
  </p>
);

const ImageBlock: React.FC<{ url: string; caption?: string }> = ({ url, caption }) => (
  <figure className="my-8">
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <img src={url} alt={caption || 'Learning content'} className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
    </div>
    {caption && <figcaption className="text-center text-slate-500 text-sm mt-3 italic">{caption}</figcaption>}
  </figure>
);

const KeyKnowledgeBlock: React.FC<{ title: string; points: string[] }> = ({ title, points }) => (
  <div className="my-8 p-6 bg-cosmic-neon/5 border border-cosmic-neon/20 rounded-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <CheckCircle2 className="w-12 h-12 text-cosmic-neon" />
    </div>
    <h4 className="text-cosmic-neon font-bold mb-4 flex items-center gap-2">
      <Sparkles className="w-4 h-4" />
      {title}
    </h4>
    <ul className="space-y-3">
      {points.map((point, i) => (
        <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cosmic-neon shrink-0" />
          {point}
        </li>
      ))}
    </ul>
  </div>
);

const ExtensionBlock: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="my-8 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
    <h4 className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
      <Lightbulb className="w-4 h-4" />
      {title}
    </h4>
    <p className="text-slate-400 text-sm leading-relaxed italic">
      {content}
    </p>
  </div>
);

const QuizBlock: React.FC<{ block: Extract<ContentBlock, { type: 'quiz' }> }> = ({ block }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="my-12 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-cosmic-neon/20 flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-cosmic-neon" />
        </div>
        <h4 className="text-xl font-bold text-white">知识自测</h4>
      </div>
      
      <p className="text-lg text-slate-200 mb-8">{block.question}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {block.options.map((option, i) => (
          <button
            key={i}
            disabled={showResult}
            onClick={() => setSelected(i)}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              selected === i 
                ? "bg-cosmic-neon/20 border-cosmic-neon text-white" 
                : "bg-white/5 border-white/10 text-slate-400 hover:border-white/30"
            )}
          >
            <span className="font-mono mr-3 opacity-50">{String.fromCharCode(65 + i)}.</span>
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {!showResult ? (
          <button
            disabled={selected === null}
            onClick={() => setShowResult(true)}
            className="px-8 py-3 bg-cosmic-neon text-black font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            提交答案
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className={cn(
              "p-4 rounded-xl mb-4 text-center font-bold",
              selected === block.answer ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
            )}>
              {selected === block.answer ? "回答正确！" : `回答错误，正确答案是 ${String.fromCharCode(65 + block.answer)}`}
            </div>
            <p className="text-slate-400 text-sm text-center italic">{block.explanation}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- Main Components ---

const ChapterDetail: React.FC<{ chapter: Chapter; onBack: () => void }> = ({ chapter, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full w-full overflow-y-auto custom-scrollbar bg-cosmic-bg"
    >
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        <img src={chapter.thumbnail} alt={chapter.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-bg via-cosmic-bg/40 to-transparent" />
        
        <div className="absolute top-8 left-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </button>
        </div>

        <div className="absolute bottom-12 left-12 max-w-2xl">
          <div className="px-3 py-1 bg-cosmic-neon/20 border border-cosmic-neon/30 rounded text-[10px] font-bold text-cosmic-neon uppercase tracking-widest mb-4 inline-block">
            {chapter.category}
          </div>
          <h1 className="text-5xl font-display font-bold text-white mb-2">{chapter.title}</h1>
          <p className="text-xl text-slate-300">{chapter.subtitle}</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-8 py-12 pb-32">
        {chapter.content.map((block, i) => {
          switch (block.type) {
            case 'title': return <TitleBlock key={i} content={block.content} />;
            case 'text': return <TextBlock key={i} content={block.content} />;
            case 'image': return <ImageBlock key={i} url={block.url} caption={block.caption} />;
            case 'key-knowledge': return <KeyKnowledgeBlock key={i} title={block.title} points={block.points} />;
            case 'extension': return <ExtensionBlock key={i} title={block.title} content={block.content} />;
            case 'quiz': return <QuizBlock key={i} block={block} />;
            default: return null;
          }
        })}
      </div>
    </motion.div>
  );
};

const CelestialLearning: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const selectedChapter = ACADEMY_CONTENT.find(c => c.id === selectedChapterId);
  const currentChapter = ACADEMY_CONTENT[activeIndex];

  // Extract key knowledge points
  const keyKnowledge = currentChapter.content.find(b => b.type === 'key-knowledge') as any;
  const points = keyKnowledge?.points || [];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % ACADEMY_CONTENT.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + ACADEMY_CONTENT.length) % ACADEMY_CONTENT.length);
  };

  return (
    <div className="h-full w-full bg-cosmic-bg overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!selectedChapter ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col items-center justify-center p-4 md:p-8 relative"
          >
            <div className="max-w-6xl w-full">
              <div className="mb-8 md:mb-12 text-center">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 neon-text tracking-tight">天体探索</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">穿梭于星系之间，揭开宇宙最深处的奥秘。</p>
              </div>

              <div className="relative flex items-center justify-center min-h-[500px]">
                {/* Navigation Arrows */}
                <button 
                  onClick={handlePrev}
                  className="absolute left-0 md:left-4 z-30 p-3 md:p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-cosmic-neon hover:text-cosmic-bg transition-all backdrop-blur-xl shadow-2xl group"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                </button>

                {/* Main Interactive Component */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentChapter.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center glass-panel p-6 md:p-12 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                  >
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cosmic-neon/10 blur-[120px] rounded-full pointer-events-none" />

                    {/* Left: Celestial Image Area */}
                    <div 
                      className="relative aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <motion.div
                        animate={{ 
                          rotate: isHovered ? 360 : 0,
                          scale: isHovered ? 1.05 : 1
                        }}
                        transition={{ 
                          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                          scale: { duration: 0.4 }
                        }}
                        className="relative w-full h-full"
                      >
                        {/* Decorative Rings */}
                        <div className="absolute inset-0 border border-white/5 rounded-full scale-110 animate-pulse" />
                        <div className="absolute inset-0 border border-cosmic-neon/10 rounded-full scale-125 rotate-45" />
                        
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_80px_rgba(0,242,255,0.2)]">
                          <img 
                            src={currentChapter.thumbnail} 
                            alt={currentChapter.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </motion.div>

                      {/* Floating Info Badge */}
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 bg-cosmic-neon text-cosmic-bg px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,242,255,0.5)]"
                      >
                        {currentChapter.category}
                      </motion.div>
                    </div>

                    {/* Right: Content Area */}
                    <div className="flex flex-col space-y-6 md:space-y-8 z-10">
                      <div className="space-y-3">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="text-cosmic-neon font-mono text-xs tracking-[0.3em] uppercase">Celestial Object</span>
                          <h3 className="text-4xl md:text-6xl font-display font-bold text-white mt-2 leading-tight">
                            {currentChapter.title}
                          </h3>
                        </motion.div>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-slate-400 text-lg leading-relaxed font-light"
                        >
                          {currentChapter.subtitle}
                        </motion.p>
                      </div>

                      {/* Key Knowledge Points */}
                      <div className="space-y-4">
                        {points.slice(0, 3).map((point: string, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="flex items-start gap-4 group"
                          >
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cosmic-neon shadow-[0_0_8px_rgba(0,242,255,0.8)] group-hover:scale-150 transition-transform" />
                            <p className="text-slate-300 text-sm md:text-base leading-snug">{point}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="pt-4"
                      >
                        <button 
                          onClick={() => setSelectedChapterId(currentChapter.id)}
                          className="group flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-cosmic-neon border border-white/10 hover:border-cosmic-neon rounded-2xl text-white hover:text-cosmic-bg transition-all duration-500 font-bold uppercase tracking-widest text-sm relative overflow-hidden"
                        >
                          <span className="relative z-10">了解更多详情</span>
                          <BookOpen className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Right Arrow */}
                <button 
                  onClick={handleNext}
                  className="absolute right-0 md:right-4 z-30 p-3 md:p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-cosmic-neon hover:text-cosmic-bg transition-all backdrop-blur-xl shadow-2xl group"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Progress & Navigation Dots */}
              <div className="flex justify-center items-center gap-4 mt-12">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">0{activeIndex + 1}</span>
                <div className="flex gap-2">
                  {ACADEMY_CONTENT.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1.5 transition-all duration-500 rounded-full ${
                        activeIndex === i ? 'w-12 bg-cosmic-neon shadow-[0_0_10px_rgba(0,242,255,0.5)]' : 'w-2 bg-white/10 hover:bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">0{ACADEMY_CONTENT.length}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <ChapterDetail 
            key="detail"
            chapter={selectedChapter} 
            onBack={() => setSelectedChapterId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelestialLearning;
