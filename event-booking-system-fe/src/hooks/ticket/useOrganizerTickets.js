import { useState, useEffect, useCallback } from 'react';
import * as ticketService from '../../services/ticketService';
import { mapTicketResponse } from '../../mappers/ticketMapper';
import {
  buildOrganizerTicketQuery,
  EMPTY_TICKET_FILTERS,
} from '../../filters/ticketFilter';

export const useOrganizerTickets = (filters = EMPTY_TICKET_FILTERS, options = {}) => {
  const { autoFetch = true } = options;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    const params = buildOrganizerTicketQuery(filters);

    if (!params) {
      setTickets([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ticketService.getOrganizerTickets(params);

      if (response.success) {
        setTickets(response.data.map(mapTicketResponse));
      } else {
        setError(response.message || 'Không thể tải danh sách vé');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchTickets();
    }
  }, [autoFetch, fetchTickets]);

  return { tickets, loading, error, fetchTickets };
};
