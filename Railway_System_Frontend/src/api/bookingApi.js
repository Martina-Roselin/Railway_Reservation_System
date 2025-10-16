// src/api/bookingApi.js
import api from "../utils/request";

// Get user's bookings
export const getUserBookings = () => api.get("/bookings");

// Create a booking
export const createBooking = (bookingData) => api.post("/bookings", bookingData);

// Cancel a booking
export const cancelBooking = (bookingId) => api.patch(`/bookings/${bookingId}/cancel`);

// Get booking by ID
export const getBookingById = (bookingId) => api.get(`/bookings/${bookingId}`);

// Download ticket
export const downloadTicket = (bookingId) => api.get(`/bookings/${bookingId}/ticket`);

// Temporary booking - This doesn't exist in the provided APIs, so we'll remove it
// export const createTemporaryBooking = (bookingData) => api.post("/bookings/temporary", bookingData);
