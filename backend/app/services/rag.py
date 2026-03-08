# ============================================================
# ARQUIVO: services/rag.py — Cadeia RAG (Retrieval-Augmented Generation)
# ============================================================

# CONCEITO: AsyncIterator
# Um "iterador assincrono" — permite entregar valores um por um
# de forma assincrona (sem travar o programa). Usado no streaming.
from collections.abc import AsyncIterator
from operator import itemgetter

# ============================================================
# SECAO: Imports do LangChain Core
# ============================================================

from langchain_core.output_parsers import StrOutputParser #extrai a string

# ChatPromptTemplate: modelo de prompt com placeholders.
# Permite criar mensagens com {variaveis} que sao preenchidas depois.
from langchain_core.prompts import ChatPromptTemplate

# ChatOpenAI: interface do LangChain para os modelos de chat da OpenAI.
from langchain_openai import ChatOpenAI

from app.config import OPENAI_API_KEY, OPENAI_MODEL, RETRIEVER_TOP_K, RETRIEVER_SCORE_THRESHOLD
from app.services.ingest import get_vector_store

# ============================================================
# SECAO: Prompt de Sistema (Prompt Engineering)
# ============================================================
# CONCEITO: Grounding (Fundamentacao)
# A regra 3 ("baseie suas respostas EXCLUSIVAMENTE no contexto")
# e a tecnica mais importante aqui. Ela forca o LLM a responder
# APENAS com base nos seus documentos, nao no conhecimento geral.
# Isso evita "alucinacoes" (o LLM inventar informacoes).
#
# O placeholder {context} sera substituido pelos chunks recuperados
# do ChromaDB na hora da consulta.
SYSTEM_PROMPT = """Você é um assistente médico especialista em ACLS (Advanced Cardiac Life Support), \
SAVA (Suporte Avançado de Vida em Cardiologia), PALS (Pediatric Advanced Life Support) e emergências médicas.

Seu papel é ajudar profissionais de saúde a tomar decisões rápidas em situações de crises em cenário de emergência, UTI e Bloco Cirúrgico, como as descrita no ACLS, SAVA e PALS \

REGRAS IMPORTANTES:
1. Responda SEMPRE em português brasileiro.
2. Seja direto e objetivo — em emergências, cada segundo conta.
3. Baseie suas respostas EXCLUSIVAMENTE no contexto fornecido abaixo.
4. Se a informação não estiver no contexto, diga claramente que não possui essa informação nos documentos disponíveis.
5. Inclua dosagens, intervalos e protocolos específicos quando disponíveis.
6. NUNCA invente informações médicas. Na dúvida, oriente a consultar o protocolo oficial.
7. Ao final da resposta, cite brevemente de qual documento/seção a informação foi extraída.
8. Use o HISTÓRICO DA CONVERSA abaixo para entender o contexto de perguntas de follow-up.

CONTEXTO DOS DOCUMENTOS:
{context}"""

# O {question} sera substituido pela pergunta do usuario
HUMAN_TEMPLATE = "{question}"


# ============================================================
# SECAO: Configuracao do LLM
# ============================================================
def get_llm() -> ChatOpenAI:
    """Cria e retorna o modelo de linguagem (LLM) configurado."""
    return ChatOpenAI(
        model=OPENAI_MODEL,            
        openai_api_key=OPENAI_API_KEY,
        temperature=0.1,
        # streaming=True permite receber a resposta token por token
        # ao inves de esperar a resposta completa.
        streaming=True,
    )

# ============================================================
# SECAO: Formatacao dos Documentos Recuperados
# ============================================================
def format_docs(docs: list) -> str:
    """Formata os chunks recuperados do ChromaDB em texto legivel.

    Cada chunk recebe uma etiqueta com a fonte (nome do PDF e pagina).
    Isso permite que o LLM cite de onde veio a informacao.
    """
    formatted = []
    for doc in docs:
        # .get() busca um valor no dicionario; se nao existir, usa o padrao
        source = doc.metadata.get("source_file", "desconhecido")
        page = doc.metadata.get("page", "?")
        formatted.append(f"[Fonte: {source}, p.{page}]\n{doc.page_content}")

    # Junta todos os chunks separados por "---"
    return "\n\n---\n\n".join(formatted)


# ============================================================
# SECAO: Construcao da Cadeia RAG (LCEL)
# ============================================================
def build_rag_chain():
    """Constroi a cadeia RAG completa usando LCEL (LangChain Expression Language).

    CONCEITO: LCEL e o operador |
    O operador | (pipe) conecta componentes em sequencia, como tubos.
    A saida de um componente vira a entrada do proximo.
    E como uma linha de montagem em uma fabrica.
    """

    # Passo preparatorio: criar o retriever a partir do ChromaDB
    vector_store = get_vector_store()

    # Validacao: verificar se existem documentos indexados
    if vector_store._collection.count() == 0:
        raise ValueError(
            "Nenhum documento indexado no ChromaDB. "
            "Execute a ingestao de PDFs antes de usar o chat."
        )

    retriever = vector_store.as_retriever( #resgata vetores da vectostore
        search_type="similarity_score_threshold", #busca por similaridade e resgata as melhores
        search_kwargs={
            "k": RETRIEVER_TOP_K, # Retorna os 4 mais relevantes
            "score_threshold": RETRIEVER_SCORE_THRESHOLD
            },  
    )

    
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("placeholder", "{chat_history}"),
        ("human", HUMAN_TEMPLATE),
    ])

   
    chain = (
        {
            "context": itemgetter("question") | retriever | format_docs, "question": itemgetter("question"), "chat_history": itemgetter("chat_history")}
        | prompt
        | get_llm()
        | StrOutputParser()
    )

    return chain


# ============================================================
# SECAO: Cache da Cadeia RAG (Singleton Lazy)
# ============================================================
# A chain e criada uma unica vez e reutilizada em todas as requisicoes.
# Isso evita recriar o LLM, retriever e conexao ChromaDB a cada pergunta.
# Quando novos documentos sao ingeridos, o cache e invalidado.
_rag_chain = None


def get_rag_chain():
    """Retorna a chain RAG cacheada (cria na primeira chamada)."""
    global _rag_chain
    if _rag_chain is None:
        _rag_chain = build_rag_chain()
    return _rag_chain


async def ask(question: str, chat_history: list | None = None) -> str:
    """Faz uma pergunta e retorna a resposta completa (não streaming)."""
    chain = get_rag_chain()
    return await chain.ainvoke({
        "question": question,
        "chat_history": chat_history or [],
    })


async def ask_stream(question: str, chat_history: list | None = None) -> AsyncIterator[str]:
    """Faz uma pergunta e retorna a resposta token por token (streaming)."""
    chain = get_rag_chain()
    async for chunk in chain.astream({
        "question": question,
        "chat_history": chat_history or [],
    }):
        yield chunk


# ============================================================
# RESUMO DO ARQUIVO: services/rag.py
# ============================================================
# Conceitos Python aprendidos:
#   - async/await: programacao assincrona (nao trava o programa)
#   - AsyncIterator: iterador que entrega valores de forma assincrona
#   - yield: retorna um valor e pausa a funcao (generator)
#   - async for: loop assincrono para consumir iteradores async
#   - .get(): busca em dicionarios com valor padrao
#
# Conceitos RAG/LangChain aprendidos:
#   - LCEL (|): operador pipe para montar cadeias de processamento
#   - Retriever: componente que busca documentos por similaridade
#   - RunnablePassthrough: passa o valor adiante sem modificar
#   - ChatPromptTemplate: template de prompt com placeholders
#   - StrOutputParser: extrai texto da resposta do LLM
#   - Temperature: controle de criatividade (0.1 = factual)
#   - Grounding: forcar o LLM a usar apenas o contexto fornecido
#   - Streaming (astream): resposta token por token em tempo real
#
# Proximo arquivo para estudar: app/routes/chat.py
# ============================================================
