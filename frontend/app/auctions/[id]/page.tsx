import BidForm from "@/components/BidForm";

async function getAuction(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${id}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function AuctionPage({ params }: { params: { id: string } }) {
  const auction = await getAuction(params.id);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{auction.title}</h1>
      <p>Current Bid: {auction.currentBid} Pi</p>
      <BidForm auctionId={auction.id} />
    </div>
  );
}
