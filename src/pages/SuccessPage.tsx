import { motion } from 'motion/react';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import SEO from '../components/SEO';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when reaching the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-light-bg dark:bg-[#0B0B0B] flex items-center justify-center">
      <SEO title="Pedido Confirmado" description="Seu pedido na Nexus Supplements foi confirmado com sucesso!" />
      
      <div className="max-w-md w-full px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#121212] rounded-3xl p-8 border border-light-border dark:border-white/5 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-brand-green/10 dark:bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-brand-green dark:text-neon-blue" />
          </div>
          
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">
            Pedido Confirmado!
          </h1>
          
          <p className="text-text-muted dark:text-zinc-400 mb-8">
            Obrigado por escolher a Nexus. Sua jornada para a performance máxima acaba de dar um passo importante. 
            Em breve você receberá um e-mail com os detalhes do seu pedido.
          </p>
          
          {sessionId && (
            <div className="bg-light-surface dark:bg-[#1A1A1A] p-4 rounded-xl mb-8 border border-light-border dark:border-white/5">
              <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">ID da Sessão</p>
              <p className="text-xs font-mono break-all opacity-60">{sessionId}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Link
              to="/conta"
              className="w-full bg-brand-blue dark:bg-neon-blue text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:box-glow transition-all flex items-center justify-center gap-2"
            >
              Acompanhar Pedido
            </Link>
            
            <Link
              to="/produtos"
              className="w-full py-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main dark:hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              Continuar Comprando <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
