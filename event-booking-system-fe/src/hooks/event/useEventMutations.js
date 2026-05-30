import { useState } from 'react';
import * as eventService from '../../services/eventService';
import { mapEventResponse } from '../../mappers/eventMapper';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

export const useEventMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const createEvent = async (eventData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.createEvent(eventData);

      if (response.success) {
        const mapped = mapEventResponse(response.data);
        setResult(mapped);
        return mapped;
      } else {
        setError(response.message || 'Không thể tạo sự kiện');
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể tạo sự kiện');
      setError(message);
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
        const mapped = mapEventResponse(response.data);
        setResult(mapped);
        return mapped;
      } else {
        setError(response.message || 'Không thể cập nhật sự kiện');
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể cập nhật sự kiện');
      setError(message);
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
      } else {
        setError(response.message || 'Không thể xóa sự kiện');
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể xóa sự kiện');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const publishEvent = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.publishEvent(id);

      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Không thể mở bán sự kiện');
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể mở bán sự kiện');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const endEvent = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.endEvent(id);

      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Không thể kết thúc sự kiện');
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể kết thúc sự kiện');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearResult = () => setResult(null);

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    publishEvent,
    endEvent,
    loading,
    error,
    result,
    clearError,
    clearResult,
  };
};
