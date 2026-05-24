import { handleApi } from "../api/apiHandler";
import { authAxiosClient } from "../api/axiosClient";

export const submitOrganizerApplication = async (applicationData) => {
  const token = localStorage.getItem('token');
  return handleApi(() => authAxiosClient(token).post('/secure/organizer-application', applicationData));
}