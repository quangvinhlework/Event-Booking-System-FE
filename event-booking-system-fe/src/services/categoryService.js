import { handleApi } from '../api/apiHandler';
import { axiosClient } from '../api/axiosClient';

export const getCategories = async () => {
  return handleApi(() => axiosClient.get('/categories'));
};
