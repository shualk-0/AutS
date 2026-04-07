
export interface Hotspot {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  facts: string[];
  distance: string;
  magnitude: string;
  mythology?: string;
  x: number;
  y: number;
}

export interface SubRegion {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  color: string;
  hotspots: Hotspot[];
}

export interface OverviewRegion {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  color: string;
  subRegions: SubRegion[];
}

export const STAR_MAP_DATA: OverviewRegion[] = [
  {
    id: 'northern',
    name: '北天区域',
    description: '北半球常年可见的星空区域，包含北极星及著名的北斗七星。',
    x: 50,
    y: 20,
    color: '#38bdf8',
    subRegions: [
      {
        id: 'big-dipper-sub',
        name: '北斗区域',
        description: '大熊座的核心部分，北半球最重要的指引。',
        x: 40,
        y: 40,
        color: '#7dd3fc',
        hotspots: [
          {
            id: 'polaris',
            name: '北极星 (勾陈一)',
            type: '三合星系统',
            description: '目前最靠近北天极的亮星，是航海和野外辨认方向的重要参考。',
            image: 'https://picsum.photos/seed/polaris/400/300',
            distance: '约 433 光年',
            magnitude: '1.97',
            facts: ['地轴北极指向的方向', '实际上是三颗恒星组成的系统', '亮度呈现微弱的脉动变化'],
            mythology: '在中国古代神话中，北极星被认为是紫微大帝的化身，统领北天。',
            x: 50,
            y: 15
          },
          {
            id: 'dubhe',
            name: '天枢 (大熊座α)',
            type: '红巨星',
            description: '北斗七星的第一颗星，与天璇一起被称为“指极星”。',
            image: 'https://picsum.photos/seed/dubhe/400/300',
            distance: '约 123 光年',
            magnitude: '1.79',
            facts: ['北斗七星中最亮的一颗', '表面温度约为 4500K', '正处于恒星演化的晚期'],
            x: 30,
            y: 35
          },
          {
            id: 'mizar-alcor',
            name: '开阳与辅',
            type: '多星系统',
            description: '著名的肉眼双星，位于北斗七星的斗柄转折处。',
            image: 'https://picsum.photos/seed/mizar/400/300',
            distance: '约 83 光年',
            magnitude: '2.23 / 3.99',
            facts: ['古代用于测试视力', '实际上包含六颗恒星', '开阳是第一颗被望远镜发现的双星'],
            x: 70,
            y: 60
          },
          {
            id: 'm101',
            name: '风车星系 (M101)',
            type: '螺旋星系',
            description: '位于大熊座的一个巨大的正面螺旋星系。',
            image: 'https://picsum.photos/seed/m101/400/300',
            distance: '约 2100 万光年',
            magnitude: '7.86',
            facts: ['直径约为银河系的两倍', '包含约一万亿颗恒星', '拥有极其清晰的旋臂结构'],
            x: 80,
            y: 20
          },
          {
            id: 'merak',
            name: '天璇 (大熊座β)',
            type: '主序星',
            description: '北斗七星的第二颗星，与天枢一起指向北极星。',
            image: 'https://picsum.photos/seed/merak/400/300',
            distance: '约 79 光年',
            magnitude: '2.37',
            facts: ['表面温度约为 9350K', '质量约为太阳的 2.7 倍', '拥有一个尘埃盘，可能存在行星系统'],
            x: 30,
            y: 50
          },
          {
            id: 'phecda',
            name: '天玑 (大熊座γ)',
            type: '主序星',
            description: '北斗七星的第三颗星，位于斗身的左下角。',
            image: 'https://picsum.photos/seed/phecda/400/300',
            distance: '约 83 光年',
            magnitude: '2.44',
            facts: ['旋转速度非常快', '是一颗蓝白色的恒星', '年龄约为 3.6 亿年'],
            x: 45,
            y: 65
          },
          {
            id: 'alioth',
            name: '玉衡 (大熊座ε)',
            type: '特殊变星',
            description: '北斗七星中最亮的一颗，位于斗柄的起始处。',
            image: 'https://picsum.photos/seed/alioth/400/300',
            distance: '约 81 光年',
            magnitude: '1.76',
            facts: ['拥有极强的磁场', '亮度呈现微小的周期性变化', '是全天第31亮星'],
            x: 60,
            y: 50
          }
        ]
      },
      {
        id: 'cassiopeia-sub',
        name: '仙后座区域',
        description: '北天著名的“W”形星座，位于银河之中。',
        x: 70,
        y: 30,
        color: '#bae6fd',
        hotspots: [
          {
            id: 'schedar',
            name: '王良四',
            type: '橙巨星',
            description: '仙后座最亮的恒星，位于W形的底部。',
            image: 'https://picsum.photos/seed/schedar/400/300',
            distance: '约 228 光年',
            magnitude: '2.24',
            facts: ['亮度是太阳的 600 多倍', '直径约为太阳的 40 倍', '表面温度较低，呈现橙色'],
            mythology: '在希腊神话中，仙后座代表虚荣的埃塞俄比亚王后卡西俄珀亚。',
            x: 50,
            y: 50
          },
          {
            id: 'tycho-snr',
            name: '第谷超新星遗迹',
            type: '超新星遗迹',
            description: '1572年由第谷·布拉赫观测到的超新星爆发留下的残骸。',
            image: 'https://picsum.photos/seed/tycho/400/300',
            distance: '约 8000-9800 光年',
            magnitude: '无法直接观测',
            facts: ['Ia型超新星爆发', '目前仍在高速扩张', '是强烈的无线电源'],
            x: 30,
            y: 70
          }
        ]
      }
    ]
  },
  {
    id: 'southern',
    name: '南天区域',
    description: '南半球可见的壮丽星空，包含南十字座及大小麦哲伦云。',
    x: 50,
    y: 80,
    color: '#818cf8',
    subRegions: [
      {
        id: 'southern-cross-sub',
        name: '南十字区域',
        description: '南半球最著名的标志，用于指引南极。',
        x: 50,
        y: 60,
        color: '#a5b4fc',
        hotspots: [
          {
            id: 'acrux',
            name: '十字架二',
            type: '多星系统',
            description: '南十字座最亮的恒星，也是全天第13亮星。',
            image: 'https://picsum.photos/seed/acrux/400/300',
            distance: '约 320 光年',
            magnitude: '0.76',
            facts: ['由三颗蓝白色恒星组成', '位于南十字座的最南端', '是南半球航海的重要参考'],
            x: 50,
            y: 80
          },
          {
            id: 'jewel-box',
            name: '珠宝盒星团 (NGC 4755)',
            type: '疏散星团',
            description: '被誉为“南天最美丽的星团”，包含各种颜色的恒星。',
            image: 'https://picsum.photos/seed/jewelbox/400/300',
            distance: '约 6400 光年',
            magnitude: '4.2',
            facts: ['包含约 100 颗恒星', '中心有一颗明亮的红超巨星', '非常年轻，仅有约 700 万年历史'],
            x: 70,
            y: 40
          },
          {
            id: 'coalsack',
            name: '煤袋星云',
            type: '暗星云',
            description: '夜空中最著名的暗星云，遮挡了后方的银河光芒。',
            image: 'https://picsum.photos/seed/coalsack/400/300',
            distance: '约 600 光年',
            magnitude: '不适用 (暗星云)',
            facts: ['跨度约 30-35 光年', '肉眼可见的黑色斑块', '主要由冰冷的尘埃组成'],
            x: 30,
            y: 50
          }
        ]
      }
    ]
  },
  {
    id: 'zodiac',
    name: '黄道星座区域',
    description: '太阳在天球上运行路径经过的区域，包含著名的黄道十二星座。',
    x: 80,
    y: 50,
    color: '#fbbf24',
    subRegions: [
      {
        id: 'scorpius-sub',
        name: '天蝎区域',
        description: '夏季星空的代表，拥有巨大的蝎子形状。',
        x: 60,
        y: 60,
        color: '#fcd34d',
        hotspots: [
          {
            id: 'antares',
            name: '心宿二 (天蝎座α)',
            type: '红超巨星',
            description: '天蝎座的心脏，一颗巨大的红色恒星，常与火星混淆。',
            image: 'https://picsum.photos/seed/antares/400/300',
            distance: '约 550 光年',
            magnitude: '1.06',
            facts: ['直径约为太阳的 700 倍', '全天第15亮星', '名字意为“火星的对手”'],
            mythology: '在中国古代被称为“大火”，是二十八宿中心宿的第二星。',
            x: 50,
            y: 50
          },
          {
            id: 'm7',
            name: '托勒密星团 (M7)',
            type: '疏散星团',
            description: '位于天蝎座尾部，是一个肉眼清晰可见的大型星团。',
            image: 'https://picsum.photos/seed/m7/400/300',
            distance: '约 980 光年',
            magnitude: '3.3',
            facts: ['包含约 80 颗恒星', '跨度约 25 光年', '早在公元130年就被托勒密记录'],
            x: 70,
            y: 80
          }
        ]
      }
    ]
  },
  {
    id: 'milkyway-main',
    name: '银河带区域',
    description: '银河系恒星最密集的带状区域，充满了星云和星团。',
    x: 50,
    y: 50,
    color: '#a855f7',
    subRegions: [
      {
        id: 'sgr-center-sub',
        name: '人马座银河中心区域',
        description: '银河系的中心方向，是星空中最灿烂的部分。',
        x: 50,
        y: 70,
        color: '#c084fc',
        hotspots: [
          {
            id: 'sgr-a-star',
            name: '人马座 A*',
            type: '超大质量黑洞',
            description: '位于银河系几何中心的超大质量黑洞，是银河系的引力核心。',
            image: 'https://picsum.photos/seed/sgra/400/300',
            distance: '约 26000 光年',
            magnitude: '无法直接观测',
            facts: ['质量约为太阳的 400 万倍', '2022年公布了其首张影像', '周围有恒星以极高速度运行'],
            x: 50,
            y: 50
          },
          {
            id: 'lagoon-nebula',
            name: '礁湖星云 (M8)',
            type: '发射星云',
            description: '银河中心附近一个巨大的星际云，是恒星诞生的温床。',
            image: 'https://picsum.photos/seed/lagoon/400/300',
            distance: '约 4100 光年',
            magnitude: '6.0',
            facts: ['包含年轻的星团 NGC 6530', '跨度约 110 光年', '肉眼在黑暗环境下可见'],
            x: 30,
            y: 40
          },
          {
            id: 'trifid-nebula',
            name: '三叶星云 (M20)',
            type: '发射/反射星云',
            description: '因其被尘埃带分割成三片而得名，呈现红蓝交织的色彩。',
            image: 'https://picsum.photos/seed/trifid/400/300',
            distance: '约 5200 光年',
            magnitude: '6.3',
            facts: ['包含发射星云、反射星云和暗星云', '内部有大量原恒星', '是天文摄影的热门目标'],
            x: 40,
            y: 30
          }
        ]
      },
      {
        id: 'cygnus-sub',
        name: '天鹅区域',
        description: '夏季银河中的巨大天鹅，拥有明亮的北十字星群。',
        x: 60,
        y: 30,
        color: '#d8b4fe',
        hotspots: [
          {
            id: 'deneb',
            name: '天津四 (天鹅座α)',
            type: '蓝超巨星',
            description: '天鹅座最亮的恒星，夏季大三角之一。',
            image: 'https://picsum.photos/seed/deneb/400/300',
            distance: '约 2600 光年',
            magnitude: '1.25',
            facts: ['是已知最远的亮星之一', '亮度是太阳的 20 万倍', '正处于演化为红超巨星的阶段'],
            mythology: '在中国神话中，天津四位于银河的渡口。',
            x: 50,
            y: 20
          },
          {
            id: 'cygnus-loop',
            name: '天鹅座圈 (面纱星云)',
            type: '超新星遗迹',
            description: '一个巨大的超新星爆发残骸，呈现出精美的丝状结构。',
            image: 'https://picsum.photos/seed/veil/400/300',
            distance: '约 2400 光年',
            magnitude: '7.0',
            facts: ['爆发发生于约 1-2 万年前', '跨度达 3 度（6个满月大小）', '由多个部分组成（如西面纱、东面纱）'],
            x: 70,
            y: 50
          },
          {
            id: 'albireo',
            name: '辇道增七',
            type: '双星',
            description: '被誉为“全天最美丽的双星”，呈现鲜明的金黄色与深蓝色对比。',
            image: 'https://picsum.photos/seed/albireo/400/300',
            distance: '约 430 光年',
            magnitude: '3.05',
            facts: ['主星是橙巨星，伴星是蓝主序星', '通过小望远镜即可轻易分辨', '是天鹅的头部'],
            x: 30,
            y: 80
          }
        ]
      }
    ]
  },
  {
    id: 'deepsky-main',
    name: '深空天体区域',
    description: '远离银河系平面的区域，是观测遥远星系的绝佳窗口。',
    x: 20,
    y: 50,
    color: '#ec4899',
    subRegions: [
      {
        id: 'andromeda-sub',
        name: '仙女座区域',
        description: '包含银河系的近邻——巨大的仙女座大星系。',
        x: 30,
        y: 30,
        color: '#f472b6',
        hotspots: [
          {
            id: 'm31',
            name: '仙女座大星系 (M31)',
            type: '螺旋星系',
            description: '距离银河系最近的大型星系，是肉眼可见最遥远的天体。',
            image: 'https://picsum.photos/seed/m31/400/300',
            distance: '约 254 万光年',
            magnitude: '3.44',
            facts: ['包含约一万亿颗恒星', '直径约 22 万光年', '40亿年后将与银河系碰撞合并'],
            mythology: '代表希腊神话中被拴在海边岩石上的安德洛墨达公主。',
            x: 50,
            y: 50
          },
          {
            id: 'm32',
            name: 'M32',
            type: '矮椭圆星系',
            description: '仙女座大星系的卫星星系之一。',
            image: 'https://picsum.photos/seed/m32/400/300',
            distance: '约 265 万光年',
            magnitude: '8.08',
            facts: ['结构非常紧凑', '中心拥有超大质量黑洞', '正受到仙女座大星系的引力潮汐影响'],
            x: 60,
            y: 60
          }
        ]
      }
    ]
  },
  {
    id: 'seasonal-main',
    name: '季节星空区域',
    description: '随季节更替而变化的代表性星空，包含著名的季节大三角。',
    x: 50,
    y: 50,
    color: '#10b981',
    subRegions: [
      {
        id: 'orion-sub',
        name: '猎户区域',
        description: '冬季星空的王者，拥有极其壮丽的星云和亮星。',
        x: 40,
        y: 60,
        color: '#34d399',
        hotspots: [
          {
            id: 'm42-nebula',
            name: '猎户座大星云 (M42)',
            type: '发射星云',
            description: '夜空中最明亮的星云，是恒星诞生的巨大摇篮。',
            image: 'https://picsum.photos/seed/m42/400/300',
            distance: '约 1344 光年',
            magnitude: '4.0',
            facts: ['肉眼清晰可见', '包含著名的四合星（梯形星群）', '跨度约 24 光年'],
            x: 50,
            y: 60
          },
          {
            id: 'betelgeuse-star',
            name: '参宿四',
            type: '红超巨星',
            description: '猎户座的左肩，一颗处于生命末期的巨大红色恒星。',
            image: 'https://picsum.photos/seed/betelgeuse/400/300',
            distance: '约 642 光年',
            magnitude: '0.42',
            facts: ['体积是太阳的 700 多倍', '随时可能爆发为超新星', '亮度呈现周期性变化'],
            x: 30,
            y: 20
          },
          {
            id: 'rigel-star',
            name: '参宿七',
            type: '蓝超巨星',
            description: '猎户座最亮的恒星，一颗极高亮度的蓝白色巨星。',
            image: 'https://picsum.photos/seed/rigel/400/300',
            distance: '约 860 光年',
            magnitude: '0.12',
            facts: ['亮度是太阳的 12 万倍', '实际上是一个多星系统', '表面温度约为 12000K'],
            x: 70,
            y: 80
          },
          {
            id: 'horsehead-nebula',
            name: '马头星云 (B33)',
            type: '暗星云',
            description: '因形状酷似马头而闻名，是天文摄影中最具挑战性的目标之一。',
            image: 'https://picsum.photos/seed/horsehead/400/300',
            distance: '约 1500 光年',
            magnitude: '不适用 (暗星云)',
            facts: ['位于猎户座腰带附近', '由冰冷的尘埃和气体组成', '背景是红色的发射星云 IC 434'],
            x: 55,
            y: 45
          },
          {
            id: 'bellatrix',
            name: '参宿五',
            type: '蓝巨星',
            description: '猎户座的右肩，一颗高温且快速旋转的恒星。',
            image: 'https://picsum.photos/seed/bellatrix/400/300',
            distance: '约 250 光年',
            magnitude: '1.64',
            facts: ['全天第27亮星', '表面温度高达 22000K', '名字在拉丁语中意为“女战士”'],
            x: 70,
            y: 20
          },
          {
            id: 'saiph',
            name: '参宿六',
            type: '蓝超巨星',
            description: '猎户座的右脚，一颗极其明亮且巨大的蓝白色恒星。',
            image: 'https://picsum.photos/seed/saiph/400/300',
            distance: '约 650 光年',
            magnitude: '2.06',
            facts: ['亮度是太阳的 6 万多倍', '直径约为太阳的 22 倍', '正处于演化的最后阶段'],
            x: 30,
            y: 80
          },
          {
            id: 'm78',
            name: 'M78',
            type: '反射星云',
            description: '全天最亮的反射星云之一，看起来像一团发光的星际尘埃。',
            image: 'https://picsum.photos/seed/m78/400/300',
            distance: '约 1350 光年',
            magnitude: '8.3',
            facts: ['反射了周围恒星的光芒', '包含许多正在形成的恒星', '跨度约 4 光年'],
            x: 80,
            y: 40
          }
        ]
      }
    ]
  }
];
