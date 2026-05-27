import { useState, useCallback, useEffect } from 'react';
import * as eventService from '../../services/eventService';
import { mapEventResponse } from '../../mappers/eventMapper';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

export const useEvent = (id) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvent = useCallback(async () => {
    if (!id) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.getEventById(id);

      if (response.success) {
        const mapped = mapEventResponse(response.data);
        setEvent(mapped);
        return mapped;
      }

      throw new Error(response.message || 'Không thể tải sự kiện');
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể tải sự kiện');
      setError(message);
      setEvent(null);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const clearEvent = useCallback(() => {
    setEvent(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id, fetchEvent]);

  return {
    event,
    loading,
    error,
    fetchEvent,
    getEventById: fetchEvent,
    clearEvent,
  };
};
