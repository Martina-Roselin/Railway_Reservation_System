// src/api/adminApi.js
import api from "../utils/request";

// Dashboard - This endpoint doesn't exist in the provided APIs, so we'll remove it
// export const getDashboardStats = () => api.get("/admin/dashboard/stats");

// Train Management - Using the correct endpoints
export const getAllTrains = () => api.get("/trains");
export const addTrain = (trainData) => api.post("/trains", trainData);
export const updateTrain = (id, trainData) => api.put(`/trains/${id}`, trainData);
export const deleteTrain = (id) => api.delete(`/trains/${id}`);

// Booking Management - Using the correct endpoints
export const getAllBookings = () => api.get("/bookings/admin");
export const cancelBooking = (bookingId) => api.patch(`/bookings/${bookingId}/cancel`);

// User Management - These endpoints don't exist in the provided APIs
// We'll need to handle this differently or remove these functions
// export const getAllUsers = () => api.get("/admin/users");
// export const updateUserStatus = (userId, status) => api.patch(`/admin/users/${userId}/status`, { status });
