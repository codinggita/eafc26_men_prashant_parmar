const Player = require('../models/Player');
const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Admin analytics dashboard (summary stats)
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  const totalPlayers = await Player.countDocuments({ isDeleted: false });
  const totalUsers = await User.countDocuments();
  const deletedPlayers = await Player.countDocuments({ isDeleted: true });
  
  const latestPlayers = await Player.find({ isDeleted: false })
    .sort('-createdAt')
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      totalPlayers,
      totalUsers,
      deletedPlayers,
      latestPlayers
    }
  });
});

// @desc    Check API health status
// @route   GET /api/v1/admin/health
// @access  Public
exports.getHealth = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
