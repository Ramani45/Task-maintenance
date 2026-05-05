import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Memoized fetch function to keep it stable
  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Create Operation
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/projects`, { 
        name: newProjectName, 
        admin: localStorage.getItem('userId') 
      });
      setNewProjectName("");
      fetchProjects(); // Refresh list after creation
    } catch (err) {
      alert("Project creation failed");
    }
  };

  // Delete Operation - Fixes your "Delete doesn't work" issue
  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${API_URL}/api/projects/${projectId}`);
        // Real-time UI update: remove from local state immediately
        setProjects(prev => prev.filter(p => p._id !== projectId));
      } catch (err) {
        alert("Delete failed. You may not have permission.");
      }
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1>Project Management</h1>
      
      {/* Creation Section */}
      <div style={formCard}>
        <h3>Create New Project</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px' }}>
          <input 
            value={newProjectName} 
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Enter project name..." 
            style={inputStyle} 
            required 
          />
          <button type="submit" style={createBtn}>Create</button>
        </form>
      </div>

      {/* Projects Grid */}
      <div style={gridStyle}>
        {projects.map(project => (
          <div key={project._id} style={cardStyle}>
            <div style={{ borderBottom: '1px solid #eee', marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{project.name}</h3>
            </div>
            <p>Admin: <b>{project.admin?.name || 'ramani'}</b></p>
            <p>Members: {project.members?.length || 1}</p>
            
            <div style={actionRow}>
              {/* This enables the "View Project Tasks" functionality */}
              <button 
                onClick={() => navigate(`/projects/${project._id}`)} 
                style={viewBtn}
              >
                View Project Tasks
              </button>
              
              <button 
                onClick={() => handleDelete(project._id)} 
                style={deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Internal Styles
const formCard = { background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const inputStyle = { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' };
const createBtn = { padding: '10px 25px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' };
const cardStyle = { padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const actionRow = { display: 'flex', gap: '10px', marginTop: '20px' };
const viewBtn = { flex: 2, padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const deleteBtn = { flex: 1, padding: '10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Projects;