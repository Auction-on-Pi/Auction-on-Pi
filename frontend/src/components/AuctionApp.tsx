import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

interface Auction {
  id: string;
  title: string;
  description: string;
  current_bid: number;
  ends_at: string;
  status: string;
}

export default function AuctionApp() {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const getAuctions = async () => {
      try {
        const { data: auctions, error } = await supabase
          .from('auctions')
          .select('id, title, description, current_bid, ends_at, status')
          .eq('status', 'active');

        if (error) {
          console.error('Error fetching auctions:', error.message);
          return;
        }

        if (auctions && auctions.length > 0) {
          setAuctions(auctions);
        }
      } catch (error: any) {
        console.error('Error fetching auctions:', error.message);
      }
    };

    getAuctions();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Auction List</h1>
      {auctions.length === 0 ? (
        <p>No active auctions available.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {auctions.map((auction) => (
            <li
              key={auction.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
              }}
            >
              <h2>{auction.title}</h2>
              <p>{auction.description}</p>
              <p>Current Bid: {auction.current_bid} Pi</p>
              <p>Ends: {new Date(auction.ends_at).toLocaleString()}</p>
              <p>Status: {auction.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
