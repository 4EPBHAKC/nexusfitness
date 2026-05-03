import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Whey', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop' },
  { name: 'Creatina', image: 'https://images.unsplash.com/photo-1622484211148-7146b25e1324?q=80&w=600&auto=format&fit=crop' },
  { name: 'Pré-treino', image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=600&auto=format&fit=crop' },
  { name: 'Kits', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop' },
  { name: 'Hipercalórico', image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=600&auto=format&fit=crop' },
];

export default function Categories() {
  return (
    <section className="py-24 bg-white dark:bg-[#121212] border-y border-light-border dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-brand-blue dark:text-neon-blue text-sm font-bold tracking-[0.2em] uppercase mb-4">Escolha seu objetivo</h2>
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Categorias Principais
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, index) => (
            <Link key={cat.name} to={`/produtos?categoria=${cat.name}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-light-border dark:border-white/5 hover:border-brand-blue dark:hover:border-neon-blue/50 transition-all box-glow-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-all duration-700 scale-105 animate-image-active"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 z-20 text-center">
                  <h4 className="text-white font-display font-bold uppercase tracking-wider group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors text-lg md:text-xl">
                    {cat.name}
                  </h4>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
