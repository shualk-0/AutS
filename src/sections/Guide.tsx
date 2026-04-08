import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Moon, 
  Sun, 
  Wind, 
  Droplets, 
  MapPin, 
  Navigation, 
  Info, 
  ChevronRight, 
  Star,
  Eye,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Compass,
  Sparkles,
  RefreshCw,
  Volume2,
  Square,
  FileText,
  Play,
  History,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../lib/utils';

interface ObservationData {
  date: string;
  cloudCover: number; // 0-100
  bortleScale: number; // 1-9
  moonPhase: number; // 0-1 (0: new moon, 0.5: half, 1: full)
  humidity: number; // 0-100
  windSpeed: number; // km/h
  seeing: number; // 1-5 (1: poor, 5: excellent)
  transparency: number; // 1-5
}

const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const BASE_DATA: Omit<ObservationData, 'date'>[] = [
  { cloudCover: 15, bortleScale: 4, moonPhase: 0.1, humidity: 45, windSpeed: 12, seeing: 4, transparency: 4 },
  { cloudCover: 40, bortleScale: 4, moonPhase: 0.2, humidity: 55, windSpeed: 18, seeing: 3, transparency: 3 },
  { cloudCover: 85, bortleScale: 4, moonPhase: 0.3, humidity: 75, windSpeed: 25, seeing: 1, transparency: 2 },
  { cloudCover: 10, bortleScale: 4, moonPhase: 0.4, humidity: 40, windSpeed: 8, seeing: 5, transparency: 5 },
  { cloudCover: 5, bortleScale: 4, moonPhase: 0.5, humidity: 35, windSpeed: 5, seeing: 5, transparency: 5 },
  { cloudCover: 25, bortleScale: 4, moonPhase: 0.6, humidity: 50, windSpeed: 15, seeing: 4, transparency: 4 },
  { cloudCover: 60, bortleScale: 4, moonPhase: 0.7, humidity: 65, windSpeed: 20, seeing: 2, transparency: 3 },
];

const generateMockData = (): ObservationData[] => {
  const today = new Date();

  return BASE_DATA.map((item, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() + index);

    return {
      ...item,
      date: index === 0 ? '今日' : WEEK_DAYS[d.getDay()]
    };
  });
};

const MOCK_DATA: ObservationData[] = generateMockData();

const calculateScore = (data: ObservationData) => {
  // Weights: Cloud 40%, Bortle 30%, Moon 20%, Other 10%
  const cloudScore = (100 - data.cloudCover) * 0.4;
  const bortleScore = ((9 - data.bortleScale) / 8 * 100) * 0.3;
  const moonScore = (1 - data.moonPhase) * 100 * 0.2;
  const otherScore = (data.seeing / 5 * 50 + data.transparency / 5 * 50) * 0.1;
  
  return Math.round(cloudScore + bortleScore + moonScore + otherScore);
};

const COMMON_CITIES = ['北京市', '上海市', '广州市', '深圳市', '成都市', '杭州市', '西安市', '拉萨市', '乌鲁木齐', '昆明市'];

const DEEPSEEK_CONFIG = {
  apiKey: "1123b457-ced6-4f8c-8d73-4e66502464d1",
  base_url: "https://ark.cn-beijing.volces.com/api/v3",
  model: "ep-20260405155245-wnxh7"
};

const hashCityToSeed = (city: string) => {
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const getCityLevel = (city: string) => {
  if (
    city.includes('上海') ||
    city.includes('北京') ||
    city.includes('广州') ||
    city.includes('深圳')
  ) {
    return 'mega';
  }

  if (
    city.includes('杭州') ||
    city.includes('成都') ||
    city.includes('西安') ||
    city.includes('南京') ||
    city.includes('武汉') ||
    city.includes('重庆')
  ) {
    return 'large';
  }

  if (
    city.includes('拉萨') ||
    city.includes('乌鲁木齐') ||
    city.includes('香格里拉') ||
    city.includes('丽江') ||
    city.includes('大理') ||
    city.includes('阿里')
  ) {
    return 'excellent';
  }

  return 'normal';
};

const generateObservationDataByCity = (city: string): ObservationData => {
  const seed = hashCityToSeed(city);
  const random = createSeededRandom(seed);
  const level = getCityLevel(city);

  let bortleScale = 4;
  let cloudBase = 35;
  let humidityBase = 50;
  let transparencyBase = 3;
  let seeingBase = 3;
  let windBase = 10;

  if (level === 'mega') {
    bortleScale = 7 + Math.floor(random() * 2); // 7-8
    cloudBase = 45;
    humidityBase = 60;
    transparencyBase = 2;
    seeingBase = 2;
    windBase = 12;
  } else if (level === 'large') {
    bortleScale = 5 + Math.floor(random() * 2); // 5-6
    cloudBase = 35;
    humidityBase = 55;
    transparencyBase = 3;
    seeingBase = 3;
    windBase = 10;
  } else if (level === 'excellent') {
    bortleScale = 2 + Math.floor(random() * 2); // 2-3
    cloudBase = 18;
    humidityBase = 35;
    transparencyBase = 4;
    seeingBase = 4;
    windBase = 8;
  } else {
    bortleScale = 4 + Math.floor(random() * 2); // 4-5
    cloudBase = 30;
    humidityBase = 45;
    transparencyBase = 3;
    seeingBase = 3;
    windBase = 9;
  }

  const cloudCover = Math.min(95, Math.max(5, Math.floor(cloudBase + random() * 30 - 10)));
  const humidity = Math.min(95, Math.max(20, Math.floor(humidityBase + random() * 25 - 8)));
  const windSpeed = Math.min(30, Math.max(2, Math.floor(windBase + random() * 10 - 3)));
  const moonPhase = Number((random() * 0.9).toFixed(1));
  const transparency = Math.min(5, Math.max(1, transparencyBase + Math.floor(random() * 2)));
  const seeing = Math.min(5, Math.max(1, seeingBase + Math.floor(random() * 2) - 1));

  return {
    ...MOCK_DATA[0],
    cloudCover,
    bortleScale,
    moonPhase,
    humidity,
    windSpeed,
    transparency,
    seeing
  };
};

const generateTrendDataByCity = (city: string): ObservationData[] => {
  const base = generateObservationDataByCity(city);
  const days = generateMockData();
  const seed = hashCityToSeed(city + '-trend');
  const random = createSeededRandom(seed);

  return days.map((day, index) => {
    const cloudOffset = Math.floor(random() * 20 - 10) + index * 2 - 4;
    const humidityOffset = Math.floor(random() * 16 - 8) + index - 3;
    const windOffset = Math.floor(random() * 8 - 4);
    const seeingOffset = Math.floor(random() * 3) - 1;
    const transparencyOffset = Math.floor(random() * 3) - 1;

    return {
      ...day,
      cloudCover: Math.min(95, Math.max(5, base.cloudCover + cloudOffset)),
      bortleScale: base.bortleScale,
      moonPhase: day.moonPhase,
      humidity: Math.min(95, Math.max(20, base.humidity + humidityOffset)),
      windSpeed: Math.min(30, Math.max(2, base.windSpeed + windOffset)),
      transparency: Math.min(5, Math.max(1, base.transparency + transparencyOffset)),
      seeing: Math.min(5, Math.max(1, base.seeing + seeingOffset)),
    };
  });
};

const DailyAstronomyFact: React.FC<{ data: ObservationData, location: string }> = ({ data, location }) => {
  const [fact, setFact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFact = async () => {
      const today = new Date().toDateString();
      const factCacheKey = `daily_astro_fact_${location}`;
      const factDateKey = `daily_astro_fact_date_${location}`;

      const cached = localStorage.getItem(factCacheKey);
      const cachedDate = localStorage.getItem(factDateKey);

      if (cached && cachedDate === today) {
        setFact(cached);
        return;
      }

      setLoading(true);
      try {
        const prompt = `你是一位资深天文学家。请根据以下观测条件，提供一条有趣且相关的天文冷知识。
        
        观测地点：${location}
        当前条件：云量 ${data.cloudCover}%，视宁度 ${data.seeing}/5，透明度 ${data.transparency}/5，月相照明度 ${Math.round(data.moonPhase * 100)}%。
        
        要求：
        1. 知识点要有趣、科学准确。
        2. 最好能联系当前的观测条件（例如：如果云多，可以讲讲云层上的天文现象；如果月亮亮，可以讲讲月球知识）。
        3. 语言生动，字数在100字以内。
        4. 请务必使用中文。`;

        const response = await fetch(`${DEEPSEEK_CONFIG.base_url}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
          },
          body: JSON.stringify({
            model: DEEPSEEK_CONFIG.model,
            messages: [{ role: 'user', content: prompt }]
          })
        });

        if (response.ok) {
          const result = await response.json();
          const newFact = result.choices?.[0]?.message?.content;
          if (newFact) {
            setFact(newFact);
            localStorage.setItem(factCacheKey, newFact);
            localStorage.setItem(factDateKey, today);
        }
        }
      } catch (error) {
        console.error('Failed to fetch daily fact:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFact();
  }, [data, location]);

  if (!fact && !loading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-3xl border border-cosmic-neon/20 bg-cosmic-neon/5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="w-12 h-12 text-cosmic-neon" />
      </div>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-cosmic-neon/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-cosmic-neon" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-cosmic-neon uppercase tracking-widest flex items-center gap-2">
            每日天文冷知识
            {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            {loading ? '正在从宇宙深处获取灵感...' : fact}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const AudioSkyTour: React.FC<{ data: ObservationData, location: string }> = ({ data, location }) => {
  const [loading, setLoading] = useState(false);
  const [tourText, setTourText] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const startTour = async () => {
    if (expanded && tourText) {
      setExpanded(false);
      return;
    }

    setLoading(true);
    try {
      const prompt = `你是一位富有诗意的天文学导师。请根据以下观测条件，为用户生成一段约150字的“星空导览”文字内容。

观测地点：${location}
当前条件：云量 ${data.cloudCover}%，视宁度 ${data.seeing}/5，透明度 ${data.transparency}/5，月相照明度 ${Math.round(data.moonPhase * 100)}%。

要求：
1. 语气亲切、深邃、富有感染力。
2. 引导用户观察当前的星空（例如：如果晴朗，引导看银河；如果多云，引导感受宇宙的宁静）。
3. 结尾要有一句鼓励探索的话。
4. 请务必使用中文。
5. 控制在120-180字之间。`;

      const scriptResponse = await fetch(`${DEEPSEEK_CONFIG.base_url}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          model: DEEPSEEK_CONFIG.model,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!scriptResponse.ok) throw new Error('导览生成失败');

      const scriptData = await scriptResponse.json();
      const script = scriptData.choices?.[0]?.message?.content?.trim();

      if (!script) throw new Error('未获取到导览内容');

      setTourText(script);
      setExpanded(true);
    } catch (error) {
      console.error('Sky Tour Error:', error);
      setTourText('暂时无法生成星空导览，请检查网络或 API 配置后重试。');
      setExpanded(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border-white/10 bg-white/5 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cosmic-neon/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-cosmic-neon" />
          </div>
          <div>
            <h4 className="text-white font-bold">AI 星空导览</h4>
            <p className="text-slate-400 text-xs">手机环境更稳定的文字导览版本</p>
          </div>
        </div>

        <button
          onClick={startTour}
          disabled={loading}
          className={cn(
            "px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2",
            expanded && tourText
              ? "bg-white/5 text-slate-300 border border-white/10"
              : "bg-cosmic-neon text-cosmic-bg hover:scale-105 active:scale-95"
          )}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          {loading ? '生成中...' : expanded && tourText ? '收起导览' : '开始导览'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="rounded-2xl border border-cosmic-neon/20 bg-cosmic-neon/5 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cosmic-neon/15 flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-5 h-5 text-cosmic-neon" />
              </div>
              <div className="space-y-2">
                <h5 className="text-sm font-bold text-cosmic-neon tracking-widest uppercase">
                  本次星空导览
                </h5>
                <p className="text-slate-300 text-sm leading-7 whitespace-pre-line">
                  {tourText || '正在为你整理今晚的星空建议...'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Guide: React.FC = () => {
  const [location, setLocation] = useState(() => localStorage.getItem('last_astronomy_location') || '上海市');
  const [isLocating, setIsLocating] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [recentLocations, setRecentLocations] = useState<string[]>(() => {
    const saved = localStorage.getItem('recent_astronomy_locations');
    return saved ? JSON.parse(saved) : ['上海市', '北京市', '广州市', '深圳市'];
  });
  const [currentData, setCurrentData] = useState<ObservationData>(MOCK_DATA[0]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(calculateScore(currentData));
  }, [currentData]);

  useEffect(() => {
    localStorage.setItem('last_astronomy_location', location);
    if (location && !recentLocations.includes(location)) {
      const updated = [location, ...recentLocations.filter(l => l !== location)].slice(0, 5);
      setRecentLocations(updated);
      localStorage.setItem('recent_astronomy_locations', JSON.stringify(updated));
    }
  }, [location]);

  const handleAutoLocate = () => {
    setIsLocating(true);

  if (!navigator.geolocation) {
    alert("您的设备不支持定位，请手动选择城市");
    setIsLocating(false);
    setShowCityPicker(true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log("定位成功:", latitude, longitude, "精度:", accuracy);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "zh-CN,zh;q=0.9",
              "User-Agent": "AutS/1.0"
            }
          }
        );

        if (!response.ok) throw new Error("反向地理解析失败");

        const data = await response.json();

        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          data.address.state ||
          "未知城市";

        handleCitySelect(city, latitude, longitude);
      } catch (error) {
        console.error("城市解析失败:", error);
        alert("定位到了当前位置，但城市解析失败，请手动选择城市");
        setShowCityPicker(true);
      } finally {
        setIsLocating(false);
      }
    },
    (error) => {
      console.error("定位失败:", error);

      let msg = "定位失败";
      if (error.code === 1) msg = "请允许定位权限";
      else if (error.code === 2) msg = "无法获取位置信息";
      else if (error.code === 3) msg = "定位超时";

      alert(msg + "，请手动选择城市");
      setShowCityPicker(true);
      setIsLocating(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
  };

 const handleCitySelect = (
  city: string,
  latitude?: number,
  longitude?: number
) => {
  setLocation(city);
  setShowCityPicker(false);

  const cityData = generateObservationDataByCity(city);
  setCurrentData(cityData);

  if (latitude !== undefined && longitude !== undefined) {
    localStorage.setItem(
      'last_location_coords',
      JSON.stringify({ latitude, longitude })
    );
  }
};

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim()) {
      handleCitySelect(customCity.trim());
      setCustomCity('');
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return 'from-emerald-500/20 to-transparent';
    if (s >= 60) return 'from-yellow-500/20 to-transparent';
    return 'from-red-500/20 to-transparent';
  };

 const trendData = generateTrendDataByCity(location);

const chartData = trendData.map(d => ({
  name: d.date,
  score: calculateScore(d)
}));

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 custom-scrollbar pb-24 bg-cosmic-bg">
      {/* Header & Location */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Compass className="w-8 h-8 text-cosmic-neon" />
            星空观测指南
          </h2>
          <p className="text-slate-400 mt-1">基于实时气象与天文数据的专业观测建议</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setShowCityPicker(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-xl transition-all"
          >
            <MapPin className="w-4 h-4 text-cosmic-neon" />
            <span className="max-w-[150px] truncate">{location}</span>
          </button>
          <button 
            onClick={handleAutoLocate}
            disabled={isLocating}
            className="px-4 py-2 bg-cosmic-neon/10 hover:bg-cosmic-neon/20 text-cosmic-neon rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            {isLocating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
            {isLocating ? '定位中...' : '自动定位'}
          </button>
        </div>
      </div>

      {/* Daily Astronomy Fact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyAstronomyFact data={currentData} location={location} />
        <AudioSkyTour data={currentData} location={location} />
      </div>

      {/* City Picker Modal */}
      <AnimatePresence>
        {showCityPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCityPicker(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-cosmic-bg border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">选择观测城市</h3>
                <button onClick={() => setShowCityPicker(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCustomCitySubmit} className="mb-6">
                <div className="relative">
                  <input 
                    type="text" 
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="输入城市名称..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-cosmic-neon/50 transition-all"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-4 bg-cosmic-neon text-cosmic-bg rounded-lg text-xs font-bold"
                  >
                    确认
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <History className="w-3 h-3" />
                    最近/推荐
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recentLocations.map((city) => (
                      <button 
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-cosmic-neon/10 hover:border-cosmic-neon/30 hover:text-cosmic-neon transition-all"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAutoLocate}
                  disabled={isLocating}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-cosmic-neon/10 border border-cosmic-neon/20 text-cosmic-neon font-bold hover:bg-cosmic-neon/20 transition-all"
                >
                  {isLocating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Compass className="w-5 h-5" />
                  )}
                  {isLocating ? '正在获取位置...' : '自动定位当前城市'}
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">常用城市</p>
                <div className="grid grid-cols-3 gap-2">
                  {COMMON_CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className="p-2 text-sm bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-cosmic-neon/10 hover:border-cosmic-neon/30 hover:text-cosmic-neon transition-all"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Score Card */}
      <div className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-8 flex flex-col md:flex-row items-center gap-8",
        getScoreBg(score)
      )}>
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-white/5"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={552.92}
              initial={{ strokeDashoffset: 552.92 }}
              animate={{ strokeDashoffset: 552.92 - (552.92 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={getScoreColor(score)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-6xl font-display font-bold", getScoreColor(score))}>{score}</span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">观测评分</span>
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-cosmic-neon">
            <Star className="w-3 h-3" />
            {score >= 80 ? '极佳观测时机' : score >= 60 ? '条件尚可' : '不建议观测'}
          </div>
          <h3 className="text-2xl font-bold text-white">
            {score >= 80 ? '今晚星空璀璨，适合深空摄影' : 
             score >= 60 ? '云量适中，可进行行星目视观测' : 
             '天气条件欠佳，建议室内学习天文知识'}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            当前云量仅为 {currentData.cloudCover}%，大气视宁度表现优异。月相处于{currentData.moonPhase < 0.2 ? '新月' : '盈月'}阶段，对暗弱星云的干扰极小。
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>视宁度: {currentData.seeing}/5</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>透明度: {currentData.transparency}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Condition Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ConditionCard 
          icon={Cloud} 
          label="云量" 
          value={`${currentData.cloudCover}%`} 
          subValue={currentData.cloudCover < 20 ? '晴朗' : currentData.cloudCover < 50 ? '多云' : '阴天'}
          color="text-blue-400"
        />
        <ConditionCard 
          icon={Star} 
          label="光污染" 
          value={`Bortle ${currentData.bortleScale}`} 
          subValue="郊区/乡村"
          color="text-yellow-400"
        />
        <ConditionCard 
          icon={Moon} 
          label="月相" 
          value={`${Math.round(currentData.moonPhase * 100)}%`} 
          subValue="照明度"
          color="text-purple-400"
        />
        <ConditionCard 
          icon={Droplets} 
          label="湿度" 
          value={`${currentData.humidity}%`} 
          subValue="露点风险低"
          color="text-cyan-400"
        />
      </div>

      {/* Trend Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cosmic-neon" />
            未来7天观测趋势
          </h4>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cosmic-neon" />
              <span className="text-slate-400">评分趋势</span>
            </div>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#ffffff40" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#ffffff40" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a14', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#00f2ff' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#00f2ff" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          <ChevronRight className="w-5 h-5 text-cosmic-neon" />
          推荐观测内容
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {score >= 80 ? (
            <>
              <RecommendationCard 
                title="深空天体" 
                desc="M42 猎户座大星云、M31 仙女座星系" 
                tags={['摄影', '长曝光']}
              />
              <RecommendationCard 
                title="双星系统" 
                desc="辇道增七、开阳增一" 
                tags={['目视', '高倍率']}
              />
              <RecommendationCard 
                title="银河中心" 
                desc="人马座方向银河核心区域" 
                tags={['广角', '肉眼']}
              />
            </>
          ) : score >= 60 ? (
            <>
              <RecommendationCard 
                title="月面细节" 
                desc="第谷环形山、雨海边缘" 
                tags={['目视', '高亮度']}
              />
              <RecommendationCard 
                title="明亮行星" 
                desc="木星大红斑、土星光环" 
                tags={['行星', '高倍率']}
              />
              <RecommendationCard 
                title="亮星团" 
                desc="昴星团 M45、蜂巢星团 M44" 
                tags={['双筒镜', '低倍率']}
              />
            </>
          ) : (
            <div className="col-span-full p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
              <div>
                <h5 className="text-white font-bold">观测条件不佳</h5>
                <p className="text-slate-400 text-sm">建议今晚在“探索”中学习天文理论，或在“AI助手”处交流心得。</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConditionCard: React.FC<{ icon: any, label: string, value: string, subValue: string, color: string }> = ({ icon: Icon, label, value, subValue, color }) => (
  <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
    <div className="flex items-center justify-between">
      <Icon className={cn("w-5 h-5", color)} />
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-[10px] text-slate-400">{subValue}</span>
    </div>
  </div>
);

const RecommendationCard: React.FC<{ title: string, desc: string, tags: string[] }> = ({ title, desc, tags }) => (
  <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all group cursor-pointer">
    <h5 className="text-white font-bold mb-1 group-hover:text-cosmic-neon transition-colors">{title}</h5>
    <p className="text-slate-400 text-xs mb-3 line-clamp-1">{desc}</p>
    <div className="flex gap-2">
      {tags.map(tag => (
        <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-slate-500">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default Guide;
