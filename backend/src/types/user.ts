// src/types/users.ts
export interface AuthUserData {
  id: number;         // Matches Prisma's Int ID
  piUserId: string;
  username: string;
  accessToken: string;
  roles?: string[];   // Optional to match your session type
}

// For Prisma model types
export type UserWithRelations = {
  id: number;
  piUserId: string;
  username: string;
  auctions: Auction[];
  bids: Bid[];
};

// Additional types for related models
type Auction = {
  id: number;
  title: string;
  description: string;
  // ... other auction fields
};

type Bid = {
  id: number;
  amount: number;
  // ... other bid fields
};
