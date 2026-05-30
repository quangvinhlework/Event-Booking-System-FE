import { useEffect, useState, useCallback } from "react";
import { sendMessage, subscribeMessages } from "../../services/chatService";

/**
 * Hook quản lý chat real-time cho một phòng (roomId).
 *
 * @param {string} roomId – ID phòng chat (vd: "event_123")
 * @returns {{ messages, loading, error, sendMessage }}
 */
export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard: nếu chưa có roomId thì không subscribe
    if (!roomId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let isFirstSnapshot = true;

    const unsubscribe = subscribeMessages(
      roomId,
      // onData callback
      (newMessages) => {
        setMessages(newMessages);
        if (isFirstSnapshot) {
          setLoading(false);
          isFirstSnapshot = false;
        }
      },
      // onError callback
      (errorMessage) => {
        setError(errorMessage);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe khi roomId thay đổi hoặc component unmount
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [roomId]);

  /**
   * Gửi tin nhắn vào phòng chat hiện tại.
   */
  const handleSendMessage = useCallback(
    async (senderId, senderName, text) => {
      if (!text || !text.trim()) return;
      if (!roomId) return;

      try {
        await sendMessage(roomId, {
          senderId,
          senderName,
          text: text.trim(),
          createdAt: Date.now(),
        });
      } catch (err) {
        console.error("[useChat] Failed to send message:", err);
        setError("Gửi tin nhắn thất bại. Vui lòng thử lại.");
      }
    },
    [roomId]
  );

  /**
   * Xoá lỗi hiện tại.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage: handleSendMessage,
    clearError,
  };
};