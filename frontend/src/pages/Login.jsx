import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Student Login</h2>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
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
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="link-text">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p className="link-text">
          New student? <Link to="/register">Register</Link>
        </p>
        <p className="link-text">
          Admin? <Link to="/admin/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
