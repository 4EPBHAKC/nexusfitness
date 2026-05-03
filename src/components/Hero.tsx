import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1200&auto=format&fit=crop&fm=webp",
    benefit: "27g de proteína por porção",
    headline: "A PROTEÍNA QUE CABE NO SEU BOLSO",
    price: "R$ 199,90",
    cta: "Comprar Agora",
    gradient: "from-blue-900/80 via-light-bg dark:via-[#0B0B0B] to-light-bg dark:to-[#0B0B0B]",
    textGradient: "from-brand-blue to-blue-600 dark:from-neon-blue dark:to-blue-600",
    accent: "text-brand-blue dark:text-neon-blue",
    buttonClass: "bg-brand-blue dark:bg-neon-blue text-white dark:text-black hover:shadow-[0_0_20px_rgba(31,162,214,0.4)] dark:hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1622484211148-7146b25e1324?q=80&w=1200&auto=format&fit=crop&fm=webp",
    benefit: "Aumento de força explosiva",
    headline: "O SEGREDO DOS ATLETAS DE ELITE",
    price: "R$ 99,90",
    cta: "Garantir o Meu",
    gradient: "from-orange-900/80 via-light-bg dark:via-[#0B0B0B] to-light-bg dark:to-[#0B0B0B]",
    textGradient: "from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-600",
    accent: "text-orange-600 dark:text-orange-500",
    buttonClass: "bg-orange-600 dark:bg-orange-500 text-white dark:text-black hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] dark:hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=1200&auto=format&fit=crop&fm=webp",
    benefit: "Menos de 15 kcal por dose",
    headline: "ENERGIA EXTREMA PARA SEU TREINO",
    price: "R$ 149,90",
    cta: "Explodir no Treino",
    gradient: "from-purple-900/80 via-light-bg dark:via-[#0B0B0B] to-light-bg dark:to-[#0B0B0B]",
    textGradient: "from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600",
    accent: "text-purple-600 dark:text-purple-500",
    buttonClass: "bg-purple-600 dark:bg-purple-500 text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleManualNav = (action: () => void) => {
    setIsAutoPlaying(false);
    action();
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-light-bg dark:bg-[#0B0B0B]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} opacity-40 z-0`}></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,#FFFFFF_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,#0B0B0B_100%)] z-0"></div>

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-12 pt-12 md:pt-0">
            
            {/* Text Content */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-4 inline-block"
              >
                <span className={`px-4 py-1.5 rounded-full border border-light-border dark:border-white/20 bg-white/5 ${slides[currentSlide].accent} text-xs font-bold tracking-widest uppercase backdrop-blur-sm`}>
                  {slides[currentSlide].benefit}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6 uppercase text-text-main dark:text-white"
              >
                {slides[currentSlide].headline.split(' ').map((word, i, arr) => (
                  <span key={i}>
                    {i === arr.length - 1 || i === arr.length - 2 ? (
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slides[currentSlide].textGradient} drop-shadow-lg`}>
                        {word}{' '}
                      </span>
                    ) : (
                      <>{word} </>
                    )}
                  </span>
                ))}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-8"
              >
                <span className="text-4xl md:text-5xl font-black text-text-main dark:text-white">
                  {slides[currentSlide].price}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <a 
                  href="#produtos"
                  className={`group relative px-8 py-4 font-display font-bold text-lg uppercase tracking-widest overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 rounded-xl ${slides[currentSlide].buttonClass}`}
                >
                  <span className="relative z-10">{slides[currentSlide].cta}</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                </a>
              </motion.div>
            </div>

            {/* Image Content */}
            <div className="flex-1 w-full h-[40vh] md:h-auto flex items-center justify-center order-1 md:order-2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
                className="relative w-full max-w-md aspect-square md:aspect-auto md:h-[80%] rounded-2xl overflow-hidden shadow-2xl border border-light-border dark:border-white/10"
              >
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].headline}
                  className="w-full h-full object-cover animate-image-active"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute z-20 top-1/2 -translate-y-1/2 left-4 md:left-8">
        <button 
          onClick={() => handleManualNav(prevSlide)}
          className="w-12 h-12 rounded-full bg-white/50 dark:bg-black/50 border border-light-border dark:border-white/10 flex items-center justify-center text-text-main dark:text-white hover:bg-white/10 hover:border-light-border dark:border-white/30 backdrop-blur-md transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute z-20 top-1/2 -translate-y-1/2 right-4 md:right-8">
        <button 
          onClick={() => handleManualNav(nextSlide)}
          className="w-12 h-12 rounded-full bg-white/50 dark:bg-black/50 border border-light-border dark:border-white/10 flex items-center justify-center text-text-main dark:text-white hover:bg-white/10 hover:border-light-border dark:border-white/30 backdrop-blur-md transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleManualNav(() => setCurrentSlide(index))}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index 
                ? `w-8 h-2 ${slides[currentSlide].accent.replace('text-', 'bg-')}` 
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
