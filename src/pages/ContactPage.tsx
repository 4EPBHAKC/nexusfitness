import { useState, FormEvent, ChangeEvent, FocusEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Youtube, Twitter, Loader2, CheckCircle2, AlertCircle, Check } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Dúvida sobre produto',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Nome é obrigatório';
      else if (value.trim().length < 3) error = 'Mínimo 3 caracteres';
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = 'E-mail é obrigatório';
      else if (!emailRegex.test(value)) error = 'E-mail inválido';
    }
    if (name === 'message') {
      if (!value.trim()) error = 'Mensagem é obrigatória';
      else if (value.trim().length < 10) error = 'Mínimo 10 caracteres';
    }
    return error;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (!validateForm()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: 'Dúvida sobre produto',
        message: ''
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      setErrors({ form: 'Erro ao enviar mensagem. Tente novamente mais tarde.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const getInputStatus = (name: string) => {
    if (!touched[name]) return 'default';
    return errors[name] ? 'error' : 'success';
  };

  return (
    <div className="pt-32 pb-24 bg-light-bg dark:bg-[#0B0B0B] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-text-main dark:text-white"
          >
            Fale <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-600 dark:from-neon-blue dark:to-blue-600">Conosco</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-muted dark:text-zinc-400 max-w-2xl mx-auto"
          >
            Dúvidas sobre produtos, parcerias ou suporte? Nossa equipe está pronta para te atender.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Informações de Contato</h3>
              <div className="space-y-6">
                {[
                  { icon: Phone, label: 'WhatsApp / Telefone', value: '+55 (11) 99999-9999' },
                  { icon: Mail, label: 'E-mail', value: 'contato@nexusfit.com.br' },
                  { icon: MapPin, label: 'Endereço', value: 'Av. Paulista, 1000 - São Paulo, SP' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 dark:bg-neon-blue/10 border border-brand-blue/20 dark:border-neon-blue/20 flex items-center justify-center text-brand-blue dark:text-neon-blue shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-text-muted text-[10px] uppercase tracking-widest font-black mb-1">{item.label}</p>
                      <p className="text-text-main dark:text-white text-lg font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Redes Sociais</h3>
              <div className="flex gap-4">
                {[Instagram, Youtube, Twitter].map((Icon, idx) => (
                  <motion.a 
                    key={idx} 
                    href="#" 
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 flex items-center justify-center text-text-muted dark:text-zinc-400 hover:text-brand-blue dark:hover:text-neon-blue hover:border-brand-blue dark:hover:border-neon-blue/50 transition-all shadow-sm"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white dark:bg-[#121212] p-8 md:p-12 rounded-[2rem] border border-light-border dark:border-white/5 shadow-2xl relative overflow-hidden ${shake ? 'animate-shake' : ''}`}
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Mensagem Enviada!</h3>
                  <p className="text-text-muted dark:text-zinc-400 mb-8">
                    Obrigado pelo contato. Nossa equipe analisará sua mensagem e responderá em até 24 horas úteis.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-bold uppercase tracking-widest px-8 py-3 rounded-xl hover:scale-105 transition-transform"
                  >
                    Enviar outra mensagem
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Envie uma Mensagem</h3>
                  
                  {errors.form && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5" />
                      <p className="text-sm font-bold">{errors.form}</p>
                    </div>
                  )}

                  <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Nome Completo</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full bg-light-surface dark:bg-[#1A1A1A] border rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none transition-all ${
                              getInputStatus('name') === 'error' ? 'border-red-500 ring-1 ring-red-500/20' : 
                              getInputStatus('name') === 'success' ? 'border-green-500/50' : 
                              'border-light-border dark:border-white/10 focus:border-brand-blue dark:focus:border-neon-blue'
                            }`} 
                            placeholder="Seu nome" 
                          />
                          {getInputStatus('name') === 'success' && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                          {getInputStatus('name') === 'error' && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
                        </div>
                        <AnimatePresence>
                          {touched.name && errors.name && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider flex items-center gap-1"
                            >
                              <AlertCircle className="w-3 h-3" /> {errors.name}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="relative">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">E-mail</label>
                        <div className="relative">
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full bg-light-surface dark:bg-[#1A1A1A] border rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none transition-all ${
                              getInputStatus('email') === 'error' ? 'border-red-500 ring-1 ring-red-500/20' : 
                              getInputStatus('email') === 'success' ? 'border-green-500/50' : 
                              'border-light-border dark:border-white/10 focus:border-brand-blue dark:focus:border-neon-blue'
                            }`} 
                            placeholder="seu@email.com" 
                          />
                          {getInputStatus('email') === 'success' && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                          {getInputStatus('email') === 'error' && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
                        </div>
                        <AnimatePresence>
                          {touched.email && errors.email && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider flex items-center gap-1"
                            >
                              <AlertCircle className="w-3 h-3" /> {errors.email}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Assunto</label>
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-light-surface dark:bg-[#1A1A1A] border border-light-border dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-neon-blue transition-colors appearance-none cursor-pointer"
                      >
                        <option value="Dúvida sobre produto">Dúvida sobre produto</option>
                        <option value="Problema com pedido">Problema com pedido</option>
                        <option value="Parceria / Patrocínio">Parceria / Patrocínio</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">Mensagem</label>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${formData.message.length >= 10 ? 'text-green-500' : 'text-text-muted'}`}>
                          {formData.message.length}/10 min
                        </span>
                      </div>
                      <div className="relative">
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          rows={5} 
                          className={`w-full bg-light-surface dark:bg-[#1A1A1A] border rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none transition-all resize-none ${
                            getInputStatus('message') === 'error' ? 'border-red-500 ring-1 ring-red-500/20' : 
                            getInputStatus('message') === 'success' ? 'border-green-500/50' : 
                            'border-light-border dark:border-white/10 focus:border-brand-blue dark:focus:border-neon-blue'
                          }`} 
                          placeholder="Como podemos ajudar?"
                        ></textarea>
                        {getInputStatus('message') === 'success' && <Check className="absolute right-4 top-4 w-4 h-4 text-green-500" />}
                        {getInputStatus('message') === 'error' && <AlertCircle className="absolute right-4 top-4 w-4 h-4 text-red-500" />}
                      </div>
                      <AnimatePresence>
                        {touched.message && errors.message && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" /> {errors.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-blue dark:bg-neon-blue text-white dark:text-black font-black uppercase tracking-[0.2em] py-4 rounded-xl box-glow hover:box-glow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>Enviando... <Loader2 className="w-4 h-4 animate-spin" /></>
                      ) : (
                        <>Enviar Mensagem <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
