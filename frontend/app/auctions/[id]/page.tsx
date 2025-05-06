'use client';
import { useState } from 'react';

export default function BidForm({ auctionId }) {
  const [bid, setBid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bid || parseFloat(bid) <= 0) {
      setError('Please enter a valid bid amount.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('https://auction-on-pi-backend.vercel.app/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionId, amount: parseFloat(bid), user: 'currentUser' }), // Replace 'currentUser' with actual user data if signed in
      });
      if (response.ok) {
        alert('Bid placed successfully!');
        setBid('');
      } else {
        setError('Failed to place bid.');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        placeholder="Enter your bid (Pi)"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Placing Bid...' : 'Place Bid'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
      }
