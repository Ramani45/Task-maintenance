import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [myTasks, setMyTasks] = useState([]);
  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/tasks/user/${userId}`);
        setMyTasks(res.data);
      } catch (err) { console.error(err); }
    };
    if (userId) fetchMyTasks();
  }, [userId, API_URL]);

  return (
    <div style={{ padding: '40px' }}>
      <h2>Hello, {userName}!</h2>
      <p style={{ color: '#666' }}>Here are the tasks currently assigned to you.</p>

      <div style={{ marginTop: '20px' }}>
        {myTasks.length > 0 ? myTasks.map(task => (
          <div key={task._id} style={taskItemStyle}>
            <div>
              <strong style={{ fontSize: '1.1rem' }}>{task.title}</strong>
              <p style={{ margin: '5px 0', color: '#777' }}>{task.description}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                background: task.priority === 'High' ? '#ff4d4d' : '#eee', 
                color: task.priority === 'High' ? 'white' : 'black',
                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'
              }}>
                {task.priority}
              </span>
              <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Status: <b>{task.status}</b></p>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '50px', border: '2px dashed #ccc' }}>
             <h3>No tasks assigned yet.</h3>
             <p>Check the Projects page to join a team!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const taskItemStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  backgroundColor: 'white', padding: '20px', borderRadius: '8px',
  marginBottom: '15px', border: '1px solid #ddd'
};

export default Profile;