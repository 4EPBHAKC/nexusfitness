import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Rafael Costa",
    role: "Powerlifter",
    content: "O pré-treino Nuclear mudou completamente meus treinos de força. O pump é absurdo e a energia não tem aquele 'crash' no final. Melhor do mercado.",
    image: "https://images.unsplash.com/photo-1583465584740-552d8c83044e?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Amanda Silva",
    role: "Atleta Crossfit",
    content: "A recuperação com o Whey Isolate da NexusFit é notável. Sabor incrível, dissolve fácil e não pesa no estômago. Recomendo de olhos fechados.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Diego Martins",
    role: "Bodybuilder",
    content: "Qualidade que bate de frente com as marcas gringas mais caras. A creatina deles tem laudo e a pureza é sentida na primeira semana de uso.",
    image: "https://images.unsplash.com/photo-1567598508481-65985588e295?q=80&w=200&auto=format&fit=crop"
  }
];

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-light-bg dark:bg-[#0B0B0B] relative border-y border-light-border dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-brand-blue dark:text-neon-blue text-sm font-bold tracking-[0.2em] uppercase mb-4">Aprovado por Atletas</h2>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Quem usa, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-600 dark:from-neon-blue dark:to-blue-600">comprova</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white dark:bg-[#121212] p-8 rounded-2xl border border-light-border dark:border-white/5 relative group hover:border-brand-blue dark:hover:border-neon-blue/30 transition-colors"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-black/5 dark:text-white/5 group-hover:text-brand-blue/10 dark:group-hover:text-neon-blue/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-blue dark:fill-neon-blue text-brand-blue dark:text-neon-blue" />
                ))}
              </div>
              
              <p className="text-text-muted dark:text-zinc-400 mb-8 italic leading-relaxed">
                "{item.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-full object-cover border border-light-border dark:border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h5 className="font-bold text-text-main dark:text-white uppercase tracking-wider text-sm">{item.name}</h5>
                  <span className="text-brand-blue dark:text-neon-blue text-xs font-bold uppercase tracking-widest">{item.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
