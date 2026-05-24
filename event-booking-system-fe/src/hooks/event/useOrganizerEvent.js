import * as eventService from '../../services/eventService';
import { useState, useEffect, useCallback } from 'react';
import { mapEventResponse } from '../../mappers/eventMapper';
import { buildEventQuery } from '../../filters/eventFilter';

export const useOrganizerEvent = (filters = {}, options = {}) => {
  const { autoFetch = true, append = false } = options;
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = buildEventQuery(filters);
      const response = await eventService.getOrganizerEvents(params);
      if (response.success) {
        const mappedEvents = response.data.map(mapEventResponse);
        if (append && filters.page > 1) {
          setEvents((prevEvents) => [...prevEvents, ...mappedEvents]);
        } else {
          setEvents(mappedEvents);
        }
        setHasMore(mappedEvents.length > 0);
      } else {
        throw new Error(response.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [append, filters]);

  const getEventById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventService.getOwnEventById(id);
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
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return { events, event, loading, error, hasMore, fetchEvents, getEventById };
};
