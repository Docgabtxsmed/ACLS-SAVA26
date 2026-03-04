# ============================================================
# ARQUIVO: services/ingest.py — Pipeline de Ingestao de PDFs
# ============================================================
# Este e o arquivo mais importante para entender como os documentos
# sao processados e armazenados. Ele faz 3 coisas:
#   1. CARREGA os PDFs (extrai o texto)
#   2. DIVIDE o texto em chunks (pedacos menores)
#   3. ARMAZENA os embeddings no ChromaDB (banco vetorial)
# ============================================================

from pathlib import Path

# ============================================================
# SECAO: Imports do LangChain
# ============================================================
# O LangChain e modular — cada funcionalidade vem de um pacote separado:

# Chroma: interface do LangChain para o banco de dados vetorial ChromaDB.
# Permite armazenar, buscar e gerenciar embeddings.
from langchain_chroma import Chroma

# PyPDFLoader: carregador de PDFs. Extrai o texto pagina por pagina
# e retorna objetos Document com o texto e metadados (numero da pagina, etc).
from langchain_community.document_loaders import PyPDFLoader

# OpenAIEmbeddings: converte texto em vetores numericos usando a API da OpenAI.
# O modelo "text-embedding-3-small" transforma texto em vetores de 1536 dimensoes.
from langchain_openai import OpenAIEmbeddings

# RecursiveCharacterTextSplitter: divide textos longos em chunks menores.
# "Recursive" porque tenta diferentes separadores em ordem de prioridade.
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Importa as configuracoes centrais do config.py (Modulo 1)
from app.config import (
    CHUNK_OVERLAP,
    CHUNK_SIZE,
    CHROMA_PERSIST_DIR,
    COLLECTION_NAME,
    OPENAI_API_KEY,
    OPENAI_EMBEDDING_MODEL,
    PDF_DIR,
)


# ============================================================
# SECAO: Funcoes de Conexao (Embeddings e ChromaDB)
# ============================================================

# CONCEITO: Type Hint "-> OpenAIEmbeddings"
# A seta -> indica o TIPO de retorno da funcao.
# Nao muda o comportamento, mas documenta que esta funcao
# retorna um objeto do tipo OpenAIEmbeddings.
def get_embeddings() -> OpenAIEmbeddings:
    """Cria e retorna o modelo de embeddings da OpenAI."""
    return OpenAIEmbeddings(
        model=OPENAI_EMBEDDING_MODEL,     # "text-embedding-3-small"
        openai_api_key=OPENAI_API_KEY,    # Sua chave da OpenAI
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

    # CONCEITO: Operador "or"
    # "pdf_dir or PDF_DIR" = se pdf_dir for None (ou vazio), usa PDF_DIR
    directory = Path(pdf_dir or PDF_DIR)

    # Verifica se a pasta existe antes de tentar ler
    if not directory.exists():
        raise FileNotFoundError(f"PDF directory not found: {directory}")

    documents = []

    # CONCEITO: glob("*.pdf")
    # glob busca arquivos que casam com um padrao.
    # "*.pdf" = todos os arquivos que terminam em .pdf
    pdf_files = list(directory.glob("*.pdf"))

    if not pdf_files:
        raise FileNotFoundError(f"No PDF files found in: {directory}")

    for pdf_path in pdf_files:
        # PyPDFLoader le o PDF e extrai o texto pagina por pagina.
        # Cada pagina vira um Document com:
        #   - page_content: o texto da pagina
        #   - metadata: {"source": "caminho/do/arquivo.pdf", "page": 0}
        loader = PyPDFLoader(str(pdf_path))
        docs = loader.load()

        # Adicionamos o nome do arquivo nos metadados de cada pagina.
        # Isso permite rastrear DE QUAL PDF veio cada chunk depois.
        for doc in docs:
            doc.metadata["source_file"] = pdf_path.name

        # CONCEITO: extend() vs append()
        # extend() adiciona CADA item da lista individualmente
        # append() adicionaria a lista inteira como um unico item
        # [1,2].extend([3,4]) = [1,2,3,4]
        # [1,2].append([3,4]) = [1,2,[3,4]]  <-- NAO e o que queremos!
        documents.extend(docs)

    return documents


# ============================================================
# SECAO: Etapa 2 — Dividir em Chunks
# ============================================================
def split_documents(documents: list) -> list:
    """Divide os documentos em chunks menores para embedding.

    Por que dividir?
    - LLMs tem limite de tokens (contexto).
    - Chunks menores permitem busca mais precisa.
    - Um PDF de 100 paginas nao cabe inteiro no prompt.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,         # Maximo de 1000 caracteres por chunk
        chunk_overlap=CHUNK_OVERLAP,   # 200 caracteres se repetem entre chunks

        # length_function: funcao usada para medir o tamanho do texto.
        # len = conta caracteres. Poderia usar uma funcao que conta tokens.
        length_function=len,

        # separators: lista de separadores em ORDEM DE PRIORIDADE.
        # O splitter tenta o primeiro ("\n\n" = paragrafo).
        # Se o chunk ficar grande demais, tenta o proximo ("\n" = linha).
        # E assim por diante, ate chegar em "" (caractere por caractere).
        separators=["\n\n", "\n", ". ", " ", ""],
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
    # Etapa 1: Carregar PDFs
    documents = load_pdfs(pdf_dir)

    # Etapa 2: Dividir em chunks
    chunks = split_documents(documents)

    # Etapa 3: Gerar embeddings e armazenar no ChromaDB.
    # add_documents() faz DUAS coisas automaticamente:
    #   1. Chama a embedding_function para cada chunk (texto → vetor)
    #   2. Salva o vetor + texto + metadados no ChromaDB
    vector_store = get_vector_store()
    vector_store.add_documents(chunks)

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


# ============================================================
# RESUMO DO ARQUIVO: services/ingest.py
# ============================================================
# Conceitos Python aprendidos:
#   - Type Hints: "str | None", "-> list", "-> dict"
#   - pathlib.glob(): busca de arquivos por padrao
#   - extend() vs append(): formas de adicionar itens a listas
#   - Atributos privados: prefixo _ em Python
#
# Conceitos RAG/LangChain aprendidos:
#   - PyPDFLoader: extrai texto de PDFs pagina por pagina
#   - RecursiveCharacterTextSplitter: divide texto em chunks com overlap
#   - OpenAIEmbeddings: converte texto em vetores numericos
#   - ChromaDB: banco vetorial com persistencia em disco
#     - Collections: agrupamento logico de documentos
#     - persist_directory: dados salvos em disco
#     - embedding_function: vetorizacao automatica ao adicionar docs
#     - add_documents(): gera embeddings + armazena
#   - Pipeline de ingestao: Load → Split → Embed → Store
#
# Proximo arquivo para estudar: ingest_docs.py
# ============================================================
