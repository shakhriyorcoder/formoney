
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME } from '../constants';
import { useStore } from '../store/useStore';
import { Language } from '../types';
import { translations } from '../translations';

export const Header: React.FC = () => {
  const { user, isAdmin, language, setLanguage } = useStore();
  const location = useLocation();
  const t = translations[language];
  const [showLang, setShowLang] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between border-b border-white/10 mb-4">
      <Link to="/" className="text-xl font-bold tracking-tight">
        {APP_NAME}
      </Link>
      
      <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
        <Link 
          to="/" 
          className={`${location.pathname === '/' ? 'text-white' : 'text-white/60'} transition-colors hover:text-white`}
        >
          {t.search}
        </Link>
        <Link 
          to="/pricing" 
          className={`${location.pathname === '/pricing' ? 'text-white' : 'text-white/60'} transition-colors hover:text-white`}
        >
          {t.pricing}
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setShowLang(!showLang)}
            className="flex items-center gap-2 px-2 py-1 glass rounded-lg hover:bg-white/10 transition-all uppercase text-[10px]"
          >
            <span className="opacity-60">{t.lang}:</span> {language}
          </button>
          
          {showLang && (
            <div className="absolute top-full right-0 mt-2 glass rounded-xl overflow-hidden min-w-[100px] border border-white/20 shadow-2xl">
              {[Language.EN, Language.UZ, Language.RU].map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLanguage(l);
                    setShowLang(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-white/10 text-xs uppercase ${language === l ? 'text-ios-blue' : 'text-white/60'}`}
                >
                  {l === Language.EN ? 'English' : l === Language.UZ ? 'O\'zbekcha' : 'Русский'}
                </button>
              ))}
            </div>
          )}
        </div>

        {isAdmin && (
          <Link 
            to="/admin" 
            className="text-red-400 font-bold px-3 py-1 rounded-full border border-red-400/30 bg-red-400/10"
          >
            {t.admin}
          </Link>
        )}
      </nav>
    </header>
  );
};
