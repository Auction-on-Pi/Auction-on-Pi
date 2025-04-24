import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(`${window.__ENV.backendURL}/api/auth/register`, { username, password, email });
      window.location.href = '/login';
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
