import { handleApi } from '../api/apiHandler';
import { authAxiosClientMultipart } from '../api/axiosClient';
import { getToken } from '../utils/authUtils';

export const submitOrganizerApplication = (applicationData) => {
  const token = getToken();
  return handleApi(() =>
    authAxiosClientMultipart(token).post('/v1/me/organizer-application', applicationData)
  );
};
