const Player = require('../models/Player');
const asyncHandler = require('../middlewares/asyncHandler');

// --- Player Information Routes ---

// @desc    Fetch players by a specific field
// @route   GET /api/v1/players/:field/:value
// @access  Public
exports.getPlayersByField = asyncHandler(async (req, res, next) => {
  const { field, value } = req.params;
  // Map field to DB field if necessary (e.g., name -> Name)
  const dbField = field.charAt(0).toUpperCase() + field.slice(1);
  const filter = { [dbField]: value, isDeleted: false };
  
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
    .sort('-OVR')
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
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        ovrNum: { $toDouble: { $ifNull: ["$OVR", "0"] } },
        pacNum: { $toDouble: { $ifNull: ["$PAC", "0"] } }
      }
    },
    {
      $group: {
        _id: null,
        totalPlayers: { $sum: 1 },
        averageRating: { $avg: '$ovrNum' },
        highestRating: { $max: '$ovrNum' },
        lowestRating: { $min: '$ovrNum' },
        averagePace: { $avg: '$pacNum' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || { totalPlayers: 0, averageRating: 0, highestRating: 0, lowestRating: 0, averagePace: 0 }
  });
});

// @desc    Get distribution by position
// @route   GET /api/v1/stats/positions
// @access  Public
exports.getPositionDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await Player.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: { $ifNull: ['$Position', { $ifNull: ['$POSITION', 'Unknown'] }] },
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

// @desc    Get top teams by average rating
// @route   GET /api/v1/stats/top-teams
// @access  Public
exports.getTopTeams = asyncHandler(async (req, res, next) => {
  const teams = await Player.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        Team: 1,
        ovrNum: { $toDouble: { $ifNull: ["$OVR", "0"] } }
      }
    },
    {
      $group: {
        _id: { $ifNull: ['$Team', 'Unknown'] },
        avgRating: { $avg: '$ovrNum' },
        playerCount: { $sum: 1 }
      }
    },
    { $sort: { avgRating: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    success: true,
    data: teams
  });
});

// @desc    Compare two football players
// @route   GET /api/v1/stats/compare/:p1/:p2
// @access  Public
exports.comparePlayers = asyncHandler(async (req, res, next) => {
  const player1 = await Player.findById(req.params.p1);
  const player2 = await Player.findById(req.params.p2);

  if (!player1 || !player2 || player1.isDeleted === true || player2.isDeleted === true) {
    return res.status(404).json({ success: false, message: 'One or both players not found' });
  }

  res.status(200).json({
    success: true,
    data: { player1, player2 }
  });
});

// @desc    Get youngest players analytics
// @route   GET /api/v1/stats/analytics/youngest
// @access  Public
exports.getYoungestPlayers = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: { $ne: true } }).sort('Age').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Get oldest players analytics
// @route   GET /api/v1/stats/analytics/oldest
// @access  Public
exports.getOldestPlayers = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: { $ne: true } }).sort('-Age').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Get skill distribution
// @route   GET /api/v1/stats/analytics/skills
// @access  Public
exports.getSkillDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await Player.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: { $ifNull: ['$Skill Moves', 'Unknown'] },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);
  res.status(200).json({ success: true, data: distribution });
});

// @desc    Get foot distribution
// @route   GET /api/v1/stats/analytics/foot
// @access  Public
exports.getFootDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await Player.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: { $ifNull: ['$Preferred Foot', 'Unknown'] },
        count: { $sum: 1 }
      }
    }
  ]);
  res.status(200).json({ success: true, data: distribution });
});

// @desc    Get counts by category (team, league, nation)
// @route   GET /api/v1/stats/:category/count
// @access  Public
exports.getCategoryCounts = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  const allowedCategories = ['team', 'league', 'nation'];

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ success: false, message: 'Invalid category' });
  }

  const dbField = category.charAt(0).toUpperCase() + category.slice(1);

  const counts = await Player.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: `$${dbField}`,
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: counts
  });
});

// @desc    Get nation distribution (top nations)
// @route   GET /api/v1/stats/analytics/nations
// @access  Public
exports.getNationAnalytics = asyncHandler(async (req, res, next) => {
  const nations = await Player.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        Nation: 1,
        ovrNum: { $toDouble: { $ifNull: ["$OVR", "0"] } }
      }
    },
    {
      $group: {
        _id: { $ifNull: ['$Nation', 'Unknown'] },
        avgRating: { $avg: '$ovrNum' },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 15 }
  ]);
  res.status(200).json({ success: true, data: nations });
});

// @desc    Get distribution of playstyles
// @route   GET /api/v1/stats/playstyles
// @access  Public
exports.getPlaystyleDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await Player.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $unwind: '$Playstyles' },
    {
      $group: {
        _id: '$Playstyles',
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
