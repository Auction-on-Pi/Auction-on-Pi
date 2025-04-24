import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AuctionList() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      const res = await axios.get(`${window.__ENV.backendURL}/api/auctions`);
      setAuctions(res.data);
    };
    fetchAuctions();
  }, []);

  return (
    <div>
      <h1>Ongoing Auctions</h1>
      <ul>
        {auctions.map(auction => (
          <li key={auction._id}>
            <Link to={`/auction/${auction._id}`}>{auction.title}</Link> - Current Bid: ${auction.currentHighestBid}
          </li>
        ))}
      </ul>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </div>
  );
}

export default AuctionList;
