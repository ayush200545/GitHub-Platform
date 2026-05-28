import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "Loading..." });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3002/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-container profile-layout">
        
        {/* User Sidebar */}
        <aside className="profile-sidebar">
          <div className="glass-panel profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {userDetails.username ? userDetails.username.charAt(0).toUpperCase() : "?"}
              </div>
            </div>

            <div className="profile-info">
              <h2 className="profile-name">{userDetails.username}</h2>
              <p className="profile-bio">Exploring the digital frontier.</p>
            </div>

            <button className="neon-btn full-width profile-follow-btn">Follow</button>

            <div className="profile-stats">
              <div className="stat-box">
                <span className="stat-value">124</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">42</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="profile-main">
          
          {/* Custom Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'repos' ? 'active' : ''}`}
              onClick={() => navigate("/")}
            >
              Repositories
            </button>
          </div>

          <div className="tab-content">
            <div className="glass-panel heatmap-panel">
              <h3 className="section-title">Contribution Activity</h3>
              <div className="heatmap-wrapper">
                <HeatMapProfile />
              </div>
            </div>
          </div>
          
        </main>
      </div>
    </>
  );
};

export default Profile;
