// src/pages/PassengerDetails/PassengerDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getTrainById } from "../../api/trainApi";
import { createBooking } from "../../api/bookingApi";
import "./PassengerDetails.css";

const PassengerDetails = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Get the travel date from navigation state, fallback to today if not provided
  const [travelDate, setTravelDate] = useState(
    location.state?.travelDate || new Date().toISOString().split('T')[0]
  );

  const [passengerData, setPassengerData] = useState({
    passengerName: "",
    email: "",
    seatNumbers: [""] // Start with one seat
  });

  useEffect(() => {
    fetchTrainDetails();
  }, [trainNumber]);

  const fetchTrainDetails = async () => {
    try {
      const response = await getTrainById(trainNumber);
      setTrain(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching train details:", err);
      setError("Failed to load train details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setPassengerData({
      ...passengerData,
      [e.target.name]: e.target.value
    });
  };

  const handleSeatChange = (index, value) => {
    const updatedSeats = [...passengerData.seatNumbers];
    updatedSeats[index] = value;
    setPassengerData({
      ...passengerData,
      seatNumbers: updatedSeats
    });
  };

  const addSeat = () => {
    setPassengerData({
      ...passengerData,
      seatNumbers: [...passengerData.seatNumbers, ""]
    });
  };

  const removeSeat = (index) => {
    if (passengerData.seatNumbers.length > 1) {
      const updatedSeats = passengerData.seatNumbers.filter((_, i) => i !== index);
      setPassengerData({
        ...passengerData,
        seatNumbers: updatedSeats
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Filter out empty seat numbers
      const validSeatNumbers = passengerData.seatNumbers.filter(seat => seat.trim() !== "");
      
      if (validSeatNumbers.length === 0) {
        setError("Please enter at least one seat number.");
        setSubmitting(false);
        return;
      }

      const bookingData = {
        bookingDetails: {
          train: { id: train.id },
          passengerName: passengerData.passengerName,
          email: passengerData.email,
          bookingDate: travelDate + "T00:00:00" // Use the actual travel date instead of current date
        },
        seatNumbers: validSeatNumbers
      };

      const response = await createBooking(bookingData);
      
      // Navigate to payment page with the booking ID
      navigate(`/payment/${response.data.id}`);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError(err?.response?.data?.message || "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading train details...</p>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="alert alert-danger" role="alert">
        Train not found.
      </div>
    );
  }

  return (
    <div className="passenger-details">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="page-title">Passenger Details</h1>
          <p className="text-muted">Complete your booking information</p>
        </div>
      </div>

      {/* Train Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Train Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Train:</strong> {train.trainNumber} - {train.trainName}</p>
              <p><strong>Route:</strong> {train.origin} → {train.destination}</p>
              <p><strong>Travel Date:</strong> {new Date(travelDate).toLocaleDateString()}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Departure:</strong> {train.departureTime}</p>
              <p><strong>Arrival:</strong> {train.arrivalTime}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Passenger Details Form */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Passenger Information</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Passenger Name *</label>
                <input
                  type="text"
                  name="passengerName"
                  className="form-control"
                  placeholder="Enter passenger name"
                  value={passengerData.passengerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={passengerData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {!location.state?.travelDate && (
                <div className="col-md-6">
                  <label className="form-label">Travel Date *</label>
                  <input
                    type="date"
                    name="travelDate"
                    className="form-control"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <h6>Seat Numbers</h6>
              {passengerData.seatNumbers.map((seat, index) => (
                <div key={index} className="row g-3 mb-2">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Seat ${index + 1} (e.g., S9-21)`}
                      value={seat}
                      onChange={(e) => handleSeatChange(index, e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    {passengerData.seatNumbers.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeSeat(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addSeat}
              >
                Add Another Seat
              </button>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Booking...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
