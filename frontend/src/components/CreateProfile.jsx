import React, { useState } from 'react';

function CreateProfile({ onProfileCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Error creating profile');
        return;
      }

      // Save user ID locally
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userEmail', data.email);
      setMessage(`Profile loaded: ${data.name}`);

      if (onProfileCreated) {
        onProfileCreated(data); // optional callback to parent
      }

    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Create or Load Profile</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name: <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Email: <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <button type="submit">Continue</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}

export default CreateProfile;
