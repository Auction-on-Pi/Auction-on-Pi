import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request, { params }) {
  const { id } = params;
  const { amount } = await request.json();
  const bid = await prisma.bid.create({
    data: { amount, auctionId: parseInt(id) },
  });
  return Response.json(bid);
}
