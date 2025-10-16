// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SearchTrains from "./pages/SearchTrains/SearchTrains";
import TrainDetails from "./pages/TrainDetails/TrainDetails";
import PassengerDetails from "./pages/PassengerDetails/PassengerDetails";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import BookingConfirmation from "./pages/BookingConfirmation/BookingConfirmation";
import MyBookings from "./pages/MyBookings/MyBookings";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminManageTrains from "./pages/Admin/ManageTrains/ManageTrains";
import AdminManageBookings from "./pages/Admin/ManageBookings/ManageBookings";
import AdminRegister from "./pages/Admin/AdminRegister/AdminRegister";
import { isAuthenticated, isAdmin } from "./utils/auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/search" element={<SearchTrains />} />
          <Route path="/traindetails/:trainNumber" element={<TrainDetails />} />
          <Route path="/passenger-details/:trainNumber" element={<PassengerDetails />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />

          <Route
            path="/bookings"
            element={<ProtectedRoute><MyBookings /></ProtectedRoute>}
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/register"
            element={<AdminRoute><AdminRegister /></AdminRoute>}
          />
          <Route
            path="/admin/trains"
            element={<AdminRoute><AdminManageTrains /></AdminRoute>}
          />
          <Route
            path="/admin/bookings"
            element={<AdminRoute><AdminManageBookings /></AdminRoute>}
          />

          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
