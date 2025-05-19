// src/types/users.ts
export interface UserSessionData {
  id: string;         // Using string instead of ObjectId for compatibility
  username: string;
  uid: string;
  roles: string[];
  accessToken: string;
}

// For Prisma model types (if you need them)
export type UserPrismaData = {
  id: string;
  username: string;
  uid: string;
  roles: string[];
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
};
