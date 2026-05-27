import { handleApi } from "../api/apiHandler";
import { axiosClientJsonBody } from "../api/axiosClient";

export const createPayment = async (orderData) => {
  return handleApi(() => {
    return axiosClientJsonBody.post('/payment/paypal/create', orderData);
  });
};