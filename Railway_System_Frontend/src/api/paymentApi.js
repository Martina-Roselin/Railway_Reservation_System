// src/api/paymentApi.js
import api from "../utils/request";

// Simulate payment - Using the correct endpoint with query parameter
export const simulatePayment = (bookingId) => api.post(`/payment/simulate?bookingId=${bookingId}`);
