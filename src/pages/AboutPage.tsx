import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import AboutComponent from '../components/About';
import SEO from '../components/SEO';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-light-border dark:border-white/5 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold uppercase tracking-tight group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors">
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-blue dark:text-neon-blue' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-text-muted dark:text-zinc-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-24 bg-light-bg dark:bg-[#0B0B0B] min-h-screen">
      <SEO 
        title="Sobre Nós" 
        description="Conheça a história da NexusFit. Nossa missão é fornecer suplementação de elite com transparência total."
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-24">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            alt="Athlete training"
            className="w-full h-full object-cover animate-image-active"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-light-bg dark:from-black/60 dark:via-black/80 dark:to-[#050505]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-text-main dark:text-white"
          >
            Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-600 dark:from-neon-blue dark:to-blue-600">História</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-muted dark:text-zinc-400 max-w-2xl mx-auto font-light"
          >
            Nascemos da insatisfação com o mercado tradicional. Criamos o que nós mesmos queríamos consumir.
          </motion.p>
        </div>
      </section>

      {/* About Component (Reused) */}
      <AboutComponent />

      {/* Mission & Values */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Missão", desc: "Fornecer suplementação de elite com transparência total, impulsionando atletas a quebrarem seus próprios limites." },
            { title: "Visão", desc: "Ser a marca referência em performance e inovação no mercado fitness global." },
            { title: "Valores", desc: "Transparência, Inovação, Qualidade Extrema, Foco no Resultado e Respeito ao Atleta." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white dark:bg-[#121212] p-10 rounded-3xl border border-light-border dark:border-white/5 hover:border-brand-blue dark:hover:border-neon-blue/30 transition-colors"
            >
              <h3 className="text-2xl font-black uppercase tracking-tight text-brand-blue dark:text-neon-blue mb-4">{item.title}</h3>
              <p className="text-text-muted dark:text-zinc-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-24 border-t border-light-border dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Dúvidas <span className="text-brand-blue dark:text-neon-blue">Frequentes</span></h2>
          <p className="text-text-muted dark:text-zinc-400">Tudo o que você precisa saber sobre a NexusFit.</p>
        </div>
        
        <div className="bg-white dark:bg-[#121212] rounded-3xl border border-light-border dark:border-white/5 px-8">
          <FAQItem 
            question="Os produtos são testados em laboratório?" 
            answer="Sim, 100% dos nossos lotes passam por rigorosos testes de pureza e concentração em laboratórios independentes antes de chegarem até você." 
          />
          <FAQItem 
            question="Qual o prazo de entrega?" 
            answer="O prazo médio é de 3 a 7 dias úteis para capitais e até 12 dias úteis para o interior, dependendo da sua região." 
          />
          <FAQItem 
            question="Posso devolver um produto se não gostar?" 
            answer="Sim, oferecemos garantia de satisfação. Se o lacre não estiver rompido, você tem até 7 dias após o recebimento para solicitar a devolução." 
          />
          <FAQItem 
            question="Como posso rastrear meu pedido?" 
            answer="Assim que seu pedido for despachado, você receberá um código de rastreio por e-mail e poderá acompanhá-lo diretamente na sua área de cliente." 
          />
        </div>
      </section>
    </div>
  );
}
