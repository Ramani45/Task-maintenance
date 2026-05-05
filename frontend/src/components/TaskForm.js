import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ refreshTasks, closeModal }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', formData);
      refreshTasks(); // Refresh the list on the dashboard
      closeModal();   // Close the form
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  return (
    <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
        <h3>Create New Task</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Task Title" required style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          
          <textarea placeholder="Description" style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          
          <select style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input type="date" required style={{ width: '100%', marginBottom: '20px', padding: '8px' }}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={closeModal} style={{ backgroundColor: '#ccc', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;