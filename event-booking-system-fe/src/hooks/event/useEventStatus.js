import { useState, useEffect } from 'react';
import * as eventStatusService from '../../services/eventStatusService';
import { mapEventStatusResponse } from '../../mappers/eventStatusMapper';

export const useEventStatus = () => {
    const [eventStatus, setEventStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEventStatus();
    }, []);

    const fetchEventStatus = async () => {
        try {
            const response = await eventStatusService.getEventStatuses();
            if (response.success) {
                setEventStatus(response.data.map(mapEventStatusResponse));
            } else {
                setError(response.message || 'Không thể tải trạng thái sự kiện');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        eventStatus,
        loading,
        error,
        fetchEventStatus,
    };
};