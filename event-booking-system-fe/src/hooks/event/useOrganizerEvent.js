import * as eventService from '../../services/eventService';
import { useState, useEffect, useCallback } from 'react';
import { mapEventResponse } from '../../mappers/eventMapper';

export const useOrganizerEvent = () => {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getOrganizerEvents();
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
  }, []);

  const getEventById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getEventById(id);
      if (response.success) {
        const mappedEvent = mapEventResponse(response.data)
        setEvent(mappedEvent);
        console.log("abc" + event)
      } else {
        throw new Error(response.message || 'Failed to fetch event by id');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, event, loading, error, fetchEvents, getEventById };
};
