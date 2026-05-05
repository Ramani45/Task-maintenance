import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, overdue: 0 });
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Memoized fetch function to prevent the "missing dependency" warning
  const fetchData = useCallback(async () => {
    try {
      const [sRes, tRes] = await Promise.all([
        axios.get(`${API_URL}/api/tasks/dashboard`),
        axios.get(`${API_URL}/api/tasks`)
      ]);
      setStats(sRes.data);
      setTasks(tRes.data);
    } catch (err) { 
      console.error("Error loading dashboard data", err); 
    }
  }, [API_URL]);

  // Runs once on mount, and whenever fetchData is re-memoized
  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // UPDATE: Status change with live sync
  const handleStatusChange = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    // Optimistic UI Update for real-time feel
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      await axios.put(`${API_URL}/api/tasks/${taskId}`, { status: newStatus });
      fetchData(); // Refresh analytics (like Overdue count)
    } catch (err) {
      setTasks(originalTasks); // Rollback on failure
      alert("Update failed");
    }
  };

  // DELETE: Remove task
  const handleDelete = async (taskId) => {
    if (window.confirm("Permanently delete this task?")) {
      try {
        await axios.delete(`${API_URL}/api/tasks/${taskId}`);
        setTasks(tasks.filter(t => t._id !== taskId));
        fetchData();
      } catch (err) { 
        alert("Delete failed"); 
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={statsRow}>
        <div style={cardStyle}>
          <h3>Total Tasks</h3>
          <p style={bigNum}>{stats.total}</p>
        </div>
        <div style={{...cardStyle, color: '#e74c3c'}}>
          <h3>Overdue</h3>
          <p style={bigNum}>{stats.overdue}</p>
        </div>
      </div>

      <div style={headerStyle}>
        <h2>Live Task Feed</h2>
        {localStorage.getItem('role') === 'admin' && (
          <button onClick={() => setShowModal(true)} style={addBtn}>
            + Create New Task
          </button>
        )}
      </div>

      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRow}>
              <th style={cellStyle}>Task Title</th>
              <th style={cellStyle}>Assignee</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id} style={rowStyle}>
                <td style={cellStyle}><b>{task.title}</b></td>
                <td style={cellStyle}>{task.assignedTo?.name || 'Unassigned'}</td>
                <td style={cellStyle}>
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    style={dropdownStyle}
                  >
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td style={cellStyle}>
                  <button onClick={() => handleDelete(task._id)} style={deleteBtn}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && (
        <TaskForm refreshTasks={fetchData} closeModal={() => setShowModal(false)} />
      )}
    </div>
  );
};

// Internal Styles
const containerStyle = { padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' };
const statsRow = { display: 'flex', gap: '20px', marginBottom: '30px' };
const cardStyle = { background: 'white', padding: '20px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' };
const bigNum = { fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const addBtn = { padding: '10px 20px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const tableWrapper = { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderRow = { backgroundColor: '#f1f3f5', textAlign: 'left' };
const cellStyle = { padding: '15px', borderBottom: '1px solid #eee' };
const rowStyle = { transition: 'background 0.2s' };
const dropdownStyle = { padding: '6px', borderRadius: '4px', border: '1px solid #ced4da' };
const deleteBtn = { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' };

export default Dashboard;