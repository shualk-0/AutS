import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Star, 
  Clock, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  ArrowLeft, 
  Award, 
  Zap, 
  FileText, 
  Upload, 
  Search,
  Telescope,
  Rocket,
  Compass,
  Globe,
  Sun,
  Moon,
  Orbit,
  Info,
  X,
  LucideIcon
} from 'lucide-react';
import { UserProfile } from '../types';

const DEEPSEEK_CONFIG = {
  apiKey: "1123b457-ced6-4f8c-8d73-4e66502464d1",
  base_url: "https://ark.cn-beijing.volces.com/api/v3",
  model: "ep-20260405155245-wnxh7"
};

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  quiz: QuizQuestion[];
}

interface Course {
  id: string;
  title: string;
  scope: string;
  difficulty: '入门' | '进阶' | '专业';
  contentCount: number;
  icon: LucideIcon;
  color: string;
  structure: {
    level: string;
    items: Chapter[];
  }[];
}

interface UserStats {
  totalPoints: number;
  completedChapters: string[];
  badges: string[];
}

const SYSTEMATIC_COURSES: Course[] = [
  {
    id: 'cosmology-001',
    title: '宇宙起源与演化',
    scope: '从大爆炸理论到宇宙的终极命运，探索万物的起点。',
    difficulty: '入门',
    contentCount: 5,
    icon: Orbit,
    color: 'text-purple-400',
    structure: [
      {
        level: '基础理论',
        items: [
          {
            id: 'big-bang-01',
            title: '大爆炸：宇宙的诞生',
            description: '理解宇宙是如何从一个奇点开始膨胀的。',
            image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200',
            content: `宇宙大爆炸理论（Big Bang Theory）是现代宇宙学中最具影响力的学说。它认为宇宙起源于约138亿年前的一个极高温度、极高密度的“奇点”。

### 核心阶段：
1. **普朗克时期**：宇宙诞生的最初10^-43秒，物理定律尚不明确。
2. **暴胀时期**：宇宙在极短时间内经历了指数级的膨胀，解决了平坦性问题。
3. **核合成时期**：大爆炸后几分钟，氢、氦等轻元素开始形成，奠定了宇宙的物质基础。
4. **复合时期**：约38万年后，宇宙变得透明，光子可以自由传播，形成了我们今天观测到的宇宙微波背景辐射（CMB）。

### 关键知识点：
- **奇点**：宇宙开始时的无限密度点。
- **138亿年**：目前公认的宇宙年龄。
- **哈勃定律**：星系远离速度与距离成正比，证明宇宙在膨胀。
- **CMB**：大爆炸留下的“余温”，宇宙最古老的光。

### 关键证据：
- **宇宙膨胀**：爱德温·哈勃发现星系正在远离我们。
- **微波背景辐射**：1964年发现的均匀背景辐射。
- **轻元素丰度**：氢和氦的比例与理论预测契合。`,
            quiz: [
              {
                question: '宇宙大爆炸大约发生在多少年前？',
                options: ['46亿年', '100亿年', '138亿年', '200亿年'],
                correctAnswer: 2,
                points: 50,
                explanation: '科学界普遍认为宇宙起源于约138亿年前。'
              },
              {
                question: '大爆炸后约38万年发生的“复合时期”标志着什么？',
                options: ['黑洞的形成', '宇宙变得透明', '第一颗恒星诞生', '星系的合并'],
                correctAnswer: 1,
                points: 50,
                explanation: '此时电子与原子核结合形成中性原子，光子不再被频繁散射，宇宙变得透明。'
              }
            ]
          },
          {
            id: 'cmb-01',
            title: '宇宙微波背景辐射：大爆炸的余晖',
            description: '探索宇宙中最古老的光，揭示早期宇宙的秘密。',
            image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200',
            content: `宇宙微波背景辐射（CMB）是宇宙大爆炸留下的电磁辐射，充斥在整个宇宙空间中。它是我们能观测到的最古老的光。

### 发现历史：
1964年，美国工程师阿诺·彭齐亚斯和罗伯特·威尔逊在调试射电望远镜时，意外发现了一种无法消除的背景噪声。这种噪声在各个方向上都完全相同，最终被证实是大爆炸的遗迹。

### 科学意义：
CMB为我们提供了宇宙诞生后约38万年时的“快照”。通过分析CMB的微小温度波动，科学家可以推断出宇宙的年龄、成分（如暗物质比例）以及它的几何形状。

### 关键知识点：
- **38万年**：CMB产生于大爆炸后约38万年。
- **各向同性**：CMB在各个方向上几乎完全均匀。
- **各向异性**：CMB中存在的极微小温度差异（十万分之一度），是后来星系形成的种子。
- **普朗克卫星**：目前观测CMB最精确的探测器。

CMB是现代宇宙学“标准模型”的基石。`,
            quiz: [
              {
                question: '宇宙微波背景辐射（CMB）产生于大爆炸后约多少年？',
                options: ['3分钟', '38万年', '10亿年', '138亿年'],
                correctAnswer: 1,
                points: 50,
                explanation: '在大爆炸后约38万年，宇宙冷却到足以让原子形成，光子开始自由传播，形成了CMB。'
              }
            ]
          }
        ]
      },
      {
        level: '进阶探索',
        items: [
          {
            id: 'dark-matter-01',
            title: '暗物质与暗能量',
            description: '揭开占据宇宙95%的神秘成分。',
            image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&q=80&w=1200',
            content: `虽然我们能看到的恒星、行星 and 星系构成了壮丽的宇宙，但它们仅占宇宙总质能的5%左右。剩下的95%由暗物质和暗能量组成。

### 暗物质 (Dark Matter) - 约27%
- **特性**：不发射、不吸收、也不反射光，无法直接观测。
- **证据**：星系旋转曲线异常（边缘恒星速度过快）、引力透镜效应、星系团的稳定性。
- **作用**：提供额外的引力，像“胶水”一样维持星系的结构。如果没有暗物质，星系会因为旋转太快而分崩离析。

### 暗能量 (Dark Energy) - 约68%
- **特性**：一种充斥在空间中的均匀能量，具有负压强。
- **作用**：产生斥力，导致宇宙的膨胀速度不断加快。
- **发现**：1998年通过观测远处的Ia型超新星，科学家发现宇宙正在加速膨胀。

### 关键知识点：
- **5%**：普通物质（原子）仅占宇宙的5%。
- **引力胶水**：暗物质通过引力维持星系不解体。
- **宇宙加速器**：暗能量推动宇宙加速膨胀。
- **WIMPs**：弱相互作用大质量粒子，暗物质的热门候选者。

这是现代物理学最大的谜团之一，揭开它们的真相将彻底改变我们对自然界的认知。`,
            quiz: [
              {
                question: '暗能量在宇宙中的主要作用是什么？',
                options: ['维持星系结构', '导致宇宙加速膨胀', '形成黑洞', '产生引力波'],
                correctAnswer: 1,
                points: 50,
                explanation: '暗能量提供一种排斥力，克服引力导致宇宙膨胀速度越来越快。'
              }
            ]
          },
          {
            id: 'inflation-01',
            title: '宇宙暴胀：瞬间的巨变',
            description: '在宇宙诞生的最初一瞬间，空间经历了超光速的指数级扩张。',
            image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4b519?auto=format&fit=crop&q=80&w=1200',
            content: `暴胀理论（Inflation Theory）认为，在宇宙诞生的极早期（约10^-36秒），宇宙经历了一个极短但极其剧烈的指数级膨胀过程。

### 为什么要提出暴胀？
传统的宇宙大爆炸模型无法解释两个重要问题：
1. **平坦性问题**：为什么宇宙看起来如此平坦？
2. **视界问题**：为什么宇宙在各个方向上温度如此均匀？

暴胀理论完美地解决了这些问题：它将微小的空间区域拉伸到巨大，使得宇宙变得平坦且均匀。

### 关键知识点：
- **10^-36秒**：暴胀发生的极早时间点。
- **指数级膨胀**：宇宙在瞬间扩大了至少10^26倍。
- **量子涨落**：暴胀将微小的量子涨落放大，形成了后来星系结构的种子。
- **阿兰·古斯**：暴胀理论的主要提出者之一。

暴胀不仅解释了宇宙的宏观特征，还为我们理解物质的起源提供了线索。`,
            quiz: [
              {
                question: '暴胀理论主要解决了大爆炸模型中的哪些问题？',
                options: ['黑洞起源问题', '平坦性问题与视界问题', '暗物质来源问题', '恒星演化问题'],
                correctAnswer: 1,
                points: 50,
                explanation: '暴胀理论通过极早期的剧烈膨胀，解释了宇宙为何如此平坦以及背景辐射为何如此均匀。'
              }
            ]
          },
          {
            id: 'cosmic-fate-01',
            title: '宇宙的终极命运',
            description: '宇宙最终会走向何方？大冻结还是大撕裂？',
            image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4b519?auto=format&fit=crop&q=80&w=1200',
            content: `宇宙的未来取决于暗能量的性质以及宇宙的总密度。

### 三种可能的情景：
1. **大冻结 (Big Freeze)**：宇宙持续膨胀，恒星耗尽燃料，黑洞蒸发，最终宇宙达到热寂状态，温度接近绝对零度。
2. **大撕裂 (Big Rip)**：如果暗能量的排斥力随时间增强，最终它将撕碎星系、恒星、行星，甚至原子本身。
3. **大挤压 (Big Crunch)**：如果引力最终战胜膨胀，宇宙将停止扩张并开始收缩，最终回到奇点状态。

目前的观测数据更倾向于“大冻结”或“加速膨胀下的热寂”。`,
            quiz: [
              {
                question: '“热寂”状态意味着宇宙达到了什么状态？',
                options: ['极高温度', '最大熵值和均匀温度', '物质极度密集', '引力最强'],
                correctAnswer: 1,
                points: 50,
                explanation: '热寂是指宇宙能量分布完全均匀，不再有能量流动，无法维持生命或物理过程。'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'solar-system-001',
    title: '太阳系深度探索',
    scope: '从炽热的太阳到冰冷的奥尔特云，领略家园的壮丽。',
    difficulty: '入门',
    contentCount: 8,
    icon: Sun,
    color: 'text-orange-400',
    structure: [
      {
        level: '内太阳系',
        items: [
          {
            id: 'sun-core-01',
            title: '太阳：生命之源',
            description: '探索这颗维持太阳系运转的恒星内部。',
            image: 'https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?auto=format&fit=crop&q=80&w=1200',
            content: `太阳是一颗黄矮星（G型主序星），占据了太阳系总质量的 99.86%。

### 内部结构：
1. **核心**：温度高达1500万摄氏度，压力是地球大气的2500亿倍，进行着氢核聚变。
2. **辐射层**：能量以光子形式在密集的等离子体中“随机行走”，耗时数万年。
3. **对流层**：热物质上升，冷物质下降，形成巨大的环流。
4. **光球层**：我们看到的太阳表面，温度约5500摄氏度。
5. **色球层与日冕**：太阳的大气层，日冕温度高达数百万度。

### 关键知识点：
- **核聚变**：将氢转化为氦，释放巨大能量。
- **11年周期**：太阳活动（如黑子）的周期性变化。
- **日冕**：太阳的最外层大气，温度远高于表面。
- **太阳风**：从太阳射出的带电粒子流。

### 太阳周期：
太阳活动呈现约11年的周期性变化，包括黑子数量的增减、耀斑和日冕物质抛射（CME）的频率。`,
            quiz: [
              {
                question: '太阳的主要能量来源是什么？',
                options: ['核裂变', '核聚变', '化学燃烧', '引力坍缩'],
                correctAnswer: 1,
                points: 50,
                explanation: '太阳核心通过将氢原子核聚变为氦原子核释放巨大能量。'
              }
            ]
          },
          {
            id: 'moon-01',
            title: '月球：地球的永恒伴侣',
            description: '探索月球的起源、地貌以及它对地球的影响。',
            image: 'https://images.unsplash.com/photo-1522030239044-12f91ef11b2b?auto=format&fit=crop&q=80&w=1200',
            content: `月球是地球唯一的天然卫星，也是人类目前唯一亲自踏足过的地外天体。

### 起源：大碰撞假说
目前最广为接受的理论是，约45亿年前，一颗火星大小的天体（忒伊亚）撞击了早期地球，撞击产生的碎片在地球轨道上聚集形成了月球。

### 对地球的影响：
1. **潮汐**：月球的引力是地球海洋潮汐的主要驱动力。
2. **自转稳定**：月球的存在稳定了地球地轴的倾角，从而维持了稳定的气候季节。
3. **减缓自转**：由于潮汐摩擦，地球的自转速度正在极其缓慢地减慢。

### 关键知识点：
- **潮汐锁定**：月球总是以同一面朝向地球。
- **月海**：月球表面暗色的平原，实际上是古代火山喷发形成的玄武岩。
- **1/6引力**：月球表面的引力仅为地球的六分之一。
- **阿波罗计划**：人类首次登月的伟大航程。`,
            quiz: [
              {
                question: '月球对地球最显著的物理影响是什么？',
                options: ['产生极光', '引起海洋潮汐', '提供光合作用所需的光', '改变地球的公转轨道'],
                correctAnswer: 1,
                points: 50,
                explanation: '月球的引力拉扯地球上的海水，形成了周期性的潮汐现象。'
              }
            ]
          },
          {
            id: 'asteroid-belt-01',
            title: '小行星带与矮行星',
            description: '探索火星与木星之间岩石世界的秘密。',
            image: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?auto=format&fit=crop&q=80&w=1200',
            content: `小行星带是位于火星和木星轨道之间的一个环形区域，聚集了数以百万计的小行星。

### 形成原因：
科学家认为，这些岩石碎片原本可能形成一颗行星，但由于木星强大的引力扰动，它们无法聚集成球，最终留下了这些“建筑残余”。

### 矮行星：谷神星
谷神星（Ceres）是小行星带中最大的天体，也是唯一一颗位于内太阳系的矮行星。它拥有球形外观，甚至可能存在地下海洋。

### 关键知识点：
- **2.2 - 3.2 AU**：小行星带的主要分布范围。
- **碳质小行星**：最常见的一类，富含碳元素。
- **木星引力**：阻止了小行星带形成行星的主要原因。
- **谷神星**：小行星带中唯一的矮行星。

小行星带并非像电影中那样拥挤，天体之间的平均距离其实非常遥远。`,
            quiz: [
              {
                question: '小行星带主要位于哪两颗行星的轨道之间？',
                options: ['地球与火星', '火星与木星', '木星与土星', '金星与地球'],
                correctAnswer: 1,
                points: 50,
                explanation: '小行星带位于类地行星（火星）与巨行星（木星）的交界地带。'
              }
            ]
          }
        ]
      },
      {
        level: '行星特征与地质',
        items: [
          {
            id: 'planetary-magnetosphere-01',
            title: '行星磁场：宇宙的隐形护盾',
            description: '了解行星磁场是如何产生的，以及它如何保护生命。',
            image: 'https://images.unsplash.com/photo-1541873676947-995986398e94?auto=format&fit=crop&q=80&w=1200',
            content: `行星磁场是由行星内部的“发电机效应”产生的。对于地球来说，液态外核的流动产生了强大的磁场。

### 磁层的作用：
1. **抵御太阳风**：磁场将来自太阳的高能带电粒子偏转，防止它们剥离大气层。
2. **保护生命**：如果没有磁场，地球表面的辐射将变得极高，生命难以生存。
3. **极光现象**：当部分带电粒子进入极地大气时，会产生美丽的极光。

木星拥有太阳系中最强大的磁场，其范围甚至可以延伸到土星轨道。火星和金星由于缺乏全球磁场，大气层在数十亿年间被太阳风严重剥蚀。`,
            quiz: [
              {
                question: '行星磁场的主要产生机制是什么？',
                options: ['板块运动', '发电机效应', '大气环流', '潮汐力'],
                correctAnswer: 1,
                points: 50,
                explanation: '行星内部导电流体的运动（如液态铁核）通过发电机效应产生磁场。'
              }
            ]
          },
          {
            id: 'ring-systems-01',
            title: '环系统：土星的华丽外衣',
            description: '探索土星环的组成、结构以及它们是如何形成的。',
            image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&q=80&w=1200',
            content: `土星环是太阳系中最壮观的景观之一。虽然看起来像是一个连续的平面，但它实际上由无数冰块和岩石碎片组成。

### 核心知识：
- **成分**：约99.9%是纯净的水冰，大小从微米到数米不等。
- **洛希极限**：当一个小天体过于靠近大行星时，会被引力撕碎，从而形成环系统。
- **牧羊犬卫星**：一些小卫星通过引力作用维持着环的边缘和缝隙（如卡西尼缝）。

除了土星，木星、天王星和海王星也拥有环系统，只是它们更暗、更难以观测。`,
            quiz: [
              {
                question: '土星环主要由什么物质组成？',
                options: ['岩石', '尘埃', '水冰', '液态氢'],
                correctAnswer: 2,
                points: 50,
                explanation: '土星环绝大部分由水冰组成，这使得它们具有极高的反照率。'
              }
            ]
          }
        ]
      },
      {
        level: '外太阳系与边缘',
        items: [
          {
            id: 'gas-giants-01',
            title: '气态巨行星与冰巨星',
            description: '探索木星、土星、天王星和海王星的差异。',
            image: 'https://images.unsplash.com/photo-1614314107768-6018061b5b72?auto=format&fit=crop&q=80&w=1200',
            content: `外太阳系的四颗大行星可以分为两类：

### 气态巨行星 (木星 & 土星)：
- 主要由氢和氦组成，没有固体表面。
- 内部压力巨大，氢可能呈现出液态金属状态。

### 冰巨星 (天王星 & 海王星)：
- 含有更高比例的“冰”（水、氨、甲烷）。
- 呈现蓝色或青色，是因为大气中的甲烷吸收了红光。

这些行星都拥有众多的卫星和复杂的环系统。`,
            quiz: [
              {
                question: '为什么海王星看起来是蓝色的？',
                options: ['因为表面有海洋', '因为大气中的甲烷吸收红光', '因为距离太阳太远', '因为大气层太薄'],
                correctAnswer: 1,
                points: 50
              }
            ]
          },
          {
            id: 'kuiper-belt-01',
            title: '柯伊伯带与奥尔特云',
            description: '太阳系的边缘：冰冷天体的聚集地。',
            image: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?auto=format&fit=crop&q=80&w=1200',
            content: `在海王星轨道之外，存在着两个巨大的冰冷天体区域：

### 柯伊伯带 (Kuiper Belt)：
- 位于海王星轨道外（30-50 AU），是冥王星等矮行星的故乡。
- 短周期彗星的来源地。

### 奥尔特云 (Oort Cloud)：
- 一个包裹太阳系的巨大球壳，延伸至1光年远。
- 长周期彗星的来源地，被认为是太阳系形成初期的残余物质。

### 关键知识点：
- **冰冷世界**：主要由水冰、氨冰和甲烷冰组成。
- **冥王星**：柯伊伯带中最著名的天体。
- **1光年**：奥尔特云的延伸范围，几乎到达了太阳引力的边缘。
- **彗星摇篮**：这两个区域是绝大多数彗星的故乡。`,
            quiz: [
              {
                question: '冥王星位于太阳系的哪个区域？',
                options: ['小行星带', '柯伊伯带', '奥尔特云', '银河系中心'],
                correctAnswer: 1,
                points: 50
              }
            ]
          },
          {
            id: 'comets-01',
            title: '彗星与流星：宇宙的访客',
            description: '了解这些拖着长尾巴的冰冷天体和划破夜空的流星。',
            image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4b519?auto=format&fit=crop&q=80&w=1200',
            content: `彗星被形象地称为“脏雪球”，它们主要由冰、尘埃和岩石组成。

### 彗星的结构：
1. **彗核**：彗星的实体部分。
2. **彗发**：靠近太阳时，冰升华形成的大气层。
3. **彗尾**：受太阳风和光压影响形成的明亮尾巴，总是背向太阳。

### 流星与陨石：
- **流星**：尘埃颗粒进入地球大气层摩擦生热发光。
- **流星雨**：地球穿过彗星留下的尘埃带时产生。
- **陨石**：未在大气层中烧尽而降落到地面的残骸。

### 关键知识点：
- **脏雪球**：彗星的成分描述。
- **背向太阳**：彗尾的方向特性。
- **哈雷彗星**：最著名的周期彗星，每76年回归一次。
- **流星雨**：与彗星轨道密切相关。`,
            quiz: [
              {
                question: '彗星的彗尾总是指向哪个方向？',
                options: ['指向太阳', '背向太阳', '指向地球', '指向运动方向'],
                correctAnswer: 1,
                points: 50,
                explanation: '受太阳风和太阳光压的影响，彗尾总是被“吹”向背离太阳的方向。'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'stellar-life-001',
    title: '恒星的一生',
    scope: '从星云中的胚胎到超新星爆发，见证恒星的轮回。',
    difficulty: '进阶',
    contentCount: 6,
    icon: Star,
    color: 'text-blue-400',
    structure: [
      {
        level: '演化阶段',
        items: [
          {
            id: 'nebula-birth-01',
            title: '星云：恒星的摇篮',
            description: '在巨大的气体和尘埃云中，新的恒星正在孕育。',
            image: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&q=80&w=1200',
            content: `恒星诞生于星际空间中巨大的分子云（星云）。

### 诞生过程：
1. **引力坍缩**：在某种扰动下，星云中的一部分开始在自身引力作用下收缩。
2. **原恒星形成**：中心温度升高，形成一个发热的核心。
3. **主序星阶段**：当核心温度达到1000万度，氢核聚变开启，恒星进入稳定的壮年期。

恒星的质量决定了它的命运。质量越大，寿命越短，结局也越壮烈。`,
            quiz: [
              {
                question: '恒星诞生的主要物质基础是什么？',
                options: ['黑洞', '星云', '行星', '白矮星'],
                correctAnswer: 1,
                points: 50
              }
            ]
          },
          {
            id: 'stellar-death-01',
            title: '恒星的终局：白矮星、中子星与黑洞',
            description: '不同质量的恒星在生命末期会走向完全不同的结局。',
            image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1200',
            content: `当恒星耗尽核心的核燃料，它将根据质量走向不同的终点：

### 低中质量恒星 (如太阳)：
- 膨胀为**红巨星**，抛出外层形成**行星状星云**，核心塌缩为**白矮星**。

### 大质量恒星 (8倍太阳质量以上)：
- 经历**超新星爆发**，核心塌缩为极度致密的**中子星**。

### 极大质量恒星 (20倍太阳质量以上)：
- 经历超新星爆发后，核心引力强大到连中子简并压力都无法支撑，最终塌缩为**黑洞**。`,
            quiz: [
              {
                question: '太阳最终会演化成什么天体？',
                options: ['黑洞', '中子星', '白矮星', '超新星'],
                correctAnswer: 2,
                points: 50
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'astrobiology-001',
    title: '天体生物学与生命搜寻',
    scope: '探索宇宙中生命存在的可能性，寻找外星文明。',
    difficulty: '进阶',
    contentCount: 4,
    icon: Globe,
    color: 'text-lime-400',
    structure: [
      {
        level: '生命基础',
        items: [
          {
            id: 'habitable-zone-01',
            title: '宜居带：生命的温床',
            description: '什么是宜居带？为什么液态水如此重要？',
            image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1200',
            content: `天体生物学研究宇宙中生命的起源、演化和分布。

### 宜居带 (Habitable Zone)：
- 指恒星周围的一定距离范围，在该范围内行星表面可以维持液态水的存在。
- 也被称为“金发姑娘区”（Goldilocks Zone），即不太热也不太冷。

### 生命的必要条件：
1. **液态水**：极佳的溶剂，支持复杂的生化反应。
2. **能量来源**：如恒星光照或行星内部热量。
3. **关键元素**：碳、氢、氮、氧、磷、硫（CHNOPS）。`,
            quiz: [
              {
                question: '为什么液态水被认为是生命存在的关键？',
                options: ['因为它很漂亮', '它是极佳的生化反应溶剂', '它能产生氧气', '它能抵御引力'],
                correctAnswer: 1,
                points: 50
              }
            ]
          },
          {
            id: 'seti-01',
            title: 'SETI：搜寻地外文明',
            description: '人类是如何尝试与外星文明取得联系的？',
            image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200',
            content: `SETI（Search for Extraterrestrial Intelligence）是搜寻地外文明计划的缩写。

### 主要手段：
- **射电监听**：利用巨大的射电望远镜（如FAST）监听来自宇宙的异常无线电信号。
- **德雷克方程**：用于估算银河系中可能存在的、具有通讯能力的文明数量。
- **费米悖论**：如果宇宙中存在大量文明，为什么我们还没有发现任何证据？

人类也曾向宇宙发送信号（如阿雷西博信息）或携带信息的探测器（如旅行者号金唱片）。`,
            quiz: [
              {
                question: '费米悖论的核心矛盾是什么？',
                options: ['外星人太远了', '宇宙很大但没有发现外星文明证据', '人类技术太落后', '黑洞吞噬了信号'],
                correctAnswer: 1,
                points: 50
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'observation-001',
    title: '观测天文学基础',
    scope: '学习如何使用望远镜、识别星座，开启你的星空之旅。',
    difficulty: '入门',
    contentCount: 6,
    icon: Telescope,
    color: 'text-emerald-400',
    structure: [
      {
        level: '观测入门',
        items: [
          {
            id: 'telescope-basics-01',
            title: '望远镜的种类与原理',
            description: '了解折射、反射和折反射望远镜的区别。',
            image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&q=80&w=1200',
            content: `望远镜是天文学家的“眼睛”。

### 主要类型：
1. **折射望远镜**：使用透镜成像。优点是图像稳定、对比度高，缺点是容易产生色差，大口径制造困难。
2. **反射望远镜**：使用凹面镜成像。优点是没有色差、口径可以做得很大，是目前专业天文台的主流。
3. **折反射望远镜**：结合了透镜和反射镜，体积小巧，适合业余爱好者。

### 关键参数：
- **口径**：最重要的指标，决定了集光能力和分辨率。
- **焦距**：决定了放大倍率和视场大小。`,
            quiz: [
              {
                question: '对于天文望远镜来说，最重要的参数是什么？',
                options: ['放大倍率', '口径', '长度', '品牌'],
                correctAnswer: 1,
                points: 50
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'galaxies-001',
    title: '星系与大尺度结构',
    scope: '从银河系到宇宙长城，探索星系的分类与分布。',
    difficulty: '进阶',
    contentCount: 5,
    icon: Globe,
    color: 'text-cyan-400',
    structure: [
      {
        level: '星系分类',
        items: [
          {
            id: 'hubble-sequence-01',
            title: '哈勃星系分类法',
            description: '学习如何根据形状识别不同类型的星系。',
            image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200',
            content: `爱德温·哈勃提出了著名的“哈勃音叉图”来对星系进行分类。

### 主要类别：
1. **椭圆星系 (E)**：呈球形或椭球形，内部主要是年老的恒星，缺乏气体和尘埃。
2. **螺旋星系 (S)**：具有明显的旋臂结构，如我们的银河系。
3. **棒旋星系 (SB)**：中心有一条贯穿核球的“棒”状结构。
4. **不规则星系 (Irr)**：没有明显的对称形状，通常含有大量的气体和年轻恒星。

星系的演化是一个漫长的过程，星系之间的碰撞和合并是驱动演化的重要力量。`,
            quiz: [
              {
                question: '我们的银河系属于哪种类型的星系？',
                options: ['椭圆星系', '螺旋星系', '棒旋星系', '不规则星系'],
                correctAnswer: 2,
                points: 50
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'exoplanets-001',
    title: '系外行星与地外生命',
    scope: '寻找“地球2.0”，探索宇宙中是否存在其他文明。',
    difficulty: '专业',
    contentCount: 4,
    icon: Search,
    color: 'text-rose-400',
    structure: [
      {
        level: '探测技术',
        items: [
          {
            id: 'transit-method-01',
            title: '凌日法：寻找遥远的行星',
            description: '了解科学家是如何通过微弱的光度变化发现系外行星的。',
            image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1200',
            content: `凌日法（Transit Method）是目前发现系外行星最成功的方法。

### 原理：
当一颗行星从其母恒星前方经过时，会遮挡一小部分星光，导致恒星的亮度出现周期性的微弱下降。

### 我们能学到什么：
- **行星大小**：亮度下降的幅度决定了行星的半径。
- **轨道周期**：两次凌日之间的时间间隔就是行星的“一年”。
- **大气成分**：通过分析凌日时的光谱变化，可以探测行星的大气成分。

著名的开普勒太空望远镜和TESS卫星就是利用这种方法发现了数千颗系外行星。`,
            quiz: [
              {
                question: '凌日法主要是通过观测恒星的什么变化来发现行星的？',
                options: ['位置变化', '颜色变化', '亮度变化', '温度变化'],
                correctAnswer: 2,
                points: 50
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'space-future-001',
    title: '空间探索与未来',
    scope: '从阿波罗登月到火星移民，探索人类在宇宙中的未来。',
    difficulty: '入门',
    contentCount: 4,
    icon: Rocket,
    color: 'text-amber-400',
    structure: [
      {
        level: '探索历程',
        items: [
          {
            id: 'moon-landing-01',
            title: '阿波罗计划：人类的一大步',
            description: '回顾人类首次登上月球的壮举。',
            image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200',
            content: `1969年7月20日，阿波罗11号成功降落在月球静海。

### 历史意义：
- **尼尔·阿姆斯特朗**：留下了著名的脚印，并说出了“这是我个人的一小步，却是人类的一大步”。
- **科学成果**：带回了约382公斤的月球岩石样本，彻底改变了我们对月球起源的认知。
- **技术飞跃**：推动了计算机、材料科学和生命保障系统的飞速发展。

目前，NASA的“阿尔忒弥斯”计划正致力于重返月球，并建立长期基地。`,
            quiz: [
              {
                question: '人类首次登上月球是在哪一年？',
                options: ['1957年', '1961年', '1969年', '1972年'],
                correctAnswer: 2,
                points: 50
              }
            ]
          },
          {
            id: 'mars-colonization-01',
            title: '火星移民：人类的第二家园？',
            description: '探讨将火星改造为宜居行星的可能性与挑战。',
            image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1200',
            content: `火星是太阳系中与地球最相似的行星，被认为是人类星际移民的首选。

### 核心挑战：
1. **大气层稀薄**：气压仅为地球的1%，且主要由二氧化碳组成。
2. **极度寒冷**：平均温度约为零下60摄氏度。
3. **辐射危害**：缺乏全球磁场，宇宙射线直接照射表面。
4. **资源获取**：如何从火星土壤中提取水分和氧气。

### 改造设想（地球化）：
- 释放温室气体以提高温度。
- 引入微生物改变大气成分。
- 建立封闭式生态系统。

这不仅是技术的挑战，更是伦理和哲学的考验。`,
            quiz: [
              {
                question: '火星大气层的主要成分是什么？',
                options: ['氮气', '氧气', '二氧化碳', '甲烷'],
                correctAnswer: 2,
                points: 50
              }
            ]
          }
        ]
      }
    ]
  },
];

interface AcademyProps {
  profile: UserProfile | null;
  onUpdateProfile: (p: UserProfile) => void;
}

const Academy: React.FC<AcademyProps> = ({ profile, onUpdateProfile }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importedTextbook, setImportedTextbook] = useState<{
    name: string, 
    content: string, 
    pageCount: number,
    slideSummaries?: { title: string, summary: string }[]
  } | null>(null);
  const [courses, setCourses] = useState<Course[]>(SYSTEMATIC_COURSES);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('astro_academy_stats');
    const initialStats = saved ? JSON.parse(saved) : {
      totalPoints: 0,
      completedChapters: [],
      badges: []
    };
    
    // Sync with profile if available
    if (profile) {
      return {
        ...initialStats,
        totalPoints: profile.points,
        completedChapters: profile.completedChapters
      };
    }
    return initialStats;
  });

  // Keep userStats in sync with profile if profile changes externally
  useEffect(() => {
    if (profile) {
      setUserStats(prev => ({
        ...prev,
        totalPoints: profile.points,
        completedChapters: profile.completedChapters
      }));
    }
  }, [profile?.points, profile?.completedChapters]);

  const handleCompleteChapter = (points: number) => {
    if (!selectedChapter) return;
    
    const isNewChapter = !userStats.completedChapters.includes(selectedChapter.id);
    const newCompletedChapters = isNewChapter 
      ? [...userStats.completedChapters, selectedChapter.id]
      : userStats.completedChapters;

    const newStats = {
      ...userStats,
      totalPoints: isNewChapter ? userStats.totalPoints + points : userStats.totalPoints,
      completedChapters: newCompletedChapters
    };
    
    setUserStats(newStats);
    localStorage.setItem('astro_academy_stats', JSON.stringify(newStats));

    // Update global profile
    if (profile) {
      const updatedProfile: UserProfile = {
        ...profile,
        points: isNewChapter ? profile.points + points : profile.points,
        completedChapters: newCompletedChapters
      };
      onUpdateProfile(updatedProfile);
      localStorage.setItem('auts_profile', JSON.stringify(updatedProfile));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(10);

    try {
      // Note: In a real environment, you'd need a PDF library like pdfjs-dist
      // This is a simulated implementation for the demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      setImportProgress(40);
      
      const prompt = `你是一个资深天文学教授。请分析以下教材内容（模拟），并生成一份系统化的学习大纲。
      要求：
      1. 提供课程总体摘要。
      2. 提供关键结论列表。
      3. 提供3道选择题（每道题包含 question, options, correctAnswer (0-3), points (50)）。
      4. 针对教材的每一页（假设有5页），提供一个简短的幻灯片摘要（Slide Summary），包含标题和摘要内容。
      请以JSON格式返回，不要包含任何Markdown代码块标记，直接返回JSON字符串。
      JSON结构示例：
      {
        "summary": "...",
        "keyPoints": ["...", "..."],
        "quiz": [{"question": "...", "options": ["...", "..."], "correctAnswer": 0, "points": 50}],
        "slideSummaries": [{"title": "...", "summary": "..."}]
      }`;

      const response = await fetch(`${DEEPSEEK_CONFIG.base_url}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          model: DEEPSEEK_CONFIG.model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant that outputs only valid JSON.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      const data = await response.json();
      const contentStr = data.choices?.[0]?.message?.content || '{}';
      const aiResult = JSON.parse(contentStr);
      setImportProgress(100);

      const dynamicCourse: Course = {
        id: `imported-${Date.now()}`,
        title: `AI 解析: ${file.name}`,
        scope: `基于导入教材《${file.name}》生成的深度学习课程`,
        difficulty: '进阶',
        contentCount: 1,
        icon: BookOpen,
        color: 'text-emerald-400',
        structure: [
          {
            level: '核心精要',
            items: [
              {
                id: `imp-${Date.now()}`,
                title: '教材核心解析',
                description: 'AI 自动提取的教材关键观点',
                image: `https://picsum.photos/seed/astronomy/1200/600`,
                content: aiResult.summary || "解析内容生成中...",
                quiz: aiResult.quiz || []
              }
            ]
          }
        ]
      };

      setCourses(prev => [dynamicCourse, ...prev]);
      setSelectedCourse(dynamicCourse);
      setImportedTextbook({
        name: file.name,
        content: "教材内容已解析",
        pageCount: 5,
        slideSummaries: aiResult.slideSummaries || []
      });
      
      setTimeout(() => setIsImporting(false), 500);
    } catch (error) {
      console.error('PDF processing error:', error);
      setIsImporting(false);
      alert('教材解析失败，请检查网络连接。');
    }
  };

  const renderCourseList = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">天文知识体系</h2>
          <p className="text-slate-400">从基础概念到专业观测，构建你的宇宙认知地图</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cosmic-neon/20 flex items-center justify-center text-cosmic-neon">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">探索积分</div>
              <div className="text-xl font-bold text-white">{userStats.totalPoints}</div>
            </div>
          </div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="glass-panel px-6 py-4 flex items-center gap-3 hover:border-cosmic-neon/50 transition-all group"
          >
            <Upload className="w-5 h-5 text-cosmic-neon group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-white">导入教材</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".pdf" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedCourse(course)}
            className="glass-panel p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-5 -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-110 ${course.color}`} />
            
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${course.color} border border-white/10 group-hover:border-current/30 transition-colors`}>
                <course.icon className="w-8 h-8" />
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 border border-white/10 ${
                  course.difficulty === '入门' ? 'text-emerald-400' : 
                  course.difficulty === '进阶' ? 'text-orange-400' : 'text-rose-400'
                }`}>
                  {course.difficulty}
                </span>
                <span className="text-xs text-slate-500 mt-2">{course.contentCount} 课时</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cosmic-neon transition-colors">{course.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.scope}</p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 text-cosmic-neon text-xs font-bold">
                开始学习 <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderKnowledgeTree = (course: Course) => (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">{course.title}</h2>
          <p className="text-sm text-slate-400">知识体系结构图</p>
        </div>
      </div>

      <div className="space-y-12 relative before:absolute before:left-[19px] before:top-8 before:bottom-8 before:w-0.5 before:bg-white/10">
        {course.structure.map((section, sIdx) => (
          <div key={section.level} className="relative pl-12">
            <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-slate-900 border-2 border-cosmic-neon flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
              <span className="text-[10px] font-bold text-cosmic-neon">{sIdx + 1}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <h4 className="text-sm font-bold text-cosmic-neon uppercase tracking-widest">
                {section.level}
              </h4>
              <div className="h-px flex-1 bg-gradient-to-r from-cosmic-neon/30 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map(item => {
                const isCompleted = userStats.completedChapters.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedChapter(item)}
                    className={`glass-panel p-5 cursor-pointer group transition-all ${
                      isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : 'hover:border-cosmic-neon/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-base font-bold text-white group-hover:text-cosmic-neon transition-colors">
                            {item.title}
                          </h5>
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500 group-hover:text-cosmic-neon'
                      }`}>
                        <Play className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChapterContent = (chapter: Chapter) => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setSelectedChapter(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回目录</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4" />
            预计阅读 8 分钟
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white">
            <Star className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {chapter.image && (
          <div className="w-full h-64 md:h-96 relative">
            <img 
              src={chapter.image} 
              alt={chapter.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cosmic-bg via-transparent to-transparent" />
          </div>
        )}
        
        <div className="p-8 md:p-12 -mt-12 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">{chapter.title}</h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="text-lg text-slate-300 leading-relaxed mb-8 whitespace-pre-line">
              {chapter.content}
            </div>

            {/* Slide Summaries Section for Imported Content */}
            {selectedCourse?.id.startsWith('imported-') && importedTextbook?.slideSummaries && (
              <div className="space-y-6 my-12">
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-xl font-bold text-white">幻灯片摘要 (Slide Summaries)</h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {importedTextbook.slideSummaries.map((slide, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-panel p-6 border-l-4 border-cosmic-neon bg-cosmic-neon/5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-cosmic-neon/20 flex items-center justify-center text-cosmic-neon text-xs font-bold">
                          {idx + 1}
                        </div>
                        <h4 className="text-white font-bold">{slide.title}</h4>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {slide.summary}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-cosmic-neon/5 border-l-4 border-cosmic-neon p-6 my-8 rounded-r-2xl">
              <div className="flex items-center gap-3 text-cosmic-neon mb-2">
                <Info className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider text-xs">核心要点</span>
              </div>
              <p className="text-sm text-slate-300 italic">
                {chapter.description}
              </p>
            </div>

            <p className="text-slate-400 leading-relaxed">
              深入理解这一概念是掌握后续知识的关键。建议结合星图模拟器进行实地观察，将理论与实践相结合。
            </p>
          </div>

          {chapter.quiz && chapter.quiz.length > 0 && (
            <div className="mt-12 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-white font-bold">知识闯关</div>
                  <div className="text-xs text-slate-500">完成测试即可获得积分奖励</div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setIsQuizMode(true);
                  setCurrentQuizIdx(0);
                  setQuizScore(0);
                  setQuizFinished(false);
                }}
                className="px-10 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                开始闯关
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-cosmic-bg overflow-y-auto custom-scrollbar">
      <div className="p-6 md:p-12 pt-24 pb-32">
        <AnimatePresence mode="wait">
        {!selectedCourse ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderCourseList()}
          </motion.div>
        ) : !selectedChapter ? (
          <motion.div
            key="tree"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderKnowledgeTree(selectedCourse)}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            {renderChapterContent(selectedChapter)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Progress Overlay */}
      <AnimatePresence>
        {isImporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="w-full max-w-md p-8 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/10"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * importProgress) / 100}
                    className="text-cosmic-neon transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-white">
                  {importProgress}%
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">正在解析教材...</h3>
              <p className="text-slate-400 text-sm">AI 正在构建知识索引并生成学习路径</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {isQuizMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              {!quizFinished ? (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">知识闯关</h3>
                        <p className="text-slate-400 text-sm">
                          第 {currentQuizIdx + 1} / {selectedChapter?.quiz.length} 题
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsQuizMode(false)}
                      className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-8">
                    <h4 className="text-2xl font-bold text-white leading-tight">
                      {selectedChapter?.quiz[currentQuizIdx].question}
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                      {selectedChapter?.quiz[currentQuizIdx].options.map((option: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (idx === selectedChapter?.quiz[currentQuizIdx].correctAnswer) {
                              setQuizScore(prev => prev + 50);
                            }
                            if (currentQuizIdx < selectedChapter!.quiz.length - 1) {
                              setCurrentQuizIdx(prev => prev + 1);
                            } else {
                              setQuizFinished(true);
                            }
                          }}
                          className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left text-white hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all group flex items-center justify-between"
                        >
                          <span className="font-medium">{option}</span>
                          <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-emerald-500/40" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center space-y-8">
                  <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <Award className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">闯关成功！</h3>
                    <p className="text-slate-400">你表现得很出色，继续保持探索精神。</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-slate-400 text-sm mb-1">获得积分</div>
                      <div className="text-3xl font-bold text-emerald-400">
                        {userStats.completedChapters.includes(selectedChapter?.id || '') ? '+0' : `+${quizScore}`}
                      </div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-slate-400 text-sm mb-1">正确率</div>
                      <div className="text-3xl font-bold text-white">
                        {Math.round((quizScore / (selectedChapter!.quiz.reduce((acc, q) => acc + q.points, 0))) * 100)}%
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleCompleteChapter(quizScore);
                      setIsQuizMode(false);
                      setSelectedChapter(null);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-2xl font-bold text-lg hover:from-emerald-500 hover:to-emerald-300 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-3 group"
                  >
                    <Award className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    领取奖励
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default Academy;
