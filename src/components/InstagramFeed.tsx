import { motion } from 'motion/react';
import { Instagram, Play } from 'lucide-react';

const feed = [
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop&fm=webp' },
  { id: 2, type: 'video', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop&fm=webp' },
  { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1526506114642-54cb358636b5?q=80&w=600&auto=format&fit=crop&fm=webp' },
  { id: 4, type: 'video', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop&fm=webp' },
  { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop&fm=webp' },
];

export default function InstagramFeed() {
  const instagramUrl = "https://www.instagram.com/nexusfitness.br/reels/";

  return (
    <section id="comunidade" className="py-24 bg-white dark:bg-[#121212] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <h2 className="text-brand-blue dark:text-neon-blue text-sm font-bold tracking-[0.2em] uppercase mb-2 flex items-center justify-center md:justify-start gap-2">
            <Instagram className="w-4 h-4" /> @nexusfitness.br
          </h2>
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Junte-se ao <br className="hidden md:block" /> Nosso Time
          </h3>
          <a 
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-bold uppercase tracking-widest text-xs transition-all rounded-full hover:scale-105 hover:box-glow"
          >
            <Instagram className="w-4 h-4" /> Seguir-nos
          </a>
        </div>
        <div className="hidden md:block">
          <a 
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-light-border dark:border-white/20 hover:border-brand-blue dark:hover:border-neon-blue text-text-main dark:text-white font-bold uppercase tracking-widest text-sm transition-all rounded-full flex items-center gap-2 hover:scale-105"
          >
            <Instagram className="w-5 h-5" /> Ver Perfil Completo
          </a>
        </div>
      </div>

      {/* Uniform Grid Feed */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {feed.map((item, index) => (
            <motion.a
              key={item.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer block border border-light-border dark:border-white/5"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-all duration-500 z-10 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  {item.type === 'video' ? (
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                      <Play className="w-5 h-5 text-white fill-white ml-1" />
                    </div>
                  ) : (
                    <Instagram className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              <img 
                src={item.url} 
                alt="Instagram post" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
