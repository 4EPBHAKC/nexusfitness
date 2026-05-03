import { motion } from 'motion/react';
import { ShieldCheck, Zap, Activity, Trophy } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    { icon: Zap, title: "Performance Extrema", desc: "Fórmulas concentradas para resultados reais." },
    { icon: ShieldCheck, title: "Qualidade Pura", desc: "Ingredientes testados e certificados em laboratório." },
    { icon: Activity, title: "Saúde em Foco", desc: "Desenvolvido por especialistas em nutrição esportiva." },
    { icon: Trophy, title: "Resultados Comprovados", desc: "Aprovado por atletas de alta performance." }
  ];

  return (
    <section className="py-24 bg-light-bg dark:bg-[#0B0B0B] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-brand-blue dark:text-neon-blue text-sm font-bold tracking-[0.2em] uppercase mb-4">Por que escolher a NexusFit?</h2>
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Nossa Promessa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-600 dark:from-neon-blue dark:to-blue-600">Qualidade</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-light-border dark:border-white/5 hover:border-brand-blue dark:hover:border-neon-blue/30 transition-all group hover:box-glow text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 dark:bg-neon-blue/10 border border-brand-blue dark:border-neon-blue/20 flex items-center justify-center text-brand-blue dark:text-neon-blue mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-xl uppercase tracking-wide mb-3">{item.title}</h4>
              <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
