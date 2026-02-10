
import React, { useState } from 'react';
import { Product } from '../types';
import { translations } from '../translations';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useStore();
  const t = translations[language];
  const [imgError, setImgError] = useState(false);

  return (
    <a 
      href={product.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group relative flex flex-col glass rounded-[28px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/5 ${product.isCheapest ? 'success-glow border-[#30D158]/30 bg-[#30D158]/5' : ''}`}
    >
      {product.isCheapest && (
        <div className="absolute top-4 left-4 z-20 bg-[#30D158] text-black text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg tracking-widest uppercase">
          {t.cheapest}
        </div>
      )}
      
      <div className="aspect-square overflow-hidden bg-white/5 relative flex items-center justify-center p-2">
        {!imgError ? (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
             <span className="text-[10px] font-bold">Rasm yuklanmadi</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
            {product.marketplace}
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${product.isCheapest ? 'bg-[#30D158] shadow-[0_0_8px_#30D158]' : 'bg-white/20'}`}></div>
        </div>

        <h3 className="text-sm font-semibold leading-relaxed mb-4 line-clamp-2 min-h-[44px] text-white/90">
          {product.title}
        </h3>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white leading-none">
              {product.price > 0 ? product.price.toLocaleString() : 'N/A'}
            </span>
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">
              {language === 'en' ? 'UZS' : 'SO\'M'}
            </span>
          </div>
          
          <div className="w-10 h-10 rounded-2xl glass border-white/10 flex items-center justify-center group-hover:bg-ios-blue group-hover:text-white transition-all duration-300 group-hover:border-ios-blue shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
};
