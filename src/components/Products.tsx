import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products as localProducts, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

interface ProductsProps {
  limit?: number;
  title?: string;
}

export default function Products({ limit, title = "Suplementos Premium" }: ProductsProps) {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('Buscando produtos do Supabase para o componente Products...');
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log('Produtos carregados do Supabase com sucesso:', data.length);
          const mappedProducts: Product[] = data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: Number(p.price),
            priceFormatted: p.price_formatted,
            image: p.image,
            tag: p.tag,
            description: p.description,
            benefits: p.benefits || [],
            nutritionalInfo: p.nutritional_info || [],
            reviews: [],
            keyIngredients: p.key_ingredients || [],
            dietaryRestrictions: p.dietary_restrictions || []
          }));
          setProducts(mappedProducts);
        } else {
          console.warn('Supabase retornou 0 produtos, usando fallback local.');
        }
      } catch (err) {
        console.error('Erro ao buscar produtos do Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const displayProducts = limit ? products.slice(0, limit) : products;

  if (isLoading && products === localProducts) {
    // Show skeleton or loader if you want, but local fallback is fine for instant UI
  }

  return (
    <section id="produtos" className="py-24 bg-light-bg dark:bg-[#0B0B0B] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-brand-blue dark:text-neon-blue text-sm font-bold tracking-[0.2em] uppercase mb-2">Nossa Linha</h2>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
              {title.split(' ').map((word, i) => (
                <span key={i}>
                  {word} {i === 0 && <br />}
                </span>
              ))}
            </h3>
          </div>
          
          <Link to="/produtos" className="text-sm font-bold uppercase tracking-widest border-b border-brand-blue dark:border-neon-blue text-text-muted dark:text-zinc-300 hover:text-brand-blue dark:hover:text-neon-blue transition-colors pb-1 flex items-center gap-2">
            Ver todos os produtos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product, index) => (
              <Link key={product.id} to={`/produto/${product.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative bg-white dark:bg-[#121212] border border-light-border dark:border-white/5 hover:border-brand-blue dark:hover:border-neon-blue/30 rounded-2xl overflow-hidden transition-all duration-500 hover:box-glow hover:shadow-2xl dark:hover:shadow-neon-blue/10 h-full flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden bg-light-surface dark:bg-zinc-900 p-8 flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent z-10"></div>
                    {product.tag && (
                      <span className="absolute top-4 left-4 z-20 bg-brand-green dark:bg-neon-blue text-white dark:text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {product.tag}
                      </span>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 scale-105 animate-image-active"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 relative z-20 flex flex-col flex-1">
                    <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">{product.category}</p>
                    <h4 className="text-xl font-display font-bold uppercase mb-4 group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors line-clamp-2">{product.name}</h4>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold">{product.priceFormatted}</span>
                      <button 
                        className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-main dark:text-white group-hover:bg-brand-blue dark:group-hover:bg-neon-blue group-hover:text-white dark:group-hover:text-black transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          addItem(product);
                        }}
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
