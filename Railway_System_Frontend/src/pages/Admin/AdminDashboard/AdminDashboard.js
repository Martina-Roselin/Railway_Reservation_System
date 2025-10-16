// src/pages/Admin/AdminDashboard/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { getAllTrains } from "../../../api/trainApi";
import { getAllBookings } from "../../../api/adminApi";
import { registerAdmin } from "../../../api/authApi";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTrains: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    canceledBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Admin registration state
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [adminFormError, setAdminFormError] = useState("");
  const [adminFormSuccess, setAdminFormSuccess] = useState("");
  const [submittingAdmin, setSubmittingAdmin] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [trainsResponse, bookingsResponse] = await Promise.all([
          getAllTrains(),
          getAllBookings()
        ]);

        const trains = trainsResponse.data;
        const bookings = bookingsResponse.data;
        
        const totalTrains = trains.length;
        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter(b => b.paid && !b.canceled).length;
        const pendingBookings = bookings.filter(b => !b.paid && !b.canceled).length;
        const canceledBookings = bookings.filter(b => b.canceled).length;
        const totalRevenue = bookings.filter(b => b.paid && !b.canceled).reduce((sum, b) => sum + (b.train?.price || 0), 0);
        
        setStats({ totalTrains, totalBookings, confirmedBookings, pendingBookings, canceledBookings, totalRevenue });
        
        const recent = bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)).slice(0, 5);
        setRecentBookings(recent);
        setError("");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAdminFormChange = (e) => {
    setAdminForm({
      ...adminForm,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    if (adminFormError) setAdminFormError("");
    if (adminFormSuccess) setAdminFormSuccess("");
  };

  const handleAdminRegistration = async (e) => {
    e.preventDefault();
    setAdminFormError("");
    setAdminFormSuccess("");
    
    // Validation
    if (adminForm.password !== adminForm.confirmPassword) {
      setAdminFormError("Passwords do not match");
      return;
    }
    
    if (adminForm.password.length < 6) {
      setAdminFormError("Password must be at least 6 characters long");
      return;
    }
    
    setSubmittingAdmin(true);
    
    try {
      const response = await registerAdmin({
        username: adminForm.username,
        password: adminForm.password
      });
      
      setAdminFormSuccess(`✅ Admin user "${adminForm.username}" registered successfully!`);
      setAdminForm({ username: "", password: "", confirmPassword: "" });
      setShowAdminForm(false);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setAdminFormSuccess(""), 5000);
      
    } catch (err) {
      console.error("Error registering admin:", err);
      setAdminFormError(err?.response?.data?.message || "Failed to register admin user. Please try again.");
    } finally {
      setSubmittingAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container-fluid">
        {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
            <h1 className="dashboard-title">👑 Admin Dashboard</h1>
            <p className="text-muted">Welcome to the Railway Management System</p>
          </div>
        </div>

        {/* Admin Registration Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">🔐 Admin User Management</h5>
                <button
                  className={`btn ${showAdminForm ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => setShowAdminForm(!showAdminForm)}
                >
                  {showAdminForm ? 'Cancel' : 'Register New Admin'}
                </button>
              </div>
              <div className="card-body">
                {showAdminForm ? (
                  <form onSubmit={handleAdminRegistration}>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Username *</label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          value={adminForm.username}
                          onChange={handleAdminFormChange}
                          required
                          placeholder="Enter admin username"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Password *</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          value={adminForm.password}
                          onChange={handleAdminFormChange}
                          required
                          placeholder="Enter password"
                          minLength="6"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Confirm Password *</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          value={adminForm.confirmPassword}
                          onChange={handleAdminFormChange}
                          required
                          placeholder="Confirm password"
                          minLength="6"
                        />
        </div>
      </div>

                    {adminFormError && (
                      <div className="alert alert-danger mt-3">
                        {adminFormError}
                      </div>
                    )}
                    
                    {adminFormSuccess && (
                      <div className="alert alert-success mt-3">
                        {adminFormSuccess}
        </div>
      )}

                    <div className="mt-3">
                      <button
                        type="submit"
                        className="btn btn-success me-2"
                        disabled={submittingAdmin}
                      >
                        {submittingAdmin ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Registering...
                          </>
                        ) : (
                          'Register Admin User'
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowAdminForm(false);
                          setAdminForm({ username: "", password: "", confirmPassword: "" });
                          setAdminFormError("");
                          setAdminFormSuccess("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">
                      Click "Register New Admin" to create additional admin accounts
                    </p>
                    <small className="text-muted">
                      Only existing admins can register new admin users
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stat-card bg-primary text-white">
              <div className="stat-icon">🚂</div>
              <div className="stat-content">
                <h3>{stats.totalTrains}</h3>
                <p>Total Trains</p>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stat-card bg-success text-white">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stat-card bg-info text-white">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.confirmedBookings}</h3>
                <p>Confirmed</p>
            </div>
          </div>
        </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stat-card bg-warning text-white">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>{stats.pendingBookings}</h3>
                <p>Pending</p>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stat-card bg-danger text-white">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <h3>{stats.canceledBookings}</h3>
                <p>Canceled</p>
            </div>
          </div>
        </div>
          <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
            <div className="stat-card bg-dark text-white">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
        <div className="row mb-4">
        <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header">
                <h5 className="card-title mb-0">⚡ Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <a href="/admin/trains" className="btn btn-outline-primary w-100">
                      🚂 Manage Trains
                    </a>
                  </div>
                  <div className="col-md-3">
                    <a href="/admin/bookings" className="btn btn-outline-success w-100">
                      📊 Manage Bookings
                    </a>
                  </div>
                  <div className="col-md-3">
                    <a href="/search" className="btn btn-outline-info w-100">
                      🔍 View Trains
                    </a>
                  </div>
                  <div className="col-md-3">
                    <a
                      href="/admin/register"
                      className="btn btn-outline-warning w-100"
                    >
                      👑 Add Admin
                    </a>
        </div>
      </div>
              </div>
            </div>
          </div>
      </div>

        {/* Recent Bookings */}
        <div className="row">
        <div className="col-12">
            <div className="card shadow-sm">
            <div className="card-header">
                <h5 className="card-title mb-0">📋 Recent Bookings</h5>
              </div>
              <div className="card-body">
                {recentBookings.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Passenger</th>
                          <th>Train</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td><strong>#{booking.id}</strong></td>
                            <td>{booking.passengerName}</td>
                            <td>{booking.train?.trainName || 'N/A'}</td>
                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td>
                              {booking.canceled ? (
                                <span className="badge bg-danger">Canceled</span>
                              ) : booking.paid ? (
                                <span className="badge bg-success">Confirmed</span>
                              ) : (
                                <span className="badge bg-warning">Pending</span>
                              )}
                            </td>
                            <td>₹{booking.train?.price || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No recent bookings found</p>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
