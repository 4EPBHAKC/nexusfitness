import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Star, CheckCircle2, ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { products as localProducts, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const initialProduct = localProducts.find(p => p.id === Number(id));
  const [product, setProduct] = useState<Product | undefined>(initialProduct);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        console.log(`Buscando detalhes do produto ID ${id} no Supabase...`);
        const { data, error: sbError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (sbError) {
          console.error('Erro ao buscar no Supabase:', sbError);
          throw sbError;
        }
        
        if (data) {
          console.log('Dados do produto recuperados do Supabase:', data.name);
          const mappedProduct: Product = {
            id: data.id,
            name: data.name,
            category: data.category,
            price: Number(data.price),
            priceFormatted: data.price_formatted,
            image: data.image,
            tag: data.tag,
            description: data.description,
            benefits: Array.isArray(data.benefits) ? data.benefits : [],
            nutritionalInfo: Array.isArray(data.nutritional_info) ? data.nutritional_info : [],
            reviews: [],
            keyIngredients: Array.isArray(data.key_ingredients) ? data.key_ingredients : [],
            dietaryRestrictions: Array.isArray(data.dietary_restrictions) ? data.dietary_restrictions : []
          };
          setProduct(mappedProduct);
        }
      } catch (err) {
        console.error('Erro ao carregar produto do Supabase, mantendo dados locais se disponíveis.', err);
        // Fallback already set via initialProduct
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-light-bg dark:bg-[#0B0B0B]">
        <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center">
        <SEO title="Produto não encontrado" />
        <h1 className="text-4xl font-black mb-4">Produto não encontrado</h1>
        <Link to="/produtos" className="text-brand-blue dark:text-neon-blue hover:text-text-main dark:text-white transition-colors">Voltar para produtos</Link>
      </div>
    );
  }

  const getAverageRating = (product: any) => {
    if (product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    return sum / product.reviews.length;
  };

  const avgRating = getAverageRating(product);
  const relatedProducts = localProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-24 pb-24 bg-light-bg dark:bg-[#0B0B0B] min-h-screen">
      <SEO 
        title={product.name} 
        description={product.description}
        image={product.image}
      />
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/produtos" className="inline-flex items-center gap-2 text-text-muted dark:text-zinc-400 hover:text-brand-blue dark:hover:text-neon-blue transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-[500px] lg:h-[700px] bg-light-surface dark:bg-zinc-900 rounded-3xl overflow-hidden border border-light-border dark:border-white/5 flex items-center justify-center p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.1)_0%,transparent_60%)]"></div>
            {product.tag && (
              <span className="absolute top-6 left-6 z-20 bg-brand-green dark:bg-neon-blue text-white dark:text-black text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                {product.tag}
              </span>
            )}
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover relative z-10 animate-image-active"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <span className="text-brand-blue dark:text-neon-blue text-sm font-bold tracking-[0.2em] uppercase mb-4">{product.category}</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-brand-blue dark:fill-neon-blue text-brand-blue dark:text-neon-blue' : 'text-text-muted'}`} />
                ))}
              </div>
              <span className="text-text-muted dark:text-zinc-400 text-sm">({product.reviews.length} avaliações)</span>
            </div>

            <p className="text-text-muted dark:text-zinc-400 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="text-4xl font-bold mb-8">{product.priceFormatted}</div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => addItem(product)}
                className="flex-1 bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-display font-bold text-lg uppercase tracking-widest py-4 rounded-xl box-glow hover:box-glow-hover transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> Adicionar ao Carrinho
              </button>
              <button 
                onClick={() => toggleFavorite(product)}
                className={`w-full sm:w-16 h-16 flex items-center justify-center rounded-xl border transition-all ${
                  isFavorite(product.id) 
                    ? 'bg-red-500/10 border-red-500 text-red-500' 
                    : 'border-light-border dark:border-white/10 text-text-muted dark:text-zinc-400 hover:text-red-500 hover:border-red-500/50'
                }`}
                aria-label={isFavorite(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart className={`w-6 h-6 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Benefits */}
            <div className="mb-12">
              <h3 className="text-text-main dark:text-white font-bold uppercase tracking-widest mb-6">Benefícios</h3>
              <ul className="space-y-3">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-text-muted dark:text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue dark:text-neon-blue shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Ingredients & Dietary Restrictions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-text-main dark:text-white font-bold uppercase tracking-widest mb-4">Ingredientes Chave</h3>
                <div className="flex flex-wrap gap-2">
                  {product.keyIngredients.map((ing, idx) => (
                    <span key={idx} className="px-3 py-1 bg-light-surface dark:bg-white/5 border border-light-border dark:border-white/10 rounded-full text-xs text-text-muted dark:text-zinc-300">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-text-main dark:text-white font-bold uppercase tracking-widest mb-4">Restrições</h3>
                <div className="flex flex-wrap gap-2">
                  {product.dietaryRestrictions.map((diet, idx) => (
                    <span key={idx} className="px-3 py-1 bg-brand-blue/10 dark:bg-neon-blue/10 border border-brand-blue/20 dark:border-neon-blue/20 rounded-full text-xs text-brand-blue dark:text-neon-blue font-bold">
                      {diet}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Nutritional Info */}
            <div className="bg-white dark:bg-[#121212] border border-light-border dark:border-white/5 rounded-2xl p-6">
              <h3 className="text-text-main dark:text-white font-bold uppercase tracking-widest mb-6">Informação Nutricional</h3>
              <div className="space-y-3">
                {product.nutritionalInfo.map((info, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-light-border dark:border-white/5 last:border-0">
                    <span className="text-text-muted dark:text-zinc-400">{info.label}</span>
                    <span className="font-bold text-text-main dark:text-white">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mb-24">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Avaliações dos Clientes</h2>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < Math.round(avgRating) ? 'fill-brand-blue dark:fill-neon-blue text-brand-blue dark:text-neon-blue' : 'text-text-muted'}`} />
                  ))}
                </div>
                <span className="text-2xl font-bold">{avgRating.toFixed(1)} de 5</span>
              </div>
              <p className="text-text-muted dark:text-zinc-400 mt-2">Baseado em {product.reviews.length} avaliações</p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 max-w-md w-full space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = product.reviews.filter(r => r.rating === star).length;
                const percentage = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-4">
                    <span className="text-sm font-bold w-12 shrink-0">{star} estrelas</span>
                    <div className="flex-1 h-2 bg-light-surface dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-brand-blue dark:bg-neon-blue"
                      />
                    </div>
                    <span className="text-sm text-text-muted w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.reviews.map(review => (
              <div key={review.id} className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-light-border dark:border-white/5 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white mb-1">{review.user}</h4>
                    <span className="text-xs text-text-muted">{review.date}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-brand-blue dark:fill-neon-blue text-brand-blue dark:text-neon-blue' : 'text-text-muted'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-text-muted dark:text-zinc-400 text-sm leading-relaxed flex-1">"{review.comment}"</p>
                
                {review.photo && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-light-border dark:border-white/10 h-32 w-32 relative group cursor-pointer">
                    <img 
                      src={review.photo} 
                      alt={`Foto de ${review.user}`} 
                      className="w-full h-full object-cover scale-105 animate-image-active transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase tracking-wider">Ver Foto</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, index) => (
                <Link key={p.id} to={`/produto/${p.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-white dark:bg-[#121212] border border-light-border dark:border-white/5 hover:border-brand-blue dark:hover:border-neon-blue/30 rounded-2xl overflow-hidden transition-all duration-500 hover:box-glow hover:shadow-2xl dark:hover:shadow-neon-blue/10 h-full flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden bg-light-surface dark:bg-zinc-900 p-8 flex items-center justify-center shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent z-10"></div>
                      <img 
                        src={p.image} 
                        alt={p.name}
                        className="w-full h-full object-cover transition-all duration-700 scale-105 animate-image-active"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6 relative z-20 flex flex-col flex-1">
                      <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">{p.category}</p>
                      <h4 className="text-lg font-display font-bold uppercase mb-4 group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors line-clamp-2">{p.name}</h4>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-lg font-bold">{p.priceFormatted}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
