import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.devOtp ? `${response.data.message} OTP: ${response.data.devOtp}` : response.data.message);
      setStep(2);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to send OTP."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      setMessage(response.data.message);
      setStep(3);
    } catch (err) {
      setError(getApiErrorMessage(err, "OTP verification failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post("/auth/reset-password", { email, otp, newPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(getApiErrorMessage(err, "Password reset failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <form className="card auth-card" onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Registered Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={step > 1}
        />

        {step >= 2 && (
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(event) => setOtp(event.target.value)} required />
        )}

        {step === 3 && (
          <>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
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
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </>
        )}

        {message && <p className="warning">{message}</p>}
        {error && <p className="error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : step === 1
            ? "Send OTP"
            : step === 2
            ? "Verify OTP"
            : "Reset Password"}
        </button>

        <p className="link-text">
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
