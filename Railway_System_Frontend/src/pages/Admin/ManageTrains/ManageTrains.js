// src/pages/Admin/ManageTrains/ManageTrains.js
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllTrains, addTrain, updateTrain, deleteTrain } from "../../../api/adminApi";
import "./ManageTrains.css";

const AdminManageTrains = () => {
  const [searchParams] = useSearchParams();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(searchParams.get("action") === "add");
  const [editingTrain, setEditingTrain] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [trainForm, setTrainForm] = useState({
    trainNumber: "",
    trainName: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    distance: "",
    totalStops: "",
    seatAvailability: [
      { class: "SL", className: "Sleeper Class", price: "", availableSeats: "" },
      { class: "3A", className: "AC 3 Tier", price: "", availableSeats: "" },
      { class: "2A", className: "AC 2 Tier", price: "", availableSeats: "" },
      { class: "1A", className: "AC First Class", price: "", availableSeats: "" }
    ]
  });

  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async () => {
    try {
      const response = await getAllTrains();
      setTrains(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching trains:", err);
      setError("Failed to fetch trains.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setTrainForm({
      ...trainForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSeatAvailabilityChange = (index, field, value) => {
    const updatedSeats = [...trainForm.seatAvailability];
    updatedSeats[index] = {
      ...updatedSeats[index],
      [field]: value
    };
    setTrainForm({
      ...trainForm,
      seatAvailability: updatedSeats
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTrain) {
        await updateTrain(editingTrain.id, trainForm);
      } else {
        await addTrain(trainForm);
      }

      setShowForm(false);
      setEditingTrain(null);
      resetForm();
      fetchTrains();
      setError("");
    } catch (err) {
      console.error("Error saving train:", err);
      setError(err?.response?.data?.message || "Failed to save train.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (train) => {
    setEditingTrain(train);
    setTrainForm({
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      origin: train.origin,
      destination: train.destination,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration || "",
      distance: train.distance || "",
      totalStops: train.totalStops || "",
      seatAvailability: train.seatAvailability || trainForm.seatAvailability
    });
    setShowForm(true);
  };

  const handleDelete = async (trainId) => {
    if (!window.confirm("Are you sure you want to delete this train?")) {
      return;
    }

    try {
      await deleteTrain(trainId);
      fetchTrains();
      setError("");
    } catch (err) {
      console.error("Error deleting train:", err);
      setError("Failed to delete train.");
    }
  };

  const resetForm = () => {
    setTrainForm({
      trainNumber: "",
      trainName: "",
      origin: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      duration: "",
      distance: "",
      totalStops: "",
      seatAvailability: [
        { class: "SL", className: "Sleeper Class", price: "", availableSeats: "" },
        { class: "3A", className: "AC 3 Tier", price: "", availableSeats: "" },
        { class: "2A", className: "AC 2 Tier", price: "", availableSeats: "" },
        { class: "1A", className: "AC First Class", price: "", availableSeats: "" }
      ]
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingTrain(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading trains...</p>
      </div>
    );
  }

  return (
    <div className="admin-manage-trains">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="page-title">Manage Trains</h1>
            {!showForm && (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Add New Train
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title mb-0">
              {editingTrain ? "Edit Train" : "Add New Train"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Train Number *</label>
                  <input
                    type="text"
                    name="trainNumber"
                    className="form-control"
                    value={trainForm.trainNumber}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Train Name *</label>
                  <input
                    type="text"
                    name="trainName"
                    className="form-control"
                    value={trainForm.trainName}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Origin *</label>
                  <input
                    type="text"
                    name="origin"
                    className="form-control"
                    value={trainForm.origin}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Destination *</label>
                  <input
                    type="text"
                    name="destination"
                    className="form-control"
                    value={trainForm.destination}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Departure Time *</label>
                  <input
                    type="time"
                    name="departureTime"
                    className="form-control"
                    value={trainForm.departureTime}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Arrival Time *</label>
                  <input
                    type="time"
                    name="arrivalTime"
                    className="form-control"
                    value={trainForm.arrivalTime}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Duration (HH:MM)</label>
                  <input
                    type="text"
                    name="duration"
                    className="form-control"
                    placeholder="e.g., 08:30"
                    value={trainForm.duration}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Distance (km)</label>
                  <input
                    type="number"
                    name="distance"
                    className="form-control"
                    value={trainForm.distance}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Total Stops</label>
                  <input
                    type="number"
                    name="totalStops"
                    className="form-control"
                    value={trainForm.totalStops}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="mt-4">
                <h6>Seat Availability & Pricing</h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Class</th>
                        <th>Class Name</th>
                        <th>Price (₹)</th>
                        <th>Available Seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainForm.seatAvailability.map((seat, index) => (
                        <tr key={index}>
                          <td>{seat.class}</td>
                          <td>{seat.className}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={seat.price}
                              onChange={(e) => handleSeatAvailabilityChange(index, "price", e.target.value)}
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={seat.availableSeats}
                              onChange={(e) => handleSeatAvailabilityChange(index, "availableSeats", e.target.value)}
                              placeholder="0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingTrain ? "Update Train" : "Add Train"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">All Trains</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Train Number</th>
                  <th>Train Name</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trains.map((train) => (
                  <tr key={train.id}>
                    <td><strong>{train.trainNumber}</strong></td>
                    <td>{train.trainName}</td>
                    <td>{train.origin} → {train.destination}</td>
                    <td>{train.departureTime}</td>
                    <td>{train.arrivalTime}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(train)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(train.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageTrains;
