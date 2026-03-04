# Guia de Estudo: RAG Backend — SAVA ACLS

> **Para quem e este guia?** Iniciantes em Python que querem entender como funciona um sistema RAG
> (Retrieval-Augmented Generation) na pratica, usando LangChain, ChromaDB e OpenAI.

---

## Como usar este guia

Este guia e **hands-on** (mao na massa). A cada modulo voce vai:

1. **Abrir** o arquivo indicado no seu editor
2. **Ler** os comentarios didaticos que estao no codigo
3. **Estudar** a explicacao do modulo aqui neste documento
4. **Fazer** o mini-exercicio para fixar o aprendizado

**Ordem obrigatoria:** Siga os modulos na sequencia (1 → 2 → 3 → 4 → 5 → 6). Cada modulo usa conceitos do anterior.

**Tempo estimado:** ~2-3 horas para o guia completo.

---

## Visao Geral da Arquitetura

Antes de mergulhar no codigo, entenda o fluxo completo do sistema:

```
FASE DE PREPARACAO (roda uma vez):
═══════════════════════════════════════════════════════════

  📄 PDFs (guidelines AHA)
       │
       ▼
  ┌─────────────┐
  │ PyPDFLoader  │  ← Extrai texto de cada pagina do PDF
  └──────┬──────┘
         │
         ▼
  ┌──────────────────────────────┐
  │ RecursiveCharacterTextSplitter│  ← Divide o texto em pedacos (chunks)
  │ chunk_size=1000              │     de 1000 caracteres com 200 de
  │ chunk_overlap=200            │     sobreposicao entre eles
  └──────────────┬───────────────┘
                 │
                 ▼
  ┌──────────────────────┐
  │ OpenAI Embeddings    │  ← Transforma cada chunk em um vetor numerico
  │ text-embedding-3-small│    (lista de 1536 numeros decimais)
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────┐
  │ ChromaDB         │  ← Armazena os vetores em disco
  │ (banco vetorial) │     para busca por similaridade
  └──────────────────┘


FASE DE CONSULTA (cada pergunta do usuario):
═══════════════════════════════════════════════════════════

  💬 "Qual a dose de epinefrina?"
       │
       ▼
  ┌──────────────────────┐
  │ OpenAI Embeddings    │  ← Transforma a pergunta em vetor
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────┐
  │ ChromaDB         │  ← Busca os 4 chunks mais parecidos
  │ similarity search│     com a pergunta (cosine similarity)
  └──────────┬───────┘
             │
             ▼
  ┌──────────────────────────────┐
  │ Prompt Template              │  ← Monta a mensagem para o LLM:
  │ "Voce e um especialista..."  │    "Baseado NESTES documentos,
  │ + contexto dos 4 chunks      │     responda a pergunta"
  │ + pergunta do usuario        │
  └──────────────┬───────────────┘
                 │
                 ▼
  ┌──────────────────┐
  │ GPT-4o-mini      │  ← Gera a resposta baseada no contexto
  │ temperature=0.1  │     (baixa = mais factual, menos criativo)
  └──────────┬───────┘
             │
             ▼
  💬 "A dose de epinefrina e 1mg IV/IO a cada 3-5 minutos..."
```

### Estrutura de pastas do backend

```
backend/
├── app/
│   ├── config.py              ← [Modulo 1] Configuracoes centrais
│   ├── main.py                ← [Modulo 6] Aplicacao FastAPI
│   ├── services/
│   │   ├── ingest.py          ← [Modulo 2] Pipeline de ingestao de PDFs
│   │   └── rag.py             ← [Modulo 4] Cadeia RAG (pergunta → resposta)
│   └── routes/
│       └── chat.py            ← [Modulo 5] Endpoints da API
├── ingest_docs.py             ← [Modulo 3] Script CLI de ingestao
├── data/pdfs/                 ← Seus PDFs vao aqui
├── chroma_db/                 ← Banco vetorial (criado automaticamente)
├── requirements.txt           ← Dependencias Python
└── .env                       ← Suas chaves de API (secreto!)
```

---

## Modulo 1: Configuracao Central

**Arquivo:** `backend/app/config.py`

### O que voce vai aprender
- Como gerenciar configuracoes com variaveis de ambiente
- O que e `pathlib.Path` e por que usamos
- O significado de cada parametro RAG

### Conceitos-chave

#### 1.1 — Variaveis de Ambiente (`.env`)

Variaveis de ambiente sao valores que ficam **fora do codigo**. Por que?

- **Seguranca:** Sua API key da OpenAI nao pode ir para o GitHub
- **Flexibilidade:** Voce muda configuracoes sem alterar codigo
- **Ambientes:** Valores diferentes para desenvolvimento vs producao

```python
# O python-dotenv le o arquivo .env e coloca os valores nas variaveis de ambiente
from dotenv import load_dotenv
load_dotenv()  # A partir daqui, os.getenv() consegue ler o .env

# Padrao: os.getenv("NOME_DA_VARIAVEL", "valor_padrao_se_nao_existir")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
```

#### 1.2 — pathlib.Path

`pathlib` e a forma moderna do Python para trabalhar com caminhos de arquivos.

```python
from pathlib import Path

# __file__ = caminho deste arquivo (config.py)
# .resolve() = caminho absoluto (sem .. ou .)
# .parent = pasta pai
BASE_DIR = Path(__file__).resolve().parent.parent

# Exemplo pratico:
# __file__        = /projeto/backend/app/config.py
# .resolve()      = /projeto/backend/app/config.py  (ja era absoluto)
# .parent         = /projeto/backend/app/
# .parent.parent  = /projeto/backend/               ← BASE_DIR!
```

O operador `/` em pathlib junta caminhos (nao e divisao!):
```python
PDF_DIR = str(BASE_DIR / "data" / "pdfs")
# Resultado: "/projeto/backend/data/pdfs"
```

#### 1.3 — Parametros RAG

Esses sao os 3 parametros que voce pode ajustar para melhorar a qualidade das respostas:

| Parametro | Valor | O que faz |
|-----------|-------|-----------|
| `CHUNK_SIZE` | 1000 | Tamanho maximo de cada pedaco de texto (em caracteres). ~250 tokens. |
| `CHUNK_OVERLAP` | 200 | Quantos caracteres se repetem entre um chunk e o proximo. Evita perder contexto na "fronteira". |
| `RETRIEVER_TOP_K` | 4 | Quantos chunks sao recuperados do banco para cada pergunta. Mais = mais contexto, mas mais caro. |

**Analogia:** Imagine que voce tem um livro de 300 paginas. CHUNK_SIZE e como cortar o livro em fichas de estudo. CHUNK_OVERLAP e repetir as ultimas 2 linhas de uma ficha no inicio da proxima, para nao perder o fio da meada.

### Mini-exercicio 1

1. Abra o arquivo `.env.example` e leia cada variavel
2. No `config.py`, mude `CHUNK_SIZE` para 500 (o dobro de fichas, mas menores). Preveja: o numero de chunks vai aumentar ou diminuir?
3. Adicione uma nova variavel ao `config.py`:
   ```python
   MAX_TOKENS = int(os.getenv("MAX_TOKENS", "2000"))
   ```
   E adicione `MAX_TOKENS=2000` ao `.env.example`. Isso vai ser util depois!

---

## Modulo 2: Ingestao de PDFs (O Coracao do Sistema)

**Arquivo:** `backend/app/services/ingest.py`

### O que voce vai aprender
- Como o LangChain carrega PDFs
- Como o texto e dividido em chunks
- **DEEP DIVE: Como o ChromaDB armazena e busca vetores**

### Conceitos-chave

#### 2.1 — Type Hints (Dicas de Tipo)

Python nao obriga tipos, mas **type hints** documentam o que cada funcao espera e retorna:

```python
# str | None = aceita string OU None (nenhum valor)
# -> list = esta funcao retorna uma lista
def load_pdfs(pdf_dir: str | None = None) -> list:
    ...

# -> OpenAIEmbeddings = retorna um objeto do tipo OpenAIEmbeddings
def get_embeddings() -> OpenAIEmbeddings:
    ...
```

Isso nao muda o comportamento do codigo, mas ajuda voce (e seu editor) a entender o que esta acontecendo.

#### 2.2 — Pipeline de Ingestao (3 etapas)

```
ETAPA 1: CARREGAR          ETAPA 2: DIVIDIR           ETAPA 3: ARMAZENAR
─────────────────          ──────────────────          ───────────────────
PDF → PyPDFLoader     →    RecursiveCharacter     →    ChromaDB
      extrai texto          TextSplitter                (embeds + salva)
      pagina por             corta em chunks
      pagina                 de 1000 chars
```

**Etapa 1 — Carregar PDFs:**
```python
loader = PyPDFLoader("guideline_aha.pdf")
docs = loader.load()
# docs = [Document(page_content="texto da pag 1", metadata={"page": 0}),
#         Document(page_content="texto da pag 2", metadata={"page": 1}),
#         ...]
```

**Etapa 2 — Dividir em Chunks:**
```python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # maximo de caracteres por chunk
    chunk_overlap=200,      # sobreposicao entre chunks
    separators=["\n\n", "\n", ". ", " ", ""],
    # ↑ Tenta cortar em paragrafos primeiro (\n\n),
    #   depois linhas (\n), depois frases (. ),
    #   depois palavras ( ), e por ultimo caractere ("")
)
```

**Por que "Recursive"?** Ele tenta os separadores na ordem. Se um paragrafo inteiro cabe em 1000 chars, otimo! Se nao, tenta quebrar por linhas, e assim por diante.

**Etapa 3 — Embeddings + ChromaDB:** (veja deep dive abaixo)

#### 2.3 — DEEP DIVE: ChromaDB e Banco de Dados Vetorial

Este e o conceito mais importante do sistema. Vamos por partes:

##### O que e um Embedding?

Um embedding transforma texto em uma **lista de numeros** (vetor). Textos com significados parecidos geram vetores parecidos.

```
"parada cardiaca"     → [0.23, -0.45, 0.78, 0.12, ...]  (1536 numeros)
"PCR no adulto"       → [0.21, -0.43, 0.76, 0.14, ...]  (muito parecido!)
"receita de bolo"     → [-0.67, 0.89, -0.12, 0.56, ...] (totalmente diferente)
```

##### O que e o ChromaDB?

ChromaDB e um **banco de dados vetorial** — ele armazena esses vetores e consegue buscar os mais parecidos rapidamente.

**Analogia da Biblioteca:**
- Banco relacional (SQL) = biblioteca organizada por **autor e titulo** (busca exata)
- Banco vetorial (ChromaDB) = biblioteca organizada por **assunto e significado** (busca semantica)

Na biblioteca vetorial, se voce pedir "tratamento de arritmia", ela encontra livros sobre "manejo de taquicardia" mesmo que a palavra "arritmia" nao apareca no texto.

##### Como o ChromaDB armazena dados?

```python
vector_store = Chroma(
    collection_name="acls_documents",    # Nome da "tabela" (colecao)
    embedding_function=get_embeddings(), # Funcao que transforma texto → vetor
    persist_directory="./chroma_db",     # Pasta onde salva em disco
)
```

- **collection_name:** Como uma tabela em um banco SQL. Voce pode ter varias colecoes (uma para cada tipo de documento).
- **embedding_function:** O ChromaDB usa essa funcao automaticamente quando voce adiciona documentos. Nao precisa gerar embeddings manualmente!
- **persist_directory:** Os dados ficam salvos em disco. Se voce reiniciar o servidor, os embeddings continuam la.

##### Como a busca por similaridade funciona?

Quando voce faz uma pergunta:

1. A pergunta e transformada em vetor (usando o mesmo modelo de embedding)
2. O ChromaDB calcula a **distancia** entre o vetor da pergunta e todos os vetores armazenados
3. Retorna os `k` vetores mais proximos (mais parecidos)

A medida de distancia usada e **cosine similarity** (similaridade do cosseno):
- 1.0 = textos identicos em significado
- 0.0 = textos sem relacao
- -1.0 = textos com significados opostos

```python
# Na pratica, voce nao precisa calcular isso manualmente:
retriever = vector_store.as_retriever(
    search_type="similarity",    # usa cosine similarity
    search_kwargs={"k": 4},      # retorna os 4 mais parecidos
)
```

### Mini-exercicio 2

1. Adicione um `print()` dentro da funcao `load_pdfs()` para mostrar o nome de cada PDF carregado:
   ```python
   for pdf_path in pdf_files:
       print(f"  Carregando: {pdf_path.name}")
   ```
2. Rode a ingestao com seus PDFs. Anote o numero de chunks criados.
3. Mude `CHUNK_SIZE` para 500 no `.env` e rode novamente. O numero de chunks mudou como voce esperava?
4. **Desafio:** Adicione um campo `"ingested_at"` com a data/hora atual nos metadados de cada documento:
   ```python
   from datetime import datetime
   doc.metadata["ingested_at"] = datetime.now().isoformat()
   ```

---

## Modulo 3: Script de Ingestao CLI

**Arquivo:** `backend/ingest_docs.py`

### O que voce vai aprender
- Como funciona `sys.path` (sistema de imports do Python)
- O padrao `if __name__ == "__main__"`
- Como criar scripts de linha de comando

### Conceitos-chave

#### 3.1 — sys.path e imports

Quando voce escreve `from app.services.ingest import ...`, o Python procura o modulo `app` nos diretorios listados em `sys.path`.

O problema: `ingest_docs.py` esta na pasta `backend/`, mas o Python nao sabe que deve procurar modulos ali. Por isso fazemos:

```python
sys.path.insert(0, str(Path(__file__).parent))
# Adiciona a pasta do script (backend/) no inicio da lista de busca
```

#### 3.2 — `if __name__ == "__main__"`

```python
if __name__ == "__main__":
    main()
```

Essa e uma "guarda" do Python:
- Se voce **rodar** o arquivo (`python ingest_docs.py`): `__name__` = `"__main__"` → executa `main()`
- Se voce **importar** o arquivo (`from ingest_docs import ...`): `__name__` = `"ingest_docs"` → NAO executa

Isso evita que o script rode automaticamente quando importado por outro modulo.

#### 3.3 — Argumentos de linha de comando

```python
pdf_dir = sys.argv[1] if len(sys.argv) > 1 else None
# sys.argv = lista de argumentos passados no terminal
# sys.argv[0] = "ingest_docs.py" (o proprio script)
# sys.argv[1] = primeiro argumento (se existir)

# Exemplo:
# python ingest_docs.py /meus/pdfs    → pdf_dir = "/meus/pdfs"
# python ingest_docs.py               → pdf_dir = None (usa padrao)
```

### Mini-exercicio 3

1. Rode `python ingest_docs.py` (com PDFs na pasta). Observe a saida.
2. **Experimento:** Remova a linha `sys.path.insert(...)` e rode novamente. Que erro aparece? Restaure a linha depois.
3. **Desafio:** Modifique o script para aceitar uma flag `--verbose` que imprime os primeiros 80 caracteres de cada chunk:
   ```python
   verbose = "--verbose" in sys.argv
   if verbose:
       for i, chunk in enumerate(chunks[:5]):  # primeiros 5
           print(f"  Chunk {i}: {chunk.page_content[:80]}...")
   ```
   (Dica: voce vai precisar acessar os chunks — olhe a funcao `ingest_pdfs`)

---

## Modulo 4: Cadeia RAG — O Cerebro do Sistema

**Arquivo:** `backend/app/services/rag.py`

### O que voce vai aprender
- Programacao assincrona (`async/await`)
- LCEL — LangChain Expression Language (o operador `|`)
- Prompt engineering para contexto medico
- Streaming de respostas

### Conceitos-chave

#### 4.1 — async/await (Programacao Assincrona)

Quando voce chama a API da OpenAI, o programa precisa **esperar** a resposta (pode demorar 2-5 segundos). Com `async/await`, o programa nao fica travado — ele pode atender outros usuarios enquanto espera.

```python
# SEM async (sincrono) — trava tudo enquanto espera:
def ask(question):
    return chain.invoke(question)  # programa PARA aqui ate ter resposta

# COM async (assincrono) — libera para outros enquanto espera:
async def ask(question):
    return await chain.ainvoke(question)  # programa pode fazer outras coisas
```

**Analogia:** Imagine um garcom no restaurante. Sincrono = ele fica parado ao lado da cozinha esperando seu prato ficar pronto. Assincrono = ele anota seu pedido, vai atender outra mesa, e volta quando o prato esta pronto.

#### 4.2 — Streaming e AsyncIterator

Streaming e quando a resposta vem **pedaco por pedaco** (token por token), como voce ve no ChatGPT:

```python
async def ask_stream(question: str) -> AsyncIterator[str]:
    chain = build_rag_chain()
    async for chunk in chain.astream(question):
        yield chunk  # "cospe" cada token conforme chega
```

- `AsyncIterator[str]` = tipo que indica "vou entregar strings uma por uma"
- `async for` = loop assincrono (espera cada token chegar)
- `yield` = ao inves de `return` (que retorna tudo de uma vez), `yield` entrega um valor e PAUSA a funcao ate pedirem o proximo

#### 4.3 — LCEL: O Operador `|` do LangChain

LCEL (LangChain Expression Language) permite montar pipelines usando `|`, como tubos conectados:

```python
chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | get_llm()
    | StrOutputParser()
)
```

Vamos destrinchar passo a passo:

```
PASSO 1: O dicionario (executa em paralelo)
─────────────────────────────────────────────
{"context": retriever | format_docs, "question": RunnablePassthrough()}

Recebe: "Qual a dose de epinefrina?"

Executa em PARALELO:
  "context" → retriever busca 4 chunks → format_docs formata com fontes
  "question" → RunnablePassthrough() passa a pergunta sem alterar

Resultado: {
  "context": "[Fonte: aha_2025.pdf, p.45]\nEpinefrina 1mg IV/IO...\n---\n...",
  "question": "Qual a dose de epinefrina?"
}


PASSO 2: prompt (ChatPromptTemplate)
─────────────────────────────────────
Recebe o dicionario e preenche os placeholders:

  Sistema: "Voce e um especialista... CONTEXTO: [texto dos 4 chunks]"
  Usuario: "Qual a dose de epinefrina?"


PASSO 3: get_llm() (ChatOpenAI)
────────────────────────────────
Envia para o GPT-4o-mini e recebe a resposta.


PASSO 4: StrOutputParser()
──────────────────────────
Extrai apenas o texto da resposta (remove metadados do LangChain).

Resultado final: "A dose de epinefrina e 1mg IV/IO a cada 3-5 minutos..."
```

#### 4.4 — Prompt Engineering

O `SYSTEM_PROMPT` e o que define o comportamento do chatbot:

```python
SYSTEM_PROMPT = """Voce e um assistente medico especialista em ACLS...

REGRAS IMPORTANTES:
1. Responda SEMPRE em portugues brasileiro.
2. Seja direto e objetivo — em emergencias, cada segundo conta.
3. Baseie suas respostas EXCLUSIVAMENTE no contexto fornecido.
4. Se a informacao nao estiver no contexto, diga claramente.
5. Inclua dosagens e protocolos quando disponiveis.
6. NUNCA invente informacoes medicas.
7. Cite de qual documento a informacao foi extraida.

CONTEXTO DOS DOCUMENTOS:
{context}"""
```

A regra **3** e a mais importante: ela faz o LLM responder **apenas** com base nos seus documentos, nao no conhecimento geral. Isso se chama **grounding** (fundamentacao).

`temperature=0.1` complementa isso: valores baixos tornam o modelo mais deterministico e factual. Em medicina, voce nao quer respostas "criativas".

### Mini-exercicio 4

1. Adicione um `print()` dentro de `format_docs()` para ver que contexto o LLM recebe:
   ```python
   def format_docs(docs: list) -> str:
       formatted = [...]
       result = "\n\n---\n\n".join(formatted)
       print(f"\n📋 CONTEXTO ENVIADO AO LLM ({len(docs)} chunks):\n{result[:500]}...")
       return result
   ```
2. Mude `temperature` de 0.1 para 0.9 e faca a mesma pergunta duas vezes. As respostas sao iguais ou diferentes?
3. **Desafio:** Mude o `RETRIEVER_TOP_K` de 4 para 1. A qualidade da resposta muda? E com 8?

---

## Modulo 5: Rotas da API

**Arquivo:** `backend/app/routes/chat.py`

### O que voce vai aprender
- Decorators do Python (`@router.post()`)
- Validacao com Pydantic `BaseModel`
- Server-Sent Events (SSE) para streaming
- Upload de arquivos

### Conceitos-chave

#### 5.1 — Decorators (Decoradores)

Decorators sao "embrulhos" que adicionam comportamento a funcoes:

```python
@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    ...
```

O `@router.post("/chat")` faz 3 coisas automaticamente:
1. Registra a funcao `chat()` para responder requisicoes POST em `/api/chat`
2. Valida que o body da requisicao e um `ChatRequest` valido
3. Garante que a resposta sera um `ChatResponse` valido

Sem decorator, voce teria que fazer tudo isso manualmente.

#### 5.2 — Pydantic BaseModel

Pydantic valida dados automaticamente:

```python
class ChatRequest(BaseModel):
    question: str   # campo obrigatorio do tipo string

class ChatResponse(BaseModel):
    answer: str     # campo obrigatorio do tipo string
```

Se alguem enviar `{"pergunta": "oi"}` (campo errado), o FastAPI retorna automaticamente um erro 422 explicando que `question` e obrigatorio.

#### 5.3 — Server-Sent Events (SSE)

SSE e uma tecnica onde o servidor **empurra** dados para o cliente continuamente (ao inves do cliente ficar perguntando "ja tem resposta?"):

```python
async def event_generator():
    async for token in ask_stream(request.question):
        yield {"event": "token", "data": json.dumps({"token": token})}
    yield {"event": "done", "data": json.dumps({"status": "complete"})}

return EventSourceResponse(event_generator())
```

O frontend recebe os tokens em tempo real e vai montando a resposta na tela (igual o ChatGPT).

#### 5.4 — Upload de Arquivos

```python
@router.post("/ingest/upload")
async def ingest_upload(file: UploadFile):
    content = await file.read()           # le o conteudo do arquivo enviado
    file_path.write_bytes(content)        # salva em disco
    result = ingest_pdfs()                # processa e cria embeddings
```

`UploadFile` e um tipo especial do FastAPI que lida com uploads multipart/form-data automaticamente.

### Mini-exercicio 5

1. Suba o servidor (`uvicorn app.main:app --reload`) e acesse `http://localhost:8000/docs`
2. Teste o endpoint `/api/health` pelo Swagger (clique em "Try it out")
3. Teste o `/api/chat` com a pergunta: "O que e ACLS?"
4. **Desafio:** Crie um novo endpoint:
   ```python
   @router.get("/models")
   async def models():
       from app.config import OPENAI_MODEL, OPENAI_EMBEDDING_MODEL
       return {
           "chat_model": OPENAI_MODEL,
           "embedding_model": OPENAI_EMBEDDING_MODEL,
       }
   ```

---

## Modulo 6: Aplicacao Principal

**Arquivo:** `backend/app/main.py`

### O que voce vai aprender
- Como o FastAPI e inicializado
- O que e CORS e por que precisamos configurar
- Como routers sao montados

### Conceitos-chave

#### 6.1 — FastAPI App

```python
app = FastAPI(
    title="SAVA ACLS RAG API",        # Nome que aparece no /docs
    description="API de chatbot...",    # Descricao no /docs
    version="0.1.0",                    # Versao da API
)
```

O FastAPI gera automaticamente:
- Documentacao interativa em `/docs` (Swagger UI)
- Documentacao alternativa em `/redoc` (ReDoc)

#### 6.2 — CORS (Cross-Origin Resource Sharing)

Quando seu frontend (React, rodando em `localhost:5173`) tenta chamar seu backend (FastAPI, rodando em `localhost:8000`), o navegador **bloqueia** por seguranca — sao "origens" diferentes.

CORS e a permissao explicita: "Eu (backend) autorizo que estes frontends me acessem":

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server (seu React)
        "http://localhost:4173",  # Vite preview
    ],
    allow_methods=["*"],   # Permite GET, POST, PUT, DELETE...
    allow_headers=["*"],   # Permite qualquer header
)
```

#### 6.3 — include_router

```python
app.include_router(chat_router)
# Conecta todas as rotas de chat.py na app principal
# O prefixo "/api" vem do router, entao:
#   /api/chat, /api/ingest, /api/health, etc.
```

Isso permite organizar rotas em arquivos separados. Em um projeto maior, voce teria:
```python
app.include_router(chat_router)      # /api/chat/...
app.include_router(auth_router)      # /api/auth/...
app.include_router(admin_router)     # /api/admin/...
```

### Mini-exercicio 6

1. Acesse `http://localhost:8000/` no navegador. O que aparece?
2. Acesse `http://localhost:8000/docs`. Explore a documentacao gerada automaticamente.
3. Mude a `version` para `"0.2.0"` e verifique que mudou no endpoint `/`.
4. **Desafio:** Adicione `"http://localhost:3001"` na lista de `allow_origins`. Explique quando voce precisaria disso.

---

## Desafios Integradores

Esses desafios exigem conhecimento de **varios modulos** ao mesmo tempo.

### Desafio 1: Endpoint para limpar o banco vetorial

Crie um endpoint `DELETE /api/clear` que apaga todos os documentos do ChromaDB.

**Dicas:**
- Voce vai precisar de uma nova funcao em `ingest.py`
- Use `vector_store._collection.delete()` para limpar
- Adicione a rota em `chat.py`

### Desafio 2: Incluir contagem de documentos na resposta

Modifique o endpoint `/api/chat` para retornar quantos chunks foram usados como contexto.

**Dicas:**
- Modifique `ChatResponse` para incluir `sources_count: int`
- Voce precisara mudar a funcao `ask()` em `rag.py` para retornar essa informacao

### Desafio 3: Listar fontes unicas

Crie um endpoint `GET /api/sources` que retorna a lista de todos os arquivos PDF que foram ingeridos.

**Dicas:**
- ChromaDB permite buscar metadados: `collection.get(include=["metadatas"])`
- Extraia os valores unicos de `"source_file"`

---

## Glossario de Termos

| Termo | Significado |
|-------|-------------|
| **RAG** | Retrieval-Augmented Generation — buscar documentos relevantes antes de gerar a resposta |
| **Embedding** | Representacao numerica (vetor) de um texto. Textos similares = vetores proximos |
| **Chunk** | Pedaco de texto com tamanho fixo, criado ao dividir documentos grandes |
| **Chunk Overlap** | Sobreposicao entre chunks consecutivos para manter contexto |
| **Vector Store** | Banco de dados otimizado para busca por similaridade de vetores |
| **ChromaDB** | Banco de dados vetorial open-source que usamos neste projeto |
| **Collection** | Agrupamento logico de documentos no ChromaDB (equivalente a uma tabela SQL) |
| **Cosine Similarity** | Medida matematica de quao parecidos dois vetores sao (0 a 1) |
| **Retriever** | Componente que busca documentos relevantes no vector store |
| **Top-K** | Numero de documentos recuperados por consulta |
| **LCEL** | LangChain Expression Language — sintaxe com `\|` para montar pipelines |
| **Prompt Template** | Modelo de mensagem com placeholders ({context}, {question}) |
| **Grounding** | Tecnica de forcar o LLM a responder baseado apenas em documentos fornecidos |
| **Temperature** | Parametro que controla a "criatividade" do LLM (0 = deterministico, 1 = criativo) |
| **SSE** | Server-Sent Events — protocolo para streaming do servidor para o cliente |
| **CORS** | Cross-Origin Resource Sharing — permissao para frontend acessar backend de outra origem |
| **Pydantic** | Biblioteca de validacao de dados usada pelo FastAPI |
| **FastAPI** | Framework web Python para criar APIs de alta performance |
| **async/await** | Programacao assincrona — permite atender multiplas requisicoes sem travar |
| **Streaming** | Entregar a resposta token por token ao inves de esperar a resposta completa |
