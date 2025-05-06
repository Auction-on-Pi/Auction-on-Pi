import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auction = await prisma.auction.findUnique({ where: { id: params.id } });
  if (!auction) {
    return NextResponse.json({ error: "Auction not found" }, { status: 404 });
  }
  return NextResponse.json(auction);
}
