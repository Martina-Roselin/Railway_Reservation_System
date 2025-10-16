// src/pages/Login/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { saveToken } from "../../utils/auth";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const resp = await loginUser(form);
      // Expecting { token: "jwt..." }
      const { token } = resp.data;
      if (token) {
        saveToken(token);
        navigate("/search");
      } else {
        setError("Login succeeded but token not received.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input name="username" value={form.username} onChange={handleChange} required className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required className="form-control" />
              </div>

              <button className="btn btn-primary" type="submit">Login</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
