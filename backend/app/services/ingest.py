# ============================================================
# ARQUIVO: services/ingest.py — Pipeline de Ingestao de PDFs
# =================================================

from pathlib import Path
import chromadb 
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import OpenAIEmbeddings
from langchain_experimental.text_splitter import SemanticChunker
from langchain_huggingface import HuggingFaceEmbeddings

# Importa as configuracoes centrais do config.py (Modulo 1)
from app.config import (
    CHROMA_PERSIST_DIR,
    COLLECTION_NAME,
    OPENAI_API_KEY,
    OPENAI_EMBEDDING_MODEL,
    PDF_DIR,
    HUGGINGFACE_EMBEDDING_MODEL,
    EMBEDDING_PROVIDER
)
# ============================================================
# SECAO: Funcoes de Conexao (Embeddings e ChromaDB)
# ============================================================
# CONCEITO: Type Hint "-> OpenAIEmbeddings" | A seta -> indica o TIPO de retorno da funcao | Nao muda o comportamento, mas documenta que esta funcao | Retorna um objeto do tipo OpenAIEmbeddings.

def get_embeddings():
    """ - "huggingface": roda localmente no seu Mac (gratuito)
        - "openai": usa a API da OpenAI (pago)
    """
    if EMBEDDING_PROVIDER == "huggingface":
        return HuggingFaceEmbeddings(
            model_name=HUGGINGFACE_EMBEDDING_MODEL,
        )
    else:
        return OpenAIEmbeddings(
            model=OPENAI_EMBEDDING_MODEL,
            openai_api_key=OPENAI_API_KEY,
        )


def get_vector_store() -> Chroma:
    """Cria e retorna a conexao com o ChromaDB.

    DEEP DIVE — ChromaDB:
    - collection_name: como uma "tabela" no banco. Agrupa documentos relacionados.
      Voce pode ter colecoes diferentes para temas diferentes.
    - embedding_function: o ChromaDB usa essa funcao AUTOMATICAMENTE quando voce
      adiciona documentos. Ele transforma o texto em vetor sem voce precisar fazer manualmente.
    - persist_directory: pasta no disco onde os dados sao salvos.
      Se voce reiniciar o servidor, os embeddings continuam la!
    """
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=get_embeddings(),
        persist_directory=CHROMA_PERSIST_DIR,
    )


# ============================================================
# SECAO: Etapa 1 — Carregar PDFs
# ============================================================

# CONCEITO: Type Hint "str | None"
# O parametro pdf_dir aceita uma string OU None (nenhum valor).
# O "= None" define None como valor padrao (se nao for informado).
def load_pdfs(pdf_dir: str | None = None) -> list:
    """Carrega todos os PDFs de um diretorio e retorna uma lista de Documents."""

    directory = Path(pdf_dir or PDF_DIR)

    # Verifica se a pasta existe antes de tentar ler
    if not directory.exists():
        raise FileNotFoundError(f"PDF directory not found: {directory}")

    documents = []

    pdf_files = list(directory.glob("*.pdf"))
    if not pdf_files:
        raise FileNotFoundError(f"No PDF files found in: {directory}")

    for pdf_path in pdf_files:
        loader = PyPDFLoader(str(pdf_path))
        docs = loader.load()

        # Adicionamos o nome do arquivo nos metadados de cada pagina.
        # Isso permite rastrear DE QUAL PDF veio cada chunk depois.
        for doc in docs:
            doc.metadata["source_file"] = pdf_path.name
        documents.extend(docs)

    return documents


# ============================================================
# SECAO: Etapa 2 — Dividir em Chunks
# ============================================================
def split_documents(documents: list) -> list:
   splitter = SemanticChunker(
                embeddings=get_embeddings() ,
                breakpoint_threshold_type="percentile",
        )
   return splitter.split_documents(documents)


# ============================================================
# SECAO: Etapa 3 — Pipeline Completa (Load → Split → Embed → Store)
# ============================================================
def ingest_pdfs(pdf_dir: str | None = None) -> dict:
    """Pipeline completa de ingestao: carrega PDFs, divide em chunks,
    gera embeddings e armazena no ChromaDB.

    Esta funcao orquestra as 3 etapas anteriores em sequencia.
    """
    # Etapa 1: Carregar PDFs (loader)
    documents = load_pdfs(pdf_dir)
    # Etapa 2: Dividir em chunks
    chunks = split_documents(documents)
    # Etapa 3: Limpar dados anteriores para evitar duplicatas na re-ingestao.
    client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    try:
        client.delete_collection(COLLECTION_NAME)
    except ValueError:
        pass  # Collection ainda nao existe

    # Etapa 4: Gerar embeddings e armazenar no ChromaDB.
    # add_documents() faz DUAS coisas automaticamente:
    #   1. Chama a embedding_function para cada chunk (texto → vetor)
    #   2. Salva o vetor + texto + metadados no ChromaDB
    vector_store = get_vector_store()
    vector_store.add_documents(chunks)

    # Invalida o cache da chain RAG para usar os novos documentos
    import app.services.rag as rag_module
    rag_module._rag_chain = None

    # Retorna estatisticas da ingestao
    return {
        "status": "success",
        "documents_loaded": len(documents),
        "chunks_created": len(chunks),
        "pdf_directory": str(pdf_dir or PDF_DIR),
    }


def get_ingested_stats() -> dict:
    """Retorna estatisticas do vector store (quantos chunks estao armazenados)."""
    vector_store = get_vector_store()

    # CONCEITO: Atributo privado (_collection)
    # O prefixo _ indica que e um atributo "interno" do ChromaDB.
    # Acessamos diretamente para obter a contagem de documentos.
    collection = vector_store._collection
    return {
        "total_chunks": collection.count(),
        "collection_name": COLLECTION_NAME,
    }