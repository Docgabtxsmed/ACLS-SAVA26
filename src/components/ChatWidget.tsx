import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ChatWidget.css';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Função para parsear formatação inline (negrito)
function parseInline(text: string): string {
  // Converte **texto** para <strong>texto</strong>
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// Função para parsear Markdown completo
function parseMarkdown(text: string): string {
  if (!text.trim()) return '';

  // Divide por parágrafos (duas quebras de linha)
  const paragraphs = text.split(/\n\n+/);
  const result: string[] = [];

  for (const para of paragraphs) {
    const lines = para.split('\n').filter((line) => line.trim());

    if (lines.length === 0) continue;

    // Verifica se é uma lista não ordenada
    if (lines[0].match(/^[-*]\s/)) {
      result.push('<ul>');
      for (const line of lines) {
        const match = line.match(/^[-*]\s(.+)$/);
        if (match) {
          result.push(`<li>${parseInline(match[1])}</li>`);
        }
      }
      result.push('</ul>');
    }
    // Verifica se é uma lista ordenada
    else if (lines[0].match(/^\d+\.\s/)) {
      result.push('<ol>');
      for (const line of lines) {
        const match = line.match(/^\d+\.\s(.+)$/);
        if (match) {
          result.push(`<li>${parseInline(match[1])}</li>`);
        }
      }
      result.push('</ol>');
    }
    // É um parágrafo normal
    else {
      const content = lines.join('<br />');
      result.push(`<p>${parseInline(content)}</p>`);
    }
  }

  return result.join('');
}

export default function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStreamedText, setCurrentStreamedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isLoadingRef = useRef<boolean>(false);

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      setIsOpen(true);
      return;
    }
    setIsOpen(!isOpen);
  };

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentStreamedText]);

  // Cancelar requisição ao fechar o modal
  useEffect(() => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setCurrentStreamedText('');
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoadingRef.current) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    isLoadingRef.current = true;
    setIsLoading(true);
    setCurrentStreamedText('');

    // Criar novo AbortController para esta requisição
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('http://localhost:8000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.content }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Resposta sem corpo');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.substring(6).trim();
          } else if (line.startsWith('data:')) {
            const dataStr = line.substring(5).trim();

            if (currentEvent === 'token') {
              try {
                const data = JSON.parse(dataStr);
                if (data.token) {
                  accumulatedText += data.token;
                  setCurrentStreamedText(accumulatedText);
                }
              } catch (e) {
                console.error('Erro ao parsear token:', e);
              }
            } else if (currentEvent === 'done') {
              // Finalizar mensagem do assistente
              if (accumulatedText) {
                // Capturar o valor antes de resetar para evitar closure bug
                const finalText = accumulatedText;
                setMessages((prev) => [
                  ...prev,
                  { role: 'assistant', content: finalText },
                ]);
                accumulatedText = '';
              }
              // Sempre limpa o streaming e o loading, independente do accumulatedText
              setCurrentStreamedText('');
              isLoadingRef.current = false;
              setIsLoading(false);
            } else if (currentEvent === 'error') {
              try {
                const data = JSON.parse(dataStr);
                throw new Error(data.error || 'Erro desconhecido');
              } catch (e) {
                const errorMsg = e instanceof Error ? e.message : 'Erro ao processar resposta';
                setError(errorMsg);
                isLoadingRef.current = false;
                setIsLoading(false);
                setCurrentStreamedText('');
              }
            }
          }
        }
      }

      // Fallback: se o evento done não foi processado mas há texto acumulado
      if (accumulatedText) {
        // Capturar o valor antes de resetar para evitar closure bug
        const finalText = accumulatedText;
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: finalText },
        ]);
      }
      setCurrentStreamedText('');

      isLoadingRef.current = false;
      setIsLoading(false);
      abortControllerRef.current = null;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Requisição cancelada pelo usuário - não exibir erro
        isLoadingRef.current = false;
        return;
      }

      const errorMsg =
        err instanceof Error ? err.message : 'Erro ao conectar com o servidor';
      setError(errorMsg);
      isLoadingRef.current = false;
      setIsLoading(false);
      setCurrentStreamedText('');
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        className="chat-widget-button"
        onClick={handleOpenChat}
        aria-label="Abrir chat"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Modal do chat */}
      {isOpen && (
        <div className="chat-widget-modal">
          {/* Header */}
          <div className="chat-widget-header">
            <h3 className="chat-widget-title">Assistente IA</h3>
            <button
              className="chat-widget-close"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar chat"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Área de mensagens */}
          <div className="chat-widget-messages">
            {!isAuthenticated ? (
              <div className="chat-widget-empty">
                <p>Faça login para usar o assistente IA</p>
                <button
                  className="chat-widget-login-button"
                  onClick={() => navigate('/login')}
                >
                  Fazer Login
                </button>
              </div>
            ) : (
              <>
                {messages.length === 0 && !isLoading && !error && (
                  <div className="chat-widget-empty">
                    <p>Olá! Como posso ajudar você hoje?</p>
                  </div>
                )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-widget-message chat-widget-message--${msg.role}`}
              >
                <div
                  className="chat-widget-message-content"
                  dangerouslySetInnerHTML={{
                    __html: msg.role === 'assistant' ? parseMarkdown(msg.content) : msg.content,
                  }}
                />
              </div>
            ))}

            {/* Mensagem sendo streamada */}
            {currentStreamedText && (
              <div className="chat-widget-message chat-widget-message--assistant">
                <div
                  className="chat-widget-message-content"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdown(currentStreamedText),
                  }}
                />
              </div>
            )}

            {/* Indicador de carregamento */}
            {isLoading && !currentStreamedText && (
              <div className="chat-widget-message chat-widget-message--assistant">
                <div className="chat-widget-loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {/* Mensagem de erro */}
            {error && (
              <div className="chat-widget-message chat-widget-message--error">
                <div className="chat-widget-message-content">{error}</div>
              </div>
            )}

            <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {isAuthenticated && (
          <div className="chat-widget-input-container">
            <input
              type="text"
              className="chat-widget-input"
              placeholder="Digite sua pergunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="chat-widget-send"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              aria-label="Enviar mensagem"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          )}
        </div>
      )}
    </>
  );
}

