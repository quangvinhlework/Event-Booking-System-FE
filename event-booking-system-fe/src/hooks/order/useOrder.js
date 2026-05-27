import { useCallback, useContext, useState } from 'react';
import * as orderService from '../../services/orderService';
import { AuthContext } from '../../contexts/AuthContext';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

export const useOrder = (eventId) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(
    async (quantity = 1, options = {}) => {
      const { targetWindow } = options;
      if (!eventId) {
        return null;
      }

      if (!isAuthenticated || !user) {
        const message = 'Vui lòng đăng nhập để đặt vé';
        setError(message);
        throw new Error(message);
      }

      setLoading(true);
      setError(null);

      try {
        const payload = {
          eventId: Number(eventId),
          quantity: Number(quantity) || 1,
          attendeeId: user.id,
        };

        const response = await orderService.createPayment(payload);

        if (response.success && response.data?.approvalUrl) {
          if (targetWindow && !targetWindow.closed) {
            targetWindow.location.href = response.data.approvalUrl;
          } else {
             window.open(response.data.approvalUrl, '_blank', 'noopener,noreferrer');
          }
          return response.data;
        }

        throw new Error(response.message || 'Không thể tạo đơn thanh toán');
      } catch (err) {
        const message = getApiErrorMessage(err, 'Không thể tạo đơn thanh toán');
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [eventId, isAuthenticated, user]
  );

  return {
    createOrder,
    loading,
    error,
  };
};

