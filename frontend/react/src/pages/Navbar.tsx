import React from "react";
import "../features/offer-letter/styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <a
          href="https://www.mirafra.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpFWU9q3tLqaeQFb7msaTeRzww-PdoAVAlCg&s"
            alt="Mirafra Logo"
            className="logo"
            style={{ cursor: "pointer" }}
          />
        </a>
      </div>

      <div className="nav-center">
        <h2>Automated Document Generator</h2>
      </div>

      <div className="nav-right">
        {user && (
          <>
            <span
              className="nav-link"
              onClick={() => navigate("/my-offerletters")}
            >
              Offer Letters
            </span>

            <span className="username">{user.username}</span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;