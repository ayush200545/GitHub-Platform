import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";

const MOCK_REPOS = [
  { _id: "1", name: "GitForage-Core", description: "The main backend API and orchestration engine for GitForage.", visibility: true, updatedAt: new Date().toISOString() },
  { _id: "2", name: "neon-ui-kit", description: "A beautiful glassmorphic UI library built with React.", visibility: true, updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: "3", name: "secret-algo", description: "Top secret trading algorithm. Do not share.", visibility: false, updatedAt: new Date(Date.now() - 172800000).toISOString() },
  { _id: "4", name: "3d-engine-webgl", description: "Experimental WebGL rendering engine.", visibility: true, updatedAt: new Date(Date.now() - 272800000).toISOString() },
];

const MOCK_TOP_PERFORMERS = [
  { _id: "u1", username: "alex_dev", repositories: [1,2,3,4,5] },
  { _id: "u2", username: "sarah_codes", repositories: [1,2,3,4] },
  { _id: "u3", username: "mike_builder", repositories: [1,2,3] },
  { _id: "u4", username: "emily_ui", repositories: [1,2] },
];

const MOCK_PUBLIC_REPOS = [
  { _id: "p1", name: "react-spring-animations", description: "Smooth spring physics based animations.", owner: { username: "animation_wizard" } },
  { _id: "p2", name: "awesome-web3", description: "A curated list of web3 resources.", owner: { username: "crypto_fan" } },
  { _id: "p3", name: "vim-config-ultimate", description: "The only vim config you'll ever need.", owner: { username: "vimmer101" } },
  { _id: "p4", name: "node-express-boiler", description: "Quick start your APIs.", owner: { username: "backend_guru" } },
  { _id: "p5", name: "ai-trading-bot", description: "Open source ML trading bot.", owner: { username: "quant_master" } },
  { _id: "p6", name: "nextjs-portfolio-template", description: "A stunning 3D portfolio template.", owner: { username: "design_pro" } },
];

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDesc, setNewRepoDesc] = useState("");
  const [newRepoVis, setNewRepoVis] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const isMock = userId === "mock_user_id_123" || !userId;

    const fetchRepositories = async () => {
      if (isMock) {
        // Use localStorage to persist created/forked repos
        const savedRepos = localStorage.getItem("mockUserRepos");
        if (savedRepos) {
          setRepositories(JSON.parse(savedRepos));
        } else {
          localStorage.setItem("mockUserRepos", JSON.stringify(MOCK_REPOS));
          setRepositories(MOCK_REPOS);
        }
        return;
      }
      try {
        const response = await fetch(`http://localhost:3002/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.warn("Backend failed. Falling back to mock repos.");
        const savedRepos = localStorage.getItem("mockUserRepos");
        if (savedRepos) {
          setRepositories(JSON.parse(savedRepos));
        } else {
          localStorage.setItem("mockUserRepos", JSON.stringify(MOCK_REPOS));
          setRepositories(MOCK_REPOS);
        }
      }
    };

    const fetchSuggestedRepositories = async () => {
      if (isMock) {
        setSuggestedRepositories(MOCK_PUBLIC_REPOS);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3002/repo/public`);
        const data = await response.json();
        setSuggestedRepositories(data || []);
      } catch (err) {
        setSuggestedRepositories(MOCK_PUBLIC_REPOS);
      }
    };

    const fetchTopPerformers = async () => {
      if (isMock) {
        setTopPerformers(MOCK_TOP_PERFORMERS);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3002/topPerformers`);
        const data = await response.json();
        setTopPerformers(data || []);
      } catch (err) {
        setTopPerformers(MOCK_TOP_PERFORMERS);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
    fetchTopPerformers();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  const formatDate = (dateString) => {
    if(!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDeploy = (e) => {
    e.preventDefault();
    const newRepo = {
      _id: `mock_${Date.now()}`,
      name: newRepoName,
      description: newRepoDesc,
      visibility: newRepoVis,
      updatedAt: new Date().toISOString()
    };
    const updatedRepos = [newRepo, ...repositories];
    setRepositories(updatedRepos);
    localStorage.setItem("mockUserRepos", JSON.stringify(updatedRepos));
    setIsDeployModalOpen(false);
    setNewRepoName("");
    setNewRepoDesc("");
    setNewRepoVis(true);
  };

  return (
    <>
      <Navbar />
      <div className="page-container dashboard-layout">
        
        {/* Command Header */}
        <div className="command-header">
          {/* Top Performers Pedestals */}
          <div className="glass-panel">
            <h3 className="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Top Performers
            </h3>
            <div className="top-performers-pedestals">
              {topPerformers.map((user, index) => (
                <div key={user._id} className="pedestal">
                  <div className="rank">#{index + 1}</div>
                  <h4>{user.username}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.repositories?.length} Repos</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Terminal Stream */}
          <div className="terminal-stream">
            <h3 className="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4facfe" strokeWidth="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
              Live Terminal
            </h3>
            <div className="stream-item">
              <span><strong>alex_dev</strong> pushed to <em>GitForage-Core</em></span>
            </div>
            <div className="stream-item">
              <span><strong>sarah_codes</strong> created a new issue in <em>neon-ui-kit</em></span>
            </div>
            <div className="stream-item">
              <span><strong>mike_builder</strong> forked <em>awesome-web3</em></span>
            </div>
          </div>
        </div>

        {/* Deploy Repository Modal */}
        {isDeployModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content glass-panel deploy-modal">
              <h2 style={{marginTop: 0}}>Deploy New Repository</h2>
              <form onSubmit={handleDeploy} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <input 
                  type="text" 
                  className="input-glass" 
                  placeholder="Repository Name" 
                  value={newRepoName}
                  onChange={(e)=>setNewRepoName(e.target.value)}
                  required
                />
                <textarea 
                  className="input-glass" 
                  placeholder="Description (optional)" 
                  value={newRepoDesc}
                  onChange={(e)=>setNewRepoDesc(e.target.value)}
                  rows="3"
                />
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)'}}>
                    <input type="radio" checked={newRepoVis} onChange={()=>setNewRepoVis(true)} />
                    Public
                  </label>
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)'}}>
                    <input type="radio" checked={!newRepoVis} onChange={()=>setNewRepoVis(false)} />
                    Private
                  </label>
                </div>
                <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                  <button type="button" className="neon-btn" style={{background: 'transparent', borderColor: 'var(--text-secondary)'}} onClick={() => setIsDeployModalOpen(false)}>Cancel</button>
                  <button type="submit" className="neon-btn" style={{flex: 1}}>Deploy Now</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Repositories 3D Grid */}
        <div>
          <div className="feed-header">
            <h2>Your Forages</h2>
            <button className="neon-btn" onClick={() => setIsDeployModalOpen(true)}>+ Deploy Repository</button>
          </div>
          
          <div className="search-bar-container">
            <input
              type="text"
              className="input-glass search-input"
              value={searchQuery}
              placeholder="Search your command center..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="repo-grid-3d">
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((repo) => (
                <div key={repo._id} className="repo-card-3d" onClick={() => navigate(`/repo/${repo._id}`)}>
                  <div className="repo-card-header">
                    <h3>{repo.name}</h3>
                    <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
                      {repo.visibility ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <p className="repo-description">{repo.description || "No description provided."}</p>
                  <div className="repo-meta">
                    <span className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Updated {formatDate(repo.updatedAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state glass-panel">
                <p>No repositories found. Initiate a new project.</p>
              </div>
            )}
          </div>
        </div>

        {/* Explore Grid */}
        <div className="glass-panel" style={{ marginTop: '2rem' }}>
          <h3 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            Explore Public Network
          </h3>
          <div className="explore-grid">
            {suggestedRepositories.map((repo) => (
              <div key={repo._id} className="explore-item-3d" onClick={() => navigate(`/repo/${repo._id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4>{repo.name}</h4>
                  <span className="visibility-badge public" style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>Public</span>
                </div>
                <p>{repo.description ? repo.description.substring(0, 60) + "..." : "No description"}</p>
                
                <div className="explore-item-footer" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${repo.owner?.username || repo._id}`} alt="avatar" style={{width: 20, height: 20, borderRadius: '50%'}} />
                    {repo.owner?.username || "Unknown"}
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      {Math.floor(Math.random() * 1000) + 10}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>
                      {Math.floor(Math.random() * 300) + 5}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
