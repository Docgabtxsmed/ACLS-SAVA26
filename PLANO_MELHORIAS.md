# SAVA e ACLS — Plano de Melhorias

## Resumo Executivo

Plano de evolucao do SAVA e ACLS de projeto local para produto SaaS freemium.
Organizado em 5 fases sequenciais, priorizando estabilidade antes de features.

**Modelo de negocio:** Freemium
- Gratis: algoritmos interativos (13 paginas atuais)
- Pago: chatbot IA com RAG (assinatura recorrente)

**Stack de producao:**
- Frontend: React 19 + TypeScript → Vercel
- Backend RAG: FastAPI + LangChain + ChromaDB → Railway
- Auth + DB + Pagamentos: Supabase
- IA: OpenAI (gpt-4o-mini embeddings + chat)

---

## Diagnostico Atual

### O que funciona
| Item | Status |
|------|--------|
| 13 paginas de algoritmos | Funcionando |
| Backend FastAPI com RAG | Funcionando local |
| ChatWidget com streaming SSE | Funcionando (bug corrigido) |
| Ingestao de 19 PDFs (3977 chunks) | Concluida |
| Design system com CSS variables | Consistente |

### Problemas identificados na revisao

| # | Problema | Severidade | Fase |
|---|----------|------------|------|
| 1 | API key real exposta no historico git | CRITICA | 0 |
| 2 | Sem autenticacao — qualquer um usa o chatbot (custo OpenAI) | ALTA | 1 |
| 3 | Sem rate limiting no backend | ALTA | 1 |
| 4 | `dangerouslySetInnerHTML` no ChatWidget sem sanitizacao | MEDIA | 1 |
| 5 | Sem testes (frontend e backend) | MEDIA | 2 |
| 6 | Sem historico de conversas (perde ao recarregar) | MEDIA | 2 |
| 7 | Erros nos algoritmos existentes (reportados pelo usuario) | MEDIA | 1 |
| 8 | Sem mobile optimization no ChatWidget | BAIXA | 3 |
| 9 | Sem analytics/metricas de uso | BAIXA | 3 |
| 10 | Sem PWA/offline para algoritmos | BAIXA | 4 |

---

## Arquitetura de Producao

```
                    USUARIO
                       |
                       v
                +-----------+
                |   Vercel   |  ← Frontend React (gratis)
                |  (React)   |
                +-----+-----+
                      |
          +-----------+-----------+
          |                       |
          v                       v
   +-----------+          +-----------+
   | Supabase  |          |  Railway  |  ← Backend Python ($5-7/mes)
   |  (Auth +  |          | (FastAPI) |
   |   DB +    |          | LangChain |
   | Storage)  |          | ChromaDB  |
   +-----------+          +-----+-----+
                                |
                                v
                          +-----------+
                          |  OpenAI   |  ← Pay-per-use (~$0.01/pergunta)
                          |   API     |
                          +-----------+
```

### Por que manter FastAPI separado (e nao migrar para Edge Functions)?

1. **LangChain e Python-nativo** — todo o ecossistema RAG (LangChain, ChromaDB, PyPDF) e Python
2. **ChromaDB precisa de persistencia** — Edge Functions sao stateless, nao mantem o vector store
3. **Processamento pesado** — ingestao de PDFs e operacoes de embedding sao longas demais para Edge Functions (limite de 60s)
4. **Voce ja tem o backend funcionando** — reescrever em TypeScript seria retrabalho sem ganho

**Supabase sera usado para:** Auth (login/senha + Google), banco de dados (perfis, historico, assinaturas), e futuramente Storage (upload de PDFs pelo admin).

---

## Fase 0: Seguranca Imediata (1 dia)

> Fazer ANTES de qualquer outra coisa.

### 0.1 Revogar e rotacionar API key da OpenAI

A chave `sk-proj-7J07uttPH...` ja foi commitada no historico git. Mesmo que o `.env` esteja no `.gitignore`, a chave esta exposta.

**Acoes:**
1. Acessar https://platform.openai.com/api-keys
2. Revogar a chave atual
3. Criar uma nova chave
4. Atualizar o `.env` local com a nova chave
5. Configurar limites de gasto na OpenAI (Settings → Billing → Usage limits)

### 0.2 Limpar historico git (opcional mas recomendado)

Se o repositorio for publico ou for compartilhado:
```bash
# Usar git-filter-repo para remover .env do historico
pip install git-filter-repo
git filter-repo --path backend/.env --invert-paths
```

### 0.3 Validar .gitignore

Confirmar que estes arquivos estao ignorados:
```
backend/.env
backend/chroma_db/
backend/data/pdfs/
node_modules/
```

---

## Fase 1: Fundacao para Producao (2-3 semanas)

> Infraestrutura minima para colocar online com seguranca.

### 1.1 Autenticacao com Supabase Auth

**O que fazer:**
1. Criar projeto no Supabase (https://supabase.com)
2. Instalar `@supabase/supabase-js` no frontend
3. Criar paginas de Login e Cadastro
4. Criar contexto de autenticacao (`AuthProvider`)
5. Proteger o ChatWidget — so aparece para usuarios logados
6. Algoritmos continuam abertos (freemium)

**Arquivos a criar/modificar:**
```
src/
  lib/
    supabase.ts          ← Cliente Supabase (NOVO)
  contexts/
    AuthContext.tsx       ← Provider de autenticacao (NOVO)
  pages/
    LoginPage.tsx         ← Pagina de login (NOVO)
    RegisterPage.tsx      ← Pagina de cadastro (NOVO)
  components/
    ProtectedRoute.tsx    ← Wrapper para rotas protegidas (NOVO)
    ChatWidget.tsx        ← Adicionar verificacao de auth (MODIFICAR)
  App.tsx                 ← Adicionar rotas de auth e AuthProvider (MODIFICAR)
```

**Fluxo:**
```
Usuario abre o site → ve algoritmos (gratis)
                     → clica no chat → "Faca login para usar o assistente IA"
                     → login/cadastro → chat liberado
```

### 1.2 Proteger o Backend com API Key interna

O frontend autenticado envia um token para o backend. O backend valida antes de processar.

**Opcao simples (recomendada para comecar):**
- Frontend envia header `Authorization: Bearer <supabase_jwt>`
- Backend valida o JWT com a chave publica do Supabase
- Instalar `python-jose` no backend

**Arquivo a modificar:** `backend/app/routes/chat.py`
```python
# Adicionar dependency de autenticacao
from fastapi import Depends, HTTPException
from app.auth import verify_token  # Novo arquivo

async def verify_token(authorization: str = Header(...)):
    # Validar JWT do Supabase
    ...

@router.post("/api/chat/stream")
async def chat_stream(req: ChatRequest, user=Depends(verify_token)):
    # Agora so usuarios autenticados chegam aqui
    ...
```

### 1.3 Rate Limiting

Prevenir abuso e controlar custos da OpenAI.

**Instalar:** `slowapi` (ja integra com FastAPI)
```bash
pip install slowapi
```

**Limites sugeridos:**
- Free tier: 0 perguntas/dia (chat bloqueado)
- Assinante: 50 perguntas/dia
- Global: 1000 perguntas/dia (protecao de custo)

### 1.4 Sanitizar HTML no ChatWidget

O `dangerouslySetInnerHTML` atual aceita qualquer HTML. Se a IA retornar algo malicioso (prompt injection), pode executar scripts.

**Solucao:** Instalar `dompurify`
```bash
npm install dompurify
npm install -D @types/dompurify
```

**Modificar em `ChatWidget.tsx`:**
```tsx
import DOMPurify from 'dompurify';

// Antes de usar dangerouslySetInnerHTML:
const cleanHtml = DOMPurify.sanitize(parseMarkdown(msg.content));
```

### 1.5 Corrigir erros nos algoritmos existentes

Revisar e corrigir erros identificados nas 13 paginas de algoritmos.

**Processo:**
1. Listar os erros especificos (voce mencionar quais sao)
2. Cruzar com as referencias (PDFs do SAVA/ACLS)
3. Corrigir conteudo medico
4. Validar fluxos de decisao

---

## Fase 2: Features Essenciais (3-4 semanas)

> Tornar o produto usavel e diferenciado.

### 2.1 Historico de conversas

Salvar conversas no Supabase para o usuario retomar depois.

**Tabelas no Supabase:**
```sql
-- Tabela de conversas
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de mensagens
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text,
  created_at timestamptz default now()
);

-- RLS (Row Level Security) — usuario so ve suas conversas
alter table conversations enable row level security;
create policy "Users see own conversations"
  on conversations for all
  using (auth.uid() = user_id);
```

**No ChatWidget:**
- Ao enviar primeira mensagem, criar nova conversa
- Salvar cada mensagem no Supabase
- Adicionar botao "Nova conversa" e lista de conversas anteriores

### 2.2 Deploy inicial

**Frontend → Vercel:**
```bash
npm install -g vercel
vercel
# Configurar variaveis de ambiente:
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
# VITE_API_URL=https://seu-backend.railway.app
```

**Backend → Railway:**
1. Criar conta em https://railway.app
2. Conectar repositorio GitHub (pasta `/backend`)
3. Configurar variaveis de ambiente (OPENAI_API_KEY, etc.)
4. Railway detecta Python automaticamente
5. Adicionar `Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Custo estimado mensal:**
| Servico | Custo |
|---------|-------|
| Vercel (frontend) | Gratis |
| Supabase (auth + DB) | Gratis (ate 50K MAU) |
| Railway (backend) | ~$5-7/mes |
| OpenAI API | ~$0.01/pergunta × volume |
| **Total fixo** | **~$5-7/mes** |

### 2.3 Contexto de conversa no RAG

Atualmente o backend recebe apenas a pergunta atual. Melhorar para enviar as ultimas N mensagens como contexto.

**Modificar:** `backend/app/routes/chat.py` e `backend/app/services/rag.py`

```python
# Endpoint recebe historico
class ChatRequest(BaseModel):
    question: str
    history: list[dict] = []  # [{"role": "user", "content": "..."}, ...]

# RAG usa historico para contextualizar
# Condensar historico + nova pergunta em uma "standalone question"
```

### 2.4 Melhorar UX do ChatWidget

- Textarea em vez de input (mensagens longas)
- Botao de copiar resposta
- Timestamps nas mensagens
- Indicador de "digitando..." mais elegante
- Suporte a codigo formatado (blocos ```)

---

## Fase 3: Monetizacao e Growth (4-6 semanas)

> Transformar em produto pago.

### 3.1 Sistema de assinaturas

**Opcoes de pagamento:**
- **Stripe** (mais robusto, internacional)
- **Hotmart/Kiwify** (mais facil para Brasil)

**Logica freemium:**
```
Supabase DB:
  users → subscription_status: 'free' | 'premium' | 'trial'
         → subscription_expires_at: timestamptz

Frontend:
  Se user.subscription_status === 'free':
    ChatWidget mostra "Assine para usar o assistente IA"
    Algoritmos funcionam normalmente

Backend:
  Endpoint /api/chat/stream verifica subscription_status
  Se free → retorna 403
```

### 3.2 Landing page / pagina de vendas

Criar uma pagina inicial mais atrativa:
- Hero section explicando o produto
- Demonstracao do chatbot (preview sem funcionar)
- Planos e precos
- Depoimentos (quando tiver usuarios)
- CTA para cadastro

### 3.3 Analytics basico

Usar Supabase para rastrear metricas simples:
- Numero de perguntas por usuario/dia
- Paginas mais acessadas
- Taxa de conversao free → pago
- Perguntas mais frequentes ao chatbot

### 3.4 Login com Google

Supabase Auth ja suporta OAuth nativamente:
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
});
```

Configurar no painel do Supabase: Authentication → Providers → Google.

---

## Fase 4: Polimento e Escala (continuo)

> Nice-to-haves que agregam valor.

### 4.1 PWA (Progressive Web App)
- Algoritmos disponiveis offline
- Instalavel no celular como app
- Service Worker para cache dos algoritmos
- Chatbot funciona apenas online

### 4.2 Melhorias de conteudo medico
- Imagens de ECG nos algoritmos relevantes
- Calculadora de dose pediatrica
- Quiz interativo por algoritmo
- Modo simulacao de cenario clinico

### 4.3 Painel administrativo
- Dashboard para voce ver metricas
- Upload de novos PDFs pelo navegador (sem terminal)
- Gerenciar usuarios e assinaturas
- Ver perguntas mais feitas ao chatbot

### 4.4 Otimizacoes de performance
- Migrar ChromaDB para Pinecone ou Qdrant (cloud-native, sem persistencia local)
- Cache de respostas frequentes (Redis)
- CDN para assets estaticos

---

## Fase 5: App Mobile — Proximo Sprint

> Publicar nas stores (App Store + Google Play) reaproveitando o codigo React existente.

### Estrategia: Capacitor

Capacitor empacota o app React dentro de um container nativo (WebView). Aproveita ~95% do codigo atual sem reescrita.

```
React App (seu codigo atual)
       |
  [npm run build]
       |
   Capacitor
   /        \
  iOS       Android
(Xcode)  (Android Studio)
   |           |
App Store   Google Play
```

### 5.1 Preparacao do projeto

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "SAVA e ACLS" com.sava.acls

# Adicionar plataformas
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

**Arquivo gerado:** `capacitor.config.ts`
```typescript
const config: CapacitorConfig = {
  appId: 'com.sava.acls',
  appName: 'SAVA e ACLS',
  webDir: 'dist',       // Pasta de build do Vite
  server: {
    // Em producao: carrega do build local
    // Em dev: pode apontar para localhost:5173
  }
};
```

**Estrutura adicionada ao projeto:**
```
projeto/
  ios/              ← Projeto Xcode (gerado)
  android/          ← Projeto Android Studio (gerado)
  capacitor.config.ts
  src/              ← Sem mudancas
```

### 5.2 Adaptacoes no codigo React

| Adaptacao | Descricao |
|-----------|-----------|
| URL da API | Usar variavel de ambiente (nao pode ser `localhost` no mobile) |
| Safe areas | Ajustar padding top/bottom para notch e barra de navegacao |
| Status bar | Configurar cor da status bar do dispositivo |
| Splash screen | Tela de carregamento ao abrir o app |
| Icone do app | Gerar icones nos tamanhos exigidos (1024x1024 base) |

**Plugins uteis:**
```bash
npm install @capacitor/status-bar      # Controle da status bar
npm install @capacitor/splash-screen   # Tela de splash
npm install @capacitor/push-notifications  # Notificacoes push (futuro)
npm install @capacitor/haptics         # Feedback tatil
npm install @capacitor/share           # Botao compartilhar
```

### 5.3 Build e teste

```bash
# Build do React + sincronizar com plataformas nativas
npm run build
npx cap sync

# Abrir no IDE nativo para testar
npx cap open ios        # Requer Mac + Xcode
npx cap open android    # Requer Android Studio

# Rodar no simulador/emulador direto pelo terminal
npx cap run ios
npx cap run android
```

### 5.4 Publicacao nas stores

**Apple App Store:**
- Conta Apple Developer: $99/ano
- Xcode → Product → Archive → Upload to App Store Connect
- Review da Apple: 1-3 dias uteis
- Requisitos: icones, screenshots, descricao, politica de privacidade

**Google Play Store:**
- Conta Google Play Developer: $25 (pagamento unico)
- Android Studio → Build → Generate Signed Bundle
- Upload no Google Play Console
- Review do Google: 1-7 dias

### 5.5 CI/CD para mobile (opcional)

Automatizar builds com **Appflow** (Ionic) ou **GitHub Actions**:
```
Push no GitHub → Build automatico → Upload para stores
```

### Checklist — Fase 5

- [ ] Instalar e configurar Capacitor
- [ ] Gerar icone e splash screen do app
- [ ] Adaptar CSS para safe areas (notch, barra inferior)
- [ ] Substituir `localhost` por URL de producao da API
- [ ] Testar no simulador iOS (Xcode)
- [ ] Testar no emulador Android (Android Studio)
- [ ] Criar conta Apple Developer ($99/ano)
- [ ] Criar conta Google Play Developer ($25)
- [ ] Preparar assets para as stores (screenshots, descricao, privacidade)
- [ ] Submeter para review nas stores
- [ ] Configurar push notifications (pos-lancamento)

### Dependencias — Fase 5

```bash
# Core
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Plugins nativos
npm install @capacitor/status-bar @capacitor/splash-screen
npm install @capacitor/haptics @capacitor/share
```

### Custo adicional

| Item | Custo |
|------|-------|
| Apple Developer Program | $99/ano |
| Google Play Developer | $25 (unico) |
| **Total primeiro ano** | **~$124** |

### Pre-requisitos

- Fases 1-3 concluidas (auth + deploy + monetizacao funcionando)
- PWA implementada (Fase 4.1) — serve como validacao antes de investir nas stores
- Mac disponivel (obrigatorio para build iOS)
- Android Studio instalado (para build Android)

---

## Cronograma Visual

```
Semana    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15+
       |----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
Fase 0 |XX|
Fase 1      |XXXXXXXXXXXX|
Fase 2                    |XXXXXXXXXXXXXXXX|
Fase 3                                      |XXXXXXXXXXXXXXXXXXXXXXXX|
Fase 4                                                          |XXXXXXXX|
Fase 5                                                                    |XXXXXXXX→
       ─────────────────── Sprint 1 ──────────────────────────── │Sprint 2│
```

---

## Checklist por Fase

### Fase 0 — Seguranca
- [x] Revogar API key exposta
- [x] Criar nova API key com limites de gasto
- [x] Validar .gitignore

### Fase 1 — Fundacao
- [x] Criar projeto Supabase
- [x] Implementar login/cadastro (email + senha)
- [x] Criar AuthProvider e ProtectedRoute
- [x] Proteger ChatWidget (so logados)
- [ ] Adicionar validacao JWT no backend
- [ ] Adicionar rate limiting (slowapi)
- [ ] Sanitizar HTML com DOMPurify
- [ ] Corrigir erros nos algoritmos
- [ ] Atualizar CORS para dominio de producao

### Fase 2 — Features
- [ ] Deploy frontend no Vercel
- [ ] Deploy backend no Railway
- [ ] Criar tabelas de conversas no Supabase
- [ ] Implementar historico de conversas no ChatWidget
- [ ] Enviar contexto de conversa para o RAG
- [ ] Melhorar UX do ChatWidget (textarea, copiar, timestamps)

### Fase 3 — Monetizacao
- [ ] Integrar gateway de pagamento (Stripe ou Hotmart)
- [ ] Implementar logica freemium (free vs premium)
- [ ] Criar landing page
- [ ] Adicionar login com Google
- [ ] Implementar analytics basico

### Fase 4 — Polimento
- [ ] PWA com offline para algoritmos
- [ ] Melhorias de conteudo medico
- [ ] Painel administrativo
- [ ] Migrar vector store para cloud (Pinecone/Qdrant)

### Fase 5 — App Mobile (Proximo Sprint)
- [ ] Instalar e configurar Capacitor
- [ ] Gerar icone e splash screen
- [ ] Adaptar CSS para safe areas (notch, barra inferior)
- [ ] Substituir localhost por URL de producao
- [ ] Testar no simulador iOS e emulador Android
- [ ] Criar contas de developer (Apple + Google)
- [ ] Preparar assets para as stores
- [ ] Submeter para review e publicar

---

## Dependencias para instalar (por fase)

### Fase 1
```bash
# Frontend
npm install @supabase/supabase-js dompurify
npm install -D @types/dompurify

# Backend
pip install slowapi python-jose[cryptography]
```

### Fase 2
```bash
# Deploy
npm install -g vercel
# Railway: via dashboard web
```

### Fase 3
```bash
# Se usar Stripe
npm install @stripe/stripe-js
pip install stripe
```

### Fase 5
```bash
# Capacitor core
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Plugins nativos
npm install @capacitor/status-bar @capacitor/splash-screen
npm install @capacitor/haptics @capacitor/share
```

---

## Variaveis de ambiente em producao

### Frontend (Vercel)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://seu-backend.railway.app
```

### Backend (Railway)
```env
OPENAI_API_KEY=sk-nova-chave
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CHROMA_PERSIST_DIR=./chroma_db
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
ALLOWED_ORIGINS=https://seu-site.vercel.app
```

---

## Referencias internas

| Documento | Conteudo |
|-----------|----------|
| `backend/GUIA_ESTUDO_RAG.md` | Tutorial didatico dos 6 arquivos Python |
| `MELHORIAS_CONTEUDO.md` | Roadmap de melhorias de conteudo medico |
| `CHATWIDGET_SPEC.md` | Especificacao original do ChatWidget |
| `backend/.env.example` | Template de variaveis de ambiente |
