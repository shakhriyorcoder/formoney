
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useStore } from './store/useStore';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { ProductCard } from './components/ProductCard';
import { PaywallModal } from './components/PaywallModal';
import { marketplaceService } from './services/marketplaceService';
import { Product } from './types';
import { PRICING_PLANS } from './constants';
import { translations } from './translations';

const HomeView: React.FC = () => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { addToHistory, language } = useStore();
  const t = translations[language];

  const handleSearch = async (query: string) => {
    setLoading(true);
    setResults([]);
    addToHistory(query);
    try {
      const data = await marketplaceService.searchProducts(query);
      setResults(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <SearchSection 
        onSearch={handleSearch} 
        isLoading={loading} 
        onShowPaywall={() => setShowPaywall(true)} 
      />
      
      <div className="max-w-7xl mx-auto px-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-8 animate-in fade-in duration-500">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-[6px] border-ios-blue/10 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-ios-blue rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black mb-2 tracking-tight">{t.analyzing}</p>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{t.checkingStores}</p>
            </div>
          </div>
        )}

        {results.length > 0 && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !results.length && (
          <div className="flex flex-col items-center justify-center py-32 text-white/5">
            <div className="w-32 h-32 mb-8 glass rounded-[40px] flex items-center justify-center">
               <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl font-black tracking-widest opacity-20 uppercase max-w-sm text-center leading-relaxed">
              {t.foundNothing}
            </p>
          </div>
        )}
      </div>

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
};

const PricingView: React.FC = () => {
  const { user, upgradePlan, language } = useStore();
  const t = translations[language];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black mb-4 tracking-tight">{t.pricing}</h2>
        <p className="text-white/40 max-w-xl mx-auto">
          {t.checkingStores}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING_PLANS.map((plan) => (
          <div 
            key={plan.type}
            className={`flex flex-col glass rounded-[40px] p-10 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${plan.highlight ? 'border-ios-blue/50 ring-2 ring-ios-blue/10 bg-ios-blue/5 shadow-[0_0_60px_rgba(10,132,255,0.1)]' : ''}`}
          >
            {plan.tag && (
              <div className="absolute top-8 right-8 bg-ios-blue text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                {plan.tag === 'ENG OMMABOP' ? t.mostPopular : t.bestValue}
              </div>
            )}
            
            <h3 className="text-2xl font-black mb-2 tracking-tight">
              {plan.type === 'FREE' ? t.free : plan.name}
            </h3>
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
              <span className="text-white/30 text-sm font-bold uppercase tracking-widest">SO'M / MO</span>
            </div>

            <ul className="space-y-6 mb-12 flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-4 text-sm font-medium text-white/80">
                  <div className="w-5 h-5 rounded-full bg-[#30D158]/20 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#30D158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {feature.includes('matnli') ? t.unlimitedText : feature.includes('marketpleys') ? t.allMarketplaces : feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => upgradePlan(plan.type)}
              className={`w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] ${
                user.plan === plan.type 
                  ? 'bg-white/5 text-white/20 cursor-default' 
                  : plan.highlight 
                    ? 'bg-ios-blue text-white shadow-2xl shadow-ios-blue/40 hover:bg-ios-blue/90' 
                    : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {user.plan === plan.type ? t.currentPlan : plan.cta === 'Hozir boshlash' ? t.free : plan.cta === 'Sotib olish' ? t.buyNow : t.upgrade}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminView: React.FC = () => {
  const { history, resetLimits, loginAdmin, isAdmin, language } = useStore();
  const t = translations[language];

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-40 px-6 text-center">
        <h2 className="text-3xl font-black mb-8 tracking-tight">{t.admin}</h2>
        <button 
          onClick={loginAdmin}
          className="w-full py-5 bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-[24px] shadow-2xl shadow-red-500/30"
        >
          Login as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-black mb-12 tracking-tight">System Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass p-8 rounded-[32px]">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">Daily Searches</p>
          <p className="text-4xl font-black tracking-tighter">1,284</p>
        </div>
        <div className="glass p-8 rounded-[32px]">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">Image Searches</p>
          <p className="text-4xl font-black tracking-tighter">412</p>
        </div>
        <div className="glass p-8 rounded-[32px]">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">Active Subs</p>
          <p className="text-4xl font-black tracking-tighter">89</p>
        </div>
        <div className="glass p-8 rounded-[32px]">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">Revenue (UZS)</p>
          <p className="text-4xl font-black tracking-tighter">5.4M</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-[40px] p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black tracking-tight">{t.history}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-ios-blue bg-ios-blue/10 px-3 py-1 rounded-full">Recent</span>
          </div>
          <div className="space-y-4">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <span className="text-sm font-bold text-white/80">{h.query}</span>
                <span className="text-[10px] font-black text-white/20">{new Date(h.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[40px] p-10">
          <h3 className="text-xl font-black tracking-tight mb-8">Provider Status</h3>
          <div className="space-y-8">
            {[
              { name: 'Uzum Market', active: true },
              { name: 'Wildberries', active: true },
              { name: 'Yandex Market', active: true }
            ].map(store => (
              <div key={store.name} className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white/90">{store.name}</p>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Live Engine</p>
                </div>
                <div className={`w-14 h-7 ${store.active ? 'bg-[#30D158]' : 'bg-white/10'} rounded-full relative p-1`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${store.active ? 'translate-x-7' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
            <button 
              onClick={resetLimits}
              className="w-full py-5 mt-4 glass border-white/10 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Reset All Limits (Dev Only)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#0B0B0F] selection:bg-ios-blue selection:text-white">
          <Header />
          <main className="relative">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/pricing" element={<PricingView />} />
              <Route path="/admin" element={<AdminView />} />
            </Routes>
          </main>
          
          <footer className="py-20 text-center">
             <div className="flex items-center justify-center gap-4 mb-6 opacity-20">
                <div className="w-10 h-[1px] bg-white"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Arzonroq topamiz</span>
                <div className="w-10 h-[1px] bg-white"></div>
             </div>
            <p className="opacity-10 text-[10px] font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Qayerda Arzoni? · Made for Uzbekistan
            </p>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
