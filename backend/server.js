const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// Start Server after DB Connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
