import { useEffect, useState } from "react";
import { sendMessage, subscribeMessages } from "../../services/chatService";

export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe =
      subscribeMessages(roomId, setMessages);

    return () => unsubscribe();
  }, [roomId]);

  const handleSendMessage = async (
    senderId,
    senderName,
    text
  ) => {
    if (!text.trim()) return;

    await sendMessage(roomId, {
      senderId,
      senderName,
      text,
      createdAt: Date.now()
    });
  };

  return {
    messages,
    sendMessage: handleSendMessage
  };
};