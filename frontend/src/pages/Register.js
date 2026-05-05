import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{display:'block', width:'100%', marginBottom:'10px'}} />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{display:'block', width:'100%', marginBottom:'10px'}} />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{display:'block', width:'100%', marginBottom:'10px'}} />
        <select onChange={(e) => setFormData({...formData, role: e.target.value})} style={{display:'block', width:'100%', marginBottom:'10px'}}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{width:'100%', padding:'10px', backgroundColor:'#28a745', color:'white', border:'none'}}>Sign Up</button>
      </form>
    </div>
  );
};

export default Register;