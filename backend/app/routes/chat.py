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
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# CONCEITO: Imports do FastAPI
# APIRouter: organiza endpoints em grupos (ao inves de jogar tudo no main.py)
# HTTPException: retorna erros HTTP padronizados (400, 404, 500, etc.)
# UploadFile: tipo especial para receber uploads de arquivos
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile

from app.limiter import limiter

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
from app.services.memory import add_to_history, get_history, clear_history

# CONCEITO: APIRouter
# prefix="/api" = todas as rotas deste arquivo comecam com /api
#   (ex: /api/chat, /api/ingest, /api/health)
# tags=["chat"] = agrupa as rotas na documentacao /docs
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
async def chat(request: Request, body: ChatRequest, user: dict = Depends(verify_supabase_token)):
    """Recebe uma pergunta e retorna a resposta completa. Requer autenticação."""
    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        user_id = user["sub"]

        # Busca o histórico de conversa do usuário
        history = get_history(user_id)

        # Converte para o formato que o LangChain espera
        chat_history = []
        for msg in history:
            chat_history.append((msg["role"], msg["content"]))

        # Faz a pergunta com o histórico
        answer = await ask(body.question, chat_history)

        # Salva a interação no histórico
        add_to_history(user_id, "user", body.question)
        add_to_history(user_id, "assistant", answer)

        return ChatResponse(answer=answer)
    except Exception as e:
        logger.error("/chat: %s", e, exc_info=True)
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
async def chat_stream(request: Request, body: ChatRequest, user: dict = Depends(verify_supabase_token)):
    """Recebe uma pergunta e retorna a resposta via streaming. Requer autenticação."""
    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    user_id = user["sub"]
    history = get_history(user_id)
    chat_history = [(msg["role"], msg["content"]) for msg in history]

    async def event_generator():
        full_response = []
        try:
            async for token in ask_stream(body.question, chat_history):
                full_response.append(token)
                yield {"event": "token", "data": json.dumps({"token": token})}

            # Salva no histórico após o streaming completo
            answer = "".join(full_response)
            add_to_history(user_id, "user", body.question)
            add_to_history(user_id, "assistant", answer)

            yield {"event": "done", "data": json.dumps({"status": "complete"})}
        except Exception as e:
            logger.error("/chat/stream: %s", e, exc_info=True)
            yield {"event": "error", "data": json.dumps({"error": "Erro interno ao processar a pergunta."})}

    return EventSourceResponse(event_generator())

@router.delete("/chat/history")
async def delete_history(user: dict = Depends(verify_supabase_token)):
    """Limpa o histórico de conversa do usuário. Requer autenticação."""
    clear_history(user["sub"])
    return {"status": "ok", "message": "Histórico limpo."}

# ============================================================
# SECAO: Endpoint de Ingestao
# ============================================================
@router.post("/ingest")
@limiter.limit("5/minute")
async def ingest(request: Request, is_admin: bool = Depends(verify_admin_key)):
    """Processa todos os PDFs da pasta configurada e armazena no ChromaDB. Requer chave de admin."""
    try:
        result = ingest_pdfs()
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("/ingest: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Erro interno durante a ingestão.")


# ============================================================
# SECAO: Endpoint de Upload + Ingestao
# ============================================================
@router.post("/ingest/upload")
@limiter.limit("5/minute")
async def ingest_upload(request: Request, file: UploadFile, is_admin: bool = Depends(verify_admin_key)):
    """Recebe upload de um PDF, salva em disco e processa. Requer chave de admin."""
    # Validacao: so aceita arquivos .pdf
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são aceitos.")

    # Validacao do tipo MIME (evita arquivos maliciosos renomeados para .pdf)
    if file.content_type not in ("application/pdf", "application/x-pdf"):
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
        logger.error("/ingest/upload: %s", e, exc_info=True)
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
async def health():
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
