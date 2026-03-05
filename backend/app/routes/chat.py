# ============================================================
# ARQUIVO: routes/chat.py — Endpoints da API (Rotas HTTP)
# ============================================================
# Este arquivo define os ENDPOINTS da API — os "enderecos"
# que o frontend (React) chama para interagir com o backend.
#
# Cada endpoint recebe uma requisicao HTTP e retorna uma resposta.
# Pense nos endpoints como "portas" do sistema: cada porta
# faz algo diferente (chat, ingestao, upload, estatisticas).
# ============================================================

import json
from pathlib import Path

# CONCEITO: Imports do FastAPI
# APIRouter: organiza endpoints em grupos (ao inves de jogar tudo no main.py)
# HTTPException: retorna erros HTTP padronizados (400, 404, 500, etc.)
# UploadFile: tipo especial para receber uploads de arquivos
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile

from slowapi import Limiter
from slowapi.util import get_remote_address

# CONCEITO: Pydantic BaseModel
# Pydantic valida dados automaticamente. Se alguem enviar um campo
# com tipo errado ou esquecer um campo obrigatorio, o FastAPI
# retorna erro 422 automaticamente, sem voce precisar verificar.
from pydantic import BaseModel

# EventSourceResponse: permite enviar dados do servidor para o cliente
# continuamente (streaming). Usado para o endpoint /chat/stream.
from sse_starlette.sse import EventSourceResponse

from app.auth import verify_admin_key, verify_supabase_token
from app.config import PDF_DIR
from app.services.ingest import get_ingested_stats, ingest_pdfs
from app.services.rag import ask, ask_stream

# CONCEITO: APIRouter
# prefix="/api" = todas as rotas deste arquivo comecam com /api
#   (ex: /api/chat, /api/ingest, /api/health)
# tags=["chat"] = agrupa as rotas na documentacao /docs
# Rate limiter para os endpoints de chat (30 req/min por IP)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api", tags=["chat"])


# ============================================================
# SECAO: Modelos de Dados (Pydantic)
# ============================================================
# Estes modelos definem a FORMA dos dados que entram e saem da API.
# O FastAPI usa eles para validar automaticamente.

class ChatRequest(BaseModel):
    """Modelo da requisicao de chat. O frontend envia: {"question": "texto"}"""
    question: str    # Campo obrigatorio do tipo string


class ChatResponse(BaseModel):
    """Modelo da resposta de chat. O backend retorna: {"answer": "texto"}"""
    answer: str      # Campo obrigatorio do tipo string


# ============================================================
# SECAO: Endpoint de Chat (Resposta Completa)
# ============================================================

# CONCEITO: Decorator @router.post()
# O decorator "embrulha" a funcao e registra ela como um endpoint.
# @router.post("/chat") faz 3 coisas:
#   1. Registra a funcao para responder requisicoes POST em /api/chat
#   2. Valida que o body e um ChatRequest valido
#   3. Garante que a resposta sera um ChatResponse valido
#
# response_model=ChatResponse = define o formato da resposta na documentacao
@router.post("/chat", response_model=ChatResponse)
@limiter.limit("30/minute")
async def chat(req: Request, request: ChatRequest, user: dict = Depends(verify_supabase_token)):
    """Recebe uma pergunta e retorna a resposta completa. Requer autenticação."""

    # .strip() remove espacos em branco. Se a pergunta estiver vazia:
    if not request.question.strip():
        # HTTPException retorna um erro HTTP padronizado.
        # status_code=400 = "Bad Request" (erro do cliente)
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        # await = espera a resposta do LLM (assincrono, nao trava)
        answer = await ask(request.question)
        return ChatResponse(answer=answer)
    except Exception as e:
        # Loga o erro interno sem expor detalhes ao cliente
        print(f"[ERROR] /chat: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao processar a pergunta.")


# ============================================================
# SECAO: Endpoint de Chat com Streaming (SSE)
# ============================================================

# CONCEITO: Server-Sent Events (SSE)
# SSE e um protocolo onde o servidor EMPURRA dados para o cliente
# continuamente, sem o cliente precisar ficar perguntando.
#
# Fluxo:
#   1. Frontend abre uma conexao POST /api/chat/stream
#   2. Backend comeca a gerar a resposta token por token
#   3. Cada token e enviado como um "evento" SSE
#   4. Frontend recebe e exibe em tempo real (como o ChatGPT)
#   5. Quando termina, envia um evento "done"
@router.post("/chat/stream")
@limiter.limit("30/minute")
async def chat_stream(req: Request, request: ChatRequest, user: dict = Depends(verify_supabase_token)):
    """Recebe uma pergunta e retorna a resposta via streaming (token por token). Requer autenticação."""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # CONCEITO: Async Generator (funcao geradora assincrona)
    # event_generator() e uma funcao que usa "yield" para entregar
    # dados um por um. Cada yield envia um evento SSE para o cliente.
    async def event_generator():
        try:
            # async for = loop que espera cada token do LLM
            async for token in ask_stream(request.question):
                # Cada token e enviado como um evento "token" com dados JSON
                yield {"event": "token", "data": json.dumps({"token": token})}

            # Quando todos os tokens foram enviados, sinaliza o fim
            yield {"event": "done", "data": json.dumps({"status": "complete"})}
        except Exception as e:
            # Loga o erro interno sem expor detalhes ao cliente
            print(f"[ERROR] /chat/stream: {e}")
            yield {"event": "error", "data": json.dumps({"error": "Erro interno ao processar a pergunta."})}

    # EventSourceResponse envia os eventos SSE pela conexao HTTP
    return EventSourceResponse(event_generator())


# ============================================================
# SECAO: Endpoint de Ingestao
# ============================================================
@router.post("/ingest")
@limiter.limit("5/minute")
async def ingest(req: Request, is_admin: bool = Depends(verify_admin_key)):
    """Processa todos os PDFs da pasta configurada e armazena no ChromaDB. Requer chave de admin."""
    try:
        result = ingest_pdfs()
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"[ERROR] /ingest: {e}")
        raise HTTPException(status_code=500, detail="Erro interno durante a ingestão.")


# ============================================================
# SECAO: Endpoint de Upload + Ingestao
# ============================================================
@router.post("/ingest/upload")
@limiter.limit("5/minute")
async def ingest_upload(req: Request, file: UploadFile, is_admin: bool = Depends(verify_admin_key)):
    """Recebe upload de um PDF, salva em disco e processa. Requer chave de admin."""
    # Validacao: so aceita arquivos .pdf
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são aceitos.")

    # Previne path traversal: extrai apenas o nome do arquivo, sem caminhos
    safe_filename = Path(file.filename).name
    if ".." in safe_filename or "/" in safe_filename or "\\" in safe_filename:
        raise HTTPException(status_code=400, detail="Nome de arquivo inválido.")

    # Limite de tamanho: 50MB
    MAX_SIZE = 50 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Arquivo muito grande. Limite: 50MB.")

    pdf_dir = Path(PDF_DIR)
    pdf_dir.mkdir(parents=True, exist_ok=True)

    file_path = pdf_dir / safe_filename
    file_path.write_bytes(content)

    try:
        result = ingest_pdfs()
        return result
    except Exception as e:
        print(f"[ERROR] /ingest/upload: {e}")
        raise HTTPException(status_code=500, detail="Erro interno durante a ingestão.")


# ============================================================
# SECAO: Endpoints de Utilidade
# ============================================================
@router.get("/stats")
async def stats(user: dict = Depends(verify_supabase_token)):
    """Retorna estatisticas do vector store (quantos chunks armazenados). Requer autenticação."""
    try:
        return get_ingested_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao buscar estatísticas.")


@router.get("/health")
async def health(user: dict = Depends(verify_supabase_token)):
    """Health check — endpoint para verificar se o servidor esta funcionando.
    Usado por ferramentas de monitoramento e load balancers."""
    return {"status": "ok", "service": "SAVA ACLS RAG API"}


# ============================================================
# RESUMO DO ARQUIVO: routes/chat.py
# ============================================================
# Conceitos Python aprendidos:
#   - Decorators: @router.post(), @router.get() registram endpoints
#   - Pydantic BaseModel: validacao automatica de dados
#   - async def / await: funcoes assincronas em endpoints
#   - yield em async generators: entrega de dados um por um
#   - try/except com HTTPException: tratamento de erros HTTP
#
# Conceitos de API aprendidos:
#   - APIRouter: organizacao modular de endpoints
#   - response_model: define o formato da resposta
#   - SSE (Server-Sent Events): streaming do servidor para o cliente
#   - UploadFile: recebimento de uploads de arquivos
#   - Status codes: 400 (bad request), 404 (not found), 500 (server error)
#   - EventSourceResponse: wrapper para enviar eventos SSE
#
# Proximo arquivo para estudar: app/main.py
# ============================================================
