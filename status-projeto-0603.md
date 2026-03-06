# Status do Projeto SAVA e ACLS — 06/03/2026

## Documentos existentes

| Documento | Proposito |
|---|---|
| `PLANO_MELHORIAS.md` | Roadmap completo: Fases 0-5 (seguranca → SaaS → mobile) |
| `MELHORIAS_CONTEUDO.md` | Roadmap de conteudo medico e novas funcionalidades |
| `CHATWIDGET_SPEC.md` | Spec original do ChatWidget (ja implementado) |
| `PROMPTS_CURSOR_SPRINT1.md` | 6 prompts sequenciais para o Cursor (Sprint 1) |
| `PROMPT_CURSOR_CHATWIDGET.md` | Prompt especifico para criar o ChatWidget |
| `DEBUG_REPORT.md` | 10 bugs identificados com status |
| `arquitetura-projeto-0603.md` | Arquitetura completa do sistema |
| `guia-miro-arquitetura.md` | Guia para desenhar no Miro |
| `status-projeto-0603.md` | Este documento — status consolidado |

---

## PLANO_MELHORIAS.md — Status por Fase

### Fase 0 — Seguranca Imediata — CONCLUIDA
- [x] Revogar API key exposta
- [x] Criar nova API key com limites de gasto
- [x] Validar .gitignore

### Fase 1 — Fundacao para Producao — PARCIALMENTE CONCLUIDA

| Item | Status | Notas |
|---|---|---|
| Criar projeto Supabase | Concluido | Feito |
| Login/cadastro (email+senha) | Concluido | LoginPage, RegisterPage, ForgotPasswordPage |
| AuthProvider e contexto | Concluido | AuthContext.tsx funcionando |
| Proteger ChatWidget (so logados) | Concluido | Verifica auth antes de abrir chat |
| Validacao JWT no backend | Concluido | auth.py com JWKS + HS256 fallback (corrigido em 06/03 — load_dotenv) |
| Rate limiting (SlowAPI) | Concluido | limiter.py compartilhado (corrigido em 06/03 — parametro request) |
| Sanitizar HTML com DOMPurify | Concluido | Implementado no ChatWidget |
| Corrigir erros nos algoritmos | Pendente | Nenhum algoritmo foi revisado |
| Atualizar CORS para dominio de producao | Pendente | Ainda nao fez deploy |

### Fase 2 — Features Essenciais — NAO INICIADA

| Item | Status |
|---|---|
| Deploy frontend no Vercel | Pendente |
| Deploy backend no Railway | Pendente |
| Criar tabelas de conversas no Supabase | Parcial — tabelas parecem existir (ChatWidget referencia) |
| Historico de conversas no ChatWidget | Parcial — codigo existe mas precisa validar |
| Enviar contexto de conversa para o RAG | Pendente |
| Melhorar UX do ChatWidget | Parcial — timestamps e limpar conversa feitos, falta textarea auto-resize e copiar |

### Fase 3 — Monetizacao — NAO INICIADA
- Gateway de pagamento, logica freemium, landing page, login com Google, analytics

### Fase 4 — Polimento — NAO INICIADA
- PWA, melhorias de conteudo, painel admin, migrar vector store para cloud

### Fase 5 — App Mobile — NAO INICIADA
- Capacitor, stores Apple/Google

---

## DEBUG_REPORT.md — Status dos 10 Bugs

| Bug | Severidade | Status |
|---|---|---|
| BUG-1 — signUp sem verificacao de sessao | CRITICO | Corrigido |
| BUG-2 — JWT_SECRET com placeholder | CRITICO | Corrigido (valor real no .env) |
| BUG-3 — ChatWidget sem refresh de sessao | CRITICO | Corrigido |
| BUG-4 — Nome errado no .env.example | IMPORTANTE | Corrigido |
| BUG-5 — RAG chain invocado com string | IMPORTANTE | Corrigido |
| BUG-6 — Sem validacao de ChromaDB vazio | MEDIO | Pendente |
| BUG-7 — OPENAI_API_KEY sem validacao no startup | MEDIO | Pendente |
| BUG-8 — ProtectedRoute nao utilizado | MEDIO | Pendente |
| BUG-9 — key={idx} nas listas de mensagens | BAIXO | Pendente |
| BUG-10 — print() em vez de logging | BAIXO | Pendente |

---

## Correcoes feitas em 06/03/2026 (sessao de revisao do backend)

| Fix | Descricao |
|---|---|
| Modelo OpenAI | gpt-5-nano → gpt-4o-mini |
| Limiter duplicado | Criado limiter.py compartilhado |
| Chain RAG | RunnablePassthrough → itemgetter("question") |
| Ingestao duplicada | Deleta collection antes de re-ingerir |
| ADMIN_API_KEY | Adicionada ao .env |
| /health publico | Removido Depends(verify_supabase_token) |
| Chain cacheada | Singleton get_rag_chain() |
| .env consistente | Removido SUPABASE_ANON_KEY, adicionado ALLOWED_ORIGINS |
| Upload MIME | Validacao de content_type |
| load_dotenv em auth.py | Variaveis Supabase ficavam vazias (erro 401) |
| Parametro request do SlowAPI | req: Request → request: Request (erro 500) |

---

## Resumo — O que falta por prioridade

### Prioridade ALTA (proximos passos)
1. Corrigir erros nos algoritmos (Fase 1.5) — conteudo medico incorreto nas 13 paginas
2. Deploy (Fase 2) — Vercel (frontend) + Railway (backend)
3. Validar historico de conversas — ja tem codigo, precisa testar se persiste no Supabase
4. Commit das alteracoes — tudo que foi corrigido em 06/03 ainda nao foi commitado

### Prioridade MEDIA
5. BUG-6 — Validacao de ChromaDB vazio antes de invocar RAG
6. BUG-7 — Validar OPENAI_API_KEY no startup
7. Enviar contexto de conversa para o RAG (memoria do chat)
8. UX do ChatWidget — textarea auto-resize, botao copiar

### Prioridade BAIXA
9. BUG-8 — Decidir sobre ProtectedRoute
10. BUG-9/10 — Keys no React, logging estruturado
11. Fases 3-5 — monetizacao, PWA, mobile
