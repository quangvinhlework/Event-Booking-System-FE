import { handleApi } from '../api/apiHandler';
import { authAxiosClient, axiosClientJson } from '../api/axiosClient';
import { buildEventFormData } from '../utils/formData';

export const getEvents = async (filters) => {
  return handleApi(() => axiosClientJson.get('/events', { params: filters }));
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
  return handleApi(() => authAxiosClient(token).post('/secure/organizer/events', formData));
}

export const getEventById = async (id) => {
  return handleApi(() => axiosClientJson.get(`/events/${id}`))
}

export const updateEvent = async (eventData, id) => {
  const token = localStorage.getItem('token');
  const formData = buildEventFormData(eventData);
  return handleApi(() => authAxiosClient(token).put(`/secure/organizer/events/${id}`, formData));
}
