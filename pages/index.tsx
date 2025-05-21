import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuctions()
  }, [])

  async function fetchAuctions() {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*, auction_images(image_url)')
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
        <h2 className="text-2xl font-bold mb-4">Active Auctions</h2>
        {loading ? (
          <p>Loading auctions...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction: any) => (
              <div key={auction.id} className="border rounded-lg p-4">
                <h3 className="font-bold">{auction.title}</h3>
                <p className="text-gray-600">{auction.description}</p>
                <p className="mt-2">Current Price: π {auction.current_price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
