import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = ({ refreshTasks, closeModal }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'Medium', deadline: '', assignedTo: ''
  });
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Fetch users so Admin can assign the task
    axios.get(`${API_URL}/api/auth/users`).then(res => setUsers(res.data));
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/tasks`, formData);
      refreshTasks();
      closeModal();
    } catch (err) { alert("Error creating task"); }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Assign New Task</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Task Title" required style={inputStyle}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          
          <select style={inputStyle} required onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}>
            <option value="">Assign to Member...</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>

          <input type="date" required style={inputStyle}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />

          <button type="submit" style={submitBtn}>Save Task</button>
          <button type="button" onClick={closeModal} style={cancelBtn}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalStyle = { background: 'white', padding: '30px', borderRadius: '10px', width: '350px' };
const inputStyle = { width: '100%', marginBottom: '15px', padding: '10px', boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const cancelBtn = { width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#777', cursor: 'pointer' };

export default TaskForm;