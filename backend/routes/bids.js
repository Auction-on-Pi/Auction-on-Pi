const express = require('express');
const router = express.Router();
const Bid = require('../models/bid');
const AuctionItem = require('../models/auctionItem');
const authMiddleware = require('./auctionItems').authMiddleware;

router.post('/', authMiddleware, async (req, res) => {
  const { auctionId, bidAmount } = req.body;
  const auction = await AuctionItem.findById(auctionId);
  if (!auction || auction.endTime < new Date()) return res.status(400).send('Invalid auction');
  if (bidAmount <= auction.currentHighestBid) return res.status(400).send('Bid too low');
  
  const bid = new Bid({ auctionItemId: auctionId, bidderId: req.user.id, bidAmount });
  await bid.save();
  auction.currentHighestBid = bidAmount;
  await auction.save();
  res.status(201).json(bid);
});

module.exports = router;
