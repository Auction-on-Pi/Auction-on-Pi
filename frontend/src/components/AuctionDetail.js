import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(window.__ENV.backendURL);

function AuctionDetail({ match }) {
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    const fetchAuction = async () => {
      const res = await axios.get(`${window.__ENV.backendURL}/api/auctions/${match.params.id}`);
      setAuction(res.data);
    };
    fetchAuction();

    socket.on('newBid', (data) => {
      if (data.auctionId === match.params.id) {
        setAuction(prev => ({ ...prev, currentHighestBid: data.bidAmount }));
      }
    });

    return () => socket.off('newBid');
  }, [match.params.id]);

  const placeBid = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in');
    try {
      await axios.post(`${window.__ENV.backendURL}/api/bids`, 
        { auctionId: match.params.id, bidAmount }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.emit('placeBid', { auctionId: match.params.id, bidAmount, userId: 'user-id-from-token' }); // Replace with actual user ID from token
      setBidAmount('');
    } catch (error) {
      alert('Bid failed');
    }
  };

  if (!auction) return <div>Loading...</div>;

  return (
    <div>
      <h1>{auction.title}</h1>
      <p>{auction.description}</p>
      <p>Current Highest Bid: ${auction.currentHighestBid}</p>
      <p>Ends: {new Date(auction.endTime).toLocaleString()}</p>
      <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
      <button onClick={placeBid}>Place Bid</button>
    </div>
  );
}

export default AuctionDetail;
