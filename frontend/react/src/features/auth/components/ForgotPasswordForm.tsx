import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../../api/auth";
import "../styles/LoginPage.css";

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = email.trim() !== "" && isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await forgotPasswordApi({ email: email.toLowerCase() });
      setSuccess(true);
      setError("");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || "Failed to send reset email";
      
      // Handle specific error cases
      if (err?.response?.status === 404) {
        setError("No account found with this email address");
      } else if (err?.response?.status === 403) {
        setError("This account is inactive. Please contact administrator.");
      } else if (err?.response?.status === 500) {
        setError("Failed to send reset email. Please try again later.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-left">
          <img
            src="/login-image2.avif"
            alt="Forgot Password"
            className="login-image"
          />
        </div>
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-title">Check Your Email</h2>
            <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p style={{ textAlign: "center", marginBottom: "30px", color: "#888", fontSize: "14px" }}>
              Please check your inbox and click the link to reset your password.
            </p>
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <img
          src="/login-image2.avif"
          alt="Forgot Password"
          className="login-image"
        />
      </div>
      <div className="login-right">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2 className="login-title">Forgot Password</h2>
          <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <input
            className="login-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          {error && <p className="login-error">{error}</p>}
          
          <button
            className="login-btn"
            type="submit"
            disabled={loading || !isFormValid}
          >
            {loading ? <div className="loader"></div> : "Send Reset Link"}
          </button>
          
          <button
            type="button"
            className="login-btn"
            style={{ marginTop: "10px", background: "#6c757d" }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;