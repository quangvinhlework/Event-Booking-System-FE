import { useState, useEffect, useCallback } from 'react';
import * as eventService from '../../services/eventService';
import { mapEventResponse } from '../../mappers/eventMapper';
import { buildEventQuery, EMPTY_EVENT_FILTERS } from '../../filters/eventFilter';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

export const useOrganizerEvent = (filters = EMPTY_EVENT_FILTERS, options = {}) => {
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
        setError(response.message || 'Không thể tải sự kiện của bạn');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [append, filters]);

  const getEventById = async (id) => {
    try {
      const response = await eventService.getOwnEventById(id);

      if (response.success) {
        const mappedEvent = mapEventResponse(response.data);
        setEvent(mappedEvent);
        return mappedEvent;
      } else {
        setEvent(null);
        setError(response.message || 'Không thể tải chi tiết sự kiện');
      }
    } catch (err) {
      setEvent(null);
      setError(getApiErrorMessage(err, 'Không thể tải chi tiết sự kiện'));
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return {
    events,
    event,
    loading,
    error,
    hasMore,
    fetchEvents,
    getEventById,
  };
};
