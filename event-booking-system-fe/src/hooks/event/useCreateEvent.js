import { useState } from 'react';
import * as eventService from '../../services/eventService';

export const useCreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const createEvent = async (eventData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.createEvent(eventData);

      if (response.success) {
        setResult(response.data);
        return response.data;
      }

      throw new Error(
        response.message || 'Failed to create event'
      );

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        'Failed to create event';

      setError(message);

      throw err;

    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    result,
    loading,
    error,
  };
};