import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = () => {
  const { id } = useParams(); // Gets the Project ID from the URL
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProjectData = async () => {
      const res = await axios.get(`${API_URL}/api/projects/details/${id}`);
      setProject(res.data.project);
      setTasks(res.data.tasks);
    };
    fetchProjectData();
  }, [id, API_URL]);

  const joinProject = async () => {
    const userId = localStorage.getItem('userId');
    await axios.post(`${API_URL}/api/projects/join`, { projectId: id, userId });
    alert("Joined successfully!");
    window.location.reload(); 
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div style={{ padding: '40px' }}>
      <h1>{project.name}</h1>
      <button onClick={joinProject} style={{backgroundColor: '#28a745', color: 'white', padding: '10px'}}>Join Team</button>
      
      <h3>Tasks for this Project</h3>
      <ul>
        {tasks.map(t => <li key={t._id}>{t.title} - <strong>{t.status}</strong></li>)}
      </ul>
    </div>
  );
};

export default ProjectDetails;