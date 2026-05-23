import { ref, push, onValue } from "firebase/database";
import { db } from "../firebase/firebase";

export const sendMessage = async (
  roomId,
  message
) => {
  const messagesRef = ref(
    db,
    `chats/${roomId}/messages`
  );

  await push(messagesRef, message);
};

export const subscribeMessages = (
  roomId,
  callback
) => {
  const messagesRef = ref(
    db,
    `chats/${roomId}/messages`
  );

  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    const messages = Object.entries(data).map(
      ([id, value]) => ({
        id,
        ...value
      })
    );

    callback(messages);
  });
};