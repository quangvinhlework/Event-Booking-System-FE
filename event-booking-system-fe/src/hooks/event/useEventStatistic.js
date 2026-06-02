import { useState, useCallback } from 'react';
import * as eventStatisticService from '../../services/eventStatisticService';
import { mapEventStatisticResponse } from '../../mappers/eventStatisticMapper';
import { eventStatisticFilters } from '../../filters/eventStatisticFilter';

export const useEventStatistic = () => {
  const [eventStatistics, setEventStatistics] = useState([]);
  const [eventStatistic, setEventStatistic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEventStatistics = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatistics(filters);

      if (response.success) {
        const mappedStatistics = response.data.map(mapEventStatisticResponse);
        setEventStatistics(mappedStatistics);
        return mappedStatistics;
      } else {
        setError(response.message || 'Failed to fetch event statistics');
        return [];
      }
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventStatisticsByMonth = useCallback(async (month, year, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatisticsByMonth(month, year, filters);

      if (response.success) {
        const mappedStatistics = response.data.map(mapEventStatisticResponse);
        setEventStatistics(mappedStatistics);
        return mappedStatistics;
      } else {
        setError(response.message || 'Failed to fetch event statistics by month');
        return [];
      }
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventStatisticsByQuarter = useCallback(async (quarter, year, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatisticsByQuarter(quarter, year, filters);

      if (response.success) {
        const mappedStatistics = response.data.map(mapEventStatisticResponse);
        setEventStatistics(mappedStatistics);
        return mappedStatistics;
      } else {
        setError(response.message || 'Failed to fetch event statistics by quarter');
        return [];
      }
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventStatisticsByYear = useCallback(async (year, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatisticsByYear(year, filters);

      if (response.success) {
        const mappedStatistics = response.data.map(mapEventStatisticResponse);
        setEventStatistics(mappedStatistics);
        return mappedStatistics;
      } else {
        setError(response.message || 'Failed to fetch event statistics by year');
        return [];
      }
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventStatisticByEventId = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatisticByEventId(eventId);

      if (response.success) {
        const mappedStatistic = mapEventStatisticResponse(response.data);
        setEventStatistic(mappedStatistic);
        return mappedStatistic;
      } else {
        setError(response.message || 'Failed to fetch event statistic by event id');
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    filters: eventStatisticFilters,
    eventStatistics,
    eventStatistic,
    loading,
    error,
    fetchEventStatistics,
    fetchEventStatisticsByMonth,
    fetchEventStatisticsByQuarter,
    fetchEventStatisticsByYear,
    fetchEventStatisticByEventId,
  };
};
