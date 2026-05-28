const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const players = require('./routes/playerRoutes');
const stats = require('./routes/statsRoutes');
const auth = require('./routes/authRoutes');
const admin = require('./routes/adminRoutes');

const app = express();

// Disable ETags to avoid 304 Not Modified status codes
app.set('etag', false);

// Prevent caching to ensure fresh 200 responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mount routers
app.use('/api/v1/players', players);
app.use('/api/v1/stats', stats);
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin', admin);


// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
