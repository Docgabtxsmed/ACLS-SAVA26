# ============================================================
# ARQUIVO: config.py — Central de Configuracao do Sistema
# ===========================================================
# Este arquivo define todas as configuracoes do sistema em um so lugar.
# Todos os outros arquivos importam valores daqui.
# ============================================================

import os

# CONCEITO: pathlib.Path
# Forma moderna de trabalhar com caminhos de arquivos no Python.
# Substitui os.path.join() com uma sintaxe mais limpa.
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ===========================================================
# SECAO: Configuracoes da OpenAI
#============================================================
# os.getenv("CHAVE", "padrao") = le a variavel de ambiente "CHAVE".
# Se nao existir, usa o valor "padrao" (segundo argumento).

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

if not OPENAI_API_KEY:
    import sys
    sys.exit("ERRO: OPENAI_API_KEY nao configurada. Configure no arquivo .env e reinicie o servidor.")

#Embbeding Huggingface
HUGGINGFACE_EMBEDDING_MODEL = os.getenv(
    "HUGGINGFACE_EMBBEDING_MODEL",
    "intfloat/multilingual-e5-small"
)
EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER", "huggingface")

# ============================================================
# SECAO: Caminhos de Diretorios
# ============================================================
# CONCEITO: Operador / do pathlib
# Em pathlib, o / NAO e divisao matematica — ele junta caminhos!
# BASE_DIR / "chroma_db" = "/projeto/backend/chroma_db"
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", str(BASE_DIR / "chroma_db"))
PDF_DIR = os.getenv("PDF_DIR", str(BASE_DIR / "data" / "pdfs"))

#Retriever

# RETRIEVER_TOP_K: quantos chunks sao recuperados para cada pergunta.
RETRIEVER_TOP_K = int(os.getenv("RETRIEVER_TOP_K", "3"))

# RETRIEVER_SCORE_THRESHOLD: score mínimo de similaridade (0 a 1).
# Chunks com score abaixo desse valor são descartados.
# 0.3 = permissivo (traz mais contexto, mas pode incluir ruído)
# 0.5 = equilibrado (recomendado para começar)
# 0.7 = restritivo (só traz contexto muito relevante)

RETRIEVER_SCORE_THRESHOLD = float(os.getenv("RETRIEVER_SCORE_THRESHOLD", "0.5"))

# Nome da colecao no ChromaDB (como uma "tabela" em banco de dados).
# Todos os documentos ACLS ficam nesta colecao.
COLLECTION_NAME = "acls_documents"

CHAT_HISTORY_MAX_MESSAGES = int(os.getenv("CHAT_HISTORY_MAX_MESSAGES", "5"))

