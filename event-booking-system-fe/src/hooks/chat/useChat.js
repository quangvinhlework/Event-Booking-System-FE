import { useEffect, useState, useCallback } from "react";
import { sendMessage, subscribeMessages } from "../../services/chatService";

export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
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
      
      (newMessages) => {
        setMessages(newMessages);
        if (isFirstSnapshot) {
          setLoading(false);
          isFirstSnapshot = false;
        }
      },
      
      (errorMessage) => {
        setError(errorMessage);
        setLoading(false);
      }
    );

    
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [roomId]);

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