export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  photo?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  priceFormatted: string;
  image: string;
  tag?: string;
  description: string;
  benefits: string[];
  nutritionalInfo: { label: string; value: string }[];
  reviews: Review[];
  keyIngredients: string[];
  dietaryRestrictions: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Whey Protein Isolate 100%",
    category: "Whey",
    price: 199.90,
    priceFormatted: "R$ 199,90",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop&fm=webp",
    tag: "Mais Vendido",
    description: "Proteína isolada de altíssima pureza, rápida absorção e zero lactose. Ideal para recuperação muscular e ganho de massa magra com o máximo de eficiência.",
    benefits: [
      "27g de proteína por dose",
      "Zero lactose e zero glúten",
      "Rápida absorção",
      "Rico em BCAAs e Glutamina"
    ],
    nutritionalInfo: [
      { label: "Valor Energético", value: "110 kcal" },
      { label: "Proteínas", value: "27g" },
      { label: "Carboidratos", value: "1g" },
      { label: "Gorduras Totais", value: "0g" },
      { label: "Sódio", value: "50mg" }
    ],
    reviews: [
      { id: 1, user: "Carlos M.", rating: 5, comment: "Melhor whey que já tomei. Sabor incrível e dissolve muito fácil. O resultado veio rápido!", date: "10/03/2026", photo: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop" },
      { id: 2, user: "Ana S.", rating: 5, comment: "Não me dá inchaço como os outros. Recomendo muito!", date: "05/03/2026" }
    ],
    keyIngredients: ["Proteína Isolada do Soro do Leite", "BCAA", "Glutamina"],
    dietaryRestrictions: ["Sem Glúten", "Sem Lactose"]
  },
  {
    id: 2,
    name: "Pre-Workout Nuclear",
    category: "Pré-treino",
    price: 149.90,
    priceFormatted: "R$ 149,90",
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=800&auto=format&fit=crop&fm=webp",
    tag: "Lançamento",
    description: "Fórmula explosiva para treinos insanos. Energia extrema, foco a laser e vasodilatação máxima para você quebrar todos os seus recordes.",
    benefits: [
      "Energia extrema e duradoura",
      "Foco mental aprimorado",
      "Pump muscular intenso",
      "Sem efeito 'crash' pós-treino"
    ],
    nutritionalInfo: [
      { label: "Cafeína", value: "400mg" },
      { label: "Beta-Alanina", value: "2000mg" },
      { label: "Taurina", value: "1000mg" },
      { label: "Arginina", value: "1500mg" }
    ],
    reviews: [
      { id: 1, user: "Rafael C.", rating: 5, comment: "O pump é absurdo. Bate rápido e dura o treino todo. Veias saltando!", date: "12/03/2026", photo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop" }
    ],
    keyIngredients: ["Cafeína", "Beta-Alanina", "Taurina", "Arginina"],
    dietaryRestrictions: ["Vegano", "Sem Glúten"]
  },
  {
    id: 3,
    name: "Creatina Monohidratada Pura",
    category: "Creatina",
    price: 99.90,
    priceFormatted: "R$ 99,90",
    image: "https://images.unsplash.com/photo-1622484211148-7146b25e1324?q=80&w=800&auto=format&fit=crop&fm=webp",
    description: "Creatina 100% pura, com laudo de pureza. Aumente sua força, explosão muscular e volume celular de forma comprovada cientificamente.",
    benefits: [
      "Aumento de força explosiva",
      "Maior volume muscular",
      "Melhora na recuperação",
      "100% pura e sem sabor"
    ],
    nutritionalInfo: [
      { label: "Creatina Monohidratada", value: "3000mg" },
      { label: "Carboidratos", value: "0g" },
      { label: "Sódio", value: "0mg" }
    ],
    reviews: [
      { id: 1, user: "Diego M.", rating: 5, comment: "Qualidade que bate de frente com as marcas gringas mais caras.", date: "01/03/2026" }
    ],
    keyIngredients: ["Creatina Monohidratada"],
    dietaryRestrictions: ["Vegano", "Sem Glúten", "Sem Açúcar"]
  },
  {
    id: 4,
    name: "Multivitamínico Elite",
    category: "Vitaminas",
    price: 79.90,
    priceFormatted: "R$ 79,90",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop&fm=webp",
    description: "Complexo vitamínico e mineral de alta absorção formulado especificamente para as necessidades de atletas de alto rendimento.",
    benefits: [
      "Fortalece o sistema imune",
      "Melhora a recuperação",
      "Antioxidante poderoso",
      "100% do VD das principais vitaminas"
    ],
    nutritionalInfo: [
      { label: "Vitamina C", value: "45mg" },
      { label: "Vitamina D", value: "5mcg" },
      { label: "Zinco", value: "7mg" },
      { label: "Magnésio", value: "260mg" }
    ],
    reviews: [
      { id: 1, user: "Juliana F.", rating: 4, comment: "Sinto muito mais disposição no dia a dia.", date: "28/02/2026" }
    ],
    keyIngredients: ["Vitamina C", "Vitamina D", "Zinco", "Magnésio"],
    dietaryRestrictions: ["Sem Glúten"]
  },
  {
    id: 5,
    name: "Hipercalórico Mass Titan",
    category: "Hipercalórico",
    price: 129.90,
    priceFormatted: "R$ 129,90",
    image: "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800&auto=format&fit=crop&fm=webp",
    description: "A fórmula definitiva para ganho de peso e massa muscular. Combinação perfeita de carboidratos complexos e proteínas de alto valor biológico.",
    benefits: [
      "Alto teor calórico",
      "Proteínas de lenta e rápida absorção",
      "Enriquecido com vitaminas",
      "Sabor delicioso"
    ],
    nutritionalInfo: [
      { label: "Valor Energético", value: "600 kcal" },
      { label: "Carboidratos", value: "120g" },
      { label: "Proteínas", value: "30g" },
      { label: "Gorduras Totais", value: "2g" }
    ],
    reviews: [
      { id: 1, user: "Lucas T.", rating: 5, comment: "Ganhei 4kg no primeiro mês. Muito bom!", date: "15/02/2026", photo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop" }
    ],
    keyIngredients: ["Maltodextrina", "Whey Protein", "Albumina"],
    dietaryRestrictions: ["Sem Glúten"]
  },
  {
    id: 6,
    name: "Kit Hipertrofia Máxima",
    category: "Kits",
    price: 399.90,
    priceFormatted: "R$ 399,90",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop&fm=webp",
    tag: "Kit Completo",
    description: "O combo definitivo para quem busca ganho de massa muscular acelerado. Inclui Whey Protein Isolate, Creatina Monohidratada e Pré-Treino Nuclear. Economize 15% comprando o kit.",
    benefits: [
      "Whey Isolate para síntese proteica",
      "Creatina para força e volume",
      "Pré-treino para treinos intensos",
      "Economia de R$ 50,00"
    ],
    nutritionalInfo: [
      { label: "Combo", value: "3 Produtos" },
      { label: "Duração Média", value: "30 dias" }
    ],
    reviews: [
      { id: 1, user: "Marcos V.", rating: 5, comment: "Comprei o kit e o resultado foi absurdo em 2 meses. O pré-treino é o melhor que já usei.", date: "02/03/2026", photo: "https://images.unsplash.com/photo-1583465584740-552d8c83044e?q=80&w=400&auto=format&fit=crop" }
    ],
    keyIngredients: ["Whey Protein Isolate", "Creatina", "Cafeína"],
    dietaryRestrictions: ["Sem Glúten"]
  },
  {
    id: 7,
    name: "Kit Seca Barriga (Emagrecimento)",
    category: "Kits",
    price: 249.90,
    priceFormatted: "R$ 249,90",
    image: "https://images.unsplash.com/photo-1526506114642-54cb358636b5?q=80&w=800&auto=format&fit=crop&fm=webp",
    tag: "Queima de Gordura",
    description: "Acelere seu metabolismo e queime gordura com eficiência. O kit inclui Termogênico Inferno Black e L-Carnitina líquida de rápida absorção.",
    benefits: [
      "Acelera o metabolismo basal",
      "Usa a gordura como fonte de energia",
      "Reduz a retenção de líquidos",
      "Aumenta a disposição para o cardio"
    ],
    nutritionalInfo: [
      { label: "Combo", value: "2 Produtos" },
      { label: "Duração Média", value: "30 dias" }
    ],
    reviews: [
      { id: 1, user: "Camila R.", rating: 5, comment: "Secou muito! O termogênico dá um suador no cardio que é impressionante.", date: "20/02/2026" }
    ],
    keyIngredients: ["L-Carnitina", "Cafeína", "Extrato de Chá Verde"],
    dietaryRestrictions: ["Vegano", "Sem Glúten"]
  }
];
