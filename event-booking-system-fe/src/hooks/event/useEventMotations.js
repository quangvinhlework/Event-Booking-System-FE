import { useState } from 'react';
import * as eventService from '../../services/eventService';

export const useEventMotations = () => {
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

  const updateEvent = async (eventData, id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.updateEvent(eventData, id);

      if (response.success) {
        setResult(response.data);
        return response.data;
      }

      throw new Error(
        response.message || 'Failed to update event'
      );

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        'Failed to update event';

      setError(message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.deleteEvent(id);

      if (response.success) {
        setResult(null);
        return response.data;
      }

      throw new Error(
        response.message || 'Failed to delete event'
      );

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        'Failed to delete event';

      setError(message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    result,
    loading,
    error,
    clearError,
    clearResult,
  };
};