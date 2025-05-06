import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { auctionId, amount, user } = await request.json();
  if (!auctionId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid bid data" }, { status: 400 });
  }
  const auction = await prisma.auction.findUnique({ where: { id: auctionId } });
  if (!auction || (auction.currentBid && amount <= auction.currentBid)) {
    return NextResponse.json({ error: "Bid too low or auction not found" }, { status: 400 });
  }
  const updatedAuction = await prisma.auction.update({
    where: { id: auctionId },
    data: { currentBid: amount, bids: { create: { amount, user } } },
  });
  return NextResponse.json(updatedAuction);
}
