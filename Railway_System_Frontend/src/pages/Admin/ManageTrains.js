// src/pages/Admin/ManageTrains.js
import React, { useEffect, useState } from "react";
import { getAllTrains, addTrain, updateTrain, deleteTrain } from "../../api/trainApi";

const blankTrain = {
  trainNumber: "",
  trainName: "",
  origin: "",
  destination: "",
  arrivalTime: "00:00:00",
  departureTime: "00:00:00",
  seatsAvailable: 0,
  price: 0
};

const ManageTrains = () => {
  const [trains, setTrains] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankTrain);

  const load = async () => {
    try {
      const resp = await getAllTrains();
      setTrains(resp.data);
    } catch (err) {
      alert("Failed to load trains");
    }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (t) => {
    setEditing(t.id);
    setForm(t);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this train?")) return;
    await deleteTrain(id);
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateTrain(editing, form);
    } else {
      await addTrain(form);
    }
    setEditing(null);
    setForm(blankTrain);
    load();
  };

  return (
    <div>
      <h3>Manage Trains (Admin)</h3>

      <div className="card p-3 mb-3">
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-md-2"><input className="form-control" placeholder="Number" value={form.trainNumber} onChange={(e)=>setForm({...form, trainNumber: e.target.value})} /></div>
          <div className="col-md-3"><input className="form-control" placeholder="Name" value={form.trainName} onChange={(e)=>setForm({...form, trainName: e.target.value})} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Origin" value={form.origin} onChange={(e)=>setForm({...form, origin: e.target.value})} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Destination" value={form.destination} onChange={(e)=>setForm({...form, destination: e.target.value})} /></div>
          <div className="col-md-1"><input className="form-control" placeholder="Dep" value={form.departureTime} onChange={(e)=>setForm({...form, departureTime: e.target.value})} /></div>
          <div className="col-md-1"><input className="form-control" placeholder="Arr" value={form.arrivalTime} onChange={(e)=>setForm({...form, arrivalTime: e.target.value})} /></div>
          <div className="col-md-1"><button className="btn btn-success w-100" type="submit">{editing ? "Update" : "Add"}</button></div>
        </form>
      </div>

      <div>
        {trains.map(t => (
          <div key={t.id} className="card mb-2">
            <div className="card-body d-flex justify-content-between">
              <div>
                <strong>{t.trainNumber} - {t.trainName}</strong>
                <div>{t.origin} → {t.destination}</div>
              </div>
              <div>
                <button className="btn btn-sm btn-primary me-2" onClick={()=>handleEdit(t)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(t.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTrains;
