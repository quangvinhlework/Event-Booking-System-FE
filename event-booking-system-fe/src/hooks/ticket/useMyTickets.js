import { useState, useEffect, useCallback } from 'react';
import * as ticketService from '../../services/ticketService';
import { mapTicketResponse } from '../../mappers/ticketMapper';
import { buildTicketQuery, EMPTY_TICKET_FILTERS } from '../../filters/ticketFilter';

export const useMyTickets = (filters = EMPTY_TICKET_FILTERS, options = {}) => {
  const { autoFetch = true } = options;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = buildTicketQuery(filters);
      const response = await ticketService.getMyTickets(params);

      if (response.success) {
        setTickets(response.data.map(mapTicketResponse));
      } else {
        throw new Error(response.message || 'Không thể tải danh sách vé');
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
