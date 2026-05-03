import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category
          })),
          customerEmail: user?.email || undefined,
        }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`O servidor retornou uma resposta inesperada (${response.status}): ${text.substring(0, 100)}...`);
      }

      if (response.ok && data.url) {
        // Stripe Checkout requires breaking out of the iframe.
        console.log('Iniciando redirecionamento para:', data.url);
        
        // Em ambientes de iframe (como o preview do AI Studio), o redirecionamento direto pode falhar.
        // Tentamos múltiplos métodos para garantir que o usuário chegue ao checkout.
        try {
          if (window.top && window.top !== window) {
            // Tentativa 1: Redirecionar o topo
            window.top.location.href = data.url;
          } else {
            // Tentativa 2: Janela atual (se não for iframe)
            window.location.href = data.url;
          }
        } catch (err) {
          console.warn('Erro ao acessar window.top, tentando fallbacks...', err);
          
          // Tentativa 3: Abrir em nova aba (costuma ser permitido se originado de clique)
          const newWindow = window.open(data.url, '_blank');
          
          // Se o bloqueador de popups impediu a nova aba, tentamos forçar na mesma
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            console.log('Popup bloqueado, tentando redirecionamento local forçado.');
            window.location.href = data.url;
          }
        }
      } else {
        throw new Error(data.error || 'A URL de checkout não foi retornada pelo servidor.');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Erro no Checkout: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#0F0F0F] shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-light-border dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-brand-blue dark:text-neon-blue" />
                <h2 className="text-xl font-display font-bold uppercase tracking-wider">Seu Carrinho</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.16, 1, 0.3, 1] // Custom smooth ease
                    }}
                    className="relative mb-10"
                  >
                    <div className="w-36 h-36 bg-gradient-to-br from-brand-blue/10 to-transparent dark:from-neon-blue/10 dark:to-transparent rounded-full flex items-center justify-center relative z-10 border border-brand-blue/20 dark:border-neon-blue/20">
                      <ShoppingBag className="w-16 h-16 text-brand-blue dark:text-neon-blue opacity-80" />
                    </div>
                    {/* Soft ambient glow */}
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-brand-blue/10 dark:bg-neon-blue/10 rounded-full blur-3xl -z-10" 
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    className="space-y-4 mb-12"
                  >
                    <h3 className="text-3xl font-bold uppercase tracking-tight text-text-main dark:text-white">
                      Seu carrinho está <span className="text-brand-blue dark:text-neon-blue">vazio</span>
                    </h3>
                    <p className="text-text-muted dark:text-zinc-400 text-base font-light leading-relaxed max-w-[280px] mx-auto">
                      Sua jornada para a performance máxima começa com a escolha certa.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className="w-full space-y-4"
                  >
                    <Link
                      to="/produtos"
                      onClick={() => setIsCartOpen(false)}
                      className="group relative w-full bg-brand-blue dark:bg-neon-blue text-white dark:text-black py-5 rounded-2xl font-bold uppercase tracking-[0.25em] text-xs hover:box-glow transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden shadow-xl shadow-brand-blue/10 dark:shadow-neon-blue/10"
                    >
                      <span className="relative z-10">Explorar Coleção</span>
                      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </Link>
                    
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-brand-blue dark:hover:text-neon-blue transition-colors duration-300"
                    >
                      Voltar para a loja
                    </button>
                  </motion.div>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-light-surface dark:bg-zinc-900 rounded-xl overflow-hidden shrink-0 p-2 flex items-center justify-center border border-light-border dark:border-white/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain animate-image-active"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm uppercase line-clamp-2 group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-text-muted hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mt-1">{item.category}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-brand-blue dark:hover:text-neon-blue transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-brand-blue dark:hover:text-neon-blue transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-light-border dark:border-white/10 space-y-4 bg-light-surface dark:bg-zinc-900/50">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted uppercase tracking-widest text-xs font-bold">Subtotal</span>
                  <span className="text-2xl font-black">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider text-center">
                  Frete e impostos calculados na finalização da compra
                </p>
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-brand-blue dark:bg-neon-blue text-white dark:text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:box-glow transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Finalizar Pedido
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-4 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-green dark:text-neon-blue">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Pagamento 100% Seguro</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" referrerPolicy="no-referrer" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" referrerPolicy="no-referrer" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" referrerPolicy="no-referrer" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Pix.png" alt="Pix" className="h-4" referrerPolicy="no-referrer" />
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main dark:hover:text-white transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
