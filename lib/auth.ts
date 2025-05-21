import { Pi } from '@pinetwork-js/sdk'
import { supabase } from './supabase'

export async function authenticateWithPi() {
  try {
    // Initialize Pi SDK
    const pi = new Pi({
      apiKey: process.env.NEXT_PUBLIC_PI_API_KEY,
      version: '2.0'
    })

    // Authenticate user
    const scopes = ['username', 'payments', 'wallet_address']
    const auth = await pi.authenticate(scopes, {
      onIncompletePaymentFound: function(payment) {
        console.log("Incomplete payment found!", payment)
      }
    })

    if (auth) {
      // Check if user exists in our database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('pi_username', auth.user.username)
        .single()

      if (!existingUser) {
        // Create new user in our database
        const { data: newUser, error } = await supabase
          .from('users')
          .insert([
            {
              pi_username: auth.user.username,
            }
          ])
          .single()

        if (error) throw error
      }

      return auth
    }
  } catch (error) {
    console.error('Authentication error:', error)
    throw error
  }
}
