// src/pages/BookingConfirmation/BookingConfirmation.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { isAuthenticated } from "../../utils/auth";
import "./BookingConfirmation.css";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!isAuthenticated()) {
        navigate("/login", { state: { from: `/booking-confirmation/${bookingId}` } });
        return;
      }

      setLoading(true);
      try {
        console.log("📡 Fetching all bookings for user...");
        
        // Use the working endpoint - same as PaymentPage
        const response = await fetch('/api/bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allBookings = await response.json();
        console.log('📋 All bookings received:', allBookings);
        
        // Find the specific booking by ID
        const specificBooking = allBookings.find(booking => booking.id === parseInt(bookingId));
        
        if (!specificBooking) {
          console.log('❌ Booking not found. Available IDs:', allBookings.map(b => b.id));
          setError(`Booking ID ${bookingId} not found.`);
          return;
        }

        console.log('✅ Found specific booking:', specificBooking);
        setBooking(specificBooking);
        setError("");
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      loadBookingDetails();
    }
  }, [bookingId, navigate]);

  // Function to download ticket
  const downloadTicket = async (bookingId) => {
    try {
      console.log("📥 Downloading ticket for booking:", bookingId);
      
      const response = await fetch(`/api/bookings/${bookingId}/ticket`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download ticket: ${response.status}`);
      }

      // Get the blob data (PDF file)
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `railway-ticket-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log("✅ Ticket downloaded successfully");
    } catch (error) {
      console.error("❌ Error downloading ticket:", error);
      alert("Failed to download ticket. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading booking confirmation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="alert alert-warning" role="alert">
        Booking not found.
      </div>
    );
  }

  return (
    <div className="booking-confirmation-container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div className="success-icon mb-4">
                <i className="fas fa-check-circle"></i>
              </div>
              
              <h2 className="card-title text-success mb-3">Payment Successful!</h2>
              <p className="text-muted mb-4">Your booking has been confirmed and payment processed successfully.</p>
              
              <div className="pnr-section mb-4">
                <h6 className="text-muted mb-2">Your PNR Number</h6>
                <div className="pnr-number">
                  {booking.id || booking.bookingId}
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Journey Details</h5>
            </div>
            <div className="card-body">
              <div className="journey-details">
                <div className="detail-row">
                  <span className="detail-label">Train Number & Name:</span>
                  <span className="detail-value">{booking.trainNumber} - {booking.trainName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Route:</span>
                  <span className="detail-value">{booking.origin} → {booking.destination}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Journey Date:</span>
                  <span className="detail-value">{booking.journeyDate}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Departure Time:</span>
                  <span className="detail-value">{booking.departureTime}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Arrival Time:</span>
                  <span className="detail-value">{booking.arrivalTime}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Class:</span>
                  <span className="detail-value">{booking.preferredClass}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Passenger Details</h5>
            </div>
            <div className="card-body">
              <div className="passenger-details">
                <div className="detail-item">
                  <span>Passenger Name:</span>
                  <span>{booking.passengerName}</span>
                </div>
                <div className="detail-item">
                  <span>Email:</span>
                  <span>{booking.email}</span>
                </div>
                <div className="detail-item">
                  <span>Seat Numbers:</span>
                  <span>{booking.seats?.map(seat => seat.seatNumber).join(", ") || "N/A"}</span>
                </div>
                <div className="detail-item total">
                  <span>Total Amount Paid:</span>
                  <span>₹{booking.totalAmount || booking.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Download Section */}
          <div className="card shadow-sm mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Download Your Ticket</h5>
            </div>
            <div className="card-body text-center">
              <div className="alert alert-info">
                <p className="mb-0">
                  <strong>📥 Download Ticket:</strong> Click the button below to download your ticket as a PDF file.
                </p>
                <small className="text-muted">
                  The ticket has also been sent to your email address.
                </small>
              </div>
              
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => downloadTicket(bookingId)}
              >
                📥 Download Ticket (PDF)
              </button>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-primary me-3"
              onClick={() => navigate("/bookings")}
            >
              View My Bookings
            </button>
            <button
              className="btn btn-outline-primary me-3"
              onClick={() => navigate("/search")}
            >
              Book Another Journey
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

