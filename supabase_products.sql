-- Execute este comando no SQL Editor do seu projeto Supabase para criar a tabela de produtos

CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    price_formatted TEXT NOT NULL,
    image TEXT NOT NULL,
    tag TEXT,
    description TEXT NOT NULL,
    benefits JSONB DEFAULT '[]'::JSONB,
    nutritional_info JSONB DEFAULT '[]'::JSONB,
    key_ingredients JSONB DEFAULT '[]'::JSONB,
    dietary_restrictions JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura pública
CREATE POLICY "Produtos são visíveis para todos" 
ON public.products FOR SELECT 
USING (true);

-- Inserir produtos iniciais (exemplo)
INSERT INTO public.products (
    name, category, price, price_formatted, image, tag, description, 
    benefits, nutritional_info, key_ingredients, dietary_restrictions
) VALUES 
(
    'Whey Protein Isolate 100%', 
    'Whey', 
    199.90, 
    'R$ 199,90', 
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop&fm=webp', 
    'Mais Vendido', 
    'Proteína isolada de altíssima pureza, rápida absorção e zero lactose.',
    '["27g de proteína por dose", "Zero lactose e zero glúten"]'::jsonb,
    '[{"label": "Proteínas", "value": "27g"}]'::jsonb,
    '["Proteína Isolada"]'::jsonb,
    '["Sem Lactose"]'::jsonb
);
