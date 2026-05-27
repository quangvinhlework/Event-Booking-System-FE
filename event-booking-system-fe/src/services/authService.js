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
  handleApi(() => axiosClient.post('/login', { email, password }));

export const register = (userData) => {
  const formData = buildEventFormData(userData);
  return handleApi(() => axiosClientMultipart().post('/users', formData));
};

export const getMyInfo = () => {
  const token = getToken();
  return handleApi(() => authAxiosClient(token).get('/secure/me'));
};

export const updateMyInfo = (userData) => {
  const token = getToken();
  const formData = buildEventFormData(userData);
  return handleApi(() => authAxiosClientMultipart(token).put('/secure/me', formData));
};
