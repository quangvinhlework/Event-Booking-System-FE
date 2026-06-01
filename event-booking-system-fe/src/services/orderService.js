import { handleApi } from "../api/apiHandler";
import { authAxiosClient } from "../api/axiosClient";
import { getToken } from "../utils/authUtils";

export const createPayment = async (orderData) => {
  return handleApi(() => {
    return authAxiosClient(getToken()).post('/v1/me/payment/paypal/create', orderData);
  });
};