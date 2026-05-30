import { useEffect, useState, useCallback, useMemo } from "react";
import { subscribeChatRooms } from "../../services/chatService";

/**
 * Hook quản lý danh sách phòng chat cho organizer.
 * Lắng nghe real-time các phòng chat liên quan đến events của organizer.
 *
 * @param {Array} eventIds – mảng event IDs của organizer
 * @returns {{ rooms, loading, error }}
 */
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
