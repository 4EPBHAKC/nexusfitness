# Guia de Implantação: GitHub + Vercel

Este projeto utiliza uma estrutura moderna de pastas (**src**, **public**, etc.) que é perfeitamente aceita tanto pelo GitHub quanto pela Vercel. Não é necessário mover tudo para a raiz.

## 1. Conectar ao GitHub

1. No GitHub, crie um novo repositório (Vazio).
2. No seu terminal local:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```

## 2. Configurar na Vercel

1. Vá para [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Importe o repositório que você acabou de criar.
3. **PONTO CRÍTICO: Configurações de Build**
   - Framework Preset: `Vite` (deve ser detectado automaticamente)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables (Variáveis de Ambiente)**
   Adicione todas as variáveis do seu arquivo `.env.example`:
   - `STRIPE_SECRET_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `JWT_SECRET` (crie uma senha aleatória longa)

## 3. Resolvendo o erro "Unexpected token 'T'"

Este erro acontece quando a Vercel não encontra a sua API e retorna uma página HTML de erro 404 em vez de JSON. 
Para um servidor Express customizado como o seu funcionar na Vercel, você deve adicionar um arquivo `vercel.json` na raiz do projeto.

Criei o arquivo `vercel.json` para você com as configurações necessárias.
