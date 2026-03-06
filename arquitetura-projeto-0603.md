# Arquitetura do Projeto SAVA e ACLS

## Visao Geral

O projeto e uma **aplicacao web educacional para profissionais de saude**, focada em protocolos de emergencia cardiaca (ACLS/SAVA). Ele tem **duas partes independentes** que se comunicam via HTTP:

```
+-----------------------------+         +-----------------------------+
|     FRONTEND (React)        |  HTTP   |     BACKEND (FastAPI)       |
|     Porta 5173              | ------> |     Porta 8000              |
|                             |         |                             |
|  Algoritmos interativos     |         |  Chatbot IA com RAG         |
|  + Chat Widget              |         |  (OpenAI + ChromaDB)        |
+----------+------------------+         +----------+------------------+
           |                                       |
           v                                       v
+---------------------+              +--------------------------+
|   Supabase Auth     |              |   ChromaDB (local)       |
|   (autenticacao)    |              |   (banco vetorial)       |
+---------------------+              +--------------------------+
```

---

## 1. Frontend — React + TypeScript + Vite

**Stack:** React 19, TypeScript, Vite, React Router DOM 7, Supabase JS

### Estrutura de pastas

```
src/
├── main.tsx              <- Ponto de entrada (BrowserRouter + App)
├── App.tsx               <- Rotas + AuthProvider + ChatWidget global
├── types.ts              <- Tipos compartilhados (FlowchartNode, Algorithm, etc.)
├── lib/
│   └── supabase.ts       <- Cliente Supabase (auth)
├── contexts/
│   └── AuthContext.tsx    <- Context API para autenticacao (login, registro, logout)
├── data/
│   ├── algorithms.ts     <- Dados estaticos dos 12 algoritmos (titulo, cor, icone, rota)
│   ├── arrhythmiaData.ts <- Dados de arritmias
│   └── bradyarrhythmiaData.ts
├── components/
│   ├── Navbar.tsx         <- Barra de navegacao (mostra email do user, botao Sair)
│   ├── FlowchartNode.tsx  <- No do fluxograma (expansivel com detalhes)
│   ├── FlowchartArrow.tsx <- Seta entre nos
│   ├── DosePanel.tsx      <- Painel de dosagens de medicamentos
│   ├── AlgorithmCard.tsx  <- Card na home (link para cada algoritmo)
│   ├── ChatWidget.tsx     <- Widget de chat IA (flutuante, SSE streaming)
│   └── ...modais de arritmia
├── pages/
│   ├── HomePage.tsx       <- Grid de cards dos 12 algoritmos
│   ├── LoginPage.tsx      <- Login com Supabase
│   ├── RegisterPage.tsx   <- Cadastro com confirmacao de email
│   ├── ForgotPasswordPage.tsx
│   ├── CardiacArrestPage.tsx   <- Fluxograma de PCR (exemplo de pagina de algoritmo)
│   ├── BradycardiaPage.tsx
│   ├── TachycardiaPage.tsx
│   └── ... (12 paginas de algoritmos)
└── styles/
    └── index.css          <- CSS global
```

### Como funciona o Frontend

**Fluxo de navegacao:**
1. O usuario acessa `/` → ve a **HomePage** com 12 cards de algoritmos
2. Clica em um card → navega para a pagina do algoritmo (ex: `/cardiac-arrest`)
3. Cada pagina de algoritmo e um **fluxograma interativo** montado com `FlowchartNode` + `FlowchartArrow`
4. Os nos sao clicaveis e expandem para mostrar detalhes (dosagens, passos)

**Fluxo de autenticacao:**
1. O `AuthProvider` envolve toda a app e gerencia o estado do usuario
2. Usa o **Supabase Auth** (email/senha) — o token JWT fica armazenado automaticamente pelo SDK
3. A Navbar mostra "Entrar" ou o email do usuario + "Sair"
4. O ChatWidget so funciona se o usuario estiver logado (precisa do token JWT)

**ChatWidget (componente mais complexo):**
1. E um **widget flutuante** que aparece em todas as paginas
2. Ao enviar uma pergunta, obtem o token JWT do Supabase
3. Faz `POST /api/chat/stream` com o token no header `Authorization: Bearer <token>`
4. Recebe a resposta via **SSE (Server-Sent Events)** — token por token, como o ChatGPT
5. Renderiza markdown inline (negrito, listas) com sanitizacao via DOMPurify
6. Persiste historico de conversas no Supabase (tabelas `conversations` e `messages`)

---

## 2. Backend — FastAPI + Python

**Stack:** FastAPI, LangChain, OpenAI API, ChromaDB, SlowAPI, python-jose

### Estrutura de pastas

```
backend/
├── .env                  <- Variaveis secretas (API keys, JWT secret)
├── .env.example          <- Template do .env
├── ingest_docs.py        <- Script CLI para ingestao de PDFs
├── data/pdfs/            <- PDFs dos protocolos ACLS/SAVA
├── chroma_db/            <- Banco vetorial persistente (gerado automaticamente)
└── app/
    ├── __init__.py
    ├── main.py           <- Ponto de entrada FastAPI (CORS, rate limiting, rotas)
    ├── config.py         <- Configuracoes centrais (le .env com dotenv)
    ├── auth.py           <- Validacao JWT (Supabase JWKS + HS256 fallback)
    ├── limiter.py        <- Rate limiter compartilhado (SlowAPI)
    ├── routes/
    │   └── chat.py       <- Endpoints da API (/chat, /chat/stream, /ingest, /health)
    └── services/
        ├── ingest.py     <- Pipeline de ingestao (PDF -> chunks -> embeddings -> ChromaDB)
        └── rag.py        <- Cadeia RAG (busca + prompt + LLM -> resposta)
```

### Pipeline RAG (o cerebro do sistema)

RAG = **Retrieval-Augmented Generation**. Em vez do LLM inventar respostas, ele consulta seus documentos primeiro:

```
                        INGESTAO (uma vez)
+----------+    +--------------+    +---------------+    +-----------+
|  PDFs    | -> |  PyPDFLoader | -> |  TextSplitter | -> |  ChromaDB |
|  ACLS    |    |  (extrai     |    |  (divide em   |    |  (salva   |
|  /SAVA   |    |   texto)     |    |   chunks)     |    |  vetores) |
+----------+    +--------------+    +---------------+    +-----------+

                      CONSULTA (cada pergunta)
+----------+    +---------------+    +--------------+    +-----------+
| Pergunta | -> |  ChromaDB     | -> |  Prompt com  | -> |  GPT-4o   |
| do user  |    |  (busca 4     |    |  contexto +  |    |  mini     |
|          |    |   chunks)     |    |  pergunta    |    |  (resposta|
+----------+    +---------------+    +--------------+    +-----------+
```

**Detalhando cada etapa:**

1. **Ingestao** (`backend/app/services/ingest.py`):
   - `PyPDFLoader` extrai texto de cada PDF pagina por pagina
   - `RecursiveCharacterTextSplitter` divide em chunks de 500 caracteres com 100 de overlap
   - `OpenAIEmbeddings` converte cada chunk em um vetor numerico (1536 dimensoes)
   - `ChromaDB` armazena os vetores em disco (`./chroma_db/`)

2. **Consulta** (`backend/app/services/rag.py`):
   - A pergunta do usuario e convertida em vetor
   - ChromaDB encontra os 4 chunks mais similares (busca por cosseno)
   - Um prompt de sistema instrui o LLM a responder **apenas** com base no contexto
   - GPT-4o-mini gera a resposta (temperature=0.1 para respostas factuais)
   - A chain e cacheada (singleton) para nao reconstruir a cada request

### Endpoints da API (`backend/app/routes/chat.py`)

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| `GET` | `/api/health` | Nenhuma | Health check |
| `POST` | `/api/chat` | JWT | Chat (resposta completa) |
| `POST` | `/api/chat/stream` | JWT | Chat com streaming SSE |
| `POST` | `/api/ingest` | Admin key | Processa PDFs do diretorio |
| `POST` | `/api/ingest/upload` | Admin key | Upload + processamento de PDF |
| `GET` | `/api/stats` | JWT | Estatisticas do vector store |

### Seguranca (`backend/app/auth.py`)

- **Autenticacao de usuarios:** Valida JWT do Supabase com dois metodos:
  1. **JWKS (ES256)** — busca chave publica do Supabase automaticamente (metodo moderno)
  2. **HS256 fallback** — usa `SUPABASE_JWT_SECRET` do `.env` (legado)
- **Autenticacao de admin:** Header `X-Admin-Key` comparado com `ADMIN_API_KEY`
- **Rate limiting:** SlowAPI limita 30 req/min no chat, 5 req/min na ingestao
- **CORS:** Configurado para aceitar apenas origens especificas
- **Upload:** Validacao de extensao `.pdf` + MIME type + limite de 50MB + protecao path traversal

---

## 3. Supabase (servico externo)

Usado para **duas coisas**:

1. **Autenticacao** — login/registro/logout com email/senha (JWT tokens)
2. **Persistencia de conversas** — tabelas `conversations` e `messages` no banco PostgreSQL do Supabase (acessado diretamente pelo frontend via SDK)

O backend **nao** acessa o banco Supabase — ele so valida os tokens JWT.

---

## 4. Fluxo completo de uma pergunta no chat

```
Usuario digita "Qual a dose de Adrenalina na PCR?"
         |
         v
+-- ChatWidget.tsx -------------------------------------------+
| 1. Obtem token JWT do Supabase                              |
| 2. POST /api/chat/stream com Authorization header           |
+------------------------+------------------------------------+
                         |
         v (HTTP com SSE)
+-- Backend FastAPI --------------------------------------+
| 3. auth.py valida o JWT (JWKS ou HS256)                 |
| 4. SlowAPI verifica rate limit                          |
| 5. rag.py converte pergunta em vetor                    |
| 6. ChromaDB retorna 4 chunks mais relevantes            |
| 7. Monta prompt: sistema + contexto + pergunta          |
| 8. GPT-4o-mini gera resposta (streaming)                |
| 9. Cada token e enviado como evento SSE                 |
+------------------------+--------------------------------+
                         |
         v (SSE tokens)
+-- ChatWidget.tsx -------------------------------------------+
| 10. Renderiza tokens em tempo real                          |
| 11. Salva mensagem no Supabase (conversations)              |
+-------------------------------------------------------------+
```

---

## 5. Pontos fortes da arquitetura

- **Separacao clara** frontend/backend — podem ser deployados independentemente
- **RAG com grounding** — o chatbot responde apenas com base nos documentos, evitando alucinacoes
- **Streaming SSE** — experiencia de chat em tempo real
- **Autenticacao robusta** — JWKS com fallback HS256
- **Componentes reutilizaveis** — FlowchartNode/Arrow/DosePanel constroem qualquer algoritmo

## 6. Pontos de atencao

- **Sem testes automatizados** — nenhum teste unitario ou de integracao no projeto
- **Paginas de algoritmo sao manuais** — cada pagina (CardiacArrestPage, etc.) e um componente hardcoded; nao ha um renderizador dinamico a partir de dados
- **Sem protecao de rotas no frontend** — as paginas de algoritmo sao acessiveis sem login (apenas o chat exige autenticacao)
- **`backend/venv/`** existe junto com `.venv/` — ha dois diretorios de virtual environment
