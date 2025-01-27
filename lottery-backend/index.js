// index.js
require('dotenv').config(); // MUST BE AT THE TOP
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const lotteriesRouter = require('./routes/lotteries');
app.use('/api/lotteries', lotteriesRouter);

// Test Route
app.get('/', (req, res) => {
  res.send('Lottery Backend Running');
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});