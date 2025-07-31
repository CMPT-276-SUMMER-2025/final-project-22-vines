import React, { useState } from 'react';
import axios from 'axios';

function UserProfile({ onProfileLoaded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const sanitizeEmail = (email) => email.toLowerCase().replace(/[^a-z0-9]/g, '');

  const handleSubmit = async () => {
    if (!name || !email) {
      setStatus('Name and email are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/users', { name, email });
      setStatus(`Profile loaded: ${response.data.name}`);
      onProfileLoaded({ name: response.data.name, email: response.data.email });
    } catch (error) {
      setStatus('Failed to create/load profile');
    }
  };

  return (
    <div>
      <h2>Create or Load Profile</h2>
      <div>
        <label>Name: </label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email: </label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button onClick={handleSubmit}>Continue</button>
      <p style={{ color: status.includes('failed') ? 'red' : 'green' }}>{status}</p>
    </div>
  );
}

export default UserProfile;
