# Guia Miro — Arquitetura do Projeto SAVA e ACLS

## 1. Criar o Board

- Ao entrar no Miro, clique em **"+ New board"**
- Renomeie o board: clique no titulo no topo e digite **"Arquitetura — SAVA e ACLS"**

## 2. Ferramentas basicas

Na barra lateral esquerda:

| Ferramenta | Para que serve |
|---|---|
| **Select** (seta) | Mover e selecionar elementos |
| **Sticky note** | Notas rapidas (nao ideal para arquitetura) |
| **Shape** | Retangulos, circulos — use para os blocos |
| **Connection line** | Setas entre blocos — use para os fluxos |
| **Text** | Texto solto no board |
| **Frame** | Agrupa uma secao inteira (como um "slide") |

## 3. Estruturar o board com Frames

Crie **3 frames** (um para cada diagrama). Clique em **Frame** na barra lateral e desenhe um retangulo grande:

- **Frame 1:** "Visao Geral da Arquitetura"
- **Frame 2:** "Pipeline RAG"
- **Frame 3:** "Fluxo de uma Pergunta no Chat"

Frames funcionam como areas organizadas — quando voce apresentar, pode navegar frame por frame.

## 4. Frame 1 — Visao Geral

Este e o diagrama principal. Monte assim:

**Passo 4.1 — Crie os blocos:**
- Clique em **Shape** → escolha **Retangulo**
- Desenhe 4 retangulos e nomeie:
  - `Frontend (React)` — cor azul
  - `Backend (FastAPI)` — cor verde
  - `Supabase Auth` — cor laranja
  - `ChromaDB` — cor roxa

**Passo 4.2 — Para mudar cor:**
- Clique no retangulo → na barra que aparece em cima, mude a cor de fundo

**Passo 4.3 — Conecte com setas:**
- Clique em **Connection line** na barra lateral
- Clique no bloco de origem → arraste ate o bloco de destino
- Clique na seta para adicionar um **label** (ex: "HTTP", "JWT", "Vetores")

**Passo 4.4 — Adicione detalhes dentro de cada bloco:**
- De dois cliques no retangulo para editar o texto
- Coloque o nome + as tecnologias (ex: "Frontend — React 19 + Vite + TypeScript")

## 5. Frame 2 — Pipeline RAG

Crie uma sequencia **horizontal** de blocos com setas entre eles:

**Linha 1 — Ingestao (uma vez):**
```
[PDFs ACLS/SAVA] -> [PyPDFLoader] -> [TextSplitter] -> [Embeddings] -> [ChromaDB]
```

**Linha 2 — Consulta (cada pergunta):**
```
[Pergunta] -> [ChromaDB busca] -> [Prompt + Contexto] -> [GPT-4o-mini] -> [Resposta]
```

- Use retangulos para cada etapa
- Use setas da esquerda para a direita
- Adicione uma nota em cada bloco explicando o que faz

## 6. Frame 3 — Fluxo da Pergunta

Crie um fluxo **vertical** com os 11 passos, alternando entre blocos do Frontend (azul) e Backend (verde):

1. Usuario digita pergunta → (azul)
2. Obtem token JWT → (azul)
3. POST /api/chat/stream → (seta entre azul e verde)
4. Valida JWT → (verde)
5. Rate limit check → (verde)
6. Busca no ChromaDB → (verde)
7. Monta prompt → (verde)
8. GPT-4o-mini gera resposta → (verde)
9. Envia tokens SSE → (seta entre verde e azul)
10. Renderiza em tempo real → (azul)
11. Salva no Supabase → (azul → laranja)

## 7. Atalhos uteis

- **Cmd+D** — duplica o elemento selecionado (util para criar blocos iguais)
- **Cmd+G** — agrupa elementos selecionados (mova varios blocos juntos)
- **Shift + arrastar seta** — mantem a seta reta
- **Cmd + scroll** — zoom in/out
- **Share** (topo direito) — gerar link compartilhavel

## 8. Ordem sugerida de trabalho

1. Primeiro crie todos os frames vazios (estrutura)
2. Depois monte o Frame 1 (visao geral) — e o mais importante
3. Depois Frame 2 (RAG) e Frame 3 (fluxo)
4. Por ultimo, ajuste cores, alinhamento e labels nas setas

## 9. Referencia

O documento `arquitetura-projeto-0603.md` na raiz do projeto contem todo o conteudo tecnico para preencher os diagramas.
