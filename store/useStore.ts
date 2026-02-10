
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlanType, UserSubscription, SearchHistoryItem, Language } from '../types';

interface AppState {
  user: UserSubscription;
  history: SearchHistoryItem[];
  isAdmin: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  useImageSearch: () => boolean;
  loginAdmin: () => void;
  upgradePlan: (plan: PlanType) => void;
  addToHistory: (query: string) => void;
  resetLimits: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem('user_sub');
    return saved ? JSON.parse(saved) : {
      plan: PlanType.FREE,
      imageSearchesUsed: 0,
      imageSearchLimit: 0
    };
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || Language.EN;
  });

  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('user_sub', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const useImageSearch = () => {
    if (user.plan === PlanType.FREE) return false;
    if (user.imageSearchesUsed >= user.imageSearchLimit) return false;
    
    setUser(prev => ({ ...prev, imageSearchesUsed: prev.imageSearchesUsed + 1 }));
    return true;
  };

  const upgradePlan = (plan: PlanType) => {
    const limits = { [PlanType.FREE]: 0, [PlanType.BASIC]: 20, [PlanType.PRO]: 100 };
    setUser({
      plan,
      imageSearchesUsed: 0,
      imageSearchLimit: limits[plan]
    });
  };

  const addToHistory = (query: string) => {
    setHistory(prev => [{ query, timestamp: Date.now() }, ...prev.slice(0, 19)]);
  };

  const loginAdmin = () => setIsAdmin(true);
  const resetLimits = () => setUser(prev => ({ ...prev, imageSearchesUsed: 0 }));

  return React.createElement(
    AppContext.Provider,
    { 
      value: { 
        user, 
        history, 
        isAdmin, 
        language,
        setLanguage,
        useImageSearch, 
        loginAdmin, 
        upgradePlan, 
        addToHistory, 
        resetLimits 
      } 
    },
    children
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useStore must be used within AppProvider');
  return context;
};
