# Prompts para o Cursor — Sprint 1

## Como usar

1. **Fase 0 e MANUAL** — faca voce mesmo antes de comecar (5 minutos)
2. Envie os prompts **um por vez** no Cursor, em ordem
3. Apos cada prompt, **teste** antes de enviar o proximo
4. Se o Cursor pedir decisoes, siga as orientacoes nos comentarios `<!-- -->`
5. Cada prompt e independente — se acabar o tempo, o que ja foi feito continua funcionando

**Pre-requisito:** Criar um projeto no Supabase (https://supabase.com) e ter em maos:
- `SUPABASE_URL` (ex: https://xxx.supabase.co)
- `SUPABASE_ANON_KEY` (ex: eyJ...)

---

## Fase 0: Seguranca (MANUAL — faca antes de tudo)

- [ ] Acessar https://platform.openai.com/api-keys
- [ ] Revogar a chave atual
- [ ] Criar nova chave
- [ ] Atualizar `backend/.env` com a nova chave
- [ ] Em Settings → Billing → Usage limits, definir limite mensal (ex: $10)
- [ ] Criar projeto no Supabase e anotar URL + Anon Key

---

## Prompt 1 — Autenticacao com Supabase (PRIORIDADE MAXIMA)

```
Preciso implementar autenticacao com Supabase Auth no meu projeto React 19 + TypeScript + Vite.

CONTEXTO DO PROJETO:
- App de algoritmos medicos (ACLS/SAVA) com 13 paginas de algoritmos + chatbot IA
- Modelo FREEMIUM: algoritmos sao gratis, chatbot IA so para usuarios logados
- Ja existe um ChatWidget em src/components/ChatWidget.tsx que precisa ser protegido
- Design system dark mode com CSS variables em src/styles/index.css
- Cores principais: --color-bg-dark: #1a1a2e, --color-accent: #e94560, --color-text-primary: #f0f0f0

ANTES DE IMPLEMENTAR, leia estes arquivos para entender o projeto:
- src/App.tsx (rotas existentes)
- src/components/Navbar.tsx e Navbar.css (padrao de estilo e navegacao)
- src/components/ChatWidget.tsx (componente a proteger)
- src/styles/index.css (CSS variables do design system)

O QUE CRIAR:

1. Instalar: @supabase/supabase-js

2. src/lib/supabase.ts
   - Cliente Supabase usando variaveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
   - Export da instancia do cliente

3. src/contexts/AuthContext.tsx
   - Context + Provider que gerencia estado de autenticacao
   - Estados: user, loading, isAuthenticated
   - Funcoes: signIn(email, password), signUp(email, password), signOut()
   - useEffect que escuta onAuthStateChange do Supabase
   - Hook customizado useAuth()

4. src/pages/LoginPage.tsx + LoginPage.css
   - Formulario de login (email + senha)
   - Link para "Criar conta" (navega para /register)
   - Mensagens de erro inline
   - Redireciona para / apos login bem-sucedido
   - ESTILO: seguir o padrao visual dark mode do projeto (usar CSS variables existentes)

5. src/pages/RegisterPage.tsx + RegisterPage.css
   - Formulario de cadastro (email + senha + confirmar senha)
   - Link para "Ja tenho conta" (navega para /login)
   - Validacao basica (senha minima 6 chars, senhas iguais)
   - Redireciona para / apos cadastro

6. Modificar src/App.tsx:
   - Envolver tudo com <AuthProvider>
   - Adicionar rotas: /login e /register
   - NAO alterar nenhuma rota existente de algoritmo
   - Manter <ChatWidget /> onde esta

7. Modificar src/components/ChatWidget.tsx:
   - Importar useAuth()
   - Se usuario NAO esta logado: ao clicar no botao flutuante, mostrar mensagem
     "Faca login para usar o assistente IA" com botao que leva para /login
   - Se usuario ESTA logado: funcionar normalmente como ja funciona

8. Modificar src/components/Navbar.tsx:
   - Adicionar botao "Entrar" (se nao logado) que leva para /login
   - Adicionar botao "Sair" (se logado) que faz signOut
   - Mostrar email do usuario logado (opcional, se couber no layout)

AMBIENTE:
- Ja existe um arquivo .env na raiz do projeto com:
  VITE_SUPABASE_URL=https://wqytmxduenbogjrcvlnt.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ... (ja configurado)
  VITE_API_URL=http://localhost:8000
- NAO sobrescrever nem modificar o .env existente
- Usar import.meta.env.VITE_SUPABASE_URL e import.meta.env.VITE_SUPABASE_ANON_KEY no codigo

REGRAS:
- NAO instalar nenhuma dependencia alem de @supabase/supabase-js
- NAO modificar nenhuma pagina de algoritmo existente
- NAO alterar a logica de streaming do ChatWidget (so adicionar verificacao de auth)
- NAO modificar nem sobrescrever o arquivo .env da raiz
- Usar CSS puro (arquivo .css separado por componente, como o projeto ja faz)
- TypeScript estrito — tipar todos os estados e props
- Seguir o design system existente (cores, espacamentos, border-radius das CSS variables)
- Criar um arquivo .env.example na raiz (se nao existir) com:
  VITE_SUPABASE_URL=https://seu-projeto.supabase.co
  VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
  VITE_API_URL=http://localhost:8000
```

**Teste apos este prompt:**
1. `npm run dev`
3. Verificar que algoritmos abrem sem login
4. Clicar no chat → deve pedir login
5. Ir em /register → criar conta
6. Ir em /login → fazer login
7. Chat deve funcionar apos login

---

## Prompt 2 — Seguranca do Backend (JWT + Rate Limiting)

```
Preciso proteger meu backend FastAPI com validacao de JWT do Supabase e rate limiting.

CONTEXTO:
- Backend Python FastAPI em backend/
- Endpoints de chat em backend/app/routes/chat.py
- O frontend agora tem autenticacao via Supabase Auth
- Preciso que o backend valide o JWT antes de processar perguntas ao chatbot
- Preciso de rate limiting para evitar abuso e controlar custos da OpenAI

ANTES DE IMPLEMENTAR, leia estes arquivos:
- backend/app/main.py (aplicacao FastAPI)
- backend/app/routes/chat.py (endpoints existentes)
- backend/app/config.py (configuracao)
- backend/requirements.txt (dependencias atuais)

O QUE CRIAR/MODIFICAR:

1. Instalar novas dependencias (adicionar ao requirements.txt):
   - slowapi (rate limiting para FastAPI)
   - python-jose[cryptography] (validacao de JWT)
   - httpx (para buscar JWKS do Supabase)

2. Criar backend/app/auth.py:
   - Funcao verify_supabase_token(authorization: str = Header(...))
   - Buscar a chave publica JWKS do Supabase em {SUPABASE_URL}/auth/v1/.well-known/jwks.json
   - Cache da chave publica (nao buscar em toda requisicao)
   - Decodificar e validar o JWT usando python-jose
   - Retornar dados do usuario (sub, email) ou levantar HTTPException 401
   - Ler SUPABASE_URL do .env (variavel ja existe como URL_SUPABASE no .env atual)

3. Modificar backend/app/routes/chat.py:
   - Adicionar Depends(verify_supabase_token) APENAS nos endpoints de chat:
     - POST /api/chat
     - POST /api/chat/stream
   - NAO proteger: GET /api/health, GET /api/stats, POST /api/ingest
   - O endpoint de ingest deve ter uma protecao simples por API key fixa (header X-Admin-Key)

4. Modificar backend/app/main.py:
   - Adicionar rate limiter do slowapi
   - Limites: 30 requisicoes/minuto por IP nos endpoints de chat
   - Adicionar handler para erro 429 (Too Many Requests)

5. Padronizar variaveis no backend/.env:
   IMPORTANTE: O backend/.env JA existe e contem as chaves da OpenAI e Supabase.
   As variaveis Supabase atuais se chamam URL_SUPABASE e API_KEY_SUPABASE.
   Renomear para o padrao:
   - URL_SUPABASE → SUPABASE_URL
   - API_KEY_SUPABASE → SUPABASE_ANON_KEY
   E adicionar:
   - SUPABASE_JWT_SECRET (pegar em Supabase Dashboard → Settings → API → JWT Secret)
   - ADMIN_API_KEY=uma-chave-secreta-para-ingest
   NAO remover as variaveis OpenAI existentes.

6. Atualizar backend/.env.example com todos os campos:
   OPENAI_API_KEY=sk-sua-chave-aqui
   OPENAI_MODEL=gpt-4o-mini
   OPENAI_EMBEDDING_MODEL=text-embedding-3-small
   CHROMA_PERSIST_DIR=./chroma_db
   PDF_DIR=./data/pdfs
   CHUNK_SIZE=500
   CHUNK_OVERLAP=100
   RETRIEVER_TOP_K=4
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-anon-key-aqui
   SUPABASE_JWT_SECRET=seu-jwt-secret-aqui
   ADMIN_API_KEY=uma-chave-secreta-para-ingest

7. Modificar o frontend src/components/ChatWidget.tsx:
   - No fetch para /api/chat/stream, adicionar header Authorization:
     Authorization: Bearer {session.access_token}
   - Obter o token da sessao via supabase.auth.getSession()
   - O cliente Supabase ja esta em src/lib/supabase.ts (criado no Prompt 1)

REGRAS:
- NAO alterar a logica do RAG (services/rag.py e services/ingest.py)
- NAO alterar o formato de resposta dos endpoints (SSE continua igual)
- NAO remover variaveis OpenAI do backend/.env
- Endpoints de health e stats continuam publicos
- Se o JWT for invalido, retornar 401 com mensagem clara
- Se o rate limit for excedido, retornar 429 com mensagem em portugues
- Manter compatibilidade — o frontend deve continuar funcionando normalmente
```

**Teste apos este prompt:**
1. Reiniciar backend: `cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000`
2. Sem login: chat deve retornar 401
3. Com login: chat deve funcionar normalmente
4. Testar rate limit: enviar muitas requisicoes rapidas → deve retornar 429

---

## Prompt 3 — Seguranca e UX do ChatWidget

```
Preciso melhorar a seguranca e UX do ChatWidget existente.

ANTES DE IMPLEMENTAR, leia:
- src/components/ChatWidget.tsx (componente atual)
- src/components/ChatWidget.css (estilos atuais)

MUDANCAS NECESSARIAS:

1. Instalar: dompurify e @types/dompurify

2. SEGURANCA — Sanitizar HTML (ChatWidget.tsx):
   - Importar DOMPurify from 'dompurify'
   - Em TODOS os lugares que usam dangerouslySetInnerHTML,
     sanitizar o HTML antes: DOMPurify.sanitize(parseMarkdown(content))
   - Permitir apenas tags seguras: p, strong, em, ul, ol, li, br, code, pre

3. UX — Melhorar o input (ChatWidget.tsx + ChatWidget.css):
   - Trocar <input> por <textarea> com auto-resize
   - Altura minima: 40px, maxima: 120px
   - Enter envia mensagem, Shift+Enter quebra linha
   - Manter o mesmo estilo visual (escuro, borda sutil)

4. UX — Botao de copiar resposta:
   - Adicionar icone de copiar (clipboard) no hover de cada mensagem do assistente
   - Ao clicar: navigator.clipboard.writeText(msg.content)
   - Feedback visual: icone muda para "check" por 2 segundos
   - Posicionar no canto superior direito da mensagem

5. UX — Timestamps nas mensagens (ChatWidget.tsx + ChatWidget.css):
   - Adicionar campo 'timestamp' no tipo Message: timestamp: Date
   - Exibir horario abaixo de cada mensagem (ex: "14:32")
   - Estilo: font-size pequeno, cor muted, alinhado conforme o role

6. UX — Botao "Nova conversa":
   - Adicionar botao no header do chat ao lado do titulo
   - Ao clicar: limpar messages[], resetar estados
   - Icone: + ou icone de documento novo

REGRAS:
- NAO alterar a logica de fetch/streaming SSE
- NAO alterar a logica de autenticacao (Prompt 2)
- Manter o parseMarkdown() existente — apenas sanitizar o output
- CSS puro, sem bibliotecas de UI
- Manter responsividade mobile que ja existe
```

**Teste apos este prompt:**
1. `npm run dev`
2. Enviar mensagem → resposta deve renderizar com Markdown sanitizado
3. Hover na resposta → icone de copiar aparece
4. Clicar copiar → texto copiado para clipboard
5. Shift+Enter → quebra linha no textarea
6. Enter → envia mensagem
7. Timestamps visiveis nas mensagens

---

## Prompt 4 — Historico de Conversas

```
Preciso implementar historico de conversas persistente usando Supabase.

CONTEXTO:
- O ChatWidget ja tem autenticacao (Supabase Auth via useAuth())
- O cliente Supabase ja existe em src/lib/supabase.ts
- Preciso salvar conversas no banco e permitir retomar conversas anteriores

ANTES DE IMPLEMENTAR, leia:
- src/components/ChatWidget.tsx (componente atual com auth)
- src/lib/supabase.ts (cliente Supabase)
- src/contexts/AuthContext.tsx (contexto de auth)

PASSO 1 — SQL (me mostre o SQL para eu executar no Supabase Dashboard):
Criar estas tabelas no Supabase:

- conversations:
  id (uuid, PK, default gen_random_uuid())
  user_id (uuid, FK para auth.users)
  title (text, nullable — sera preenchido com as primeiras palavras da primeira mensagem)
  created_at (timestamptz, default now())
  updated_at (timestamptz, default now())

- messages:
  id (uuid, PK, default gen_random_uuid())
  conversation_id (uuid, FK para conversations, on delete cascade)
  role (text, check: 'user' ou 'assistant')
  content (text)
  created_at (timestamptz, default now())

- RLS (Row Level Security):
  Habilitar em ambas as tabelas
  Policy: usuario so ve/edita suas proprias conversas
  Usar auth.uid() = user_id

PASSO 2 — Modificar ChatWidget.tsx:

- Estado adicional: conversations (lista), currentConversationId
- Ao enviar primeira mensagem de uma conversa:
  1. Criar nova conversa no Supabase
  2. Setar currentConversationId
  3. Usar primeiras 5 palavras como titulo
- Ao enviar cada mensagem (user e assistant):
  Salvar no Supabase na tabela messages
- Ao abrir o chat:
  Carregar lista de conversas do usuario (ordenadas por updated_at desc, limite 20)

PASSO 3 — Sidebar de conversas (no ChatWidget):

- Adicionar botao de "menu/lista" no header do chat
- Ao clicar: exibir painel lateral (ou overlay) com lista de conversas
- Cada item mostra: titulo + data relativa ("ha 2h", "ontem", etc.)
- Ao clicar em uma conversa: carregar suas mensagens e exibir
- Botao "Nova conversa" limpa tudo e inicia nova

REGRAS:
- NAO instalar nenhuma dependencia nova (Supabase client ja esta instalado)
- NAO alterar a logica de streaming SSE
- Salvar mensagens de forma assincrona (nao bloquear a UI)
- Se o salvamento falhar, mostrar warning discreto mas NAO impedir o uso
- Limitar a 20 conversas na lista (paginacao pode vir depois)
- TypeScript estrito — tipar Conversation e Message com interfaces
```

**Teste apos este prompt:**
1. Executar o SQL no Supabase Dashboard (SQL Editor)
2. `npm run dev`
3. Fazer login → enviar pergunta → resposta aparece
4. Recarregar a pagina → abrir chat → conversa anterior aparece na lista
5. Clicar na conversa → mensagens carregam
6. "Nova conversa" → limpa e permite comecar nova

---

## Prompt 5 — Preparacao para Deploy

```
Preciso preparar o projeto para deploy em producao: frontend no Vercel e backend no Railway.

ANTES DE IMPLEMENTAR, leia:
- src/components/ChatWidget.tsx (onde faz fetch para o backend)
- backend/app/main.py (CORS configuration)
- backend/app/config.py (environment variables)
- package.json (scripts)
- vite.config.ts

O QUE FAZER:

1. Frontend — Variavel de ambiente para URL da API:
   - Em TODOS os lugares que fazem fetch para 'http://localhost:8000',
     substituir por: import.meta.env.VITE_API_URL || 'http://localhost:8000'
   - Isso permite funcionar local (fallback) e em producao (Vercel env var)
   - Atualizar .env.example com VITE_API_URL=http://localhost:8000

2. Backend — Procfile para Railway:
   - Criar backend/Procfile com:
     web: uvicorn app.main:app --host 0.0.0.0 --port $PORT

3. Backend — CORS dinamico:
   - Modificar backend/app/main.py
   - Ler ALLOWED_ORIGINS do .env (comma-separated)
   - Fallback para as origens locais atuais se nao definido
   - Exemplo .env: ALLOWED_ORIGINS=https://sava-acls.vercel.app,http://localhost:5173

4. Backend — runtime.txt para Railway:
   - Criar backend/runtime.txt com: python-3.12.x
   - Garante que Railway use Python 3.12 (compativel com chromadb)

5. Atualizar backend/.env.example com todos os campos:
   OPENAI_API_KEY=sk-sua-chave-aqui
   OPENAI_MODEL=gpt-4o-mini
   OPENAI_EMBEDDING_MODEL=text-embedding-3-small
   CHROMA_PERSIST_DIR=./chroma_db
   PDF_DIR=./data/pdfs
   CHUNK_SIZE=500
   CHUNK_OVERLAP=100
   RETRIEVER_TOP_K=4
   MAX_TOKENS=2000
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_KEY=sua-service-key
   ADMIN_API_KEY=sua-chave-admin
   ALLOWED_ORIGINS=https://seu-site.vercel.app,http://localhost:5173,http://localhost:5174

6. Frontend — Atualizar .env.example na raiz:
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   VITE_API_URL=http://localhost:8000

REGRAS:
- NAO alterar nenhuma logica de negocio
- NAO hardcodar URLs de producao no codigo
- Manter retrocompatibilidade (funciona local sem .env de producao)
- NAO modificar o build process do Vite
```

**Teste apos este prompt:**
1. `npm run dev` — deve continuar funcionando local
2. `npm run build` — deve buildar sem erros
3. Backend deve aceitar ALLOWED_ORIGINS do .env

---

## Prompt 6 — PWA Basica (se sobrar tempo)

```
Preciso transformar meu app React + Vite em uma PWA basica (Progressive Web App).

CONTEXTO:
- App React 19 + TypeScript + Vite
- Ja existe em src/styles/index.css um design system dark mode
- Cores do app: background #1a1a2e, accent #e94560
- O app tem 13 paginas de algoritmos medicos que devem funcionar offline
- O chatbot IA NAO precisa funcionar offline

ANTES DE IMPLEMENTAR, leia:
- index.html (entry point)
- vite.config.ts (configuracao do Vite)
- package.json

O QUE FAZER:

1. Instalar: vite-plugin-pwa

2. Modificar vite.config.ts:
   - Adicionar VitePWA plugin com:
     registerType: 'autoUpdate'
     workbox runtimeCaching para cache das paginas
     manifest com nome, cores, icones

3. Criar/configurar o manifest (via plugin config):
   - name: "SAVA e ACLS"
   - short_name: "SAVA"
   - description: "Algoritmos interativos de emergencia medica"
   - theme_color: "#1a1a2e"
   - background_color: "#1a1a2e"
   - display: "standalone"
   - start_url: "/"
   - icons: gerar a partir de um icone base (pode ser placeholder SVG por enquanto)

4. Strategy de cache (workbox):
   - Paginas HTML: NetworkFirst (tenta rede, fallback cache)
   - CSS/JS: StaleWhileRevalidate (cache rapido, atualiza em background)
   - API calls (/api/*): NetworkOnly (NAO cachear — respostas do chatbot sao dinamicas)

REGRAS:
- Usar vite-plugin-pwa (a forma padrao de PWA com Vite)
- NAO criar service worker manual — usar a geracao automatica do workbox
- NAO cachear chamadas para a API do backend
- O app deve continuar funcionando normalmente sem PWA (graceful degradation)
- Usar cores do design system existente no manifest
```

**Teste apos este prompt:**
1. `npm run build && npm run preview`
2. Abrir no Chrome → DevTools → Application → Service Workers → deve estar registrado
3. DevTools → Application → Manifest → deve mostrar info do app
4. No celular: abrir no Chrome → menu → "Adicionar a tela inicial"
5. Desligar internet → navegar pelos algoritmos → deve funcionar offline
6. Chatbot offline → deve mostrar erro de conexao (nao crash)

---

## Resumo de prioridades

| # | Prompt | Impacto | Tempo estimado |
|---|--------|---------|----------------|
| 1 | Supabase Auth | CRITICO (protege custos) | 30-45 min |
| 2 | Backend Security | ALTO (valida JWT + rate limit) | 20-30 min |
| 3 | ChatWidget UX | MEDIO (sanitiza HTML + UX) | 20-30 min |
| 4 | Historico | MEDIO (retencao de usuario) | 30-45 min |
| 5 | Deploy prep | ALTO (habilita producao) | 15-20 min |
| 6 | PWA | BAIXO (nice-to-have) | 15-20 min |

**Com 2 dias, voce deve conseguir os 6 prompts tranquilamente.**
Se precisar priorizar, faca pelo menos os prompts 1, 2 e 5 (auth + seguranca + deploy).
