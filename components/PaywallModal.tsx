
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { translations } from '../translations';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose }) => {
  const { language } = useStore();
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-md glass rounded-[48px] p-10 relative overflow-hidden text-center flex flex-col gap-8 animate-in zoom-in-95 duration-500 border-white/20 shadow-[0_0_100px_rgba(10,132,255,0.15)]">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-24 h-24 bg-ios-blue/20 rounded-[32px] mx-auto flex items-center justify-center text-ios-blue mb-2 relative">
          <div className="absolute inset-0 bg-ios-blue blur-[30px] opacity-20"></div>
          <svg className="w-12 h-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div>
          <h2 className="text-3xl font-black mb-3 tracking-tight leading-tight">{t.subscriptionLimited}</h2>
          <p className="text-white/50 text-sm font-medium leading-relaxed px-4">
            {t.subscriptionNeeded}
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            to="/pricing" 
            onClick={onClose}
            className="block w-full py-5 bg-ios-blue text-white font-black uppercase tracking-widest text-xs rounded-[24px] hover:bg-ios-blue/90 transition-all active:scale-[0.98] shadow-2xl shadow-ios-blue/30"
          >
            {t.selectPlan}
          </Link>
          <button 
            onClick={onClose}
            className="w-full py-2 text-white/30 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors"
          >
            {t.later}
          </button>
        </div>
      </div>
    </div>
  );
};
