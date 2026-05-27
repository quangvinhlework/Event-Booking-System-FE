import { handleApi } from '../api/apiHandler';
import { authAxiosClient } from '../api/axiosClient';
import { getToken } from '../utils/authUtils';

export const submitOrganizerApplication = (applicationData) => {
  const token = getToken();
  return handleApi(() =>
    authAxiosClient(token).post('/secure/organizer-application', applicationData)
  );
};
