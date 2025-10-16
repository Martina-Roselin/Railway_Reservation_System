// src/pages/Admin/AdminRegister/AdminRegister.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../../../api/authApi";
import { isAuthenticated, isAdmin } from "../../../utils/auth";
import "./AdminRegister.css";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/admin/register" } });
      return;
    }
    
    if (!isAdmin()) {
      navigate("/", { state: { error: "Access denied. Admin privileges required." } });
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    // Clear messages when user types
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (form.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await registerAdmin({
        username: form.username,
        password: form.password
      });
      
      setSuccess(`✅ Admin user "${form.username}" registered successfully!`);
      setForm({ username: "", password: "", confirmPassword: "" });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
      
    } catch (err) {
      console.error("Error registering admin:", err);
      setError(err?.response?.data?.message || "Failed to register admin user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/admin");
  };

  return (
    <div className="admin-register-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white text-center">
                <h3 className="card-title mb-0">
                  👑 Register New Admin User
                </h3>
                <p className="mb-0 mt-2 opacity-75">
                  Create additional admin accounts for your team
                </p>
              </div>
              
              <div className="card-body p-4">
                {/* Security Notice */}
                <div className="alert alert-info mb-4">
                  <h6 className="alert-heading">🔒 Security Notice</h6>
                  <p className="mb-0">
                    Only existing admin users can register new admin accounts. 
                    This ensures the security of your railway management system.
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger">
                    <strong>❌ Error:</strong> {error}
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success">
                    <strong>✅ Success:</strong> {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Username *</strong>
                    </label>
                    <input
                      type="text"
                      name="username"
                      className="form-control form-control-lg"
                      value={form.username}
                      onChange={handleChange}
                      required
                      placeholder="Enter admin username"
                      minLength="3"
                    />
                    <div className="form-text">
                      Username must be at least 3 characters long
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Password *</strong>
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter password"
                      minLength="6"
                    />
                    <div className="form-text">
                      Password must be at least 6 characters long
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      <strong>Confirm Password *</strong>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control form-control-lg"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm password"
                      minLength="6"
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Admin Account...
                        </>
                      ) : (
                        '👑 Register Admin User'
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleBackToDashboard}
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="card-footer text-center text-muted">
                <small>
                  <strong>Current Admin:</strong> You are logged in as an administrator
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;


