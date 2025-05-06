'use client'; // Add this at the top if using Next.js
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);

  const signIn = async () => {
    try {
      const authResult = await window.Pi.authenticate(['username', 'payments']);
      const response = await fetch('https://auction-on-pi-backend.vercel.app/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ piUserId: authResult.user.uid, username: authResult.user.username }),
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      alert('Sign-in failed. Try again.');
    }
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <button onClick={signIn}>Sign in with Pi</button>
      )}
      <h1>Auction-on-Pi</h1>
      {/* Add other content here */}
    </div>
  );
}
