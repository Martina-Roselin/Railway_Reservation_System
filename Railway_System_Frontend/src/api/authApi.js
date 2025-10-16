// src/api/authApi.js
import api from "../utils/request";

export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const registerAdmin = (data) => api.post("/auth/registerAdmin", data);
