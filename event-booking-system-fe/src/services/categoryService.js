import { handleApi } from '../api/apiHandler';
import { axiosClientJson } from '../api/axiosClient';

export const getCategories = async () => {
  return handleApi(() => axiosClientJson.get('/categories'));
};
