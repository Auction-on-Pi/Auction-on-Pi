"use client";

import { useState } from "react";

interface BidFormProps {
  auctionId: string;
}

export default function BidForm({ auctionId }: BidFormProps) {
  const [bid, setBid] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Integrate Pi SDK for payment
    const Pi = (window as any).Pi;
    await Pi.authenticate(["username"], async (auth: any) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId, amount: parseFloat(bid), user: auth.user.username }),
      });
      if (response.ok) alert("Bid placed!");
      else alert("Error placing bid.");
    });
    setBid("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="number"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        placeholder="Enter your bid (Pi)"
        className="border p-2 rounded"
      />
      <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded">
        Place Bid
      </button>
    </form>
  );
}
