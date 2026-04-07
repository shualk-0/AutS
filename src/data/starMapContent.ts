export interface StarHotspot {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  facts: string[];
  position: [number, number, number];
  distance?: string;
  observation?: string;
  mythology?: string;
  explorationIndex?: number;
}

export interface SubRegion {
  id: string;
  name: string;
  description: string;
  target: [number, number, number];
  hotspots: StarHotspot[];
}

export interface OverviewRegion {
  id: string;
  name: string;
  description: string;
  target: [number, number, number];
  subRegions: SubRegion[];
}

export const STAR_MAP_DATA: OverviewRegion[] = [
  {
    id: 'north-sky',
    name: '北天区域',
    description: '北半球可见的星空，包含著名的指极星座。',
    target: [0, 100, 0],
    subRegions: [
      {
        id: 'big-dipper-region',
        name: '北极星与北斗',
        description: '大熊座的核心部分，北半球最重要的指引。',
        target: [-30, 80, 50],
        hotspots: [
          {
            id: 'polaris',
            name: '北极星',
            type: '恒星',
            description: '位于地轴北极指向的方向，是航海的重要参考。',
            image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=800',
            distance: '约 433 光年',
            observation: '北半球全年可见，几乎不动。',
            facts: ['实际上是一个三合星系统', '属于小熊座', '视星等约 1.97'],
            position: [-30, 85, 50],
            explorationIndex: 5
          },
          {
            id: 'dubhe',
            name: '天枢',
            type: '恒星',
            description: '北斗七星之一，大熊座α。',
            image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=800',
            distance: '123 光年',
            facts: ['指极星之一', '一颗红巨星', '北斗七星中最亮的一颗'],
            position: [-35, 75, 55],
            explorationIndex: 4
          }
        ]
      },
      {
        id: 'cassiopeia-region',
        name: '仙后座区域',
        description: '独特的"W"形状，位于银河之中。',
        target: [30, 70, 40],
        hotspots: [
          {
            id: 'schedar',
            name: '王良四',
            type: '恒星',
            description: '仙后座最亮的星，一颗橙色巨星。',
            image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=800',
            distance: '228 光年',
            facts: ['视星等 2.24', '仙后座 alpha'],
            position: [32, 72, 42],
            explorationIndex: 3
          }
        ]
      }
    ]
  },
  {
    id: 'zodiac-belt',
    name: '黄道星座区域',
    description: '太阳在天球上一年间所经过的路径。',
    target: [0, 0, 0],
    subRegions: [
      {
        id: 'leo-region',
        name: '狮子座区域',
        description: '春季星空的代表，拥有著名的"大镰刀"形状。',
        target: [-50, 20, 0],
        hotspots: [
          {
            id: 'regulus',
            name: '轩辕十四',
            type: '恒星',
            description: '狮子座的心脏，黄道上最亮的恒星之一。',
            image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800',
            distance: '79 光年',
            facts: ['四合星系统', '旋转速度极快'],
            position: [-52, 22, 2],
            explorationIndex: 4
          }
        ]
      },
      {
        id: 'scorpio-region',
        name: '天蝎座区域',
        description: '夏季星空的霸主，银河最灿烂的部分。',
        target: [20, -30, -50],
        hotspots: [
          {
            id: 'antares',
            name: '心宿二',
            type: '红超巨星',
            description: '天蝎座的心脏，呈现明显的红色。',
            image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=800',
            distance: '550 光年',
            facts: ['体积巨大，若放在太阳位置将吞没火星', '被称为"火星的对手"'],
            position: [22, -32, -52],
            explorationIndex: 5
          }
        ]
      }
    ]
  },
  {
    id: 'milky-way-belt',
    name: '银河带区域',
    description: '横跨夜空的银河系盘面，恒星与星云最密集的区域。',
    target: [0, 0, -100],
    subRegions: [
      {
        id: 'galactic-center-region',
        name: '银河中心',
        description: '银河系的引力中心，隐藏着超大质量黑洞。',
        target: [10, -10, -95],
        hotspots: [
          {
            id: 'sgr-a',
            name: '人马座 A*',
            type: '超大质量黑洞',
            description: '银河系中心的黑洞，是银河系的引力枢纽。',
            image: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&q=80&w=800',
            distance: '2.6 万光年',
            facts: ['质量约为太阳的 400 万倍', '2022年首次公布影像', '周围环绕着高速运动的恒星'],
            position: [10, -10, -95],
            explorationIndex: 5
          }
        ]
      },
      {
        id: 'orion-region',
        name: '猎户区域',
        description: '冬季星空的明珠，包含大量亮星和星云。',
        target: [70, 20, -70],
        hotspots: [
          {
            id: 'betelgeuse',
            name: '参宿四',
            type: '红超巨星',
            description: '猎户座的左肩，一颗巨大的红超巨星。',
            image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4b4bf?auto=format&fit=crop&q=80&w=800',
            distance: '640 光年',
            facts: ['随时可能爆发为超新星', '体积巨大', '亮度具有周期性变化'],
            position: [65, 25, -75],
            explorationIndex: 5
          },
          {
            id: 'm42',
            name: '猎户座大星云',
            type: '星云',
            description: '肉眼可见的最明亮星云之一，恒星诞生的摇篮。',
            image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&q=80&w=800',
            distance: '1344 光年',
            facts: ['恒星诞生的摇篮', '包含梯形星群', '内部有大量原行星盘'],
            position: [75, 15, -65],
            explorationIndex: 5
          }
        ]
      }
    ]
  },
  {
    id: 'deep-sky-objects',
    name: '深空天体区域',
    description: '星系、星团等河外天体。',
    target: [-80, -40, 20],
    subRegions: [
      {
        id: 'andromeda-region',
        name: '仙女座星系',
        description: '距离银河系最近的大型星系。',
        target: [-85, -45, 25],
        hotspots: [
          {
            id: 'm31',
            name: 'M31 仙女座大星系',
            type: '旋涡星系',
            description: '本星系群中最大的星系，正以每秒110公里的速度靠近银河系。',
            image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800',
            distance: '254 万光年',
            facts: ['包含约一万亿颗恒星', '肉眼可见的最遥远天体'],
            position: [-86, -46, 26],
            explorationIndex: 5
          }
        ]
      }
    ]
  }
];
