import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Filter, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { products as localProducts, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('categoria') || 'Todos';
  
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<number>(300);
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('Iniciando busca de produtos no Supabase...');
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          console.error('Erro retornado pelo Supabase:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log(`Sucesso! ${data.length} produtos carregados do banco de dados.`);
          // Map snake_case from DB to camelCase in app
          const mappedProducts: Product[] = data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: Number(p.price),
            priceFormatted: p.price_formatted,
            image: p.image,
            tag: p.tag,
            description: p.description,
            benefits: Array.isArray(p.benefits) ? p.benefits : [],
            nutritionalInfo: Array.isArray(p.nutritional_info) ? p.nutritional_info : [],
            reviews: [],
            keyIngredients: Array.isArray(p.key_ingredients) ? p.key_ingredients : [],
            dietaryRestrictions: Array.isArray(p.dietary_restrictions) ? p.dietary_restrictions : []
          }));
          setProducts(mappedProducts);
        } else {
          console.warn('O banco de dados retornou uma lista vazia. Verifique se a tabela "products" tem dados.');
        }
      } catch (err) {
        console.error('Falha crítica ao conectar com Supabase. Usando dados locais de reserva.', err);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    fetchProducts();
  }, []);

  const suggestions = searchQuery.trim().length >= 2 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = ['Todos', 'Whey', 'Pré-treino', 'Creatina', 'Vitaminas', 'Hipercalórico', 'Kits'];

  const allIngredients = Array.from(new Set(products.flatMap(p => p.keyIngredients))).sort();
  const allDietary = Array.from(new Set(products.flatMap(p => p.dietaryRestrictions))).sort();

  const getAverageRating = (product: any) => {
    if (product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    return sum / product.reviews.length;
  };

  // Sync searchQuery with URL with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchQuery) {
        newParams.set('search', searchQuery);
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams, { replace: true });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, setSearchParams]);

  // Sync category with URL
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory !== 'Todos') {
      newParams.set('categoria', selectedCategory);
    } else {
      newParams.delete('categoria');
    }
    setSearchParams(newParams, { replace: true });
  }, [selectedCategory, setSearchParams]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesPrice = product.price <= priceRange;
    const matchesIngredients = selectedIngredients.length === 0 || 
      selectedIngredients.every(ing => product.keyIngredients.includes(ing));
    const matchesDietary = selectedDietary.length === 0 || 
      selectedDietary.every(diet => product.dietaryRestrictions.includes(diet));
    
    return matchesSearch && matchesCategory && matchesPrice && matchesIngredients && matchesDietary;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'rating') {
      return getAverageRating(b) - getAverageRating(a);
    }
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="pt-32 pb-24 bg-light-bg dark:bg-[#0B0B0B] min-h-screen">
      <SEO 
        title="Nossos Produtos" 
        description="Explore nossa linha completa de suplementos de alta performance. Whey Protein, Creatina, Pré-treinos e muito mais."
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-600 dark:from-neon-blue dark:to-blue-600">Produtos</span>
          </h1>
          <p className="text-text-muted dark:text-zinc-400 max-w-2xl mx-auto">
            Encontre o suplemento ideal para o seu objetivo. Qualidade premium e resultados comprovados.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-text-main dark:text-white font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-blue dark:text-neon-blue" /> Filtros
              </h3>
              
              <div ref={searchRef} className="relative mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors"
                  />
                </div>

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#121212] border border-light-border dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {suggestions.map((product) => (
                          <Link
                            key={product.id}
                            to={`/produto/${product.id}`}
                            className="flex items-center gap-3 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors group"
                          >
                            <div className="w-8 h-8 bg-light-surface dark:bg-zinc-900 rounded p-1 flex items-center justify-center shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-text-main dark:text-white truncate group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors">
                                {product.name}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-brand-blue dark:text-neon-blue opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider mb-3">Categorias</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat 
                          ? 'bg-brand-blue/10 dark:bg-neon-blue/10 text-brand-blue dark:text-neon-blue font-bold border border-brand-blue dark:border-neon-blue/30' 
                          : 'text-text-muted dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-main dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider mb-3">Preço Máximo: R$ {priceRange}</h4>
                <input 
                  type="range" 
                  min="0" 
                  max="300" 
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand-blue dark:accent-neon-blue"
                />
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider mb-3">Ordenar por</h4>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-lg py-2 px-3 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors cursor-pointer"
                >
                  <option value="default">Destaques</option>
                  <option value="rating">Melhor Avaliados</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                </select>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider mb-3">Restrições Alimentares</h4>
                <div className="space-y-2">
                  {allDietary.map(diet => (
                    <label key={diet} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedDietary.includes(diet)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDietary(prev => [...prev, diet]);
                            } else {
                              setSelectedDietary(prev => prev.filter(d => d !== diet));
                            }
                          }}
                          className="peer appearance-none w-5 h-5 rounded border border-light-border dark:border-white/10 bg-light-surface dark:bg-[#1A1A1A] checked:bg-brand-blue dark:checked:bg-neon-blue checked:border-brand-blue dark:checked:border-neon-blue transition-all cursor-pointer"
                        />
                        <svg className="absolute w-3 h-3 text-white dark:text-black left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-text-muted dark:text-zinc-400 group-hover:text-text-main dark:group-hover:text-white transition-colors">{diet}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider mb-3">Ingredientes Chave</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {allIngredients.map(ing => (
                    <label key={ing} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIngredients.includes(ing)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIngredients(prev => [...prev, ing]);
                            } else {
                              setSelectedIngredients(prev => prev.filter(i => i !== ing));
                            }
                          }}
                          className="peer appearance-none w-5 h-5 rounded border border-light-border dark:border-white/10 bg-light-surface dark:bg-[#1A1A1A] checked:bg-brand-blue dark:checked:bg-neon-blue checked:border-brand-blue dark:checked:border-neon-blue transition-all cursor-pointer"
                        />
                        <svg className="absolute w-3 h-3 text-white dark:text-black left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-text-muted dark:text-zinc-400 group-hover:text-text-main dark:group-hover:text-white transition-colors">{ing}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product, index) => (
                  <Link key={product.id} to={`/produto/${product.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative bg-white dark:bg-[#121212] border border-light-border dark:border-white/5 hover:border-brand-blue dark:hover:border-neon-blue/30 rounded-2xl overflow-hidden transition-all duration-500 hover:box-glow hover:shadow-2xl dark:hover:shadow-neon-blue/10 h-full flex flex-col"
                    >
                      <div className="relative h-64 overflow-hidden bg-light-surface dark:bg-zinc-900 p-8 flex items-center justify-center shrink-0">
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

                      <div className="p-6 relative z-20 flex flex-col flex-1">
                        <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">{product.category}</p>
                        <h4 className="text-lg font-display font-bold uppercase mb-2 group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors line-clamp-2">{product.name}</h4>
                        
                        <div className="flex items-center gap-1 mb-4">
                          <span className="text-brand-blue dark:text-neon-blue text-xs font-bold">★ {getAverageRating(product).toFixed(1)}</span>
                          <span className="text-text-muted text-xs">({product.reviews.length} avaliações)</span>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-light-border dark:border-white/5">
                          <span className="text-xl font-bold">{product.priceFormatted}</span>
                          <button 
                            className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-main dark:text-white group-hover:bg-brand-blue dark:group-hover:bg-neon-blue group-hover:text-white dark:group-hover:text-black transition-colors"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent navigation when clicking the cart button
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
            ) : (
              <div className="text-center py-20 border border-light-border dark:border-white/5 rounded-2xl bg-white dark:bg-[#121212]">
                <p className="text-text-muted text-lg mb-4">Nenhum suplemento encontrado com estes filtros.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                    setPriceRange(300);
                    setSortBy('default');
                    setSelectedIngredients([]);
                    setSelectedDietary([]);
                  }}
                  className="text-brand-blue dark:text-neon-blue text-sm font-bold uppercase tracking-widest hover:text-text-main dark:text-white transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
