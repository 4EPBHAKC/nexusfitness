import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({ 
  title = "Nexus Supplements | Performance Extrema & Suplementação Premium",
  description = "Nexus Supplements - A marca definitiva para quem busca performance extrema. Whey, Creatina, Pré-treino e muito mais com tecnologia de ponta.",
  keywords = "suplementos, academia, fitness, whey protein, creatina, pré-treino, nexus supplements, musculação, performance",
  image = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
  url = "https://nexus-supplements.com/",
  type = "website"
}: SEOProps) {
  const siteTitle = title.includes("Nexus") ? title : `${title} | Nexus Supplements`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
