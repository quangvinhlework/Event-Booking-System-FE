import { handleApi } from '../api/apiHandler';
import {
  authAxiosClient,
  authAxiosClientMultipart,
  axiosClient,
  axiosClientMultipart,
} from '../api/axiosClient';
import { buildEventFormData } from '../utils/formData';
import { getToken } from '../utils/authUtils';

export const login = (email, password) =>
  handleApi(() => axiosClient.post('/v1/public/login', { email, password }));

export const register = (userData) => {
  const formData = buildEventFormData(userData);
  return handleApi(() => axiosClientMultipart().post('/v1/public/register', formData));
};

export const getMyInfo = () => {
  const token = getToken();
  return handleApi(() => authAxiosClient(token).get('/v1/me'));
};

export const updateMyInfo = (userData) => {
  const token = getToken();
  const formData = buildEventFormData(userData);
  return handleApi(() => authAxiosClientMultipart(token).put('/v1/me', formData));
};
