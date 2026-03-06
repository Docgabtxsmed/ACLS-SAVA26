# ============================================================
# ARQUIVO: auth.py — Autenticação e Autorização
# ============================================================
# Este arquivo valida tokens JWT do Supabase Auth.
# Protege os endpoints de chat, garantindo que apenas
# usuários autenticados possam usar o chatbot IA.
#
# Suporta chaves ECC (P-256 / ES256) e Legacy HS256.
# Busca automaticamente as chaves públicas do Supabase via JWKS.
# ============================================================

import os
import time
from typing import Any

from dotenv import load_dotenv

load_dotenv()

import httpx
from fastapi import Header, HTTPException
from jose import JWTError, jwt

# ============================================================
# SECAO: Configuração das variáveis Supabase
# ============================================================

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "")

# ============================================================
# SECAO: Cache da chave pública JWKS
# ============================================================
# Armazena as chaves JWKS em cache para não buscar em toda requisição.
# O cache expira a cada 1 hora (3600 segundos).

_jwks_cache: dict[str, Any] = {
    "keys": None,
    "fetched_at": 0,
}
_JWKS_CACHE_TTL = 3600  # 1 hora em segundos


async def _get_jwks() -> list[dict[str, Any]]:
    """Busca as chaves públicas JWKS do Supabase (com cache)."""
    now = time.time()

    # Se o cache ainda é válido, retorna direto
    if _jwks_cache["keys"] and (now - _jwks_cache["fetched_at"]) < _JWKS_CACHE_TTL:
        return _jwks_cache["keys"]

    # Busca as chaves do endpoint JWKS do Supabase
    jwks_url = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(jwks_url, timeout=10.0)
            response.raise_for_status()
            jwks_data = response.json()

        keys = jwks_data.get("keys", [])
        _jwks_cache["keys"] = keys
        _jwks_cache["fetched_at"] = now
        return keys
    except Exception as e:
        # Se já tem cache antigo, usa mesmo expirado
        if _jwks_cache["keys"]:
            return _jwks_cache["keys"]
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar chaves de autenticação do Supabase: {str(e)}",
        )


def _find_jwk_by_kid(keys: list[dict[str, Any]], kid: str) -> dict[str, Any] | None:
    """Encontra a chave JWK que corresponde ao kid do token."""
    for key in keys:
        if key.get("kid") == kid:
            return key
    return None


# ============================================================
# SECAO: Verificação do Token JWT
# ============================================================

async def verify_supabase_token(authorization: str = Header(...)) -> dict[str, Any]:
    """
    Dependency do FastAPI que verifica o token JWT do Supabase.

    Suporta:
    - Chaves ECC (P-256) → algoritmo ES256 (padrão atual do Supabase)
    - Chaves Legacy HS256 → usa SUPABASE_JWT_SECRET do .env

    Retorna os dados do usuário decodificados do token.
    Levanta HTTPException 401 se o token for inválido.
    """
    # Extrair o token do header "Authorization: Bearer <token>"
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Token de autenticação inválido. Formato esperado: Bearer <token>",
        )

    token = authorization.replace("Bearer ", "", 1)

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Token de autenticação não fornecido.",
        )

    try:
        # Ler o header do token para saber o algoritmo e kid
        unverified_header = jwt.get_unverified_header(token)
        algorithm = unverified_header.get("alg", "")
        kid = unverified_header.get("kid", "")

        payload = None

        # ============================================================
        # Método 1: JWKS (para ECC/ES256 e RS256 — padrão atual)
        # ============================================================
        if kid and SUPABASE_URL:
            jwks_keys = await _get_jwks()
            matching_key = _find_jwk_by_kid(jwks_keys, kid)

            if matching_key:
                # python-jose aceita dict JWK diretamente como chave
                payload = jwt.decode(
                    token,
                    matching_key,
                    algorithms=[algorithm] if algorithm else ["ES256", "RS256"],
                    audience="authenticated",
                )

        # ============================================================
        # Método 2: JWT Secret (fallback para Legacy HS256)
        # ============================================================
        if payload is None and SUPABASE_JWT_SECRET:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )

        # ============================================================
        # Nenhum método conseguiu validar
        # ============================================================
        if payload is None:
            raise HTTPException(
                status_code=401,
                detail="Não foi possível validar o token. Verifique as configurações do Supabase.",
            )

        # Validar que o claim essencial existe
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Token inválido: identificador de usuário ausente.",
            )

        # Retornar dados essenciais do usuário
        return {
            "sub": user_id,
            "email": payload.get("email"),
            "role": payload.get("role"),
        }

    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token de autenticação inválido ou expirado: {str(e)}",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Erro ao validar token: {str(e)}",
        )


# ============================================================
# SECAO: Proteção do endpoint de ingestão (Admin)
# ============================================================

async def verify_admin_key(x_admin_key: str = Header(...)) -> bool:
    """
    Dependency do FastAPI que verifica a chave de admin para o endpoint de ingestão.

    Uso:
        @router.post("/ingest")
        async def ingest(is_admin: bool = Depends(verify_admin_key)):
            ...
    """
    if not ADMIN_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="ADMIN_API_KEY não configurada no servidor.",
        )

    if x_admin_key != ADMIN_API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Chave de administrador inválida.",
        )

    return True
