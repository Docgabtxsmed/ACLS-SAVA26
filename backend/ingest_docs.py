#!/usr/bin/env python3
# ============================================================
# ARQUIVO: ingest_docs.py — Script CLI para Ingestao de PDFs
# ============================================================
# Este e um script de LINHA DE COMANDO (CLI) que voce roda no terminal
# para processar seus PDFs e armazenar no ChromaDB.
#
# CONCEITO: Shebang (#!/usr/bin/env python3)
# A primeira linha (comecando com #!) diz ao sistema operacional
# qual programa usar para rodar este arquivo.
# Com isso, voce pode rodar: ./ingest_docs.py (sem digitar "python")
# ============================================================
"""Script para ingestao inicial dos PDFs no ChromaDB.

Uso:
    python ingest_docs.py                    # Ingere todos os PDFs do diretorio padrao
    python ingest_docs.py /caminho/para/pdfs # Ingere PDFs de um diretorio especifico
"""

import sys
from pathlib import Path

# CONCEITO: sys.path — Como o Python encontra modulos
# Quando voce escreve "from app.services.ingest import ...",
# o Python procura a pasta "app" nos diretorios listados em sys.path.
#
# Problema: este script esta em backend/, mas o Python nao sabe
# que deve procurar modulos ali. Entao adicionamos manualmente:
#
# Path(__file__).parent = pasta deste script = backend/
# sys.path.insert(0, ...) = adiciona no INICIO da lista de busca
sys.path.insert(0, str(Path(__file__).parent))

# Agora o Python consegue encontrar o modulo "app"
from app.services.ingest import ingest_pdfs, get_ingested_stats


def main():
    # CONCEITO: sys.argv — Argumentos de Linha de Comando
    # sys.argv e uma lista com tudo que voce digitou no terminal:
    #   python ingest_docs.py /meus/pdfs
    #   sys.argv[0] = "ingest_docs.py"    (o proprio script)
    #   sys.argv[1] = "/meus/pdfs"         (primeiro argumento)
    #
    # len(sys.argv) > 1 = o usuario passou algum argumento?
    pdf_dir = sys.argv[1] if len(sys.argv) > 1 else None

    print("=" * 60)
    print("  SAVA ACLS — Ingestao de Documentos")
    print("=" * 60)

    if pdf_dir:
        print(f"\n  Diretorio: {pdf_dir}")
    else:
        print("\n  Usando diretorio padrao: ./data/pdfs/")

    print("\n  Processando PDFs...")

    # CONCEITO: try/except — Tratamento de Erros
    # try: tenta executar o codigo
    # except FileNotFoundError: se der esse erro especifico, trata aqui
    # except Exception: se der QUALQUER outro erro, trata aqui
    try:
        result = ingest_pdfs(pdf_dir)
        print(f"\n  Ingestao concluida!")
        print(f"   Documentos carregados: {result['documents_loaded']}")
        print(f"   Chunks criados: {result['chunks_created']}")

        stats = get_ingested_stats()
        print(f"   Total de chunks no ChromaDB: {stats['total_chunks']}")
        print(f"\n{'=' * 60}")

    except FileNotFoundError as e:
        print(f"\n  Erro: {e}")
        print("\n  Coloque seus PDFs na pasta ./data/pdfs/ e tente novamente.")
        # CONCEITO: sys.exit(1)
        # Encerra o programa com codigo 1 (indica erro).
        # Codigo 0 = sucesso, qualquer outro = erro.
        sys.exit(1)
    except Exception as e:
        print(f"\n  Erro inesperado: {e}")
        sys.exit(1)


# CONCEITO: if __name__ == "__main__"
# Esta e uma "guarda" padrao do Python:
# - Se voce RODAR este arquivo (python ingest_docs.py):
#     __name__ vale "__main__" → executa main()
# - Se voce IMPORTAR este arquivo de outro modulo:
#     __name__ vale "ingest_docs" → NAO executa main()
#
# Isso evita que o script rode automaticamente quando importado.
if __name__ == "__main__":
    main()


# ============================================================
# RESUMO DO ARQUIVO: ingest_docs.py
# ============================================================
# Conceitos Python aprendidos:
#   - Shebang (#!/usr/bin/env python3): header para scripts executaveis
#   - sys.path: lista de diretorios onde o Python busca modulos
#   - sys.argv: argumentos passados pela linha de comando
#   - sys.exit(): encerrar o programa com codigo de saida
#   - if __name__ == "__main__": guarda contra execucao na importacao
#   - try/except: tratamento de erros com tipos especificos
#
# Conceitos RAG/LangChain aprendidos:
#   - Este script e o PONTO DE ENTRADA para a ingestao
#   - Ele chama ingest_pdfs() que executa: Load → Split → Embed → Store
#
# Proximo arquivo para estudar: app/services/rag.py
# ============================================================
