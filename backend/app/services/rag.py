# ============================================================
# ARQUIVO: services/rag.py — Cadeia RAG (Retrieval-Augmented Generation)
# ============================================================
# Este e o CEREBRO do sistema. Quando o usuario faz uma pergunta:
#   1. BUSCA os chunks mais relevantes no ChromaDB (Retrieval)
#   2. MONTA um prompt com o contexto encontrado (Augmented)
#   3. ENVIA para o GPT-4o gerar a resposta (Generation)
#
# RAG = Retrieval + Augmented + Generation
# ============================================================

# CONCEITO: AsyncIterator
# Um "iterador assincrono" — permite entregar valores um por um
# de forma assincrona (sem travar o programa). Usado no streaming.
from collections.abc import AsyncIterator

# ============================================================
# SECAO: Imports do LangChain Core
# ============================================================

# StrOutputParser: extrai apenas o texto da resposta do LLM.
# Sem ele, voce receberia um objeto complexo com metadados.
from langchain_core.output_parsers import StrOutputParser

# ChatPromptTemplate: modelo de prompt com placeholders.
# Permite criar mensagens com {variaveis} que sao preenchidas depois.
from langchain_core.prompts import ChatPromptTemplate

# RunnablePassthrough: "passa adiante" o valor sem modificar.
# Usado para manter a pergunta original enquanto o retriever busca contexto.
from langchain_core.runnables import RunnablePassthrough

# ChatOpenAI: interface do LangChain para os modelos de chat da OpenAI.
from langchain_openai import ChatOpenAI

from app.config import OPENAI_API_KEY, OPENAI_MODEL, RETRIEVER_TOP_K
from app.services.ingest import get_vector_store

# ============================================================
# SECAO: Prompt de Sistema (Prompt Engineering)
# ============================================================
# O SYSTEM_PROMPT define o COMPORTAMENTO do chatbot.
# E como dar instrucoes a um funcionario antes dele comecar a trabalhar.
#
# CONCEITO: Grounding (Fundamentacao)
# A regra 3 ("baseie suas respostas EXCLUSIVAMENTE no contexto")
# e a tecnica mais importante aqui. Ela forca o LLM a responder
# APENAS com base nos seus documentos, nao no conhecimento geral.
# Isso evita "alucinacoes" (o LLM inventar informacoes).
#
# O placeholder {context} sera substituido pelos chunks recuperados
# do ChromaDB na hora da consulta.
SYSTEM_PROMPT = """Você é um assistente médico especialista em ACLS (Advanced Cardiac Life Support), \
SAVA (Suporte Avançado de Vida em Cardiologia) e emergências médicas.

Seu papel é ajudar profissionais de saúde a tomar decisões rápidas em situações de emergência cardíaca, \
seguindo os protocolos das diretrizes AHA (American Heart Association) 2025.

REGRAS IMPORTANTES:
1. Responda SEMPRE em português brasileiro.
2. Seja direto e objetivo — em emergências, cada segundo conta.
3. Baseie suas respostas EXCLUSIVAMENTE no contexto fornecido abaixo.
4. Se a informação não estiver no contexto, diga claramente que não possui essa informação nos documentos disponíveis.
5. Inclua dosagens, intervalos e protocolos específicos quando disponíveis.
6. NUNCA invente informações médicas. Na dúvida, oriente a consultar o protocolo oficial.
7. Ao final da resposta, cite brevemente de qual documento/seção a informação foi extraída.

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
        model=OPENAI_MODEL,               # "gpt-4o-mini" (configurado no .env)
        openai_api_key=OPENAI_API_KEY,

        # CONCEITO: Temperature (Temperatura)
        # Controla a "criatividade" do modelo:
        #   0.0 = sempre a mesma resposta (deterministico)
        #   0.1 = quase deterministico (nosso caso — medicina!)
        #   0.7 = balanceado
        #   1.0 = maximo de criatividade/variacao
        #
        # Em medicina, queremos respostas FACTUAIS, nao criativas.
        # Por isso usamos 0.1 (quase zero).
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
    retriever = vector_store.as_retriever(
        # "similarity" = busca por similaridade do cosseno
        # O ChromaDB encontra os chunks cujos vetores sao mais
        # parecidos com o vetor da pergunta do usuario.
        search_type="similarity",
        search_kwargs={"k": RETRIEVER_TOP_K},  # Retorna os 4 mais relevantes
    )

    # Passo preparatorio: criar o template do prompt
    # "system" = instrucoes para o LLM (como ele deve se comportar)
    # "human" = a mensagem do usuario
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", HUMAN_TEMPLATE),
    ])

    # ============================================================
    # A CADEIA LCEL — O coracao do RAG (leia passo a passo!)
    # ============================================================
    #
    # PASSO 1: O dicionario executa em PARALELO:
    #   "context" → retriever busca 4 chunks | format_docs formata com fontes
    #   "question" → RunnablePassthrough() passa a pergunta sem alterar
    #
    # PASSO 2: prompt recebe {"context": "...", "question": "..."}
    #   e preenche os placeholders do SYSTEM_PROMPT e HUMAN_TEMPLATE
    #
    # PASSO 3: get_llm() envia o prompt montado para o GPT-4o-mini
    #
    # PASSO 4: StrOutputParser() extrai apenas o texto da resposta
    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | get_llm()
        | StrOutputParser()
    )

    return chain


# ============================================================
# SECAO: Funcoes de Consulta (Sync e Streaming)
# ============================================================

# CONCEITO: async/await
# "async def" declara uma funcao ASSINCRONA.
# "await" ESPERA o resultado sem travar o programa.
#
# Analogia: garcom no restaurante.
# Sincrono = garcom fica parado esperando o prato ficar pronto.
# Assincrono = garcom anota o pedido, atende outra mesa, e volta
# quando o prato esta pronto.
async def ask(question: str) -> str:
    """Faz uma pergunta e retorna a resposta completa (nao streaming)."""
    chain = build_rag_chain()
    # ainvoke = versao assincrona de invoke (o "a" no inicio = async)
    return await chain.ainvoke({"question": question})


# CONCEITO: AsyncIterator e yield
# AsyncIterator = funcao que entrega valores um por um de forma assincrona.
# yield = ao inves de return (que retorna tudo de uma vez),
#         yield entrega um valor e PAUSA a funcao ate pedirem o proximo.
#
# Isso permite que o frontend mostre a resposta conforme ela e gerada,
# como voce ve no ChatGPT (as palavras aparecem uma por uma).
async def ask_stream(question: str) -> AsyncIterator[str]:
    """Faz uma pergunta e retorna a resposta token por token (streaming)."""
    chain = build_rag_chain()
    # astream = versao assincrona de stream
    # async for = loop que espera cada token chegar
    async for chunk in chain.astream({"question": question}):
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
