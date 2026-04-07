import React, { createContext, useContext, useState, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface UserContextType {
  points: number;
  addPoints: (amount: number) => void;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  inventory: string[];
  addToInventory: (item: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('auts_points');
    return saved ? parseInt(saved) : 0;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('auts_chat');
    return saved ? JSON.parse(saved) : [];
  });

  const [inventory, setInventory] = useState<string[]>(() => {
    const saved = localStorage.getItem('auts_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('auts_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('auts_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('auts_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const addPoints = (amount: number) => setPoints(prev => prev + amount);
  const addToInventory = (item: string) => setInventory(prev => [...prev, item]);

  return (
    <UserContext.Provider value={{ points, addPoints, chatHistory, setChatHistory, inventory, addToInventory }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
