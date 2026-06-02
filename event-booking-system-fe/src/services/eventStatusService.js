import { handleApi } from '../api/apiHandler';
import { authAxiosClient } from '../api/axiosClient';
import { getToken } from '../utils/authUtils';

export const getEventStatuses = async () => {
    const token = getToken();
    return handleApi(() => authAxiosClient(token).get('/v1/organizer/event-status'));
};