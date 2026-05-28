import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./repoView.css";

const MOCK_REPOS_DB = {
  "1": { name: "GitForage-Core", desc: "The main backend API and orchestration engine for GitForage.", vis: true, owner: "alex_dev", stars: 142, forks: 23, files: [{ name: "src", type: "folder", update: "Added new API endpoints", date: "2 days ago" }, { name: "package.json", type: "file", update: "Bumped versions", date: "2 days ago" }, { name: "README.md", type: "file", update: "Updated docs", date: "1 week ago" }], readme: "# GitForage Core\n\nWelcome to the GitForage Core repository. This project is built using Node.js and Express.\n\n## Features\n- 🚀 High performance routing\n- 🔒 JWT Authentication\n- 🌐 GraphQL Ready" },
  "2": { name: "neon-ui-kit", desc: "A beautiful glassmorphic UI library built with React.", vis: true, owner: "sarah_codes", stars: 405, forks: 89, files: [{ name: "components", type: "folder", update: "Added 3D cards", date: "10 hours ago" }, { name: "index.css", type: "file", update: "Refactored glow variables", date: "1 day ago" }, { name: "README.md", type: "file", update: "Initial commit", date: "3 months ago" }], readme: "# Neon UI Kit\n\nA beautiful glassmorphic UI library built for modern web applications.\n\n```css\n.glass {\n  backdrop-filter: blur(20px);\n}\n```" },
  "3": { name: "secret-algo", desc: "Top secret trading algorithm. Do not share.", vis: false, owner: "quant_master", stars: 0, forks: 0, files: [{ name: "models", type: "folder", update: "Updated LSTM model", date: "5 mins ago" }, { name: "main.py", type: "file", update: "Fixed memory leak", date: "1 hour ago" }], readme: "# Secret Algorithm\n\nConfidential. Authorized access only." },
  "p1": { name: "react-spring-animations", desc: "Smooth spring physics based animations.", vis: true, owner: "animation_wizard", stars: 1204, forks: 340, files: [{ name: "src/spring", type: "folder", update: "Optimized physics engine", date: "3 days ago" }, { name: "README.md", type: "file", update: "Added examples", date: "1 week ago" }], readme: "# React Spring Animations\n\nBring your components to life with real physics!\n\n## Installation\n`npm install react-spring-animations`" },
  "p2": { name: "awesome-web3", desc: "A curated list of web3 resources.", vis: true, owner: "crypto_fan", stars: 8900, forks: 1200, files: [{ name: "resources.json", type: "file", update: "Added new DEXs", date: "4 hours ago" }, { name: "README.md", type: "file", update: "Updated TOC", date: "1 day ago" }], readme: "# Awesome Web3\n\nA curated list of awesome Web3 resources, libraries, and tools.\n\n## Table of Contents\n- Smart Contracts\n- Frontends\n- Wallets" },
  "p5": { name: "ai-trading-bot", desc: "Open source ML trading bot.", vis: true, owner: "quant_master", stars: 560, forks: 45, files: [{ name: "data_pipeline", type: "folder", update: "Added Binance connector", date: "2 days ago" }, { name: "bot.py", type: "file", update: "Updated strategy", date: "5 days ago" }], readme: "# AI Trading Bot\n\nFully automated ML trading bot using reinforcement learning." },
  "p6": { name: "nextjs-portfolio-template", desc: "A stunning 3D portfolio template.", vis: true, owner: "design_pro", stars: 2300, forks: 560, files: [{ name: "app", type: "folder", update: "Migrated to App Router", date: "1 month ago" }, { name: "next.config.js", type: "file", update: "Configured image domains", date: "2 months ago" }], readme: "# Next.js 3D Portfolio\n\nThe most advanced portfolio template on the web. Features Three.js integration." },
};

const RepositoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [forkSuccess, setForkSuccess] = useState(false);

  useEffect(() => {
    // Dynamically look up the mock repository by ID
    const repoData = MOCK_REPOS_DB[id];
    
    if (repoData) {
      setRepo({
        _id: id,
        name: repoData.name,
        description: repoData.desc,
        visibility: repoData.vis,
        owner: { username: repoData.owner },
        stars: repoData.stars,
        forks: repoData.forks,
        files: repoData.files,
        readme: repoData.readme
      });
    } else {
      // Fallback for newly created repositories that aren't in the hardcoded DB
      setRepo({
        _id: id,
        name: `Repository ${id.substring(0,6)}`,
        description: "A newly initialized repository.",
        visibility: true,
        owner: { username: "alex_dev" },
        stars: 0,
        forks: 0,
        files: [{ name: "README.md", type: "file", update: "Initial commit", date: "Just now" }],
        readme: `# Welcome\n\nThis is a newly created repository.`
      });
    }
  }, [id]);

  const handleFork = () => {
    const savedRepos = localStorage.getItem("mockUserRepos");
    let userRepos = [];
    if (savedRepos) {
      userRepos = JSON.parse(savedRepos);
    }
    
    const newFork = {
      _id: `fork_${Date.now()}`,
      name: repo.name,
      description: repo.description,
      visibility: true,
      updatedAt: new Date().toISOString()
    };
    
    userRepos = [newFork, ...userRepos];
    localStorage.setItem("mockUserRepos", JSON.stringify(userRepos));
    
    setForkSuccess(true);
    setTimeout(() => {
      setForkSuccess(false);
      navigate('/');
    }, 1500);
  };

  if (!repo) {
    return <div className="page-container" style={{color: 'white', textAlign: 'center'}}>Loading Repository Space...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="page-container repo-view-layout">
        
        {/* Repo Header */}
        <div className="repo-header glass-panel">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Command Center
          </button>
          
          <div className="repo-title-row">
            <h2>{repo.owner.username} / <span>{repo.name}</span></h2>
            <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
              {repo.visibility ? 'Public' : 'Private'}
            </span>
          </div>
          <p className="repo-desc">{repo.description}</p>
          
          <div className="repo-actions">
            <button className="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Star {repo.stars}
            </button>
            <button className="action-btn" onClick={handleFork} style={forkSuccess ? { background: 'rgba(0, 242, 254, 0.2)', borderColor: '#00f2fe' } : {}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>
              {forkSuccess ? "Forked Successfully!" : `Fork ${repo.forks}`}
            </button>
          </div>
        </div>

        {/* 3D File Explorer */}
        <div className="file-explorer-3d glass-panel">
          <div className="explorer-header">
            <div className="branch-selector">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
              main
            </div>
            <div className="explorer-stats">
              <strong>12</strong> branches · <strong>4</strong> tags
            </div>
          </div>

          <div className="file-list">
            {repo.files && repo.files.map((file, idx) => (
              <div key={idx} className="file-row">
                <div className="file-name">
                  {file.type === "folder" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4facfe" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                  )}
                  {file.name}
                </div>
                <div className="file-update">{file.update}</div>
                <div className="file-date">{file.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Readme Section */}
        <div className="readme-3d glass-panel">
          <div className="readme-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            README.md
          </div>
          <div className="readme-content">
            <pre>{repo.readme}</pre>
          </div>
        </div>

      </div>
    </>
  );
};

export default RepositoryView;
