import React, { useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';


/**
 * UserProfile Component
 * Allows users to create or load a profile using name and email.
 * Makes a POST request to backend and triggers callback on success.
 *
 * @param {Function} onProfileLoaded - Callback to pass user data to parent
 */
function UserProfile({ onProfileLoaded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  /**
   * Utility function to sanitize email by removing non-alphanumeric characters.
   * (Note: not used in submission here, but can be used if needed for Firestore IDs)
   */
  const sanitizeEmail = (email) => email.toLowerCase().replace(/[^a-z0-9]/g, '');

  /**
   * Handles form submission:
   * Validates input
   * Sends POST request to backend
   * Triggers callback with user profile data
   */
  const handleSubmit = async () => {
    if (!name || !email) {
      setStatus('Name and email are required');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/users`, { name, email });
      setStatus(`✅ Profile loaded: ${response.data.name}`);

      // Pass profile data up to parent component
      onProfileLoaded({
        name: response.data.name,
        email: response.data.email,
      });
    } catch (error) {
      console.error('Profile creation error:', error.message);
      setStatus('❌ Failed to create/load profile');
    }
  };

  return (
    <div>
      <h2>Create or Load Profile</h2>

      <div>
        <label>Name: </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label>Email: </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <button onClick={handleSubmit}>Continue</button>

      {/* Status message shown after submit */}
      <p style={{ color: status.toLowerCase().includes('fail') ? 'red' : 'green' }}>
        {status}
      </p>
    </div>
  );
}

export default UserProfile;
