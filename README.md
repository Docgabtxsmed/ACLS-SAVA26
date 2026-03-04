# SAVA e ACLS — Plano de Acao

## Visao Geral do Projeto

Aplicacao web educacional para treinamento em **ACLS** (Advanced Cardiac Life Support) e **SAVA** (Suporte Avancado de Vida em Anestesiologia), com algoritmos interativos baseados nas diretrizes AHA 2025.

### Stack Tecnologica

| Camada | Tecnologia | Funcao |
|--------|-----------|--------|
| **Frontend** | React 19 + TypeScript + Vite | Interface com flowcharts interativos |
| **Backend** | Python + FastAPI | API REST para o chatbot |
| **Orquestracao IA** | LangChain | Pipeline RAG (Retrieval-Augmented Generation) |
| **Banco Vetorial** | ChromaDB | Armazena embeddings dos documentos |
| **LLM** | OpenAI GPT-4o-mini | Gera respostas baseadas no contexto |
| **Embeddings** | OpenAI text-embedding-3-small | Transforma texto em vetores |

### Arquitetura

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (React + TypeScript)                      │
│                                                     │
│  13 paginas de algoritmos    ChatWidget (Fase 2)    │
│  interativos (flowcharts)    botao flutuante + chat │
│                                     │               │
└─────────────────────────────────────┼───────────────┘
                                      │ HTTP /api/chat
                                      ▼
┌─────────────────────────────────────────────────────┐
│  BACKEND (FastAPI + LangChain)                      │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Pipeline RAG                               │    │
│  │                                             │    │
│  │  Pergunta → Embedding → ChromaDB (busca)    │    │
│  │  → Top 4 chunks → Prompt + Contexto         │    │
│  │  → GPT-4o-mini → Resposta                   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  ChromaDB (banco vetorial em disco)         │    │
│  │  PDFs das guidelines → chunks → embeddings  │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## Status Atual

| Componente | Status | Detalhes |
|------------|--------|----------|
| Frontend React | Pronto | 13 paginas, 12 algoritmos, ECGs, flowcharts |
| Backend Python (codigo) | Pronto | 6 arquivos, endpoints, RAG pipeline |
| Backend (ambiente) | **Pendente** | venv, dependencias, .env nao configurados |
| Ingestao de PDFs | **Pendente** | Nenhum PDF processado ainda |
| ChatWidget (frontend) | **Pendente** | Componente React nao criado |
| Deploy em producao | **Pendente** | Apenas desenvolvimento local |
| Documentacao didatica | Pronto | GUIA_ESTUDO_RAG.md + comentarios nos codigos |

### Paginas Implementadas (13)

| Pagina | Rota | Tipo |
|--------|------|------|
| Home | `/` | Grid de algoritmos |
| SBV (BLS) | `/bls` | Algoritmo ACLS |
| PCR Adulto | `/cardiac-arrest` | Algoritmo ACLS |
| Bradicardia | `/bradycardia` | Algoritmo ACLS + 4 ECGs |
| Taquicardia | `/tachycardia` | Algoritmo SAVA + 12 ECGs |
| SCA (ACS) | `/acs` | Algoritmo ACLS |
| AVC (Stroke) | `/stroke` | Algoritmo ACLS |
| Intoxicacao por AL | `/local-anesthetic-toxicity` | SAVA Especial |
| Hipertermia Maligna | `/malignant-hyperthermia` | SAVA Especial |
| Cuidados pos-PCR | `/post-cardiac-arrest` | SAVA Especial |
| PCR Pediatrica | `/pediatric-cardiac-arrest` | SAVA Especial |
| Anafilaxia | `/anaphylaxis` | SAVA Especial |
| PCR em Gestante | `/pregnant-cardiac-arrest` | SAVA Especial |

---

## Fase 1: Configurar o Backend (BLOQUEANTE)

Tudo nesta fase precisa ser feito antes de prosseguir.

### 1.1 Pre-requisitos

Verifique se voce tem instalado:

```bash
python3 --version   # Precisa ser 3.10 ou superior
node --version      # Precisa ser 18 ou superior
git --version       # Qualquer versao recente
```

### 1.2 Criar ambiente virtual Python

```bash
cd backend
python3 -m venv .venv
```

Ativar o ambiente:

```bash
# macOS / Linux:
source .venv/bin/activate

# Windows:
.venv\Scripts\activate
```

Voce sabera que esta ativo quando o terminal mostrar `(.venv)` no inicio da linha.

### 1.3 Instalar dependencias

```bash
pip install -r requirements.txt
```

Isso instala: FastAPI, LangChain, ChromaDB, OpenAI, uvicorn, e todas as dependencias.

### 1.4 Configurar variaveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e coloque sua API key real da OpenAI:

```
OPENAI_API_KEY=sk-sua-chave-real-aqui
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CHROMA_PERSIST_DIR=./chroma_db
PDF_DIR=./data/pdfs
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
RETRIEVER_TOP_K=4
```

**IMPORTANTE:** Nunca commite o arquivo `.env` no Git. Ele ja esta no `.gitignore`.

Se voce nao tem uma API key da OpenAI:
1. Acesse https://platform.openai.com/api-keys
2. Crie uma nova key
3. Adicione creditos (o GPT-4o-mini custa ~$0.15 por milhao de tokens de entrada)

### 1.5 Adicionar PDFs

Copie seus PDFs de guidelines medicas para a pasta:

```bash
cp /caminho/dos/seus/pdfs/*.pdf data/pdfs/
```

Exemplos de documentos uteis:
- AHA Guidelines 2025 (ACLS, BLS)
- NHCPS ACLS Handbook
- Documentos SAVA da disciplina
- Qualquer guideline de emergencia cardiaca

### 1.6 Rodar ingestao dos documentos

```bash
python ingest_docs.py
```

Saida esperada:

```
============================================================
  SAVA ACLS — Ingestao de Documentos
============================================================

  Usando diretorio padrao: ./data/pdfs/

  Processando PDFs...

  Ingestao concluida!
   Documentos carregados: 45
   Chunks criados: 312
   Total de chunks no ChromaDB: 312

============================================================
```

Os numeros variam conforme a quantidade e tamanho dos seus PDFs.

### 1.7 Iniciar o servidor backend

```bash
uvicorn app.main:app --reload --port 8000
```

Saida esperada:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

### 1.8 Testar no Swagger

1. Abra o navegador em: **http://localhost:8000/docs**
2. Teste o endpoint `GET /api/health` — deve retornar `{"status": "ok"}`
3. Teste o endpoint `GET /api/stats` — deve mostrar quantos chunks estao armazenados
4. Teste o endpoint `POST /api/chat` com o body:

```json
{
  "question": "Qual a dose de epinefrina na PCR?"
}
```

Se receber uma resposta com informacoes do documento, o backend esta funcionando.

### Checklist da Fase 1

- [ ] Python 3.10+ instalado
- [ ] Ambiente virtual criado e ativado
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] Arquivo `.env` criado com API key real
- [ ] PDFs copiados para `data/pdfs/`
- [ ] Ingestao executada (`python ingest_docs.py`)
- [ ] Servidor rodando (`uvicorn app.main:app --reload`)
- [ ] Teste no Swagger aprovado (`/docs`)

---

## Fase 2: Criar o ChatWidget no Frontend

Apos o backend estar funcionando, o proximo passo e criar um componente de chat no React que se conecta a API.

### 2.1 Visao geral

O ChatWidget sera um **botao flutuante** no canto inferior direito da tela. Ao clicar, abre um **modal de chat** onde o usuario pode fazer perguntas sobre emergencias medicas. As respostas vem do backend via streaming (token por token, como o ChatGPT).

```
┌──────────────────────────────────────────┐
│  Qualquer pagina do SAVA e ACLS          │
│                                          │
│  [Flowcharts, ECGs, algoritmos...]       │
│                                          │
│                                          │
│                                          │
│                              ┌─────────┐ │
│                              │  Chat   │ │
│                              │  com IA │ │
│                              │         │ │
│                              │ [input] │ │
│                              └─────────┘ │
│                                    [FAB] │
└──────────────────────────────────────────┘

FAB = Floating Action Button (botao flutuante)
```

### 2.2 Arquivos a criar

| Arquivo | Descricao |
|---------|-----------|
| `src/components/ChatWidget.tsx` | Componente React com logica do chat |
| `src/styles/ChatWidget.css` | Estilos do botao flutuante e modal |

### 2.3 Onde adicionar no App.tsx

O ChatWidget deve ficar **fora** do `<Routes>`, para aparecer em todas as paginas:

```tsx
// src/App.tsx
import ChatWidget from './components/ChatWidget'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* ... demais rotas ... */}
      </Routes>
      <ChatWidget />   {/* Visivel em TODAS as paginas */}
    </>
  )
}
```

### 2.4 Fluxo de dados

```
Usuario digita pergunta
       │
       ▼
ChatWidget.tsx
  state: messages[], isLoading, isOpen
       │
       │  fetch POST http://localhost:8000/api/chat/stream
       │  body: {"question": "..."}
       │
       ▼
EventSource (SSE)
  recebe tokens um por um:
    event: "token"  → data: {"token": "A "}
    event: "token"  → data: {"token": "dose "}
    event: "token"  → data: {"token": "de "}
    ...
    event: "done"   → data: {"status": "complete"}
       │
       ▼
ChatWidget renderiza a resposta
  progressivamente (token por token)
```

### 2.5 Exemplo de integracao com SSE

```tsx
const sendMessage = async (question: string) => {
  setIsLoading(true)
  setMessages(prev => [...prev, { role: 'user', content: question }])

  // Adiciona mensagem vazia do assistente (sera preenchida com streaming)
  setMessages(prev => [...prev, { role: 'assistant', content: '' }])

  const response = await fetch('http://localhost:8000/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  while (reader) {
    const { done, value } = await reader.read()
    if (done) break

    const text = decoder.decode(value)
    const lines = text.split('\n').filter(line => line.startsWith('data:'))

    for (const line of lines) {
      const data = JSON.parse(line.replace('data: ', ''))
      if (data.token) {
        // Atualiza a ultima mensagem (assistente) com o novo token
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1].content += data.token
          return updated
        })
      }
    }
  }

  setIsLoading(false)
}
```

### 2.6 Checklist da Fase 2

- [ ] Criar `src/components/ChatWidget.tsx`
- [ ] Criar `src/styles/ChatWidget.css`
- [ ] Implementar estado: `messages[]`, `isOpen`, `isLoading`, `input`
- [ ] Implementar botao flutuante (FAB) com icone de chat
- [ ] Implementar modal de chat com historico de mensagens
- [ ] Implementar input de texto + botao de enviar
- [ ] Conectar ao endpoint `/api/chat/stream` via SSE
- [ ] Adicionar `<ChatWidget />` no `App.tsx`
- [ ] Testar envio de pergunta e recebimento de resposta streaming
- [ ] Estilizar no tema dark do projeto (cores: #1a1a2e, #e94560)

---

## Fase 3: Melhorias de Conteudo

### 3.1 Quick Wins (prioridade alta)

| Melhoria | Descricao | Esforco |
|----------|-----------|---------|
| Imagens ECG nos modais | As imagens ja existem em `public/ecg/` mas nao sao exibidas nos modais de arritmia | Baixo |
| Navegacao entre paginas | Links "Proximo algoritmo" e "Algoritmo anterior" no rodape de cada pagina | Baixo |
| Expandir Anafilaxia | Adicionar dados do UpToDate e guidelines europeias | Medio |

### 3.2 Features Educacionais (prioridade media)

| Feature | Descricao | Esforco |
|---------|-----------|---------|
| Quiz interativo | Perguntas de multipla escolha baseadas nos algoritmos | Alto |
| Calculadora pediatrica | Calculo de doses por peso (adrenalina, amiodarona, etc.) | Medio |
| Modo simulacao | Cenarios clinicos passo a passo com decisoes | Alto |

### 3.3 Features Avancadas (prioridade baixa)

| Feature | Descricao | Esforco |
|---------|-----------|---------|
| PWA offline | Funcionar sem internet (Service Worker) | Medio |
| Busca global | Pesquisar em todas as paginas e conteudos | Medio |
| Paginas extras | Hipotermia terapeutica, Overdose/Intoxicacao | Alto |

Detalhes completos em: `MELHORIAS_CONTEUDO.md`

---

## Fase 4: Deploy e Producao

### 4.1 Opcoes de hospedagem

| Servico | Camada | Free Tier | Custo estimado |
|---------|--------|-----------|----------------|
| **Vercel** | Frontend | Sim (generoso) | Gratuito para uso pessoal |
| **Railway** | Backend | 500h/mes gratis | ~$5/mes apos free tier |
| **Render** | Backend | Sim (com sleep) | Gratuito com cold starts |
| **Fly.io** | Backend | 3 VMs gratis | Gratuito para POC |

Recomendacao: **Vercel** (frontend) + **Railway** (backend)

### 4.2 Variaveis de ambiente em producao

No servico de hospedagem do backend, configurar:

```
OPENAI_API_KEY=sk-sua-chave-producao
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

No frontend, atualizar a URL da API de `localhost:8000` para a URL do backend em producao.

### 4.3 Custos com OpenAI API

| Modelo | Uso | Custo |
|--------|-----|-------|
| GPT-4o-mini (chat) | ~$0.15 / 1M tokens de entrada | ~100 perguntas = ~$0.01 |
| GPT-4o (upgrade) | ~$2.50 / 1M tokens de entrada | ~100 perguntas = ~$0.15 |
| text-embedding-3-small | ~$0.02 / 1M tokens | Ingestao unica, custo minimo |

Para um POC/projeto academico, o custo e praticamente zero com GPT-4o-mini.

---

## Referencia Rapida

### Comandos do dia a dia

```bash
# --- FRONTEND ---
npm run dev        # Inicia o servidor de desenvolvimento (localhost:5173)
npm run build      # Compila para producao (pasta dist/)
npm run preview    # Visualiza o build de producao

# --- BACKEND ---
cd backend
source .venv/bin/activate     # Ativa o ambiente virtual
uvicorn app.main:app --reload --port 8000   # Inicia o servidor
python ingest_docs.py         # Re-ingere os PDFs
python ingest_docs.py /outro/caminho   # Ingere PDFs de outro diretorio
```

### Endpoints da API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/` | Info da API (nome, versao, link docs) |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | Pergunta → resposta completa (JSON) |
| `POST` | `/api/chat/stream` | Pergunta → resposta streaming (SSE) |
| `POST` | `/api/ingest` | Processa todos os PDFs da pasta configurada |
| `POST` | `/api/ingest/upload` | Upload + processamento de um PDF |
| `GET` | `/api/stats` | Estatisticas do banco vetorial |

### Parametros RAG ajustaveis (no .env)

| Parametro | Padrao | O que faz | Dica |
|-----------|--------|-----------|------|
| `CHUNK_SIZE` | 1000 | Caracteres por chunk | Menor = mais preciso, Maior = mais contexto |
| `CHUNK_OVERLAP` | 200 | Sobreposicao entre chunks | 20% do CHUNK_SIZE e um bom valor |
| `RETRIEVER_TOP_K` | 4 | Chunks recuperados por pergunta | Mais = melhor contexto, mais custo |
| `OPENAI_MODEL` | gpt-4o-mini | Modelo do chat | Troque para gpt-4o se quiser mais qualidade |
| `OPENAI_EMBEDDING_MODEL` | text-embedding-3-small | Modelo de embeddings | Nao mude apos a ingestao (incompativel) |

### Estrutura completa do projeto

```
SAVA e ACLS/
├── src/                          # Frontend React
│   ├── pages/                    #   13 paginas de algoritmos
│   ├── components/               #   Componentes reutilizaveis
│   ├── data/                     #   Dados estaticos (algoritmos, arritmias)
│   ├── styles/                   #   CSS global
│   └── App.tsx                   #   Roteamento principal
├── backend/                      # Backend Python
│   ├── app/
│   │   ├── config.py             #   Configuracoes centrais
│   │   ├── main.py               #   FastAPI app + CORS
│   │   ├── services/
│   │   │   ├── ingest.py         #   Pipeline: PDF → chunks → embeddings → ChromaDB
│   │   │   └── rag.py            #   Pipeline: pergunta → contexto → LLM → resposta
│   │   └── routes/
│   │       └── chat.py           #   Endpoints da API
│   ├── data/pdfs/                #   Seus PDFs aqui
│   ├── chroma_db/                #   Banco vetorial (gerado automaticamente)
│   ├── ingest_docs.py            #   Script CLI de ingestao
│   ├── requirements.txt          #   Dependencias Python
│   ├── .env.example              #   Template de configuracao
│   └── GUIA_ESTUDO_RAG.md        #   Guia de estudo para aprender RAG
├── MELHORIAS_CONTEUDO.md         # Roadmap de melhorias de conteudo
└── README.md                     # Este documento
```

### Links para outros documentos

| Documento | Conteudo |
|-----------|----------|
| `backend/GUIA_ESTUDO_RAG.md` | Guia hands-on para aprender RAG, LangChain e ChromaDB (6 modulos + exercicios) |
| `MELHORIAS_CONTEUDO.md` | Roadmap detalhado de melhorias de conteudo medico (4 fases) |
