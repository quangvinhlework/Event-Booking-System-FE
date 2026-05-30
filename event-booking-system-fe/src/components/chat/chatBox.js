import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/chat/useChat';
import './ChatBox.css';

/**
 * Floating chat widget for event pages.
 * Renders a FAB button (bottom-right) that opens a chat window
 * connected to a Firebase Realtime Database room scoped by eventId.
 */
const ChatBox = ({ eventId, eventName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Room ID format: event_{eventId}  — one room per event
  const roomId = `event_${eventId}`;
  const { messages, loading, error, sendMessage, clearError } = useChat(roomId);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen, isAuthenticated]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && text) {
      clearError();
    }
  }, [text, error, clearError]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !user) return;

    setText('');
    await sendMessage(user.id, user.fullName || user.email, trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* ── Chat Window ────────────────────────────────── */}
      <div
        className={`chat-window ${isOpen ? 'chat-window--visible' : ''}`}
        role="dialog"
        aria-label="Hộp thoại chat"
      >
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header__avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="chat-header__info">
            <p className="chat-header__title">
              Chat · {eventName || 'Sự kiện'}
            </p>
            <p className="chat-header__subtitle">
              <span className="chat-header__dot" />
              Trò chuyện với ban tổ chức
            </p>
          </div>
          <button
            type="button"
            className="chat-header__close"
            onClick={() => setIsOpen(false)}
            aria-label="Đóng chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {!isAuthenticated ? (
          <div className="chat-login-prompt">
            <div className="chat-login-prompt__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <p className="chat-login-prompt__text">
              Vui lòng đăng nhập để trò chuyện<br />với ban tổ chức sự kiện
            </p>
            <button
              type="button"
              className="chat-login-prompt__btn"
              onClick={() => navigate('/login')}
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : (
          <>
            <div className="chat-messages">
              {/* Loading state */}
              {loading ? (
                <div className="chat-empty">
                  <div className="chat-empty__icon">
                    <svg className="chat-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                  <p className="chat-empty__text">Đang tải tin nhắn...</p>
                </div>
              ) : error ? (
                /* Error state */
                <div className="chat-empty">
                  <div className="chat-empty__icon chat-empty__icon--error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <p className="chat-empty__text">{error}</p>
                  <button
                    type="button"
                    className="chat-login-prompt__btn"
                    onClick={clearError}
                    style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                  >
                    Bỏ qua
                  </button>
                </div>
              ) : messages.length === 0 ? (
                /* Empty state */
                <div className="chat-empty">
                  <div className="chat-empty__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p className="chat-empty__text">
                    Chưa có tin nhắn nào.<br />
                    Hãy bắt đầu trò chuyện với ban tổ chức!
                  </p>
                </div>
              ) : (
                /* Messages list */
                messages.map((msg) => {
                  const isSent = String(msg.senderId) === String(user?.id);
                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble ${isSent ? 'chat-bubble--sent' : 'chat-bubble--received'}`}
                    >
                      {!isSent && (
                        <span className="chat-bubble__sender">{msg.senderName}</span>
                      )}
                      <p className="chat-bubble__text">{msg.text}</p>
                      <span className="chat-bubble__time">{formatTime(msg.createdAt)}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input">
              <textarea
                ref={inputRef}
                className="chat-input__field"
                placeholder="Nhập tin nhắn..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                type="button"
                className="chat-input__send"
                onClick={handleSend}
                disabled={!text.trim()}
                aria-label="Gửi tin nhắn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── FAB Button ─────────────────────────────────── */}
      <button
        type="button"
        className={`chat-fab ${isOpen ? 'chat-fab--open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Đóng chat' : 'Mở chat với ban tổ chức'}
        id="chat-fab-button"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </>
  );
};

export default ChatBox;
