import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

/**
 * CreateProfile Component
 * -----------------------
 * Allows the user to create or load a profile using their phone number.
 * Sends a POST request to the backend and stores the phone number locally.
 *
 * @param {Function} onProfileCreated - Callback function after successful profile creation
 */
function CreateProfile({ onProfileCreated }) {
  const [phone, setPhoneInput] = useState('');
  const [message, setMessage] = useState('');
  const {setPhone} = useUser();

  /**
   * Handles form submission:
   * Sends phone number to backend
   * Stores phone number in localStorage
   * Triggers callback on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }) // Only send phone number
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Error creating profile');
        return;
      }

      // Save phone to localStorage
      localStorage.setItem('phone', data.id);
      setMessage(`✅ Profile loaded: ${data.id}`);

      setPhone(data.id);

      // Call parent callback
      if (onProfileCreated) {
        onProfileCreated(data.id);
      }

    } catch (err) {
      console.error('Profile creation error:', err.message);
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="createProfile">
      <form onSubmit={handleSubmit}>
        <label>
          Phone Number
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))} // Remove non-digits
            placeholder="Enter phone number"
          />
        </label>

        {/* Message display after submission */}
        {message && (
          <p style={{ color: message.startsWith('✅') ? 'green' : 'crimson' }}>
            {message}
          </p>
        )}

        <button type="submit">Load</button>
      </form>

      
    </div>
  );
}

export default CreateProfile;
