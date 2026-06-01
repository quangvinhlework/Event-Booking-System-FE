import { handleApi } from '../api/apiHandler';
import { authAxiosClient } from '../api/axiosClient';
import { getToken } from '../utils/authUtils';

export const getOrganizerTickets = (params) => {
  const token = getToken();
  return handleApi(() =>
    authAxiosClient(token).get('/v1/organizer/tickets', { params })
  );
};

export const getMyTickets = (params) => {
  const token = getToken();
  return handleApi(() =>
    authAxiosClient(token).get('/v1/me/my-tickets', { params })
  );
};
