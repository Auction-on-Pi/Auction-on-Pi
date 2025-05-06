import AuctionList from "@/components/AuctionList";

async function getAuctions() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch auctions: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return [];
  }
}

export default async function AuctionsPage() {
  const auctions = await getAuctions();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Active Auctions</h1>
      {auctions.length === 0 ? (
        <p>No auctions available.</p>
      ) : (
        <AuctionList auctions={auctions} />
      )}
    </div>
  );
}
