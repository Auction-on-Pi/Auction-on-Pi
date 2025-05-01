import Link from "next/link";

interface Auction {
  id: string;
  title: string;
  currentBid: number;
}

interface AuctionListProps {
  auctions: Auction[];
}

export default function AuctionList({ auctions }: AuctionListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {auctions.map((auction) => (
        <div key={auction.id} className="border p-4 rounded">
          <h2 className="text-xl">{auction.title}</h2>
          <p>Current Bid: {auction.currentBid} Pi</p>
          <Link href={`/auctions/${auction.id}`} className="text-blue-500">
            Bid Now
          </Link>
        </div>
      ))}
    </div>
  );
}
