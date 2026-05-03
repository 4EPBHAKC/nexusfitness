import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Tag, ArrowRight } from 'lucide-react';

export default function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds if not seen before
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('nexusfit_discount_seen');
      if (!hasSeen) {
        setIsOpen(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('nexusfit_discount_seen', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white dark:bg-[#121212] border border-brand-blue dark:border-neon-blue/30 rounded-3xl overflow-hidden max-w-lg w-full shadow-[0_0_50px_rgba(0,229,255,0.15)]"
          >
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/50 dark:bg-black/50 flex items-center justify-center text-text-muted dark:text-zinc-400 hover:text-text-main dark:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop" 
                alt="Treino" 
                className="w-full h-full object-cover animate-image-active"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-brand-blue/20 dark:bg-neon-blue/20 backdrop-blur-md border border-brand-blue dark:border-neon-blue flex items-center justify-center text-brand-blue dark:text-neon-blue">
                  <Tag className="w-10 h-10" />
                </div>
              </div>
            </div>

            <div className="p-8 text-center relative z-20 -mt-8">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-2">
                15% OFF NA PRIMEIRA COMPRA
              </h3>
              <p className="text-text-muted dark:text-zinc-400 mb-6">
                Desbloqueie seu potencial máximo. Use o cupom abaixo no checkout e garanta seu desconto exclusivo.
              </p>
              
              <div className="bg-light-surface dark:bg-[#1A1A1A] border border-dashed border-brand-blue dark:border-neon-blue/50 rounded-xl py-4 mb-6">
                <span className="text-2xl font-display font-bold text-brand-blue dark:text-neon-blue tracking-[0.2em]">NEXUS15</span>
              </div>

              <button 
                onClick={closePopup}
                className="w-full bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-bold uppercase tracking-widest py-4 rounded-xl box-glow hover:box-glow-hover transition-all flex items-center justify-center gap-2"
              >
                Garantir Desconto <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={closePopup}
                className="mt-4 text-xs text-text-muted uppercase tracking-wider hover:text-text-main dark:hover:text-white transition-colors"
              >
                Não, obrigado. Prefiro pagar mais caro.
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
