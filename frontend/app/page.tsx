import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Auction-on-Pi</h1>
      <p>Welcome to the Pi Network auction platform!</p>
      <Link href="/auctions" className="text-blue-500">
        View Auctions
      </Link>
    </div>
  );
}
