# Pipeline de Produção — SAVA & ACLS

## Visão Geral

```
Usuário → Frontend (Vercel) → Backend (Railway/Render) → OpenAI API
                                    ↓
                              Supabase (pgvector + auth + histórico)
```

---

# Usuário

## Quem é o Usuário
- Profissional de saúde (médico, enfermeiro, residente) ou estudante de medicina
- Acessa o sistema pelo navegador (celular ou computador)
- Interage com os algoritmos médicos (ACLS, SAVA, bradiarritmias, taquiarritmias)
- Faz perguntas ao chat com IA sobre emergências médicas

## O que o Usuário faz
- Se cadastra e faz login (autenticação via Supabase)
- Navega pelas 13 páginas de algoritmos médicos
- Consulta fluxogramas, doses de medicamentos e condutas
- Envia perguntas ao chatbot (ex: "Qual a dose de epinefrina em PCR pediátrica?")
- Recebe respostas baseadas nos PDFs de referência (UpToDate, AHA)

## O que o Usuário NÃO faz
- Não tem acesso ao servidor, banco de dados ou API keys
- Não vê o código — só vê a interface final renderizada no navegador

---

# Vercel (Frontend)

## O que é
- Plataforma de hospedagem especializada em aplicações frontend
- Criada pela mesma empresa que mantém o Next.js
- Funciona como um CDN global — distribui seu site em servidores pelo mundo inteiro

## Qual a função no pipeline
- Hospeda o **React + TypeScript + Vite** (o código que está em `/src`)
- Serve os arquivos estáticos (HTML, CSS, JS, imagens) para o navegador do usuário
- Não executa lógica de backend — apenas entrega a interface

## O que acontece na Vercel
- O usuário digita a URL → Vercel entrega o app React
- O navegador renderiza as páginas de algoritmos médicos localmente
- Quando o usuário faz login ou envia uma pergunta no chat, o **frontend faz requisições HTTP** para o backend (Railway/Render)

## Por que Vercel
- Deploy automático via `git push` (conecta ao GitHub)
- HTTPS gratuito
- Plano gratuito generoso para projetos pessoais
- Performance excelente (CDN global, cache automático)

---

# Railway ou Render (Backend)

## O que é
- Plataformas de hospedagem para **servidores backend** (aplicações que rodam código Python, Node, etc.)
- Funcionam como um computador na nuvem que fica ligado 24/7 rodando seu servidor

## Qual a função no pipeline
- Hospeda o **FastAPI** (o código que está em `/backend`)
- Recebe as requisições do frontend (login, chat, histórico)
- Processa a lógica de negócio: autenticação, RAG, streaming de respostas
- Faz a ponte entre o frontend e os serviços externos (Supabase, OpenAI)

## O que acontece no Railway/Render
1. Recebe pergunta do usuário via API (`POST /api/chat`)
2. Valida o token JWT (verifica se o usuário está autenticado)
3. Busca documentos relevantes no **banco vetorial** (Supabase pgvector)
4. Envia o contexto + pergunta para a **OpenAI API**
5. Retorna a resposta em streaming (SSE) para o frontend
6. Salva a conversa no histórico (Supabase)

## Por que Railway/Render
- Suporta Python/FastAPI nativamente
- Deploy via `git push` ou Dockerfile
- Variáveis de ambiente seguras (`.env` fica no painel, não no código)
- Escala automática se necessário
- Planos gratuitos ou de baixo custo para projetos pequenos

---

# Supabase (pgvector + Auth + Histórico)

## O que é
- Plataforma open-source que oferece **banco de dados PostgreSQL gerenciado** com funcionalidades extras
- É uma alternativa ao Firebase, mas baseada em Postgres (SQL de verdade)

## Os 3 papéis do Supabase no projeto

### Auth (Autenticação)
- Gerencia cadastro, login, logout, sessões
- Emite tokens JWT que o backend valida
- Suporta login por email/senha, Google, GitHub, etc.
- Já implementado no projeto

### pgvector (Banco Vetorial)
- Extensão do PostgreSQL que permite armazenar e buscar **vetores** (embeddings)
- Substitui o ChromaDB local usado atualmente
- **Como funciona:**
  - Na ingestão: cada trecho de PDF é transformado em um vetor numérico (embedding via OpenAI) e salvo numa tabela
  - Na busca: a pergunta do usuário vira um vetor → o pgvector encontra os trechos mais similares por distância matemática (cosine similarity)
- Vantagem: fica no mesmo banco que já existe, sem serviço adicional

### Histórico de Conversas
- Tabela no Postgres que armazena as mensagens do chat (pergunta + resposta + timestamp + user_id)
- Permite ao usuário ver conversas anteriores
- Já implementado no projeto

## Por que Supabase
- Já é utilizado no projeto (auth + histórico)
- pgvector elimina a dependência do ChromaDB
- Tudo num lugar só: auth + vetores + histórico + dados
- Dashboard visual para gerenciar tabelas
- Plano gratuito generoso

---

# OpenAI API (LLM)

## O que é
- Serviço da OpenAI que expõe modelos de linguagem (GPT-4o, GPT-4o-mini) via API REST
- Envia-se texto → recebe-se texto gerado pelo modelo
- Não é um servidor próprio — é um serviço externo consumido via API

## Qual a função no pipeline
- É o **cérebro** que gera as respostas do chat
- Recebe o contexto (trechos dos PDFs encontrados pelo pgvector) + a pergunta do usuário
- Gera uma resposta médica contextualizada e referenciada

## O que acontece na OpenAI API
1. O backend envia uma requisição com:
   - **System prompt**: instruções de comportamento (responda como especialista em emergências médicas)
   - **Contexto RAG**: os 3-5 trechos de PDF mais relevantes encontrados pelo pgvector
   - **Pergunta do usuário**: o que ele digitou no chat
2. O modelo processa tudo e gera a resposta token por token
3. A resposta volta em **streaming** (SSE) para o backend → frontend → usuário

## Dois serviços da OpenAI utilizados
- **Embeddings** (`text-embedding-3-small`): transforma texto em vetores numéricos para busca semântica
- **Chat Completions** (`gpt-4o-mini`): gera as respostas em linguagem natural

## Custos
- **Embeddings**: ~$0.02 / 1M tokens (muito barato, usado só na ingestão)
- **GPT-4o-mini**: ~$0.15 input + $0.60 output / 1M tokens
- Para uso educacional com poucos usuários: **menos de $5/mês**
- Configurar spending limit no dashboard da OpenAI para evitar surpresas

---

# Fluxo completo de uma pergunta

```
1. Usuário digita: "Qual a dose de amiodarona em TV estável?"
        ↓
2. Frontend (Vercel) envia POST /api/chat com JWT + pergunta
        ↓
3. Backend (Railway) valida JWT via Supabase
        ↓
4. Backend transforma pergunta em vetor (OpenAI Embeddings)
        ↓
5. Busca vetorial no Supabase pgvector → retorna 3-5 trechos de PDFs relevantes
        ↓
6. Backend envia (system prompt + trechos + pergunta) para OpenAI Chat
        ↓
7. OpenAI responde em streaming → Backend repassa via SSE → Frontend exibe
        ↓
8. Backend salva pergunta + resposta no histórico (Supabase)
        ↓
9. Usuário lê: "Amiodarona 150 mg IV em 10 min para TV monomórfica estável..."
```

---

*Documento gerado em 06/03/2026*
