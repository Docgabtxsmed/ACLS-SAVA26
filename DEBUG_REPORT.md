# DEBUG_REPORT.md — SAVA e ACLS

**Data:** 2026-03-05
**Revisão:** Completa (frontend + backend + auth + RAG pipeline)

---

## Sumário Executivo

Revisão identificou **10 bugs** distribuídos em 4 níveis de prioridade.
O erro "Sessão Expirada. Faça login novamente." reportado pelo usuário é causado pelo **BUG-1** (crítico), que faz o frontend aparentar estar logado sem um token real.

---

## 🔴 CRÍTICO — Corrigir antes de usar em produção

### BUG-1 — signUp sem verificação de sessão
**Arquivo:** `src/contexts/AuthContext.tsx:61`
**Descrição:** Quando a confirmação de email está ativa no Supabase (padrão), `signUp()` retorna `{ user: X, session: null }`. O código fazia `setUser(data.user)` sem checar `data.session`, tornando `isAuthenticated=true` sem token real.
**Fluxo do erro:**
```
signUp() → {user: X, session: null} → setUser(X) → isAuthenticated=true
→ usuário abre chat → getSession() → null → "Sessão Expirada"
```
**Fix aplicado:** Verificar `data.session` antes de `setUser`. Se null, lançar erro pedindo confirmação de email.
**Status:** ✅ Corrigido

---

### BUG-2 — SUPABASE_JWT_SECRET com valor placeholder
**Arquivo:** `backend/.env` (local — não versionado)
**Descrição:** A variável `SUPABASE_JWT_SECRET` contém `SEU_JWT_SECRET_AQUI` no arquivo `.env` local. Sem a chave real, a autenticação JWT falha no backend.
**Fix manual:**
1. Acessar Supabase Dashboard → Settings → API
2. Copiar "JWT Secret" (seção Legacy — HS256)
3. Colar em `backend/.env`: `SUPABASE_JWT_SECRET=<valor-real>`
**Status:** ⚠️ Ação manual necessária

---

### BUG-3 — ChatWidget sem tentativa de refresh de sessão
**Arquivo:** `src/components/ChatWidget.tsx` (handleSendMessage)
**Descrição:** Quando o token está ausente/expirado, o código mostrava erro imediatamente sem tentar renovar a sessão via `supabase.auth.refreshSession()`.
**Fix aplicado:** Tentar refresh antes de exibir erro ao usuário.
**Status:** ✅ Corrigido

---

## 🟡 IMPORTANTE — Corrigir na próxima iteração

### BUG-4 — Variável de ambiente com nome errado no .env.example
**Arquivo:** `backend/.env.example:11`
**Descrição:** Documentava `SUPABASE_SERVICE_KEY` mas o código (`auth.py`) usa `SUPABASE_JWT_SECRET`. Isso confunde na hora de configurar o ambiente.
**Fix aplicado:** Atualizado `.env.example` com o nome correto.
**Status:** ✅ Corrigido

---

### BUG-5 — RAG chain invocado com string em vez de dict
**Arquivo:** `backend/app/services/rag.py:191,206`
**Descrição:** Em LangChain 0.3.x (LCEL), chains do tipo `RunnableParallel` esperam um dicionário. O código usava `chain.ainvoke(question)` (string), causando falha silenciosa ou exceção.
**Fix aplicado:**
```python
# Antes (buggy):
return await chain.ainvoke(question)
async for chunk in chain.astream(question):

# Depois (correto):
return await chain.ainvoke({"question": question})
async for chunk in chain.astream({"question": question}):
```
**Status:** ✅ Corrigido

---

## 🟢 MÉDIO — Melhorias de qualidade

### BUG-6 — Sem validação de ChromaDB vazio antes de invocar RAG
**Arquivo:** `backend/app/services/rag.py` (função `build_rag_chain`)
**Descrição:** Se nenhum PDF foi indexado, `retriever` retorna lista vazia e o LLM recebe contexto vazio — sem aviso ao usuário.
**Fix sugerido:** Verificar `collection.count() > 0` antes de montar a chain; retornar mensagem amigável se vazio.
**Status:** 🔲 Pendente

---

### BUG-7 — OPENAI_API_KEY sem validação no startup
**Arquivo:** `backend/app/config.py`
**Descrição:** Se `OPENAI_API_KEY` estiver vazia, o servidor inicia normalmente mas falha na primeira chamada ao LLM, sem mensagem clara.
**Fix sugerido:**
```python
if not settings.OPENAI_API_KEY:
    sys.exit("OPENAI_API_KEY não configurada. Servidor encerrado.")
```
**Status:** 🔲 Pendente

---

### BUG-8 — ProtectedRoute definido mas não utilizado
**Arquivo:** `src/App.tsx`
**Descrição:** Componente `ProtectedRoute` foi criado mas nenhuma rota usa — rotas autenticadas estão desprotegidas no nível de roteamento (proteção existe apenas no ChatWidget).
**Fix sugerido:** Envolver as rotas `/algoritmos/*` e `/chat` com `<ProtectedRoute>`, ou remover `ProtectedRoute` se não for usar.
**Status:** 🔲 Pendente

---

## 🔵 BAIXA — Débito técnico

### BUG-9 — key={idx} nas listas de mensagens
**Arquivo:** `src/components/ChatWidget.tsx`
**Descrição:** Usar índice do array como `key` no React pode causar re-renders incorretos quando mensagens são inseridas ou removidas no meio da lista.
**Fix sugerido:** Gerar ID único por mensagem (ex: `crypto.randomUUID()` ou `Date.now() + Math.random()`).
**Status:** 🔲 Pendente

---

### BUG-10 — print() em vez de logging estruturado
**Arquivo:** `backend/app/routes/chat.py`
**Descrição:** Erros internos são logados com `print()`. Em produção, usar `logging` permite controle de nível, formatação e integração com ferramentas de observabilidade.
**Fix sugerido:**
```python
import logging
logger = logging.getLogger(__name__)
logger.error("Mensagem de erro", exc_info=True)
```
**Status:** 🔲 Pendente

---

## Checklist de Verificação Pós-Fix

- [ ] Criar conta nova → mensagem "Confirme seu email" (se email confirmation ativo) ou redireciona direto (se desativo)
- [ ] Fazer login com conta confirmada → abrir chat → enviar mensagem → resposta sem erro
- [ ] Token expirado → refresh automático → mensagem enviada sem interrupção
- [ ] Backend: `SUPABASE_JWT_SECRET` real configurado em `backend/.env`
- [ ] RAG: curl com token válido retorna resposta com contexto do PDF

---

## Ações Manuais Necessárias (usuário)

1. **Supabase JWT Secret** (obrigatório):
   - Dashboard → Settings → API → JWT Secret (Legacy)
   - Colar em `backend/.env`: `SUPABASE_JWT_SECRET=<valor>`

2. **Confirmação de email** (recomendado para desenvolvimento):
   - Dashboard → Authentication → Providers → Email → desativar "Confirm email"
   - Permite testar cadastro sem verificar caixa de entrada
