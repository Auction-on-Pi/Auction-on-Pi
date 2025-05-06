import AuctionList from "@/components/AuctionList";

interface Auction {
  id: number;
  title: string;
  description: string;
  startingBid: number;
  currentBid?: number;
  endTime: string;
  ownerId: number;
}

async function getAuctions(): Promise<Auction[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch auctions: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data as Auction[];
  } catch (error: any) {
    console.error('Error fetching auctions:', {
      message: error.message,
      stack: error.stack,
    });
    return [];
  }
}

export default async function AuctionsPage() {
  const auctions = await getAuctions();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Active Auctions</h1>
      {auctions.length === 0 ? (
        <p className="text-gray-500">No auctions available.</p>
      ) : (
        <AuctionList auctions={auctions} />
      )}
    </div>
  );
    }
