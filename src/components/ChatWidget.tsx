import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DOMPurify from 'dompurify';
import './ChatWidget.css';

// URL da API (usa variável de ambiente em produção, fallback para localhost em desenvolvimento)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Tipos para mensagens locais (UI)
type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

// Tipos para dados do banco
interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

interface MessageFromDB {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Função para sanitizar HTML com DOMPurify
function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'code', 'pre'],
    ALLOWED_ATTR: [],
  });
}

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

// Função para formatar data relativa
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `há ${diffMins}min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `há ${diffDays}d`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// Função para gerar título a partir das primeiras palavras
function generateTitle(content: string): string {
  const words = content.trim().split(/\s+/).slice(0, 5);
  return words.join(' ') + (content.split(/\s+/).length > 5 ? '...' : '');
}

export default function ChatWidget() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStreamedText, setCurrentStreamedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState<boolean>(false);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isLoadingRef = useRef<boolean>(false);

  // Carregar conversas ao abrir o chat
  useEffect(() => {
    if (isOpen && isAuthenticated && user) {
      loadConversations();
    }
  }, [isOpen, isAuthenticated, user]);

  const loadConversations = async () => {
    if (!user) return;

    setIsLoadingConversations(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setConversations(data || []);
    } catch (err) {
      console.error('Erro ao carregar conversas:', err);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Criar nova conversa
  const createConversation = async (firstMessage: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const title = generateTitle(firstMessage);
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title,
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (err) {
      console.error('Erro ao criar conversa:', err);
      setSaveWarning('Erro ao salvar conversa. Continuando sem salvar...');
      setTimeout(() => setSaveWarning(null), 5000);
      return null;
    }
  };

  // Salvar mensagem no banco
  const saveMessage = async (conversationId: string, role: 'user' | 'assistant', content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
        });

      if (error) throw error;

      // Atualizar updated_at da conversa
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    } catch (err) {
      console.error('Erro ao salvar mensagem:', err);
      setSaveWarning('Erro ao salvar mensagem. Continuando...');
      setTimeout(() => setSaveWarning(null), 5000);
    }
  };

  // Carregar mensagens de uma conversa
  const loadConversationMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const loadedMessages: Message[] = (data || []).map((msg: MessageFromDB) => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }));

      setMessages(loadedMessages);
      setCurrentConversationId(conversationId);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError('Erro ao carregar conversa');
    }
  };

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

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Cancelar requisição ao fechar o modal
  useEffect(() => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setCurrentStreamedText('');
    }
  }, [isOpen]);

  const handleNewConversation = () => {
    setMessages([]);
    setError(null);
    setCurrentStreamedText('');
    setCurrentConversationId(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isLoadingRef.current = false;
    setIsLoading(false);
    setShowSidebar(false);
  };

  const handleSelectConversation = async (conversationId: string) => {
    setShowSidebar(false);
    await loadConversationMessages(conversationId);
  };

  const handleCopyMessage = async (content: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoadingRef.current) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = input.trim();
    setInput('');
    setError(null);
    isLoadingRef.current = true;
    setIsLoading(true);
    setCurrentStreamedText('');

    // Criar conversa se for a primeira mensagem
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = await createConversation(messageContent);
      if (conversationId) {
        setCurrentConversationId(conversationId);
        await loadConversations(); // Recarregar lista
      }
    }

    // Salvar mensagem do usuário (assíncrono, não bloqueia UI)
    if (conversationId) {
      saveMessage(conversationId, 'user', messageContent);
    }

    // Criar novo AbortController para esta requisição
    abortControllerRef.current = new AbortController();

    try {
      // Obter o token de acesso da sessão do Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        setError('Sessão expirada. Faça login novamente.');
        isLoadingRef.current = false;
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ question: messageContent }),
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
                  { role: 'assistant', content: finalText, timestamp: new Date() },
                ]);

                // Salvar mensagem do assistente (assíncrono)
                if (conversationId) {
                  saveMessage(conversationId, 'assistant', finalText);
                }

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
          { role: 'assistant', content: finalText, timestamp: new Date() },
        ]);

        // Salvar mensagem do assistente (assíncrono)
        if (conversationId) {
          saveMessage(conversationId, 'assistant', finalText);
        }
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
          {/* Sidebar de conversas */}
          {showSidebar && (
            <div className="chat-widget-sidebar">
              <div className="chat-widget-sidebar-header">
                <h4>Conversas</h4>
                <button
                  className="chat-widget-sidebar-close"
                  onClick={() => setShowSidebar(false)}
                  aria-label="Fechar sidebar"
                >
                  <svg
                    width="18"
                    height="18"
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
              <div className="chat-widget-sidebar-content">
                {isLoadingConversations ? (
                  <div className="chat-widget-sidebar-loading">Carregando...</div>
                ) : conversations.length === 0 ? (
                  <div className="chat-widget-sidebar-empty">Nenhuma conversa ainda</div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      className={`chat-widget-conversation-item ${
                        currentConversationId === conv.id ? 'active' : ''
                      }`}
                      onClick={() => handleSelectConversation(conv.id)}
                    >
                      <div className="chat-widget-conversation-title">
                        {conv.title || 'Conversa sem título'}
                      </div>
                      <div className="chat-widget-conversation-time">
                        {formatRelativeTime(new Date(conv.updated_at))}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Header */}
          <div className="chat-widget-header">
            <h3 className="chat-widget-title">Assistente IA</h3>
            <div className="chat-widget-header-actions">
              <button
                className="chat-widget-conversations-button"
                onClick={() => setShowSidebar(!showSidebar)}
                aria-label="Ver conversas"
                title="Ver conversas"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <button
                className="chat-widget-new-conversation"
                onClick={handleNewConversation}
                aria-label="Nova conversa"
                title="Nova conversa"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
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
          </div>

          {/* Warning de erro ao salvar */}
          {saveWarning && (
            <div className="chat-widget-save-warning">{saveWarning}</div>
          )}

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
                {msg.role === 'assistant' && (
                  <button
                    className="chat-widget-copy-button"
                    onClick={() => handleCopyMessage(msg.content, idx)}
                    aria-label="Copiar mensagem"
                    title="Copiar mensagem"
                  >
                    {copiedIdx === idx ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                )}
                <div
                  className="chat-widget-message-content"
                  dangerouslySetInnerHTML={{
                    __html: msg.role === 'assistant' 
                      ? sanitize(parseMarkdown(msg.content)) 
                      : sanitize(msg.content),
                  }}
                />
                <span className="chat-widget-timestamp">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}

            {/* Mensagem sendo streamada */}
            {currentStreamedText && (
              <div className="chat-widget-message chat-widget-message--assistant">
                <div
                  className="chat-widget-message-content"
                  dangerouslySetInnerHTML={{
                    __html: sanitize(parseMarkdown(currentStreamedText)),
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
            <textarea
              ref={textareaRef}
              className="chat-widget-input"
              placeholder="Digite sua pergunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
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
