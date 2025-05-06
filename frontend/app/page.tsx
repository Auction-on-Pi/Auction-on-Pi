'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const signIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const Pi = (window as any).Pi;
      const authResult = await Pi.authenticate(['username', 'payments']);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ piUserId: authResult.user.uid, username: authResult.user.username }),
      });
      if (!response.ok) {
        throw new Error('Sign-in failed. Please try again.');
      }
      const data = await response.json();
      setUser(data);
      router.push('/auctions');
    } catch (error: any) {
      setError(error.message || 'Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <p className="text-lg">Welcome, {user.username}!</p>
      ) : (
        <button
          onClick={signIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in with Pi'}
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <h1 className="text-2xl font-bold mt-4">Auction-on-Pi</h1>
      <p>Discover and bid on exciting auctions!</p>
    </div>
  );
}
