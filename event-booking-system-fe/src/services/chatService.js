import { ref, push, onValue, query, orderByChild } from "firebase/database";
import { db } from "../firebase/firebase";

export const sendMessage = async (roomId, message) => {
  if (!roomId) {
    throw new Error("roomId is required to send a message");
  }

  const messagesRef = ref(db, `chats/${roomId}/messages`);
  await push(messagesRef, message);
};

export const subscribeMessages = (roomId, onData, onError) => {
  if (!roomId) {
    onData([]);
    return null;
  }

  const messagesRef = ref(db, `chats/${roomId}/messages`);
  const messagesQuery = query(messagesRef, orderByChild("createdAt"));

  const unsubscribe = onValue(
    messagesQuery,
    (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        onData([]);
        return;
      }

      const messages = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value,
        }))
        
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

      onData(messages);
    },
    (error) => {
      console.error(`[chatService] Error subscribing to room "${roomId}":`, error);
      if (onError) {
        onError(error.message || "Không thể tải tin nhắn");
      }
    }
  );

  return unsubscribe;
};

export const subscribeChatRooms = (eventIds, onData, onError) => {
  if (!eventIds || eventIds.length === 0) {
    onData([]);
    return null;
  }

  const chatsRef = ref(db, "chats");

  const unsubscribe = onValue(
    chatsRef,
    (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        onData([]);
        return;
      }

      const rooms = Object.entries(data)
        .filter(([roomId]) => {
          
          const eventId = roomId.replace("event_", "");
          return eventIds.includes(eventId) || eventIds.includes(Number(eventId));
        })
        .map(([roomId, roomData]) => {
          const messages = roomData.messages || {};
          const messageList = Object.entries(messages).map(([id, msg]) => ({
            id,
            ...msg,
          }));

          // Sort by time to find last message
          messageList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          const lastMsg = messageList[0] || null;

          return {
            roomId,
            eventId: roomId.replace("event_", ""),
            messageCount: messageList.length,
            lastMessage: lastMsg?.text || "",
            lastSenderName: lastMsg?.senderName || "",
            lastTimestamp: lastMsg?.createdAt || 0,
          };
        })
        // Sort rooms by last activity (most recent first)
        .sort((a, b) => b.lastTimestamp - a.lastTimestamp);

      onData(rooms);
    },
    (error) => {
      console.error("[chatService] Error subscribing to chat rooms:", error);
      if (onError) {
        onError(error.message || "Không thể tải danh sách phòng chat");
      }
    }
  );

  return unsubscribe;
};