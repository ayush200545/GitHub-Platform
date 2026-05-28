import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import "./navbar.css";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/auth");
  };

  return (
    <nav className="glass-navbar">
      <Link to="/" className="nav-brand">
        <div className="brand-icon">
          <div className="cube"></div>
        </div>
        <h3>GitForage</h3>
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/public" className="nav-link">Explore</Link>
        {currentUser ? (
          <>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="neon-btn nav-btn">Logout</button>
          </>
        ) : (
          <Link to="/auth" className="neon-btn nav-btn">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
