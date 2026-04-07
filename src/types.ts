export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  points: number;
  level: number;
  completedChapters: string[];
  achievements: string[];
  streak: number;
  lastLogin: string;
  redeemedItems: string[];
  avatarUrl?: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: string;
  description: string;
  data: {
    diameter: string;
    mass: string;
    temperature: string;
    distanceFromSun?: string;
    orbitalPeriod?: string;
    moons?: number;
  };
  features: string;
  funFact: string;
  textureUrl: string;
}

export interface Course {
  id: string;
  title: string;
  level: number;
  description: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface StargazingInfo {
  location: string;
  condition: string;
  index: number;
  cloudCover: number;
  humidity: number;
  moonPhase: string;
  recommendations: string[];
}
