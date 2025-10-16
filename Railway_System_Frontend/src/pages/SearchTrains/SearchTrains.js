// src/pages/SearchTrains/SearchTrains.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchTrains } from "../../api/trainApi";
import "./SearchTrains.css";

const SearchTrains = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: ""
  });
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await searchTrains(searchData);
      setTrains(response.data);
    } catch (err) {
      console.error("Error searching trains:", err);
      setError("Failed to search trains. Please try again.");
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (trainId) => {
    navigate(`/traindetails/${trainId}`, {
      state: { travelDate: searchData.date }
    });
  };

  return (
    <div className="search-trains">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="page-title">Search Trains</h1>
          <p className="text-muted">Find and book your perfect train journey</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">From Station</label>
                <input
                  type="text"
                  name="from"
                  className="form-control"
                  placeholder="Enter origin station"
                  value={searchData.from}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">To Station</label>
                <input
                  type="text"
                  name="to"
                  className="form-control"
                  placeholder="Enter destination station"
                  value={searchData.to}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Journey Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={searchData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Searching...
                  </>
                ) : (
                  "Search Trains"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Search Results */}
      {trains.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              Search Results ({trains.length} trains found)
            </h5>
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
                    <th>Available Seats</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map((train) => (
                    <tr key={train.id}>
                      <td>
                        <strong>{train.trainNumber}</strong>
                      </td>
                      <td>{train.trainName}</td>
                      <td>
                        {train.origin} → {train.destination}
                      </td>
                      <td>{train.departureTime}</td>
                      <td>{train.arrivalTime}</td>
                      <td>
                        <span className="badge bg-success">
                          {train.seatsAvailable} seats
                        </span>
                      </td>
                      <td>
                        <strong>₹{train.price}</strong>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleViewDetails(train.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loading && trains.length === 0 && searchData.from && searchData.to && searchData.date && (
        <div className="text-center py-4">
          <p className="text-muted">No trains found for your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SearchTrains;
  

