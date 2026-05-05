import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import ProjectTaskView from './pages/ProjectTaskView'; // Added for real-time project filtering

const Navbar = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>TaskMaster Pro</div>
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/projects" style={linkStyle}>Projects</Link>
        <Link to="/profile" style={linkStyle}>My Workspace</Link>
        <button onClick={handleLogout} style={logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* Main Content Container */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Application Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* REAL-TIME FUNCTIONALITY: Dynamic route for viewing specific project tasks */}
            <Route path="/projects/:projectId" element={<ProjectTaskView />} />
            
            {/* Default Redirect to Login */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Global UI Styling
const navStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  padding: '15px 60px', 
  backgroundColor: '#1a202c', 
  color: 'white', 
  alignItems: 'center',
  marginBottom: '20px'
};

const linkStyle = { 
  color: '#e2e8f0', 
  textDecoration: 'none', 
  fontWeight: '500' 
};

const logoutBtn = { 
  background: '#e53e3e', 
  color: 'white', 
  border: 'none', 
  padding: '8px 15px', 
  borderRadius: '4px', 
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default App;