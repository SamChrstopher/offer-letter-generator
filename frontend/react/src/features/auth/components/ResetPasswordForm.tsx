import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordApi, verifyResetTokenApi } from "../../../api/auth";
import { Eye, EyeOff } from "lucide-react";
import "../styles/LoginPage.css";

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid or missing reset token");
        setVerifying(false);
        return;
      }

      try {
        await verifyResetTokenApi(token);
        setVerifying(false);
      } catch (err) {
        setError("Invalid or expired reset link");
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (success) {
      timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [success, navigate]);

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const isFormValid = 
    newPassword.trim() !== "" && 
    confirmPassword.trim() !== "" &&
    newPassword === confirmPassword &&
    isValidPassword(newPassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!isValidPassword(newPassword)) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordApi({ token, new_password: newPassword });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="login-page">
        <div className="login-left">
          <img
            src="/login-image2.avif"
            alt="Reset Password"
            className="login-image"
          />
        </div>
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-title">Verifying...</h2>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div className="loader"></div>
              <p style={{ marginTop: "20px", color: "#666" }}>
                Verifying your reset link...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="login-page">
        <div className="login-left">
          <img
            src="/login-image2.avif"
            alt="Reset Password"
            className="login-image"
          />
        </div>
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-title">Invalid Link</h2>
            <p style={{ textAlign: "center", marginBottom: "20px", color: "#dc3545" }}>
              {error}
            </p>
            <button
              className="login-btn"
              onClick={() => navigate("/forgot-password")}
            >
              Request New Link
            </button>
            <button
              className="login-btn"
              style={{ marginTop: "10px", background: "#6c757d" }}
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="login-page">
        <div className="login-left">
          <img
            src="/login-image2.avif"
            alt="Reset Password"
            className="login-image"
          />
        </div>
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-title">Password Reset Successful!</h2>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ 
                width: "60px", 
                height: "60px", 
                margin: "0 auto 20px",
                background: "#28a745",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p style={{ color: "#28a745", marginBottom: "20px" }}>
                Your password has been reset successfully!
              </p>
              <div style={{ marginTop: "20px" }}>
                <div className="loader"></div>
                <p style={{ marginTop: "10px", color: "#666" }}>
                  Redirecting to login page in {redirectCountdown} seconds...
                </p>
              </div>
            </div>
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
          alt="Reset Password"
          className="login-image"
        />
      </div>
      <div className="login-right">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2 className="login-title">Reset Password</h2>
          
          <div className="password-wrapper">
            <input
              className="login-input password-input"
              placeholder="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {newPassword.trim() !== "" && (
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            )}
          </div>

          <div className="password-wrapper">
            <input
              className="login-input password-input"
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword.trim() !== "" && (
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            )}
          </div>

          {newPassword && newPassword.length < 6 && (
            <p style={{ color: "#dc3545", fontSize: "12px", marginTop: "-10px" }}>
              Password must be at least 6 characters
            </p>
          )}

          {error && <p className="login-error">{error}</p>}
          
          <button
            className="login-btn"
            type="submit"
            disabled={loading || !isFormValid}
          >
            {loading ? <div className="loader"></div> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;