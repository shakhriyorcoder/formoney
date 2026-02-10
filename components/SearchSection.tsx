
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { useStore } from '../store/useStore';
import { translations } from '../translations';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  onShowPaywall: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, isLoading, onShowPaywall }) => {
  const [query, setQuery] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { useImageSearch, language } = useStore();
  const t = translations[language];

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  const handleImageClick = () => {
    const canSearch = useImageSearch();
    if (!canSearch) {
      onShowPaywall();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const productTitle = await geminiService.extractProductFromImage(base64);
        setQuery(productTitle);
        onSearch(productTitle);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Error parsing image.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <div className="text-center mb-4">
        <h1 className="text-5xl font-extrabold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
          Qayerda Arzoni?
        </h1>
        <p className="text-white/40 text-sm font-medium tracking-[0.2em] uppercase">
          Wildberries · Uzum · Yandex Market
        </p>
      </div>

      <form onSubmit={handleTextSearch} className="relative group">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          className="w-full h-16 pl-6 pr-32 glass rounded-[24px] text-lg focus:outline-none focus:ring-2 focus:ring-ios-blue/50 transition-all placeholder:text-white/20"
        />
        <div className="absolute right-2 top-2 bottom-2 flex gap-2">
           <button 
            type="submit"
            disabled={isLoading || isProcessingImage}
            className="h-full px-6 bg-ios-blue hover:bg-ios-blue/80 disabled:opacity-50 text-white font-semibold rounded-[18px] transition-all flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">{t.search}</span>
              </div>
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={handleImageClick}
          disabled={isProcessingImage || isLoading}
          className="flex items-center gap-3 px-6 py-4 glass rounded-[20px] hover:bg-white/10 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-ios-blue/20 flex items-center justify-center text-ios-blue group-hover:scale-110 transition-transform">
            {isProcessingImage ? (
              <div className="w-5 h-5 border-2 border-ios-blue/30 border-t-ios-blue rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">{t.imageSearch}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">{t.premiumService}</span>
          </div>
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
      </div>
    </div>
  );
};
