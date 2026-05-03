import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, ShoppingBag } from 'lucide-react';
import { products } from '../data/products';
import { Link } from 'react-router-dom';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  product?: typeof products[0];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Fala, monstro! Para eu te recomendar o suplemento ideal, me diz: Qual seu objetivo principal?',
      options: ['Ganhar massa', 'Emagrecer', 'Melhorar desempenho']
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleOptionClick = (option: string, currentStep: number) => {
    // Add user message
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: option }]);
    
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    // Remove options from previous message to clean up UI
    setMessages(prev => prev.map(msg => msg.options ? { ...msg, options: undefined } : msg));

    // Simulate bot typing and response
    setTimeout(() => {
      if (currentStep === 0) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'bot',
          text: 'Boa! E como tá o seu nível de treino?',
          options: ['Iniciante', 'Intermediário', 'Avançado']
        }]);
        setStep(1);
      } else if (currentStep === 1) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'bot',
          text: 'Entendi. E qual tipo de suplemento você prefere focar agora?',
          options: ['Proteína (Whey/Barra)', 'Pré-treino', 'Creatina']
        }]);
        setStep(2);
      } else if (currentStep === 2) {
        // Recommend product based on answers
        const obj = newAnswers[0];
        const type = newAnswers[2];
        let recommendedProduct = products[0]; // Default Whey Isolate

        if (obj === 'Emagrecer') {
          recommendedProduct = products.find(p => p.category === 'Emagrecimento') || products[3];
        } else if (type === 'Pré-treino' || obj === 'Melhorar desempenho') {
          recommendedProduct = products.find(p => p.category === 'Pré-Treino') || products[2];
        } else if (type === 'Creatina') {
          recommendedProduct = products.find(p => p.name.toLowerCase().includes('creatina')) || products[1];
        }

        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'bot',
          text: 'Análise concluída! 🔥 Baseado no seu perfil, essa é a melhor escolha para acelerar seus resultados:',
          product: recommendedProduct
        }]);
        setStep(3); // Done
      }
    }, 800);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMsg: Message = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    
    // Remove options from previous message if user typed instead
    setMessages(prev => prev.map(msg => msg.options ? { ...msg, options: undefined } : msg));

    // Simulate bot typing and response (Fallback for typed messages)
    setTimeout(() => {
      let botReply = '';
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes("creatina")) {
        botReply = "A creatina deve ser tomada todos os dias (mesmo sem treinar), cerca de 3g a 5g por dia. Pode misturar com água ou junto com seu Whey. O importante é a constância!";
      } else if (lowerText.includes("whey")) {
        botReply = "Depende do seu objetivo! O Whey Isolate é perfeito para quem quer rápida absorção e zero lactose (ideal pós-treino). Se você quer substituir refeições ou ganhar peso, o Hipercalórico Mass Titan é a melhor pedida.";
      } else if (lowerText.includes("hipertrofia") || lowerText.includes("massa")) {
        botReply = "Para hipertrofia máxima, recomendo nosso 'Kit Hipertrofia Máxima'. Ele vem com Whey Isolate (construção muscular), Creatina (força e volume) e Pré-Treino (intensidade). Dá uma olhada na aba de Kits!";
      } else if (lowerText.includes("emagrecer") || lowerText.includes("secar") || lowerText.includes("gordura")) {
        botReply = "Para queima de gordura, o 'Kit Seca Barriga' é o ideal. Ele combina nosso Termogênico com L-Carnitina para acelerar o metabolismo. Lembre-se que a dieta é fundamental!";
      } else {
        botReply = "Boa pergunta! Nossa equipe de especialistas pode te ajudar melhor. Chama a gente no WhatsApp: (11) 99999-9999.";
      }

      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: botReply }]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-green dark:bg-neon-blue text-white dark:text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,200,83,0.4)] dark:shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] h-[550px] bg-white dark:bg-[#121212] border border-light-border dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-light-surface dark:bg-[#1A1A1A] border-b border-light-border dark:border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 dark:bg-neon-blue/20 flex items-center justify-center text-brand-blue dark:text-neon-blue">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white text-sm">NexusBot</h4>
                  <span className="text-[10px] text-brand-blue dark:text-neon-blue uppercase tracking-wider font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green dark:bg-neon-blue animate-pulse"></span> Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-muted dark:text-zinc-400 hover:text-text-main dark:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} mb-4`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-brand-blue dark:bg-neon-blue text-white dark:text-black rounded-tr-sm' 
                      : 'bg-light-surface dark:bg-[#222222] text-text-main dark:text-zinc-300 border border-light-border dark:border-white/5 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Render Options */}
                  {msg.options && (
                    <div className="flex flex-col gap-2 mt-3 w-full max-w-[85%]">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(opt, step)}
                          className="w-full text-left px-4 py-2.5 rounded-xl border border-brand-blue dark:border-neon-blue/30 text-brand-blue dark:text-neon-blue text-sm font-bold hover:bg-brand-blue dark:hover:bg-neon-blue hover:text-white dark:hover:text-black transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Product Recommendation */}
                  {msg.product && (
                    <div className="mt-3 w-full max-w-[85%] bg-white dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl overflow-hidden shadow-lg">
                      <div className="h-32 relative overflow-hidden">
                        <img src={msg.product.image} alt={msg.product.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] to-transparent"></div>
                      </div>
                      <div className="p-4 pt-2">
                        <span className="text-[10px] font-bold text-brand-blue dark:text-neon-blue uppercase tracking-wider mb-1 block">Recomendado</span>
                        <h5 className="font-bold text-text-main dark:text-white text-sm line-clamp-2 mb-2">{msg.product.name}</h5>
                        <p className="text-xl font-black text-text-main dark:text-white mb-4">{msg.product.priceFormatted}</p>
                        <Link 
                          to={`/produto/${msg.product.id}`}
                          onClick={() => setIsOpen(false)}
                          className="w-full flex items-center justify-center gap-2 bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-bold uppercase tracking-wider text-xs py-3 rounded-lg hover:shadow-[0_0_15px_rgba(31,162,214,0.4)] dark:hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
                        >
                          <ShoppingBag className="w-4 h-4" /> Comprar Agora
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-light-surface dark:bg-[#1A1A1A] border-t border-light-border dark:border-white/5 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Digite sua dúvida..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-white dark:bg-[#222222] border border-light-border dark:border-white/10 rounded-full px-4 py-2 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors"
              />
              <button 
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-full bg-brand-blue dark:bg-neon-blue text-white dark:text-black flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
