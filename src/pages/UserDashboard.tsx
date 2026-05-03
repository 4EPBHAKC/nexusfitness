import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Package, Heart, MapPin, Lock, CheckCircle2, Truck, Clock, ShoppingBag, ArrowRight, Trash2, LogOut, Eye, EyeOff, Edit3, Save, LayoutDashboard, TrendingUp, Wallet, Shield } from 'lucide-react';
import { products } from '../data/products';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import SEO from '../components/SEO';

type Tab = 'overview' | 'profile' | 'orders' | 'favorites';

const mockOrders = [
  {
    id: 'PED-98234',
    date: '10/03/2026',
    total: 'R$ 349,80',
    status: 'Enviado',
    items: [
      { product: products[0], quantity: 1 },
      { product: products[1], quantity: 1 }
    ]
  },
  {
    id: 'PED-87122',
    date: '15/02/2026',
    total: 'R$ 99,90',
    status: 'Entregue',
    items: [
      { product: products[2], quantity: 1 }
    ]
  }
];

const trackingSteps = ['Aprovado', 'Em separação', 'Enviado', 'Entregue'];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const { user, logout } = useAuth();
  const { addItem, setIsCartOpen } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const getStepIndex = (status: string) => trackingSteps.indexOf(status);

  const handleBuyAgain = (orderItems: any[]) => {
    orderItems.forEach(item => {
      // Add the item to cart as many times as specified in the order quantity
      for (let i = 0; i < item.quantity; i++) {
        addItem(item.product);
      }
    });
    setIsCartOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const maskPassword = (pass: string) => {
    if (!pass) return "********";
    if (pass.length === 1) return "*";
    if (pass.length === 2) return pass[0] + "*";
    return pass[0] + "*".repeat(pass.length - 2) + pass[pass.length - 1];
  };

  // Mock password for display purposes
  const displayPassword = "nexuspassword";

  const enableEditMode = () => {
    setIsEditing(true);
    setCurrentPassword("");
    setNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
  };

  const disableEditMode = (save = false) => {
    setIsEditing(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    // In a real app, we would handle the save logic here
  };

  const togglePasswordVisibility = (type: 'current' | 'new') => {
    if (type === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else {
      setShowNewPassword(!showNewPassword);
    }
  };

  if (!user) return null;

  const pendingText = "Informação pendente";

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO title="Minha Conta" description="Gerencie seu perfil, acompanhe seus pedidos e veja seus produtos favoritos na NexusFit." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Minha Conta</h1>
            <p className="text-text-muted dark:text-zinc-400">Olá, <span className="text-brand-blue dark:text-neon-blue font-bold">{user.name}</span>! Gerencie seus pedidos, perfil e produtos favoritos.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-sm hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" /> Sair da Conta
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-[#121212] rounded-2xl border border-light-border dark:border-white/5 p-4 flex flex-col gap-2 sticky top-28">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-brand-blue dark:bg-neon-blue text-white dark:text-black' : 'text-text-muted dark:text-zinc-400 hover:text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                <LayoutDashboard className="w-5 h-5" /> Visão Geral
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-brand-blue dark:bg-neon-blue text-white dark:text-black' : 'text-text-muted dark:text-zinc-400 hover:text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                <User className="w-5 h-5" /> Meu Perfil
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-brand-blue dark:bg-neon-blue text-white dark:text-black' : 'text-text-muted dark:text-zinc-400 hover:text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                <Package className="w-5 h-5" /> Meus Pedidos
              </button>
              <button 
                onClick={() => setActiveTab('favorites')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'favorites' ? 'bg-brand-blue dark:bg-neon-blue text-white dark:text-black' : 'text-text-muted dark:text-zinc-400 hover:text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                <Heart className="w-5 h-5" /> Favoritos
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Pedidos Realizados', value: mockOrders.length, icon: Package, color: 'text-brand-blue dark:text-neon-blue' },
                    { label: 'Produtos Favoritos', value: favorites.length, icon: Heart, color: 'text-red-500' },
                    { label: 'Total Investido', value: 'R$ 449,70', icon: Wallet, color: 'text-brand-green dark:text-neon-blue' }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-light-border dark:border-white/5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-muted dark:text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-black text-text-main dark:text-white">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity & Security */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Order */}
                  <div className="bg-white dark:bg-[#121212] rounded-2xl border border-light-border dark:border-white/5 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold uppercase tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-blue dark:text-neon-blue" /> Último Pedido
                      </h3>
                      <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-brand-blue dark:text-neon-blue uppercase tracking-widest hover:underline">Ver todos</button>
                    </div>
                    <div className="bg-light-surface dark:bg-[#1A1A1A] p-4 rounded-xl border border-light-border dark:border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold">{mockOrders[0].id}</span>
                        <span className="px-3 py-1 bg-brand-blue/10 dark:bg-neon-blue/10 text-brand-blue dark:text-neon-blue text-[10px] font-bold rounded-full uppercase">{mockOrders[0].status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <img src={mockOrders[0].items[0].product.image} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{mockOrders[0].items[0].product.name}</p>
                          <p className="text-xs text-text-muted">{mockOrders[0].date}</p>
                        </div>
                        <p className="font-bold text-sm">{mockOrders[0].total}</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Status */}
                  <div className="bg-white dark:bg-[#121212] rounded-2xl border border-light-border dark:border-white/5 p-6">
                    <h3 className="font-bold uppercase tracking-tight flex items-center gap-2 mb-6">
                      <Shield className="w-5 h-5 text-brand-green dark:text-neon-blue" /> Segurança
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-light-surface dark:bg-[#1A1A1A] rounded-xl border border-light-border dark:border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">E-mail verificado</span>
                        </div>
                        <span className="text-[10px] font-bold text-brand-green uppercase">Ativo</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-light-surface dark:bg-[#1A1A1A] rounded-xl border border-light-border dark:border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium">Autenticação 2FA</span>
                        </div>
                        <button className="text-[10px] font-bold text-brand-blue dark:text-neon-blue uppercase hover:underline">Ativar</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-brand-blue to-blue-600 dark:from-neon-blue dark:to-blue-700 p-8 rounded-2xl text-white dark:text-black flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Pronto para o próximo nível?</h3>
                    <p className="opacity-90 font-medium">Confira as novidades em nossa linha de pré-treinos.</p>
                  </div>
                  <Link to="/produtos" className="bg-white dark:bg-black text-brand-blue dark:text-neon-blue px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-2">
                    Ver Produtos <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#121212] rounded-2xl border border-light-border dark:border-white/5 p-6 md:p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
                    <User className="text-brand-blue dark:text-neon-blue" /> Dados Pessoais
                  </h2>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Nome Completo</label>
                      <input 
                        type="text" 
                        defaultValue={user.name} 
                        disabled={!isEditing}
                        className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">E-mail</label>
                      <input 
                        type="email" 
                        defaultValue={user.email} 
                        disabled={!isEditing}
                        className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Telefone</label>
                      <input 
                        type="tel" 
                        defaultValue={user.phone || pendingText} 
                        disabled={!isEditing}
                        className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-light-border dark:border-white/5">
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
                      <MapPin className="text-brand-blue dark:text-neon-blue w-5 h-5" /> Endereço de Entrega
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Rua</label>
                        <input 
                          type="text" 
                          defaultValue={user.street || pendingText} 
                          disabled={!isEditing}
                          className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Número</label>
                        <input 
                          type="text" 
                          defaultValue={user.number || pendingText} 
                          disabled={!isEditing}
                          className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Bairro</label>
                        <input 
                          type="text" 
                          defaultValue={user.neighborhood || pendingText} 
                          disabled={!isEditing}
                          className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">CEP</label>
                        <input 
                          type="text" 
                          defaultValue={user.cep || pendingText} 
                          disabled={!isEditing}
                          className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Cidade</label>
                        <input 
                          type="text" 
                          defaultValue={user.city || pendingText} 
                          disabled={!isEditing}
                          className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Estado</label>
                        <input 
                          type="text" 
                          defaultValue={user.state || pendingText} 
                          disabled={!isEditing}
                          className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Complemento</label>
                        <input 
                          type="text" 
                          defaultValue={user.complement || pendingText} 
                          disabled={!isEditing}
                          className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-light-border dark:border-white/5">
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
                      <Lock className="text-brand-blue dark:text-neon-blue w-5 h-5" /> Alterar Senha
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Senha Atual</label>
                        <div className="relative">
                          <input 
                            type={isEditing && showCurrentPassword ? "text" : "password"} 
                            value={isEditing ? currentPassword : maskPassword(displayPassword)}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder={isEditing ? "Digite sua senha atual" : ""}
                            disabled={!isEditing}
                            className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed pr-12" 
                          />
                          {isEditing && (
                            <button 
                              type="button"
                              onClick={() => togglePasswordVisibility('current')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-blue dark:hover:text-neon-blue transition-colors"
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider">Nova Senha</label>
                        <div className="relative">
                          <input 
                            type={isEditing && showNewPassword ? "text" : "password"} 
                            value={isEditing ? newPassword : maskPassword(displayPassword)}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={isEditing ? "Digite a nova senha" : ""}
                            disabled={!isEditing}
                            className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed pr-12" 
                          />
                          {isEditing && (
                            <button 
                              type="button"
                              onClick={() => togglePasswordVisibility('new')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-blue dark:hover:text-neon-blue transition-colors"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-wrap justify-end gap-4">
                    {!isEditing ? (
                      <button 
                        type="button"
                        onClick={enableEditMode}
                        className="flex items-center gap-2 text-text-muted dark:text-zinc-400 font-bold uppercase tracking-widest text-sm hover:bg-black/5 dark:hover:bg-white/5 px-6 py-4 rounded-xl transition-all"
                      >
                        <Edit3 className="w-5 h-5" /> Editar Dados
                      </button>
                    ) : (
                      <>
                        <button 
                          type="button"
                          onClick={() => disableEditMode(false)}
                          className="text-text-muted dark:text-zinc-400 font-bold uppercase tracking-widest px-6 py-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={() => disableEditMode(true)}
                          className="bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-bold uppercase tracking-widest px-8 py-4 rounded-xl box-glow hover:box-glow-hover transition-all flex items-center gap-2"
                        >
                          <Save className="w-5 h-5" /> Salvar Alterações
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Package className="text-brand-blue dark:text-neon-blue" /> Histórico de Pedidos
                </h2>

                {mockOrders.map((order) => {
                  const currentStepIndex = getStepIndex(order.status);

                  return (
                    <div key={order.id} className="bg-white dark:bg-[#121212] rounded-2xl border border-light-border dark:border-white/5 p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-light-border dark:border-white/5">
                        <div>
                          <h3 className="text-xl font-bold text-text-main dark:text-white mb-1">Pedido {order.id}</h3>
                          <p className="text-text-muted dark:text-zinc-400 text-sm">Realizado em {order.date}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-text-muted dark:text-zinc-400 text-sm mb-1">Total do Pedido</p>
                          <p className="text-xl font-bold text-brand-blue dark:text-neon-blue">{order.total}</p>
                        </div>
                      </div>

                      {/* Tracking Timeline */}
                      <div className="mb-10">
                        <h4 className="text-sm font-bold text-text-muted dark:text-zinc-400 uppercase tracking-wider mb-6">Status da Entrega</h4>
                        <div className="relative">
                          {/* Progress Line */}
                          <div className="absolute top-4 left-0 w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-blue dark:bg-neon-blue transition-all duration-1000"
                              style={{ width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
                            ></div>
                          </div>
                          
                          {/* Steps */}
                          <div className="relative flex justify-between">
                            {trackingSteps.map((step, idx) => {
                              const isActive = idx <= currentStepIndex;
                              const isLast = idx === trackingSteps.length - 1;
                              return (
                                <div key={step} className="flex flex-col items-center gap-3 z-10">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${isActive ? 'bg-white dark:bg-[#121212] border-brand-blue dark:border-neon-blue text-brand-blue dark:text-neon-blue shadow-[0_0_15px_rgba(31,162,214,0.3)] dark:shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'bg-light-surface dark:bg-[#1A1A1A] border-light-border dark:border-white/10 text-text-muted'}`}>
                                    {idx === 0 && <Clock className="w-4 h-4" />}
                                    {idx === 1 && <Package className="w-4 h-4" />}
                                    {idx === 2 && <Truck className="w-4 h-4" />}
                                    {idx === 3 && <CheckCircle2 className="w-4 h-4" />}
                                  </div>
                                  <span className={`text-xs font-bold uppercase tracking-wider text-center max-w-[80px] ${isActive ? 'text-text-main dark:text-white' : 'text-text-muted'}`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-4 mb-8">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-light-surface dark:bg-[#1A1A1A] p-4 rounded-xl border border-light-border dark:border-white/5">
                            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h4 className="font-bold text-text-main dark:text-white line-clamp-1">{item.product.name}</h4>
                              <p className="text-sm text-text-muted dark:text-zinc-400">Qtd: {item.quantity}</p>
                            </div>
                            <div className="font-bold text-text-main dark:text-white">
                              {item.product.priceFormatted}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleBuyAgain(order.items)}
                          className="flex items-center gap-2 bg-transparent border border-brand-blue dark:border-neon-blue text-brand-blue dark:text-neon-blue font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-brand-blue dark:hover:bg-neon-blue hover:text-white dark:hover:text-black transition-all"
                        >
                          <ShoppingBag className="w-5 h-5" /> Comprar Novamente
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* FAVORITES TAB */}
            {activeTab === 'favorites' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Heart className="text-brand-blue dark:text-neon-blue fill-brand-blue dark:fill-neon-blue" /> Meus Favoritos
                </h2>

                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((product) => (
                      <motion.div 
                        key={product.id} 
                        whileHover={{ y: -5, scale: 1.01 }}
                        className="bg-white dark:bg-[#121212] rounded-2xl border border-light-border dark:border-white/5 overflow-hidden group flex flex-col sm:flex-row transition-all duration-300 hover:shadow-xl dark:hover:shadow-neon-blue/5"
                      >
                        <div className="w-full sm:w-40 h-48 sm:h-auto relative overflow-hidden shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover scale-105 animate-image-active transition-transform duration-700"
                          />
                        </div>
                        <div className="p-6 flex flex-col justify-between flex-1">
                          <div>
                            <span className="text-xs font-bold text-brand-blue dark:text-neon-blue uppercase tracking-wider mb-2 block">{product.category}</span>
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-xl font-black text-text-main dark:text-white mb-4">{product.priceFormatted}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link 
                              to={`/produto/${product.id}`}
                              className="flex-1 bg-brand-blue dark:bg-white text-white dark:text-black text-center text-sm font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-blue-600 dark:hover:bg-neon-blue transition-colors"
                            >
                              Ver Produto
                            </Link>
                            <button 
                              onClick={() => toggleFavorite(product)}
                              className="w-12 h-12 flex items-center justify-center rounded-xl border border-light-border dark:border-white/10 text-text-muted dark:text-zinc-400 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
                              aria-label="Remover dos favoritos"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#121212] rounded-2xl border border-light-border dark:border-white/5 p-12 text-center">
                    <Heart className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Sua lista está vazia</h3>
                    <p className="text-text-muted dark:text-zinc-400 mb-6">Você ainda não salvou nenhum produto nos favoritos.</p>
                    <Link to="/produtos" className="inline-flex items-center gap-2 bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-bold uppercase tracking-widest px-8 py-4 rounded-xl box-glow hover:box-glow-hover transition-all">
                      Explorar Produtos <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
