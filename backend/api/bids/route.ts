import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { auctionId, amount, user } = await request.json();
  const auction = await prisma.auction.update({
    where: { id: auctionId },
    data: { currentBid: amount, bids: { create: { amount, user } } },
  });
  // Trigger Pi payment (simplified)
  return NextResponse.json(auction);
}
