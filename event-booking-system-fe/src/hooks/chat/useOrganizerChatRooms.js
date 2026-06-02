import { useEffect, useState, useCallback, useMemo } from "react";
import { subscribeChatRooms } from "../../services/chatService";

export const useOrganizerChatRooms = (eventIds) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stableIds = useMemo(() => eventIds || [], [eventIds]);

  useEffect(() => {
    if (stableIds.length === 0) {
      setRooms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let isFirst = true;

    const unsubscribe = subscribeChatRooms(
      stableIds,
      (newRooms) => {
        setRooms(newRooms);
        if (isFirst) {
          setLoading(false);
          isFirst = false;
        }
      },
      (errorMsg) => {
        setError(errorMsg);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [stableIds]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    rooms,
    loading,
    error,
    clearError,
  };
};
