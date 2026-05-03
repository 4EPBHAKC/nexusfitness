import { motion } from 'motion/react';
import { Activity, ShieldCheck, Zap, Facebook, Twitter, Instagram } from 'lucide-react';
import { useState } from 'react';

export default function About() {
  const [activeSocial, setActiveSocial] = useState<number | null>(null);

  const handleSocialClick = (idx: number) => {
    setActiveSocial(idx);
    setTimeout(() => setActiveSocial(null), 600);
  };

  const socials = [
    { 
      icon: Facebook, 
      label: 'Facebook', 
      color: 'hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600/30',
      glowColor: 'rgba(37, 99, 235, 0.6)'
    },
    { 
      icon: Twitter, 
      label: 'Twitter', 
      color: 'hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-500/30',
      glowColor: 'rgba(14, 165, 233, 0.6)'
    },
    { 
      icon: Instagram, 
      label: 'Instagram', 
      color: 'hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-600/30',
      glowColor: 'rgba(219, 39, 119, 0.6)'
    }
  ];

  return (
    <section id="sobre" className="py-24 bg-white dark:bg-[#121212] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-brand-blue dark:text-neon-blue text-sm font-bold tracking-[0.2em] uppercase mb-4">A Marca</h2>
            <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
              NÃO ACEITE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-main to-zinc-400 dark:from-white dark:to-zinc-600">
                O MEDÍOCRE
              </span>
            </h3>
            
            <p className="text-text-muted dark:text-zinc-400 text-lg mb-8 font-light leading-relaxed">
              A NEXUSFIT nasceu da obsessão por performance. Não somos apenas uma marca de suplementos, somos um laboratório de resultados. Utilizamos matéria-prima importada e tecnologia de ponta para criar fórmulas que realmente entregam o que prometem.
            </p>

            {/* Social Sharing Buttons */}
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted dark:text-zinc-500">Compartilhe</span>
              <div className="flex items-center gap-3">
                {socials.map((social, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleSocialClick(idx)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    animate={activeSocial === idx ? {
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0px transparent",
                        `0 0 20px ${social.glowColor}`,
                        "0 0 0px transparent"
                      ],
                      borderColor: [
                        "rgba(255,255,255,0.1)",
                        social.glowColor.replace('0.6', '1'),
                        "rgba(255,255,255,0.1)"
                      ]
                    } : {}}
                    transition={activeSocial === idx ? { duration: 0.5 } : { duration: 0.3 }}
                    className={`w-10 h-10 rounded-xl border border-light-border dark:border-white/10 flex items-center justify-center text-text-muted dark:text-zinc-400 transition-all duration-300 bg-light-surface dark:bg-white/5 backdrop-blur-sm ${social.color}`}
                    aria-label={`Compartilhar no ${social.label}`}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {[
                { icon: Zap, title: "Performance Extrema", desc: "Fórmulas concentradas para resultados reais." },
                { icon: ShieldCheck, title: "Qualidade Pura", desc: "Ingredientes testados e certificados em laboratório." },
                { icon: Activity, title: "Saúde em Foco", desc: "Desenvolvido por especialistas em nutrição esportiva." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 dark:bg-neon-blue/10 border border-brand-blue dark:border-neon-blue/20 flex items-center justify-center shrink-0 text-brand-blue dark:text-neon-blue">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xl uppercase tracking-wide mb-1">{item.title}</h4>
                    <p className="text-text-muted text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4 relative"
          >
            <div className="space-y-4 translate-y-8">
              <img 
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop" 
                alt="Gym training" 
                className="w-full h-64 object-cover rounded-2xl transition-all duration-500 animate-image-active"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop" 
                alt="Gym training" 
                className="w-full h-80 object-cover rounded-2xl transition-all duration-500 animate-image-active"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" 
                alt="Gym training" 
                className="w-full h-80 object-cover rounded-2xl transition-all duration-500 animate-image-active"
                referrerPolicy="no-referrer"
              />
              <div className="w-full h-64 bg-light-surface dark:bg-zinc-900 rounded-2xl border border-light-border dark:border-white/5 p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green dark:bg-neon-blue/20 blur-[50px]"></div>
                <span className="text-5xl font-black text-text-main dark:text-white mb-2">100%</span>
                <span className="text-brand-blue dark:text-neon-blue font-bold tracking-widest uppercase text-sm">Transparência</span>
                <p className="text-text-muted text-xs mt-2">Sem misturas proprietárias. Você sabe exatamente o que está tomando.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
