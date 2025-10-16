// src/pages/PaymentPage/PaymentPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { simulatePayment } from "../../api/paymentApi";
import { isAuthenticated } from "../../utils/auth";
import "./PaymentPage.css";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardholderName: "",
    paymentMethod: "credit"
  });

  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!isAuthenticated()) {
        navigate("/login", { state: { from: `/payment/${bookingId}` } });
        return;
      }

      setLoading(true);
      try {
        console.log("📡 Fetching all bookings for user...");
        
        // Get all bookings for the user using the working endpoint
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
          setError(`Booking ID ${bookingId} not found. Please check the URL.`);
          return;
        }

        console.log('✅ Found specific booking:', specificBooking);
        setBooking(specificBooking);
        setError("");
      } catch (err) {
        console.error("Error fetching booking details:", err);
        
        // Enhanced error handling
        if (err.message.includes('HTTP error! status: 401')) {
          setError("Authentication expired. Please login again.");
          localStorage.removeItem('token');
          navigate("/login");
        } else if (err.message.includes('HTTP error! status: 403')) {
          setError("Access denied. You do not have permission to view bookings.");
        } else {
          setError("Failed to fetch booking details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      loadBookingDetails();
    }
  }, [bookingId, navigate]);

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv || !paymentData.cardholderName) {
      setError("Please fill in all payment fields.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      console.log("💳 Processing payment for booking:", bookingId);
      const response = await simulatePayment(bookingId);

      console.log("✅ Payment successful:", response.data);
      
      // Refresh booking details to show updated status
      const updatedResponse = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (updatedResponse.ok) {
        const allBookings = await updatedResponse.json();
        const updatedBooking = allBookings.find(booking => booking.id === parseInt(bookingId));
        if (updatedBooking) {
          setBooking(updatedBooking);
        }
      }
      
      // Navigate to booking confirmation page
      navigate(`/booking-confirmation/${bookingId}`);
    } catch (err) {
      console.error("Payment failed:", err);
      setError(err?.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading booking details...</p>
      </div>
    );
  }

  if (error && !booking) {
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
    <div className="payment-page-container">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Payment Details</h3>
              
              <form onSubmit={handlePayment}>
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="credit"
                        value="credit"
                        checked={paymentData.paymentMethod === "credit"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="credit">
                        Credit Card
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="debit"
                        value="debit"
                        checked={paymentData.paymentMethod === "debit"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="debit">
                        Debit Card
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="upi"
                        value="upi"
                        checked={paymentData.paymentMethod === "upi"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="upi">
                        UPI
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    className="form-control"
                    placeholder="Enter cardholder name"
                    value={paymentData.cardholderName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    value={paymentData.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      className="form-control"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={paymentData.expiry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      className="form-control"
                      placeholder="123"
                      maxLength="4"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3">
                    {error}
                  </div>
                )}

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg px-5"
                    disabled={processing}
                  >
                    {processing ? "Processing Payment..." : "Pay Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Booking Summary</h5>
              
              <div className="booking-details">
                <div className="detail-item">
                  <span>Booking ID:</span>
                  <span className="fw-bold">{booking.id || booking.bookingId}</span>
                </div>
                <div className="detail-item">
                  <span>Train:</span>
                  <span>{booking.trainNumber} - {booking.trainName}</span>
                </div>
                <div className="detail-item">
                  <span>Route:</span>
                  <span>{booking.origin} → {booking.destination}</span>
                </div>
                <div className="detail-item">
                  <span>Date:</span>
                  <span>{booking.journeyDate}</span>
                </div>
                <div className="detail-item">
                  <span>Passenger:</span>
                  <span>{booking.passengerName}</span>
                </div>
                <div className="detail-item">
                  <span>Class:</span>
                  <span>{booking.preferredClass}</span>
                </div>
                <hr />
                <div className="detail-item total">
                  <span>Total Amount:</span>
                  <span className="fw-bold text-success">₹{booking.totalAmount || booking.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
