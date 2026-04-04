import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/axios";

const DEFAULT_ADMIN = {
  email: "admin@hostel.com",
  password: "admin123"
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_ADMIN);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password
      };
      const response = await api.post("/auth/admin/login", payload);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Admin login failed."));
    }
  };

  return (
    <div className="page auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input name="email" type="email" placeholder="Admin Email" value={form.email} onChange={handleChange} required />
        <div className="password-field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        <p className="link-text">Default admin: admin@hostel.com / admin123</p>
        <p className="link-text">
          Forgot password? <Link to="/forgot-password">Reset using OTP</Link>
        </p>
        <div className="btn-row">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              setForm(DEFAULT_ADMIN);
              setError("");
            }}
          >
            Use Default Credentials
          </button>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
