// src/pages/MyBookings/MyBookings.js
import React, { useState, useEffect } from "react";
import { getUserBookings, cancelBooking } from "../../api/bookingApi";
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await getUserBookings();
      setBookings(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to fetch your bookings.");
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
      fetchMyBookings(); // Refresh the list
      setError("");
    } catch (err) {
      console.error("Error canceling booking:", err);
      setError("Failed to cancel booking.");
    }
  };

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
        <p className="mt-3">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="page-title">My Bookings</h1>
          <p className="text-muted">View and manage your train bookings</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <h5 className="text-muted">No bookings found</h5>
            <p className="text-muted">You haven't made any bookings yet.</p>
            <a href="/search" className="btn btn-primary">
              Search for Trains
            </a>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              Your Bookings ({bookings.length})
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Booking ID</th>
                    <th>Train</th>
                    <th>Passenger</th>
                    <th>Booking Date</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
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
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td>
                        {booking.seats?.length || 0} seats
                      </td>
                      <td>
                        {getStatusBadge(booking)}
                      </td>
                      <td>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
