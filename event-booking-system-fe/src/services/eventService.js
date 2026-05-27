import { handleApi } from '../api/apiHandler';
import { axiosClient, authAxiosClient, authAxiosClientMultipart } from '../api/axiosClient';
import { buildEventFormData } from '../utils/formData';
import { getToken } from '../utils/authUtils';

export const getEvents = async (filters) => {
  return handleApi(() => axiosClient.get('/events', { params: filters }));
};

export const getOrganizerEvents = async (filters) => {
  const token = getToken();
  return handleApi(() => authAxiosClient(token).get('/secure/organizer/events', {
    params: filters,
  }));
}

export const createEvent = async (eventData) => {
  const token = getToken();
  const formData = buildEventFormData(eventData);
  return handleApi(() => authAxiosClientMultipart(token).post('/secure/organizer/events', formData));
}

export const getEventById = async (id) => {
  return handleApi(() => axiosClient.get(`/events/${id}`))
}

export const getOwnEventById = async (id) => {
  const token = getToken();
  return handleApi(() => authAxiosClient(token).get(`/secure/organizer/events/${id}`));
}

export const updateEvent = async (eventData, id) => {
  const token = getToken();
  const formData = buildEventFormData(eventData);
  return handleApi(() => authAxiosClientMultipart(token).put(`/secure/organizer/events/${id}`, formData));
}

export const deleteEvent = async (id) => {
  const token = getToken();
  return handleApi(() => authAxiosClient(token).delete(`/secure/organizer/events/${id}`));
}

export const publishEvent = async (eventId) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('eventId', eventId);
  return handleApi(() => authAxiosClient(token).put(`/secure/organizer/launch-event`, formData));
}

export const endEvent = async (eventId) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('eventId', eventId);
  return handleApi(() => authAxiosClient(token).put(`/secure/organizer/end-event`, formData));
}