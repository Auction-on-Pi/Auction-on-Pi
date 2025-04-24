const mongoose = require('mongoose');
const bidSchema = new mongoose.Schema({
  auctionItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'AuctionItem', required: true },
  bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidAmount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Bid', bidSchema);
