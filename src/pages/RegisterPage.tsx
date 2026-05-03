import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Lock, MapPin, Phone, ArrowRight, Loader2, Home, Hash, Map, Navigation, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [addressData, setAddressData] = useState({
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    complement: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, user, token } = useAuth();

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
            return; // Silently skip social sync if failed
          }

          if (response.ok) {
            login(data.token, data.user);
            // If user doesn't have an address, stay on registration to complete step 2
            if (!data.user.cep) {
              setStep(2);
            } else {
              navigate('/conta');
            }
          }
        } catch (err) {
          console.error('Social sync error:', err);
        }
      }
    };

    checkSession();
  }, []);

  if (user && user.cep) return <Navigate to="/conta" replace />;

  const handleSocialLogin = async (provider: 'google' | 'instagram') => {
    setIsSocialLoading(provider);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: window.location.origin + '/cadastro'
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(`Erro ao entrar com ${provider}: ${err.message}`);
      setIsSocialLoading(null);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const newFieldErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newFieldErrors.name = 'Nome é obrigatório.';
    if (!formData.email.trim()) newFieldErrors.email = 'E-mail é obrigatório.';
    if (formData.password.length < 6) {
      newFieldErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (!formData.phone.trim()) newFieldErrors.phone = 'Telefone é obrigatório.';
    
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
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
        throw new Error(`Erro inesperado (${response.status}): ${text.substring(0, 50)}...`);
      }

      if (response.ok) {
        login(data.token, data.user);
        setStep(2);
      } else {
        setError(data.error || 'Erro ao realizar cadastro.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const newFieldErrors: Record<string, string> = {};

    if (!addressData.cep.trim()) {
      newFieldErrors.cep = 'CEP é obrigatório.';
    } else {
      const cepRegex = /^\d{5}-?\d{3}$/;
      if (!cepRegex.test(addressData.cep)) {
        newFieldErrors.cep = 'Formato de CEP inválido. Use XXXXX-XXX ou XXXXXXXX.';
      }
    }

    if (!addressData.street.trim()) newFieldErrors.street = 'Rua é obrigatória.';
    if (!addressData.number.trim()) newFieldErrors.number = 'Nº é obrigatório.';
    if (!addressData.neighborhood.trim()) newFieldErrors.neighborhood = 'Bairro é obrigatório.';
    if (!addressData.city.trim()) newFieldErrors.city = 'Cidade é obrigatória.';
    if (!addressData.state.trim()) newFieldErrors.state = 'Estado é obrigatório.';

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsLoading(true);

    if (!token) {
      setError('Sessão não encontrada. Por favor, tente novamente.');
      setIsLoading(false);
      return;
    }

      try {
        const response = await fetch('/api/auth/update-address', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(addressData)
        });

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(`Erro inesperado (${response.status}): ${text.substring(0, 50)}...`);
        }

        if (response.ok) {
        login(token!, data.user);
        navigate('/conta');
      } else {
        setError(data.error || 'Erro ao salvar endereço.');
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
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
            {step === 1 ? 'Criar Conta' : 'Endereço'}
          </h1>
          <p className="text-text-muted dark:text-zinc-400 text-sm">
            {step === 1 ? 'Etapa 1 de 2: Dados Pessoais' : 'Etapa 2 de 2: Onde entregamos?'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
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

              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-light-border dark:border-white/5"></div>
                </div>
                <span className="relative bg-white dark:bg-[#121212] px-4 text-[10px] uppercase font-black tracking-widest text-text-muted">Ou preencha seus dados</span>
              </div>

              <form 
                onSubmit={handleStep1Submit} 
                className="space-y-4"
              >
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                    }}
                    className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.name ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.email ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                    }}
                    className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.password ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-12 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
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
                {fieldErrors.password && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                    }}
                    className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.phone ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-black uppercase tracking-widest py-4 rounded-xl box-glow hover:box-glow-hover transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>Próximo Passo <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleStep2Submit} 
              className="space-y-4"
            >
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="CEP"
                    required
                    value={addressData.cep}
                    onChange={(e) => {
                      setAddressData({ ...addressData, cep: e.target.value });
                      if (fieldErrors.cep) setFieldErrors({ ...fieldErrors, cep: '' });
                    }}
                    className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.cep ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
                  />
                </div>
                {fieldErrors.cep && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                    {fieldErrors.cep}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Rua"
                      value={addressData.street}
                      onChange={(e) => {
                        setAddressData({ ...addressData, street: e.target.value });
                        if (fieldErrors.street) setFieldErrors({ ...fieldErrors, street: '' });
                      }}
                      className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.street ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
                    />
                  </div>
                  {fieldErrors.street && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                      {fieldErrors.street}
                    </p>
                  )}
                </div>
                <div>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Nº"
                      value={addressData.number}
                      onChange={(e) => {
                        setAddressData({ ...addressData, number: e.target.value });
                        if (fieldErrors.number) setFieldErrors({ ...fieldErrors, number: '' });
                      }}
                      className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.number ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
                    />
                  </div>
                  {fieldErrors.number && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                      {fieldErrors.number}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={addressData.neighborhood}
                    onChange={(e) => {
                      setAddressData({ ...addressData, neighborhood: e.target.value });
                      if (fieldErrors.neighborhood) setFieldErrors({ ...fieldErrors, neighborhood: '' });
                    }}
                    className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.neighborhood ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
                  />
                </div>
                {fieldErrors.neighborhood && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                    {fieldErrors.neighborhood}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={addressData.city}
                      onChange={(e) => {
                        setAddressData({ ...addressData, city: e.target.value });
                        if (fieldErrors.city) setFieldErrors({ ...fieldErrors, city: '' });
                      }}
                      className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.city ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
                    />
                  </div>
                  {fieldErrors.city && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Estado"
                      value={addressData.state}
                      onChange={(e) => {
                        setAddressData({ ...addressData, state: e.target.value });
                        if (fieldErrors.state) setFieldErrors({ ...fieldErrors, state: '' });
                      }}
                      className={`w-full bg-light-surface dark:bg-[#1A1A1A] border ${fieldErrors.state ? 'border-red-500' : 'border-light-border dark:border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors`}
                    />
                  </div>
                  {fieldErrors.state && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">
                      {fieldErrors.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Complemento (Opcional)"
                  value={addressData.complement}
                  onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
                  className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-black uppercase tracking-widest py-4 rounded-xl box-glow hover:box-glow-hover transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>Finalizar Cadastro <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-text-muted dark:text-zinc-400 text-sm">
            Já tem uma conta? <Link to="/login" className="text-brand-blue dark:text-neon-blue font-bold hover:underline">Fazer Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
