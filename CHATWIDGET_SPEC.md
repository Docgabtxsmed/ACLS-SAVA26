# ChatWidget — Especificação de Implementação

## Contexto do Projeto

**Stack frontend:**
- React 19 + TypeScript + Vite
- CSS puro (sem Tailwind, sem UI libraries)
- Cada componente tem seu próprio arquivo `.css` na mesma pasta (`src/components/`)
- React Router DOM v7 (rotas em `src/App.tsx`)

**Backend (já rodando):**
- FastAPI em `http://localhost:8000`
- Endpoint principal: `POST /api/chat/stream` (SSE — Server-Sent Events)
- Endpoint alternativo: `POST /api/chat` (resposta completa, sem streaming)

---

## Estrutura Atual do Frontend

```
src/
  App.tsx                        ← adicionar <ChatWidget /> aqui
  main.tsx
  types.ts
  components/
    AlgorithmCard.tsx + .css
    ArrhythmiaCard.tsx + .css
    ArrhythmiaModal.tsx
    BradyarrhythmiaCard.tsx
    BradyarrhythmiaModal.tsx
    DosePanel.tsx + .css
    FlowchartArrow.tsx + .css
    FlowchartNode.tsx + .css
    Navbar.tsx + .css
    index.css
    ← ChatWidget.tsx (CRIAR)
    ← ChatWidget.css (CRIAR)
  pages/
    HomePage.tsx + .css
    CardiacArrestPage.tsx
    BradycardiaPage.tsx
    TachycardiaPage.tsx
    ACSPage.tsx
    StrokePage.tsx
    BLSSurveyPage.tsx
    AnaphylaxisPage.tsx
    LocalAnestheticToxicityPage.tsx
    MalignantHyperthermiaPage.tsx
    PostCardiacArrestCarePage.tsx
    PediatricCardiacArrestPage.tsx
    PregnantCardiacArrestPage.tsx
  styles/
```

---

## O que deve ser criado

### 1. `src/components/ChatWidget.tsx`

Componente de chat flutuante com as seguintes responsabilidades:

**Estados necessários:**
- `isOpen: boolean` — controla se o modal está aberto ou fechado
- `messages: Message[]` — histórico de mensagens da conversa
- `input: string` — texto digitado pelo usuário
- `isLoading: boolean` — true enquanto o backend está respondendo
- `currentStreamedText: string` — texto que está sendo recebido via streaming

**Tipo `Message`:**
```typescript
type Message = {
  role: 'user' | 'assistant'
  content: string
}
```

**Comportamento esperado:**
1. Botão flutuante fixo no canto inferior direito da tela (visível em TODAS as páginas)
2. Ao clicar no botão, abre um modal de chat
3. Usuário digita pergunta e envia (Enter ou botão)
4. Frontend faz `POST /api/chat/stream` com `{ "question": "..." }`
5. Resposta chega via SSE (eventos `token` e `done`)
6. Cada token recebido é concatenado e exibido em tempo real (streaming)
7. Ao receber evento `done`, a mensagem é finalizada
8. Botão X fecha o modal

**Integração com o backend (SSE):**
```typescript
// Formato do request
POST http://localhost:8000/api/chat/stream
Content-Type: application/json
Body: { "question": "Qual a dose de adrenalina?" }

// Formato dos eventos recebidos
event: token
data: {"token": "A "}

event: token
data: {"token": "dose "}

event: done
data: {"status": "complete"}

event: error
data: {"error": "mensagem de erro"}
```

**Como consumir o SSE com fetch (não usar EventSource — não suporta POST):**
```typescript
const response = await fetch('http://localhost:8000/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: input }),
})

const reader = response.body!.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value)
  // parsear linhas "data: {...}" e extrair token
}
```

---

### 2. `src/components/ChatWidget.css`

**Layout do botão flutuante:**
- `position: fixed; bottom: 24px; right: 24px; z-index: 1000`
- Botão circular (~56px), cor vermelha médica (`#dc2626` ou similar ao padrão do projeto)
- Ícone de chat ou "IA"

**Layout do modal:**
- `position: fixed; bottom: 90px; right: 24px`
- Largura: 360px, altura: 500px
- Estrutura interna:
  - Header: título + botão fechar
  - Área de mensagens: scrollável, com bolhas separadas para user/assistant
  - Input: campo de texto + botão enviar
- `z-index: 999`

**Bolhas de mensagem:**
- Usuário: alinhada à direita, fundo escuro/azul
- Assistente: alinhada à esquerda, fundo cinza claro
- Animação de "carregando" (três pontos piscando) enquanto `isLoading: true`

---

### 3. Modificação em `src/App.tsx`

Adicionar o `<ChatWidget />` **fora** do `<Routes>`, para aparecer em todas as páginas:

```tsx
import ChatWidget from './components/ChatWidget'

function App() {
  return (
    <>
      <Routes>
        {/* rotas existentes — não modificar */}
      </Routes>
      <ChatWidget />   {/* ← adicionar aqui */}
    </>
  )
}
```

---

## Restrições importantes

- **Não instalar novas dependências** — usar apenas fetch nativo do browser para SSE
- **Seguir o padrão de CSS** do projeto: arquivo `.css` separado, classes BEM ou descritivas
- **TypeScript estrito** — tipar todos os estados e funções
- **Não modificar** nenhuma página ou componente existente além do `App.tsx`
- O backend roda em `http://localhost:8000` (sem variável de ambiente por enquanto)

---

## Critério de sucesso

1. Botão flutuante aparece em todas as 13 páginas do app
2. Modal abre/fecha corretamente
3. Pergunta enviada aparece como bolha do usuário
4. Resposta do backend aparece token por token (streaming visível)
5. Campo de input é limpo após envio
6. Indicador de carregamento aparece enquanto aguarda resposta
7. Erros do backend são exibidos na interface
