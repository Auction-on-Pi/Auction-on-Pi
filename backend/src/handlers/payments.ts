import { supabase } from '../../utils/supabase/server';
import axios from 'axios';

const PI_API_URL = 'https://api.minepi.com/v2';

export const approvePiPayment = async (paymentId: string, itemId: string, bidderId: string) => {
  try {
    const auction = await supabase
      .from('auctions')
      .select('current_bid, ends_at, status')
      .eq('id', itemId)
      .single();

    if (auction.error || !auction.data) {
      throw new Error('Auction not found');
    }

    if (new Date(auction.data.ends_at) <= new Date() || auction.data.status !== 'active') {
      throw new Error('Auction is closed or inactive');
    }

    const bid = await supabase
      .from('bids')
      .select('amount')
      .eq('payment_id', paymentId)
      .single();

    const bidAmount = bid.data?.amount || 0;

    const { error } = await supabase.rpc('update_auction_bid', {
      p_auction_id: itemId,
      p_bidder_id: bidderId,
      p_amount: bidAmount,
      p_payment_id: paymentId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error approving Pi payment:', error);
    throw error;
  }
};

export const completePiPayment = async (paymentId: string, txid: string) => {
  try {
    const { error } = await supabase
      .from('bids')
      .update({ txid })
      .eq('payment_id', paymentId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error completing Pi payment:', error);
    throw error;
  }
};
