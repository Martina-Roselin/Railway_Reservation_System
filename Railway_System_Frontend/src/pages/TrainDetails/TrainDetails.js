// src/pages/TrainDetails/TrainDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getTrainById } from "../../api/trainApi";
import { isAuthenticated } from "../../utils/auth";
import "./TrainDetails.css";

const TrainDetails = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [train, setTrain] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTrainDetails = async () => {
      setLoading(true);
      try {
        console.log("🔍 Fetching train details for:", trainNumber);
        const response = await getTrainById(trainNumber);
        console.log("✅ Train details:", response.data);
        setTrain(response.data);
        setError("");
      } catch (err) {
        console.error("❌ Error fetching train details:", err);
        setError("Failed to fetch train details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (trainNumber) {
      loadTrainDetails();
    }
  }, [trainNumber]);

  const handleBookNow = () => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: `/traindetails/${trainNumber}` } });
      return;
    }
    // Pass the travel date to PassengerDetails
    const travelDate = location.state?.travelDate;
    navigate(`/passenger-details/${trainNumber}`, {
      state: { travelDate: travelDate }
    });
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!train) {
    return (
      <div className="alert alert-warning" role="alert">
        Train not found.
      </div>
    );
  }

  return (
    <div className="train-details-container">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <h2 className="card-title">
                {train.trainNumber} - {train.trainName}
              </h2>
              <p className="text-muted mb-3">
                {train.origin} → {train.destination}
              </p>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="info-card">
                    <h6 className="text-muted">Departure</h6>
                    <p className="h5 mb-0">{train.departureTime}</p>
                    <small className="text-muted">{train.origin}</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-card">
                    <h6 className="text-muted">Arrival</h6>
                    <p className="h5 mb-0">{train.arrivalTime}</p>
                    <small className="text-muted">{train.destination}</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="booking-summary">
                <h5>Journey Summary</h5>
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>{train.duration || "N/A"}</span>
                </div>
                <div className="summary-item">
                  <span>Distance:</span>
                  <span>{train.distance || "N/A"}</span>
                </div>
                <div className="summary-item">
                  <span>Total Stops:</span>
                  <span>{train.totalStops || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h4 className="card-title mb-4">Seat Availability & Pricing</h4>
          
          {train.seatAvailability && train.seatAvailability.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Class</th>
                    <th>Available Seats</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {train.seatAvailability.map((seat, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{seat.class}</strong>
                        <br />
                        <small className="text-muted">{seat.className}</small>
                      </td>
                      <td>
                        <span className={`badge ${seat.availableSeats > 10 ? 'bg-success' : seat.availableSeats > 0 ? 'bg-warning' : 'bg-danger'}`}>
                          {seat.availableSeats}
                        </span>
                      </td>
                      <td>
                        <strong>₹{seat.price}</strong>
                      </td>
                      <td>
                        {seat.availableSeats > 10 ? (
                          <span className="text-success">Available</span>
                        ) : seat.availableSeats > 0 ? (
                          <span className="text-warning">Limited</span>
                        ) : (
                          <span className="text-danger">Waitlist</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              Seat availability information will be displayed here.
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-4">
        <button 
          className="btn btn-primary btn-lg px-5"
          onClick={handleBookNow}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TrainDetails;
