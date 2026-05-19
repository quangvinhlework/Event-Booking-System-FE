import { useState } from 'react';
import * as eventStatisticService from '../../services/eventStatisticService';
import { mapEventStatisticResponse } from '../../mappers/eventStatisticMapper';
import { eventStatisticFilters } from '../../filters/eventStatisticFilter';

export const useEventStatistic = () => {
  const [eventStatistics, setEventStatistics] = useState([]);
  const [eventStatistic, setEventStatistic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEventStatistics = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatistics(filters);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch event statistics');
      }

      const mappedStatistics = response.data.map(mapEventStatisticResponse);

      setEventStatistics(mappedStatistics);
      return mappedStatistics;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchEventStatisticsByMonth = async (month, year, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatisticsByMonth(month, year, filters);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch event statistics by month');
      }

      const mappedStatistics = response.data.map(mapEventStatisticResponse);

      setEventStatistics(mappedStatistics);
      return mappedStatistics;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchEventStatisticsByQuarter = async (quarter, year, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatisticsByQuarter(quarter, year, filters);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch event statistics by quarter');
      }

      const mappedStatistics = response.data.map(mapEventStatisticResponse);

      setEventStatistics(mappedStatistics);
      return mappedStatistics;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchEventStatisticsByYear = async (year, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatisticsByYear(year, filters);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch event statistics by year');
      }

      const mappedStatistics = response.data.map(mapEventStatisticResponse);

      setEventStatistics(mappedStatistics);
      return mappedStatistics;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchEventStatisticByEventId = async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventStatisticService.getEventStatisticByEventId(eventId);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch event statistic by event id');
      }

      const mappedStatistic = mapEventStatisticResponse(response.data);

      setEventStatistic(mappedStatistic);
      return mappedStatistic;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

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
