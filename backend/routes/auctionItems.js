const express = require('express');
const router = express.Router();
const AuctionItem = require('../models/auctionItem');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, startingPrice, endTime } = req.body;
  const auctionItem = new AuctionItem({
    title,
    description,
    startingPrice,
    currentHighestBid: startingPrice,
    endTime,
    sellerId: req.user.id
  });
  await auctionItem.save();
  res.status(201).json(auctionItem);
});

router.get('/', async (req, res) => {
  const auctions = await AuctionItem.find({ endTime: { $gt: new Date() } });
  res.json(auctions);
});

router.get('/:id', async (req, res) => {
  const auction = await AuctionItem.findById(req.params.id);
  if (!auction) return res.status(404).send('Auction not found');
  res.json(auction);
});

module.exports = router;
