import { handleApi } from '../api/apiHandler';
import { axiosClient, authAxiosClient, authAxiosClientMultipart } from '../api/axiosClient';
import { buildEventFormData } from '../utils/formData';

export const getEvents = async (filters) => {
  return handleApi(() => axiosClient.get('/events', { params: filters }));
};

export const getOrganizerEvents = async (filters) => {
  const token = localStorage.getItem('token');
  return handleApi(() => authAxiosClient(token).get('/secure/organizer/events', {
    params: filters,
  }));
}

export const createEvent = async (eventData) => {
  const token = localStorage.getItem('token');
  const formData = buildEventFormData(eventData);
  return handleApi(() => authAxiosClientMultipart(token).post('/secure/organizer/events', formData));
}

export const getEventById = async (id) => {
  return handleApi(() => axiosClient.get(`/events/${id}`))
}

export const getOwnEventById = async (id) => {
  const token = localStorage.getItem('token');
  return handleApi(() => authAxiosClient(token).get(`/secure/organizer/events/${id}`));
}

export const updateEvent = async (eventData, id) => {
  const token = localStorage.getItem('token');
  const formData = buildEventFormData(eventData);
  return handleApi(() => authAxiosClientMultipart(token).put(`/secure/organizer/events/${id}`, formData));
}

export const deleteEvent = async (id) => {
  const token = localStorage.getItem('token');
  return handleApi(() => authAxiosClient(token).delete(`/secure/organizer/events/${id}`));
}
