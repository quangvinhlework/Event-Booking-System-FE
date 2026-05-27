import { useState, useEffect, useCallback } from 'react';
import * as eventService from '../../services/eventService';
import { mapEventResponse } from '../../mappers/eventMapper';
import { buildEventQuery, EMPTY_EVENT_FILTERS } from '../../filters/eventFilter';

export const useEvents = (filters = EMPTY_EVENT_FILTERS, options = {}) => {
  const { autoFetch = true, append = false } = options;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = buildEventQuery(filters);
      const response = await eventService.getEvents(params);

      if (response.success) {
        const mappedEvents = response.data.map(mapEventResponse);

        if (append && filters.page > 1) {
          setEvents((prevEvents) => [...prevEvents, ...mappedEvents]);
        } else {
          setEvents(mappedEvents);
        }

        setHasMore(mappedEvents.length > 0);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách sự kiện');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, append]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return { events, loading, error, hasMore, fetchEvents, clearEvents };
};
