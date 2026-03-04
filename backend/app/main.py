# ============================================================
# ARQUIVO: main.py — Aplicacao Principal (FastAPI)
# ============================================================
# Este e o PONTO DE ENTRADA do servidor. Ele:
#   1. Cria a aplicacao FastAPI
#   2. Configura CORS (permissao para o frontend acessar)
#   3. Conecta as rotas (endpoints) definidas em routes/chat.py
#
# Para rodar: uvicorn app.main:app --reload --port 8000
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa o router do chat.py (que contem todos os endpoints /api/...)
from app.routes.chat import router as chat_router

# ============================================================
# SECAO: Criacao da Aplicacao FastAPI
# ============================================================
# FastAPI() cria a aplicacao web. Os parametros abaixo sao
# usados para gerar a documentacao automatica em /docs.
app = FastAPI(
    title="SAVA ACLS RAG API",
    description="API de chatbot para emergências médicas com RAG (Retrieval-Augmented Generation)",
    version="0.1.0",
)

# ============================================================
# SECAO: Configuracao CORS
# ============================================================
# CONCEITO: CORS (Cross-Origin Resource Sharing)
# Quando o frontend (React em localhost:5173) tenta acessar o backend
# (FastAPI em localhost:8000), o NAVEGADOR bloqueia por seguranca
# — sao "origens" diferentes (porta diferente = origem diferente).
#
# O CORS e a permissao explicita do backend dizendo:
# "Eu autorizo ESTES frontends a me acessar."
#
# Sem essa configuracao, o frontend recebe erro de CORS no console.
app.add_middleware(
    CORSMiddleware,
    # Lista de origens (frontends) permitidos:
    allow_origins=[
        "http://localhost:5173",  # Vite dev server (React em desenvolvimento)
        "http://localhost:5174",  # Vite dev server (porta alternativa)
        "http://localhost:4173",  # Vite preview (React em preview)
        "http://localhost:3000",  # Outra porta comum de desenvolvimento
    ],
    allow_credentials=True,   # Permite envio de cookies/tokens
    allow_methods=["*"],      # Permite todos os metodos HTTP (GET, POST, etc.)
    allow_headers=["*"],      # Permite todos os headers HTTP
)

# ============================================================
# SECAO: Montagem das Rotas
# ============================================================
# CONCEITO: include_router
# Conecta todas as rotas do chat_router (definidas em routes/chat.py)
# na aplicacao principal. O prefixo "/api" vem do router.
#
# Resultado: /api/chat, /api/ingest, /api/health, etc.
#
# Em projetos maiores, voce teria varios routers:
#   app.include_router(chat_router)    # /api/chat/...
#   app.include_router(auth_router)    # /api/auth/...
#   app.include_router(admin_router)   # /api/admin/...
app.include_router(chat_router)


# ============================================================
# SECAO: Rota Raiz
# ============================================================
# CONCEITO: Decorator @app.get("/")
# Registra esta funcao para responder requisicoes GET na raiz (/).
# E a "pagina inicial" da API — retorna informacoes basicas.
@app.get("/")
async def root():
    return {
        "service": "SAVA ACLS RAG API",
        "version": "0.1.0",
        "docs": "/docs",  # Lembra o usuario que a documentacao existe!
    }


# ============================================================
# RESUMO DO ARQUIVO: main.py
# ============================================================
# Conceitos Python aprendidos:
#   - Decorator @app.get(): registra funcao como endpoint HTTP
#   - Middleware: camada que intercepta todas as requisicoes
#
# Conceitos de API aprendidos:
#   - FastAPI(): criacao da aplicacao com metadados para /docs
#   - CORS: permissao para frontends de outra origem acessarem o backend
#   - include_router(): montagem modular de rotas
#   - /docs: documentacao interativa gerada automaticamente (Swagger UI)
#
# FIM DO ESTUDO DOS ARQUIVOS!
# Agora va para a secao "Desafios Integradores" do GUIA_ESTUDO_RAG.md
# ============================================================
