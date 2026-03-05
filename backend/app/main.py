# ============================================================
# ARQUIVO: main.py — Aplicacao Principal (FastAPI)
# ============================================================
# Este e o PONTO DE ENTRADA do servidor. Ele:
#   1. Cria a aplicacao FastAPI
#   2. Configura CORS (permissao para o frontend acessar)
#   3. Configura Rate Limiting (limita requisições por IP)
#   4. Conecta as rotas (endpoints) definidas em routes/chat.py
#
# Para rodar: uvicorn app.main:app --reload --port 8000
# ============================================================

import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Rate limiting com slowapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

# Importa o router do chat.py (que contem todos os endpoints /api/...)
from app.routes.chat import router as chat_router

# ============================================================
# SECAO: Configuracao do Rate Limiter
# ============================================================
# CONCEITO: Rate Limiting
# Limita o número de requisições que um IP pode fazer por minuto.
# Isso protege contra abuso e controla custos da OpenAI.
#
# get_remote_address = função que extrai o IP do cliente da requisição
# default_limits = limite padrão para todas as rotas (pode ser sobrescrito)
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

# ============================================================
# SECAO: Criacao da Aplicacao FastAPI
# ============================================================
app = FastAPI(
    title="SAVA ACLS RAG API",
    description="API de chatbot para emergências médicas com RAG (Retrieval-Augmented Generation)",
    version="0.2.0",
)

# Associa o limiter à aplicação
app.state.limiter = limiter

# ============================================================
# SECAO: Handler para Rate Limit Excedido (429)
# ============================================================
# Quando o limite é excedido, retorna uma mensagem em português


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Limite de requisições excedido. Aguarde um momento antes de tentar novamente.",
            "retry_after": str(exc.detail),
        },
    )


# ============================================================
# SECAO: Configuracao CORS
# ============================================================
# Origens permitidas: lê de ALLOWED_ORIGINS (comma-separated) ou usa fallback localhost
_default_origins = [
    "http://localhost:5173",  # Vite dev server (React em desenvolvimento)
    "http://localhost:5174",  # Vite dev server (porta alternativa)
    "http://localhost:4173",  # Vite preview (React em preview)
    "http://localhost:3000",  # Outra porta comum de desenvolvimento
]
_env_origins = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = (
    [o.strip() for o in _env_origins.split(",") if o.strip()]
    if _env_origins
    else _default_origins
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# SECAO: Montagem das Rotas
# ============================================================
app.include_router(chat_router)


# ============================================================
# SECAO: Rota Raiz
# ============================================================
@app.get("/")
async def root():
    return {
        "service": "SAVA ACLS RAG API",
        "version": "0.2.0",
        "docs": "/docs",
    }
