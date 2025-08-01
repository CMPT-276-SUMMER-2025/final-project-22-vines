import React, { useState } from 'react';

function CreateProfile({ onProfileCreated }) {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })  // send only phone now
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Error creating profile');
        return;
      }

      localStorage.setItem('phone', data.id);  // store phone in localStorage
      setMessage(`✅ Profile loaded: ${data.id}`);

      if (onProfileCreated) {
        onProfileCreated(data.id);
      }

    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Create or Load Profile</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Phone Number: <input
  type="tel"
  required
  value={phone}
  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // remove non-digits
  placeholder="Enter phone number"
 />
        </label>
        <br />
        <button type="submit">Continue</button>
      </form>
      {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'crimson' }}>{message}</p>}
    </div>
  );
}

export default CreateProfile;
