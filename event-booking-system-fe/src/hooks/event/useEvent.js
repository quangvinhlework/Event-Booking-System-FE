import * as eventService from '../../services/eventService';
import { useState, useEffect, useCallback } from 'react';
import { mapEventResponse } from '../../mappers/eventMapper';

export const useEvent = (name, cateId, options = {}) => {
  const { autoFetch = true } = options;
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getEvents({ name: name, cateId: cateId });
      if (response.success) {
        setEvents(response.data.map(mapEventResponse));
      } else {
        throw new Error(response.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [name, cateId]);

  const getEventById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getEventById(id);
      if (response.success) {
        setEvent(mapEventResponse(response.data));
      } else {
        throw new Error(response.message || 'Failed to fetch event by id');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return { events, event, loading, error, fetchEvents, getEventById };
};
