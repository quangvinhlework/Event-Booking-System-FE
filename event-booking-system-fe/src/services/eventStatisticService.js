import { handleApi } from '../api/apiHandler';
import { authAxiosClient } from '../api/axiosClient';
import { buildEventStatisticQuery } from '../filters/eventStatisticFilter';

const getToken = () => localStorage.getItem('token');

export const getEventStatistics = async (filters = {}) => {
  const query = buildEventStatisticQuery(filters);

  return handleApi(() =>
    authAxiosClient(getToken()).get('/secure/event-statistics', { params: query })
  );
};

export const getEventStatisticsByMonth = async (month, year, filters = {}) => {
  const query = buildEventStatisticQuery({ ...filters, month, year });

  return handleApi(() =>
    authAxiosClient(getToken()).get('/secure/event-statistics/by-month', {
      params: query,
    })
  );
};

export const getEventStatisticsByQuarter = async (quarter, year, filters = {}) => {
  const query = buildEventStatisticQuery({ ...filters, quarter, year });

  return handleApi(() =>
    authAxiosClient(getToken()).get('/secure/event-statistics/by-quarter', {
      params: query,
    })
  );
};

export const getEventStatisticsByYear = async (year, filters = {}) => {
  const query = buildEventStatisticQuery({ ...filters, year });

  return handleApi(() =>
    authAxiosClient(getToken()).get('/secure/event-statistics/by-year', {
      params: query,
    })
  );
};

export const getEventStatisticByEventId = async (eventId) => {
  return handleApi(() =>
    authAxiosClient(getToken()).get(`/secure/event-statistics/${eventId}`)
  );
};
