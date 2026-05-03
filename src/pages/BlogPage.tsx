import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: "Como otimizar a absorção da Creatina",
    category: "Suplementação",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop",
    date: "12 Mar 2026",
    excerpt: "Descubra os melhores horários e combinações para extrair o máximo de resultados da sua creatina monohidratada."
  },
  {
    id: 2,
    title: "Treino de Força vs Hipertrofia: Qual a diferença?",
    category: "Treino",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    date: "08 Mar 2026",
    excerpt: "Entenda as variáveis de volume, intensidade e descanso para direcionar seu treino ao seu objetivo principal."
  },
  {
    id: 3,
    title: "A importância do sono na recuperação muscular",
    category: "Recuperação",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
    date: "05 Mar 2026",
    excerpt: "Por que dormir bem é tão importante quanto treinar pesado e se alimentar corretamente."
  },
  {
    id: 4,
    title: "Mitos e Verdades sobre o Pré-treino",
    category: "Suplementação",
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=800&auto=format&fit=crop",
    date: "01 Mar 2026",
    excerpt: "Desvendamos os principais mitos sobre estimulantes e vasodilatadores no pré-treino."
  }
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24 bg-light-bg dark:bg-[#0B0B0B] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-text-main dark:text-white">
            Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-600 dark:from-neon-blue dark:to-blue-600">Blog</span>
          </h1>
          <p className="text-text-muted dark:text-zinc-400 max-w-2xl mx-auto">
            Conteúdo técnico, dicas de treino e nutrição para você alcançar o próximo nível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white dark:bg-[#121212] rounded-3xl overflow-hidden border border-light-border dark:border-white/5 hover:border-brand-blue dark:hover:border-neon-blue/30 transition-colors flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover scale-105 animate-image-active transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-6 left-6 z-20 bg-brand-green dark:bg-neon-blue text-white dark:text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <span className="text-text-muted text-sm mb-3">{article.date}</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors">
                  {article.title}
                </h2>
                <p className="text-text-muted dark:text-zinc-400 leading-relaxed mb-8 flex-1">
                  {article.excerpt}
                </p>
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-main dark:text-white group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors mt-auto w-fit border-b border-transparent group-hover:border-brand-blue dark:group-hover:border-neon-blue pb-1">
                  Ler artigo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
