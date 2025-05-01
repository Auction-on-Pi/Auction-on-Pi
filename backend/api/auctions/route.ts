import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const auctions = await prisma.auction.findMany();
  return NextResponse.json(auctions);
}

export async function POST(request: Request) {
  const { title, startingBid, user } = await request.json();
  const auction = await prisma.auction.create({
    data: { title, currentBid: startingBid, user },
  });
  return NextResponse.json(auction);
}
