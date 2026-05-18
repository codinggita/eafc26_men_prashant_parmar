const Player = require('../models/Player');
const asyncHandler = require('../middlewares/asyncHandler');

// --- Player Information Routes ---

// @desc    Fetch players by a specific field
// @route   GET /api/v1/players/:field/:value
// @access  Public
exports.getPlayersByField = asyncHandler(async (req, res, next) => {
  const { field, value } = req.params;
  const filter = { [field]: value, isDeleted: false };
  
  const players = await Player.find(filter);

  res.status(200).json({
    success: true,
    count: players.length,
    data: players
  });
});

// @desc    Fetch top rated players
// @route   GET /api/v1/players/top-rated
// @access  Public
exports.getTopRated = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false })
    .sort('-ovr')
    .limit(10);

  res.status(200).json({
    success: true,
    data: players
  });
});

// --- Analytics Routes (Aggregation) ---

// @desc    Get player statistics (count, avg rating, etc.)
// @route   GET /api/v1/stats/players
// @access  Public
exports.getPlayerStats = asyncHandler(async (req, res, next) => {
  const stats = await Player.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalPlayers: { $sum: 1 },
        averageRating: { $avg: '$ovr' },
        highestRating: { $max: '$ovr' },
        lowestRating: { $min: '$ovr' },
        averagePace: { $avg: '$pace' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats[0]
  });
});

// @desc    Get distribution by position
// @route   GET /api/v1/stats/positions
// @access  Public
exports.getPositionDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await Player.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$position',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: distribution
  });
});
