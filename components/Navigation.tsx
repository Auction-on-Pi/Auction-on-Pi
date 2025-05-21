import { useState } from 'react'
import Link from 'next/link'
import { authenticateWithPi } from '../lib/auth'

export default function Navigation() {
  const [authenticating, setAuthenticating] = useState(false)

  async function handleAuth() {
    setAuthenticating(true)
    try {
      await authenticateWithPi()
    } catch (error) {
      console.error('Authentication error:', error)
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Auction on Pi</h1>
            </Link>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={handleAuth}
              disabled={authenticating}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {authenticating ? 'Connecting...' : 'Connect with Pi'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
