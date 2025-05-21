import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { authenticateWithPi } from '../../lib/auth'
import ImageUpload from '../../components/ImageUpload'

export default function AuctionDetail() {
  const router = useRouter()
  const { id } = router.query
  const [auction, setAuction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (id) {
      fetchAuction()
    }
  }, [id])

  useEffect(() => {
    if (auction) {
      const timer = setInterval(() => {
        const endTime = new Date(auction.end_time).getTime()
        const now = new Date().getTime()
        const distance = endTime - now

        if (distance < 0) {
          setTimeLeft('Auction ended')
          clearInterval(timer)
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24))
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [auction])

  async function fetchAuction() {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select(`
          *,
          auction_images (*),
          bids (
            *,
            users (pi_username)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setAuction(data)
    } catch (error) {
      console.error('Error fetching auction:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleBid(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Authenticate with Pi Network
      const auth = await authenticateWithPi()
      if (!auth) throw new Error('Authentication failed')

      const amount = parseFloat(bidAmount)
      if (amount <= auction.current_price) {
        throw new Error('Bid must be higher than current price')
      }

      // Create bid
      const { error: bidError } = await supabase
        .from('bids')
        .insert([
          {
            auction_id: id,
            amount: amount,
            bidder_id: auth.user.id
          }
        ])

      if (bidError) throw bidError

      // Update auction current price
      const { error: updateError } = await supabase
        .from('auctions')
        .update({ current_price: amount })
        .eq('id', id)

      if (updateError) throw updateError

      // Refresh auction data
      fetchAuction()
      setBidAmount('')
    } catch (error) {
      console.error('Error placing bid:', error)
      alert('Error placing bid: ' + (error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }

  if (!auction) {
    return (
      <Layout>
        <div>Auction not found</div>
      </Layout>
    )
  }

  return (
    <Layout title={`${auction.title} | Auction on Pi`}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
          
          {/* Image Gallery */}
          <div className="mb-6">
            {auction.auction_images && auction.auction_images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auction.auction_images.map((image: any) => (
                  <img
                    key={image.id}
                    src={image.image_url}
                    alt={auction.title}
                    className="rounded-lg object-cover w-full h-64"
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No images available</div>
            )}
          </div>

          {/* Auction Details */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{auction.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Current Price</h3>
                <p className="text-2xl font-bold text-indigo-600">π {auction.current_price}</p>
              </div>
              <div>
                <h3 className="font-semibold">Time Left</h3>
                <p className="text-2xl font-bold text-indigo-600">{timeLeft}</p>
              </div>
            </div>
          </div>

          {/* Bid Form */}
          {timeLeft !== 'Auction ended' && (
            <form onSubmit={handleBid} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="number"
                  step="0.01"
                  min={auction.current_price + 0.01}
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter bid amount"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {submitting ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </div>
            </form>
          )}

          {/* Bid History */}
          <div>
            <h2 className="text-xl font-bold mb-4">Bid History</h2>
            <div className="space-y-2">
              {auction.bids && auction.bids.length > 0 ? (
                auction.bids
                  .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((bid: any) => (
                    <div key={bid.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <span className="font-semibold">{bid.users.pi_username}</span>
                        <span className="text-gray-500 text-sm ml-2">
                          {new Date(bid.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="font-bold">π {bid.amount}</div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">No bids yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
          }
