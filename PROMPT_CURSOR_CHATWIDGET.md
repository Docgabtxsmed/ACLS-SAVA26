# Prompt para o Agente do Cursor — Implementar ChatWidget

---

## Prompt (copie e cole no Cursor)

```
Preciso implementar um ChatWidget no meu projeto React 19 + TypeScript + Vite.
Leia o arquivo CHATWIDGET_SPEC.md na raiz do projeto — ele contém toda a especificação detalhada.

Resumo do que precisa ser criado:

1. `src/components/ChatWidget.tsx` — componente de chat flutuante
2. `src/components/ChatWidget.css` — estilos do widget
3. Modificar `src/App.tsx` — adicionar <ChatWidget /> fora do <Routes>

Regras importantes:
- NÃO instalar nenhuma dependência nova
- Usar fetch nativo (não EventSource) para consumir o SSE do backend
- Seguir o padrão de CSS do projeto (arquivo .css separado por componente)
- TypeScript estrito — tipar todos os estados
- NÃO modificar nenhuma página existente, apenas App.tsx

O backend já está rodando em http://localhost:8000.
Endpoint: POST /api/chat/stream
Formato SSE: eventos "token" com { "token": "..." } e evento "done" com { "status": "complete" }

Antes de implementar, leia os arquivos existentes:
- src/App.tsx (para entender as rotas)
- src/components/Navbar.tsx e Navbar.css (para seguir o padrão de estilo)
- CHATWIDGET_SPEC.md (especificação completa)

Implemente os 3 arquivos e explique cada decisão tomada.
```

---

## O que o agente vai fazer

1. Ler a especificação em `CHATWIDGET_SPEC.md`
2. Ler `Navbar.tsx` e `Navbar.css` como referência de padrão de código
3. Criar `ChatWidget.tsx` com estados, lógica de fetch SSE e JSX
4. Criar `ChatWidget.css` com botão flutuante e modal
5. Modificar `App.tsx` para incluir o componente

## Após o agente terminar, teste assim:

1. Inicie o frontend: `npm run dev`
2. Certifique-se que o backend está rodando: `.venv/bin/uvicorn app.main:app --reload --port 8000`
3. Abra `http://localhost:5173`
4. O botão de chat deve aparecer no canto inferior direito
5. Clique e faça a pergunta: **"Qual a dose de adrenalina no protocolo de PCR?"**
6. A resposta deve aparecer token por token
