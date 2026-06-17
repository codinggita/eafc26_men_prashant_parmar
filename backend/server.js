const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const players = require('./src/routes/playerRoutes');
const stats = require('./src/routes/statsRoutes');
const auth = require('./src/routes/authRoutes');
const admin = require('./src/routes/adminRoutes');

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

// Enable CORS with specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'https://eafc26-men-prashant-parmar.onrender.com',
  'https://resonant-rugelach-150666.netlify.app',
  process.env.FRONTEND_URL // Add frontend URL from environment
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'EA FC 26 Men API Server',
    status: 'running',
    version: '1.0.0'
  });
});

// API v1 routes
app.get('/api', (req, res) => {
  res.json({ message: 'API v1 - Use /api/v1 endpoints' });
});

// Mount routers
app.use('/api/v1/players', players);
app.use('/api/v1/stats', stats);
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin', admin);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
