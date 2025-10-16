// src/pages/Register/Register.js
import React, { useState } from "react";
import { registerUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const resp = await registerUser(form);
      setMsg("Registration successful. You can login now.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Register</h3>
            {msg && <div className="alert alert-info">{msg}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input name="username" value={form.username} onChange={handleChange} required className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required className="form-control" />
              </div>

              <button className="btn btn-success" type="submit">Register</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
