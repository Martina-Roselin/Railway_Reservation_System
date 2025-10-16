// src/api/trainApi.js
import api from "../utils/request";

// Get all trains
export const getAllTrains = () => api.get("/trains");

// Search trains - Using the correct endpoint with query parameters
export const searchTrains = (searchParams) => {
  const { from, to, date } = searchParams;
  return api.get(`/trains/search?from=${from}&to=${to}&date=${date}`);
};

// Get train by ID
export const getTrainById = (id) => api.get(`/trains/details/${id}`);

// Admin endpoints (require admin token)
export const addTrain = (trainObj) => api.post("/trains", trainObj);
export const updateTrain = (id, trainObj) => api.put(`/trains/${id}`, trainObj);
export const deleteTrain = (id) => api.delete(`/trains/${id}`);
