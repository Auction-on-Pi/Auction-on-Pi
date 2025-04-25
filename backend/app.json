const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Connect to MongoDB (update the URI for your setup later)
mongoose.connect('mongodb://localhost/auction', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Import routes
const authRoutes = require('./routes/auth');
const auctionRoutes = require('./routes/auctionItems');
const bidRoutes = require('./routes/bids');

app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);

// Socket.IO setup for real-time bidding
require('./sockets/auction')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
