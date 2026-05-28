import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./dashboard.css"; // Reuse dashboard 3D styles

const MOCK_EXPLORE_DB = [
  { _id: "p1", name: "react-spring-animations", description: "Smooth spring physics based animations.", owner: { username: "animation_wizard" }, stars: 1204, forks: 340, updatedAt: new Date(Date.now() - 100000).toISOString() },
  { _id: "p2", name: "awesome-web3", description: "A curated list of web3 resources.", owner: { username: "crypto_fan" }, stars: 8900, forks: 1200, updatedAt: new Date(Date.now() - 5000000).toISOString() },
  { _id: "p3", name: "vim-config-ultimate", description: "The only vim config you'll ever need.", owner: { username: "vimmer101" }, stars: 450, forks: 80, updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: "p4", name: "node-express-boiler", description: "Quick start your APIs.", owner: { username: "backend_guru" }, stars: 2100, forks: 400, updatedAt: new Date(Date.now() - 20000).toISOString() },
  { _id: "p5", name: "ai-trading-bot", description: "Open source ML trading bot.", owner: { username: "quant_master" }, stars: 560, forks: 45, updatedAt: new Date(Date.now() - 172800000).toISOString() },
  { _id: "p6", name: "nextjs-portfolio-template", description: "A stunning 3D portfolio template.", owner: { username: "design_pro" }, stars: 2300, forks: 560, updatedAt: new Date().toISOString() },
  { _id: "p7", name: "neon-ui-components", description: "Glassmorphic component library.", owner: { username: "ui_master" }, stars: 3200, forks: 150, updatedAt: new Date(Date.now() - 3600000).toISOString() }
];

const Explore = () => {
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'latest', 'popular'
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this would fetch from /repo/public
    setRepos([...MOCK_EXPLORE_DB]);
  }, []);

  const getFilteredAndSortedRepos = () => {
    let result = [...repos];

    // 1. Search Filter
    if (searchQuery.trim() !== "") {
      result = result.filter(
        repo => 
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          repo.owner.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Sort Logic
    if (activeFilter === "latest") {
      result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (activeFilter === "popular") {
      result.sort((a, b) => b.stars - a.stars);
    }

    return result;
  };

  const displayedRepos = getFilteredAndSortedRepos();

  return (
    <>
      <Navbar />
      <div className="page-container dashboard-layout">
        
        {/* Explore Hero Section */}
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '3rem', marginBottom: '1rem', textShadow: '0 0 20px rgba(0, 242, 254, 0.4)' }}>
            Explore Public Network
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px' }}>
            Discover open-source projects, get inspired, and fork repositories from other developers around the globe.
          </p>
          
          <div className="search-bar-container" style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem' }}>
            <input
              type="text"
              className="input-glass search-input"
              style={{ fontSize: '1.2rem', padding: '1rem 1.5rem', borderRadius: '30px' }}
              value={searchQuery}
              placeholder="Search by repository or username..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="neon-btn" 
              style={activeFilter === 'all' ? {} : { background: 'transparent', border: '1px solid var(--border-glass)', boxShadow: 'none' }}
              onClick={() => setActiveFilter('all')}
            >
              All Projects
            </button>
            <button 
              className="neon-btn" 
              style={activeFilter === 'latest' ? {} : { background: 'transparent', border: '1px solid var(--border-glass)', boxShadow: 'none' }}
              onClick={() => setActiveFilter('latest')}
            >
              Latest Uploaded
            </button>
            <button 
              className="neon-btn" 
              style={activeFilter === 'popular' ? {} : { background: 'transparent', border: '1px solid var(--border-glass)', boxShadow: 'none' }}
              onClick={() => setActiveFilter('popular')}
            >
              Popular (Stars)
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="explore-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {displayedRepos.length > 0 ? (
            displayedRepos.map((repo) => (
              <div key={repo._id} className="explore-item-3d" onClick={() => navigate(`/repo/${repo._id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4>{repo.name}</h4>
                  <span className="visibility-badge public" style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>Public</span>
                </div>
                <p>{repo.description ? repo.description.substring(0, 80) + "..." : "No description"}</p>
                
                <div className="explore-item-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${repo.owner?.username || repo._id}`} alt="avatar" style={{width: 24, height: 24, borderRadius: '50%'}} />
                    {repo.owner?.username}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      {repo.stars}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4facfe" strokeWidth="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>
                      {repo.forks}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <h3>No repositories found.</h3>
              <p>Try adjusting your search query.</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Explore;
