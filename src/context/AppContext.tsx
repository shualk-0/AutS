import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentContext: string;
  setCurrentContext: (context: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentContext, setCurrentContext] = useState<string>('通用天文学');

  return (
    <AppContext.Provider value={{ currentContext, setCurrentContext }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
