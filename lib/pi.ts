import { Pi } from '@pinetwork-js/sdk'

export const pi = new Pi({
  apiKey: process.env.NEXT_PUBLIC_PI_API_KEY,
  version: '2.0'
})
