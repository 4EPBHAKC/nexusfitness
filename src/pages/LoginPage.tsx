import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        try {
          const response = await fetch('/api/auth/social-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
              provider: session.user.app_metadata.provider || 'social'
            })
          });

          let data;
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await response.json();
          } else {
            return; // Fail silently for background sync
          }

          if (response.ok) {
            login(data.token, data.user);
            navigate('/conta');
          } else {
            setError(data.error || 'Erro ao sincronizar login social.');
          }
        } catch (err) {
          console.error('Social sync error:', err);
        }
      }
    };

    checkSession();
  }, []);

  if (user) return <Navigate to="/conta" replace />;

  const handleSocialLogin = async (provider: 'google' | 'instagram') => {
    setIsSocialLoading(provider);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: window.location.origin + '/login'
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(`Erro ao entrar com ${provider}: ${err.message}`);
      setIsSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Erro inesperado do servidor (${response.status}): ${text.substring(0, 50)}...`);
      }

      if (response.ok) {
        login(data.token, data.user);
        navigate('/conta');
      } else {
        setError(data.error || 'E-mail ou senha incorretos.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-light-bg dark:bg-[#0B0B0B] min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#121212] border border-light-border dark:border-white/5 rounded-3xl p-8 shadow-2xl shadow-black/10 dark:shadow-neon-blue/5"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Acessar Conta</h1>
          <p className="text-text-muted dark:text-zinc-400 text-sm">Bem-vindo de volta, atleta.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={!!isSocialLoading || isLoading}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl text-sm font-bold hover:bg-light-surface dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {isSocialLoading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            )}
            Google
          </button>
          <button
            onClick={() => handleSocialLogin('instagram')}
            disabled={!!isSocialLoading || isLoading}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl text-sm font-bold hover:bg-light-surface dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {isSocialLoading === 'instagram' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <img src="https://www.instagram.com/favicon.ico" alt="Instagram" className="w-4 h-4 shadow-sm" />
            )}
            Instagram
          </button>
        </div>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-light-border dark:border-white/5"></div>
          </div>
          <span className="relative bg-white dark:bg-[#121212] px-4 text-[10px] uppercase font-black tracking-widest text-text-muted">Ou com e-mail</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="E-mail"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Senha"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl py-3 pl-10 pr-12 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors"
            />
            {formData.password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-blue dark:hover:text-neon-blue transition-colors p-1"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-light-border dark:border-white/10 rounded-md bg-transparent peer-checked:bg-brand-blue dark:peer-checked:bg-neon-blue peer-checked:border-brand-blue dark:peer-checked:border-neon-blue transition-all" />
                <svg
                  className="absolute w-3 h-3 text-white dark:text-black left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs font-medium text-text-muted dark:text-zinc-400 group-hover:text-brand-blue dark:group-hover:text-neon-blue transition-colors">
                Lembrar-me por 30 dias
              </span>
            </label>
            
            <Link to="/contato" className="text-xs font-bold text-brand-blue dark:text-neon-blue hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-black uppercase tracking-widest py-4 rounded-xl box-glow hover:box-glow-hover transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>Entrar <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-text-muted dark:text-zinc-400 text-sm">
            Não tem uma conta? <Link to="/cadastro" className="text-brand-blue dark:text-neon-blue font-bold hover:underline">Criar agora</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
