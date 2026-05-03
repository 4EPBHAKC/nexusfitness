import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-light-bg dark:bg-[#0B0B0B] pt-24 pb-8 border-t border-light-border dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-6">
              <Zap className="w-8 h-8 text-brand-blue dark:text-neon-blue" />
              <span className="font-display font-bold text-2xl tracking-wider">
                NEXUS<span className="text-brand-blue dark:text-neon-blue">FIT</span>
              </span>
            </a>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Suplementação de alta performance para atletas que buscam quebrar seus próprios limites. Tecnologia, pureza e resultados.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-text-main dark:text-white font-bold uppercase tracking-widest mb-6">Produtos</h4>
            <ul className="space-y-4">
              {['Whey Protein', 'Pré-Treinos', 'Creatina', 'Vitaminas', 'Acessórios'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-text-muted dark:text-zinc-400 hover:text-brand-blue dark:hover:text-neon-blue text-sm transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-main dark:text-white font-bold uppercase tracking-widest mb-6">Suporte</h4>
            <ul className="space-y-4">
              {['Rastrear Pedido', 'Trocas e Devoluções', 'Dúvidas Frequentes', 'Fale Conosco', 'Política de Privacidade'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-text-muted dark:text-zinc-400 hover:text-brand-blue dark:hover:text-neon-blue text-sm transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-text-main dark:text-white font-bold uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-text-muted text-sm mb-4">Receba ofertas exclusivas e dicas de treino.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-lg px-4 py-3 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors"
              />
              <button className="bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-bold uppercase tracking-widest text-sm py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-white transition-colors">
                Assinar
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-light-border dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs uppercase tracking-wider">
            &copy; {new Date().getFullYear()} NexusFit Supplements. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Pix_logo.svg/1200px-Pix_logo.svg.png" alt="Pix" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}
