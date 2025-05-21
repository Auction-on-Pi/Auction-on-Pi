import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { authenticateWithPi } from '../lib/auth'

export default function Home() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    fetchAuctions()
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const auth = await authenticateWithPi()
      setAuthenticated(!!auth)
    } catch (error) {
      console.error('Error checking authentication:', error)
    }
  }

  async function fetchAuctions() {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select(`
          *,
          auction_images (*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAuctions(data || [])
    } catch (error) {
      console.error('Error fetching auctions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Active Auctions</h2>
          {authenticated && (
            <Link
              href="/create"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Auction
            </Link>
          )}
        </div>

        {loading ? (
          <p>Loading auctions...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction: any) => (
              <Link href={`/auction/${auction.id}`} key={auction.id}>
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {auction.auction_images && auction.auction_images[0] && (
                    <img
                      src={auction.auction_images[0].image_url}
                      alt={auction.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{auction.title}</h3>
                    <p className="text-gray-600 line-clamp-2 mb-2">{auction.description}</p>
                    <p className="text-indigo-600 font-bold">Current Price: π {auction.current_price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
