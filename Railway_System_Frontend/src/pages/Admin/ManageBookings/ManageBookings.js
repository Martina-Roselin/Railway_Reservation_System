// src/pages/Admin/ManageBookings/ManageBookings.js
import React, { useState, useEffect } from "react";
import { getAllBookings, cancelBooking } from "../../../api/adminApi";
import "./ManageBookings.css";

const AdminManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterTrainNumber, setFilterTrainNumber] = useState("");
  const [filterPnr, setFilterPnr] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await getAllBookings();
      setBookings(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      
      // Refresh the bookings list
      fetchAllBookings();
      setError("");
    } catch (err) {
      console.error("Error canceling booking:", err);
      setError("Failed to cancel booking.");
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesDate = !filterDate || 
      new Date(booking.bookingDate).toISOString().split('T')[0] === filterDate;
    const matchesTrain = !filterTrainNumber || 
      booking.train?.trainName?.toLowerCase().includes(filterTrainNumber.toLowerCase()) ||
      booking.train?.id?.toString().includes(filterTrainNumber);
    const matchesPnr = !filterPnr || 
      booking.id?.toString().includes(filterPnr);
    
    return matchesDate && matchesTrain && matchesPnr;
  });

  const getStatusBadge = (booking) => {
    if (booking.canceled) {
      return <span className="badge bg-danger">Cancelled</span>;
    } else if (booking.paid) {
      return <span className="badge bg-success">Confirmed</span>;
    } else {
      return <span className="badge bg-warning">Pending Payment</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="admin-manage-bookings">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="page-title">Manage Bookings</h1>
          <p className="text-muted">View and manage all bookings in the system</p>
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
              <label className="form-label">Booking Date</label>
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Train Number/Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter train number or name"
                value={filterTrainNumber}
                onChange={(e) => setFilterTrainNumber(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Booking ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter booking ID"
                value={filterPnr}
                onChange={(e) => setFilterPnr(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">All Bookings</h5>
            <span className="badge bg-primary">{filteredBookings.length} bookings</span>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Train</th>
                  <th>Passenger</th>
                  <th>Email</th>
                  <th>Booking Date</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>{booking.id}</strong>
                    </td>
                    <td>
                      {booking.train?.trainName || 'N/A'}
                    </td>
                    <td>
                      {booking.passengerName}
                    </td>
                    <td>
                      {booking.email}
                    </td>
                    <td>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td>
                      {booking.seats?.length || 0} seats
                    </td>
                    <td>
                      {getStatusBadge(booking)}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleViewDetails(booking)}
                      >
                        View
                      </button>
                      {!booking.canceled && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No bookings found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDetails}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Booking Information</h6>
                    <div className="detail-item">
                      <span>Booking ID:</span>
                      <span className="fw-bold">{selectedBooking.id}</span>
                    </div>
                    <div className="detail-item">
                      <span>Train:</span>
                      <span>{selectedBooking.train?.trainName || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span>Booking Date:</span>
                      <span>{new Date(selectedBooking.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span>Status:</span>
                      <span>{getStatusBadge(selectedBooking)}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6>Passenger Information</h6>
                    <div className="detail-item">
                      <span>Name:</span>
                      <span className="fw-bold">{selectedBooking.passengerName}</span>
                    </div>
                    <div className="detail-item">
                      <span>Email:</span>
                      <span>{selectedBooking.email}</span>
                    </div>
                    <div className="detail-item">
                      <span>User:</span>
                      <span>{selectedBooking.user?.username || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span>Seats:</span>
                      <span>{selectedBooking.seats?.length || 0} seats</span>
                    </div>
                  </div>
                </div>

                {selectedBooking.seats && selectedBooking.seats.length > 0 && (
                  <div className="mt-4">
                    <h6>Seat Details</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Seat ID</th>
                            <th>Seat Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBooking.seats.map((seat) => (
                            <tr key={seat.id}>
                              <td>{seat.id}</td>
                              <td>{seat.seatNumber}</td>
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
                {!selectedBooking.canceled && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      handleCancelBooking(selectedBooking.id);
                      closeDetails();
                    }}
                  >
                    Cancel Booking
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

export default AdminManageBookings;
