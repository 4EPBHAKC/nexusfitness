import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Products from '../components/Products';
import Benefits from '../components/Benefits';
import Testimonials from '../components/Testimonials';
import InstagramFeed from '../components/InstagramFeed';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <div className="pt-0">
      <SEO />
      <Hero />
      <div id="categorias">
        <Categories />
      </div>
      <div id="produtos">
        <Products limit={4} title="Mais Vendidos" />
      </div>
      <div id="beneficios">
        <Benefits />
      </div>
      <Testimonials />
      <InstagramFeed />
    </div>
  );
}
