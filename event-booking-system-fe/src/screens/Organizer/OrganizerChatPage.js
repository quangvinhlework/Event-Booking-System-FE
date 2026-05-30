import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LoadingState } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useOrganizerEvent } from '../../hooks/event/useOrganizerEvent';
import { useOrganizerChatRooms } from '../../hooks/chat/useOrganizerChatRooms';
import { useChat } from '../../hooks/chat/useChat';
import OrganizerLayout from './layouts/OrganizerLayout';
import './OrganizerChatPage.css';

/* ── Conversation Panel (right side) ────────────────── */
const ConversationPanel = ({ roomId, eventName, user }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { messages, loading, error, sendMessage } = useChat(roomId);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [roomId]);

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
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!roomId) {
    return (
      <div className="org-chat-conv__empty">
        <div className="org-chat-conv__empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p>Chọn một cuộc trò chuyện để bắt đầu</p>
        <span>Chọn sự kiện từ danh sách bên trái để xem và trả lời tin nhắn</span>
      </div>
    );
  }

  return (
    <div className="org-chat-conv">
      {/* Header */}
      <div className="org-chat-conv__header">
        <div className="org-chat-conv__header-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className="org-chat-conv__header-info">
          <strong>{eventName}</strong>
          <span>{messages.length} tin nhắn</span>
        </div>
      </div>

      {/* Messages */}
      <div className="org-chat-conv__messages">
        {loading ? (
          <div className="org-chat-conv__center">
            <LoadingState text="Đang tải tin nhắn..." />
          </div>
        ) : error ? (
          <div className="org-chat-conv__center">
            <p className="org-chat-conv__error">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="org-chat-conv__center">
            <p className="org-chat-conv__placeholder">Chưa có tin nhắn nào trong cuộc trò chuyện này.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSent = String(msg.senderId) === String(user?.id);
            return (
              <div
                key={msg.id}
                className={`org-chat-bubble ${isSent ? 'org-chat-bubble--sent' : 'org-chat-bubble--received'}`}
              >
                {!isSent && <span className="org-chat-bubble__sender">{msg.senderName}</span>}
                <p className="org-chat-bubble__text">{msg.text}</p>
                <span className="org-chat-bubble__time">{formatTime(msg.createdAt)}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="org-chat-conv__input">
        <textarea
          ref={inputRef}
          className="org-chat-conv__textarea"
          placeholder="Nhập tin nhắn trả lời..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          type="button"
          className="org-chat-conv__send"
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
    </div>
  );
};

/* ── Main Page ──────────────────────────────────────── */
const OrganizerChatPage = () => {
  const { user } = useAuth();
  const { events, loading: eventsLoading } = useOrganizerEvent();
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Map event IDs from organizer's events
  const eventIds = useMemo(
    () => events.map((e) => String(e.id)),
    [events]
  );

  // Map eventId → event name for display
  const eventNameMap = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      map[String(e.id)] = e.name;
    });
    return map;
  }, [events]);

  const { rooms, loading: roomsLoading, error: roomsError } = useOrganizerChatRooms(eventIds);

  // Filter rooms by search
  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) return rooms;
    const q = searchQuery.toLowerCase();
    return rooms.filter((room) => {
      const name = (eventNameMap[room.eventId] || '').toLowerCase();
      return name.includes(q) || room.lastMessage.toLowerCase().includes(q);
    });
  }, [rooms, searchQuery, eventNameMap]);

  const activeEventName = activeRoomId
    ? eventNameMap[activeRoomId.replace('event_', '')] || 'Sự kiện'
    : '';

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ngày trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  const isLoading = eventsLoading || roomsLoading;

  return (
    <OrganizerLayout
      eyebrow="Tin nhắn"
      title="Trò chuyện"
      subtitle="Xem và trả lời tin nhắn từ khách hàng về các sự kiện của bạn."
    >
      {roomsError && (
        <div className="organizer-alert organizer-alert--danger">{roomsError}</div>
      )}

      {isLoading ? (
        <div className="organizer-loading">
          <LoadingState text="Đang tải cuộc trò chuyện..." />
        </div>
      ) : (
        <div className="org-chat-layout">
          {/* ── Left: Room list ────────────────────────── */}
          <aside className="org-chat-sidebar">
            <div className="org-chat-sidebar__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="org-chat-sidebar__search-input"
              />
            </div>

            <div className="org-chat-sidebar__list">
              {filteredRooms.length === 0 ? (
                <div className="org-chat-sidebar__empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p>
                    {searchQuery
                      ? 'Không tìm thấy cuộc trò chuyện phù hợp'
                      : 'Chưa có cuộc trò chuyện nào'}
                  </p>
                </div>
              ) : (
                filteredRooms.map((room) => (
                  <button
                    key={room.roomId}
                    type="button"
                    className={`org-chat-room ${activeRoomId === room.roomId ? 'org-chat-room--active' : ''}`}
                    onClick={() => setActiveRoomId(room.roomId)}
                  >
                    <div className="org-chat-room__avatar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </div>
                    <div className="org-chat-room__info">
                      <div className="org-chat-room__top">
                        <strong className="org-chat-room__name">
                          {eventNameMap[room.eventId] || `Sự kiện #${room.eventId}`}
                        </strong>
                        <span className="org-chat-room__time">
                          {formatRelativeTime(room.lastTimestamp)}
                        </span>
                      </div>
                      <p className="org-chat-room__preview">
                        {room.lastSenderName ? (
                          <>
                            <span className="org-chat-room__sender">{room.lastSenderName}:</span>{' '}
                            {room.lastMessage}
                          </>
                        ) : (
                          'Chưa có tin nhắn'
                        )}
                      </p>
                    </div>
                    {room.messageCount > 0 && (
                      <span className="org-chat-room__badge">{room.messageCount}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* ── Right: Conversation ────────────────────── */}
          <ConversationPanel
            roomId={activeRoomId}
            eventName={activeEventName}
            user={user}
          />
        </div>
      )}
    </OrganizerLayout>
  );
};

export default OrganizerChatPage;
