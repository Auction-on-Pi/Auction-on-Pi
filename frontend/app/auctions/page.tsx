import AuctionList from "@/components/AuctionList";

async function getAuctions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function AuctionsPage() {
  const auctions = await getAuctions();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Active Auctions</h1>
      <AuctionList auctions={auctions} />
    </div>
  );
}
