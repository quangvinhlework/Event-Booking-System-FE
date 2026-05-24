import * as eventService from '../../services/eventService';
import { useState, useCallback, useEffect } from 'react';
import { mapEventResponse } from '../../mappers/eventMapper';

export const useEvent = (id, filters = {}) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEventById = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getEventById(id);
      if (response.success) {
        setEvent(mapEventResponse(response.data));
        return mapEventResponse(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch event by id');
      }
    } catch (err) {
      setError(err.message);
      throw err;
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
      getEventById();
    }
  }, [id, getEventById]);

  return { event, loading, error, getEventById, clearEvent };
};
