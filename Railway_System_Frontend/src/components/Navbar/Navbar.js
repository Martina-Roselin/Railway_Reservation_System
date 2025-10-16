// src/components/Navbar/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin, removeToken } from "../../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status on mount and when component updates
    const checkAuth = () => {
      const auth = isAuthenticated();
      const admin = isAdmin();
      setIsLoggedIn(auth);
      setIsAdminUser(admin);
      
      // Debug logging
      console.log("🔍 Navbar Auth Check:");
      console.log("Is Authenticated:", auth);
      console.log("Is Admin:", admin);
    };

    checkAuth();
    
    // Listen for storage changes (when token is added/removed)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setIsAdminUser(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "#213b73" }}>
      <div className="container">
        <Link className="navbar-brand" to="/">🚂 RailwayX</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse"
          data-bs-target="#navmenu" 
          aria-controls="navmenu" 
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/search">🔍 Search Trains</Link>
            </li>
            
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/bookings">📋 My Bookings</Link>
                </li>
                {!isAdminUser && (
                  <li className="nav-item">
                    <button 
                      className="nav-link btn btn-outline-danger btn-sm ms-2" 
                      onClick={handleLogout}
                      title="Logout from User Panel"
                    >
                      🚪 Logout
                    </button>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Admin Navigation - Always visible when admin */}
          {isAdminUser && (
            <ul className="navbar-nav me-3">
              <li className="nav-item">
                <Link className="nav-link btn btn-outline-warning btn-sm me-2" to="/admin">
                  👑 Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-outline-info btn-sm me-2" to="/admin/trains">
                  🚂 Manage Trains
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-outline-success btn-sm me-2" to="/admin/bookings">
                  📊 Manage Bookings
                </Link>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-outline-danger btn-sm ms-2" 
                  onClick={handleLogout}
                  title="Logout from Admin Panel"
                >
                  🚪 Logout
                </button>
              </li>
            </ul>
          )}

          {/* Right side navigation */}
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle d-flex align-items-center" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  👤 {isAdminUser ? 'Admin' : 'User'}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  {isAdminUser && (
                    <>
                      <li><h6 className="dropdown-header">👑 Admin Functions</h6></li>
                      <li><Link className="dropdown-item" to="/admin">📊 Dashboard</Link></li>
                      <li><Link className="dropdown-item" to="/admin/trains">🚂 Manage Trains</Link></li>
                      <li><Link className="dropdown-item" to="/admin/bookings">📋 Manage Bookings</Link></li>
                      <li><Link className="dropdown-item" to="/admin/register">👑 Add Admin</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>
                          🚪 Admin Logout
                        </button>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}
                  {!isAdminUser && (
                    <>
                      <li><Link className="dropdown-item" to="/bookings">📋 My Bookings</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}
                  {!isAdminUser && (
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        🚪 Logout
                      </button>
                    </li>
                  )}
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">🔐 Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">📝 Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
