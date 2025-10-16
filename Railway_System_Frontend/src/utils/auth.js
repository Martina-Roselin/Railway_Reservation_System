// src/utils/auth.js
import {jwtDecode} from "jwt-decode";

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!getToken();

export const isAdmin = () => {
  const token = getToken();
  if (!token) return false;
  
      try {
      const decoded = jwtDecode(token);
      return decoded.role === "ADMIN";
    } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
