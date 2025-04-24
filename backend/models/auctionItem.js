const mongoose = require('mongoose');
const auctionItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startingPrice: { type: Number, required: true },
  currentHighestBid: { type: Number, default: 0 },
  endTime: { type: Date, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
module.exports = mongoose.model('AuctionItem', auctionItemSchema);
