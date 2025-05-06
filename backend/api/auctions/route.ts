import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const auctions = await prisma.auction.findMany();
    return NextResponse.json(auctions);
  } catch (error: any) {
    console.error('GET /api/auctions error:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: 'Failed to fetch auctions', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, startingBid, user, ownerId, description, endTime } = await request.json();
    if (!title || !startingBid || !user || !ownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const auction = await prisma.auction.create({
      data: {
        title,
        startingBid,
        currentBid: startingBid,
        user,
        ownerId,
        description: description || '',
        endTime: endTime ? new Date(endTime) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days
      },
    });
    return NextResponse.json(auction);
  } catch (error: any) {
    console.error('POST /api/auctions error:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: 'Failed to create auction', details: error.message }, { status: 500 });
  }
        }
