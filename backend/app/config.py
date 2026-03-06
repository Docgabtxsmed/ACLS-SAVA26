# ============================================================
# ARQUIVO: config.py — Central de Configuracao do Sistema
# ============================================================
# Este arquivo e o PRIMEIRO que voce deve estudar.
# Ele define todas as configuracoes do sistema em um so lugar.
# Todos os outros arquivos importam valores daqui.
# ============================================================

# CONCEITO: os (operating system)
# Modulo padrao do Python para interagir com o sistema operacional.
# Aqui usamos os.getenv() para ler variaveis de ambiente.
import os

# CONCEITO: pathlib.Path
# Forma moderna de trabalhar com caminhos de arquivos no Python.
# Substitui os.path.join() com uma sintaxe mais limpa.
from pathlib import Path

# CONCEITO: python-dotenv
# Biblioteca que le o arquivo .env e coloca os valores nas variaveis de ambiente.
# Assim voce pode guardar segredos (API keys) fora do codigo.
from dotenv import load_dotenv

# Carrega as variaveis do arquivo .env para o ambiente.
# A partir daqui, os.getenv() consegue ler os valores do .env
load_dotenv()

# CONCEITO: __file__ e Path
# __file__     = caminho completo DESTE arquivo (config.py)
# .resolve()   = transforma em caminho absoluto (remove .. e .)
# .parent      = sobe um nivel na pasta
#
# Exemplo pratico:
#   __file__        = /projeto/backend/app/config.py
#   .resolve()      = /projeto/backend/app/config.py
#   .parent         = /projeto/backend/app/
#   .parent.parent  = /projeto/backend/          <-- BASE_DIR!
BASE_DIR = Path(__file__).resolve().parent.parent

# ============================================================
# SECAO: Configuracoes da OpenAI
# ============================================================
# os.getenv("CHAVE", "padrao") = le a variavel de ambiente "CHAVE".
# Se nao existir, usa o valor "padrao" (segundo argumento).

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

if not OPENAI_API_KEY:
    import sys
    sys.exit("ERRO: OPENAI_API_KEY nao configurada. Configure no arquivo .env e reinicie o servidor.")

# ============================================================
# SECAO: Caminhos de Diretorios
# ============================================================
# CONCEITO: Operador / do pathlib
# Em pathlib, o / NAO e divisao matematica — ele junta caminhos!
# BASE_DIR / "chroma_db" = "/projeto/backend/chroma_db"
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", str(BASE_DIR / "chroma_db"))
PDF_DIR = os.getenv("PDF_DIR", str(BASE_DIR / "data" / "pdfs"))

# ============================================================
# SECAO: Parametros RAG (Retrieval-Augmented Generation)
# ============================================================
# Estes 3 parametros controlam a qualidade das respostas do chatbot.
# int() converte a string do .env para numero inteiro.

# CHUNK_SIZE: tamanho maximo de cada pedaco de texto (em caracteres).
# 1000 chars ≈ 250 tokens. Chunks maiores = mais contexto, mas menos precisao.
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))

# CHUNK_OVERLAP: sobreposicao entre chunks consecutivos.
# 200 chars do final de um chunk se repetem no inicio do proximo.
# Isso evita perder informacao na "fronteira" entre chunks.
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))

# RETRIEVER_TOP_K: quantos chunks sao recuperados para cada pergunta.
# 4 chunks = o LLM recebe 4 trechos relevantes como contexto.
# Mais = respostas mais completas, mas custo maior de tokens.
RETRIEVER_TOP_K = int(os.getenv("RETRIEVER_TOP_K", "4"))

# Nome da colecao no ChromaDB (como uma "tabela" em banco de dados).
# Todos os documentos ACLS ficam nesta colecao.
COLLECTION_NAME = "acls_documents"

# ============================================================
# RESUMO DO ARQUIVO: config.py
# ============================================================
# Conceitos Python aprendidos:
#   - pathlib.Path: manipulacao moderna de caminhos de arquivo
#   - __file__: variavel especial com o caminho do arquivo atual
#   - os.getenv(): leitura de variaveis de ambiente com valor padrao
#   - int(): conversao de string para inteiro
#   - load_dotenv(): carregamento de arquivo .env
#
# Conceitos RAG aprendidos:
#   - CHUNK_SIZE: tamanho dos pedacos de texto
#   - CHUNK_OVERLAP: sobreposicao entre pedacos
#   - RETRIEVER_TOP_K: quantidade de documentos recuperados
#   - COLLECTION_NAME: agrupamento de documentos no ChromaDB
#
# Proximo arquivo para estudar: app/services/ingest.py
# ============================================================
