// src/pages/Admin/ManageUsers/ManageUsers.js
import React, { useState, useEffect } from "react";
import { getAllUsers, updateUserStatus } from "../../../api/adminApi";
import "./ManageUsers.css";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = currentStatus === 'active' ? 'deactivate' : 'activate';
    
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      await updateUserStatus(userId, newStatus);
      
      // Refresh the users list
      fetchAllUsers();
      setError("");
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status.");
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesName = !filterName || 
      user.name?.toLowerCase().includes(filterName.toLowerCase()) ||
      user.username?.toLowerCase().includes(filterName.toLowerCase());
    const matchesEmail = !filterEmail || 
      user.email?.toLowerCase().includes(filterEmail.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    
    return matchesName && matchesEmail && matchesRole;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <span className="badge bg-success">Active</span>;
      case 'inactive':
        return <span className="badge bg-danger">Inactive</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <span className="badge bg-danger">Admin</span>;
      case 'user':
        return <span className="badge bg-primary">User</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-manage-users">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="page-title">Manage Users</h1>
          <p className="text-muted">View and manage user accounts in the system</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Filters</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Name/Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name or username"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">All Users</h5>
            <span className="badge bg-primary">{filteredUsers.length} users</span>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.id}</strong>
                    </td>
                    <td>
                      {user.name || user.firstName + ' ' + user.lastName}
                    </td>
                    <td>
                      {user.email}
                    </td>
                    <td>
                      {user.username}
                    </td>
                    <td>
                      {getRoleBadge(user.role)}
                    </td>
                    <td>
                      {getStatusBadge(user.status)}
                    </td>
                    <td>
                      {new Date(user.createdAt || user.joinedDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleViewDetails(user)}
                      >
                        View
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          className={`btn btn-sm ${user.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDetails}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Basic Information</h6>
                    <div className="detail-item">
                      <span>User ID:</span>
                      <span className="fw-bold">{selectedUser.id}</span>
                    </div>
                    <div className="detail-item">
                      <span>Name:</span>
                      <span className="fw-bold">{selectedUser.name || selectedUser.firstName + ' ' + selectedUser.lastName}</span>
                    </div>
                    <div className="detail-item">
                      <span>Username:</span>
                      <span>{selectedUser.username}</span>
                    </div>
                    <div className="detail-item">
                      <span>Email:</span>
                      <span>{selectedUser.email}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6>Account Information</h6>
                    <div className="detail-item">
                      <span>Role:</span>
                      <span>{getRoleBadge(selectedUser.role)}</span>
                    </div>
                    <div className="detail-item">
                      <span>Status:</span>
                      <span>{getStatusBadge(selectedUser.status)}</span>
                    </div>
                    <div className="detail-item">
                      <span>Joined Date:</span>
                      <span>{new Date(selectedUser.createdAt || selectedUser.joinedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span>Last Login:</span>
                      <span>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="detail-item">
                        <span>Phone:</span>
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedUser.bookings && selectedUser.bookings.length > 0 && (
                  <div className="mt-4">
                    <h6>Recent Bookings</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>PNR</th>
                            <th>Train</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.bookings.slice(0, 5).map((booking) => (
                            <tr key={booking.id}>
                              <td>{booking.pnrNumber || booking.id}</td>
                              <td>{booking.trainNumber}</td>
                              <td>{booking.journeyDate}</td>
                              <td>{getStatusBadge(booking.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDetails}
                >
                  Close
                </button>
                {selectedUser.role !== 'admin' && (
                  <button
                    type="button"
                    className={`btn ${selectedUser.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => {
                      handleToggleUserStatus(selectedUser.id, selectedUser.status);
                      closeDetails();
                    }}
                  >
                    {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showDetails && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default AdminManageUsers;
