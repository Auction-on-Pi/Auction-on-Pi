const AuctionItem = require('../models/auctionItem');
const Bid = require('../models/bid');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('placeBid', async (data) => {
      const { auctionId, bidAmount, userId } = data;
      const auction = await AuctionItem.findById(auctionId);
      if (!auction || auction.endTime < new Date() || bidAmount <= auction.currentHighestBid) {
        socket.emit('bidError', 'Invalid bid');
        return;
      }
      const bid = new Bid({ auctionItemId: auctionId, bidderId: userId, bidAmount });
      await bid.save();
      auction.currentHighestBid = bidAmount;
      await auction.save();
      io.emit('newBid', { auctionId, bidAmount }); // Broadcast to all clients
    });
    socket.on('disconnect', () => console.log('Client disconnected'));
  });
};
