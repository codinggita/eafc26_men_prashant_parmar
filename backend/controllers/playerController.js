const Player = require('../models/Player');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Fetch all football player records
// @route   GET /api/v1/players
// @access  Public
exports.getPlayers = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false });
  res.status(200).json({
    success: true,
    count: players.length,
    data: players
  });
});

// @desc    Fetch single player details
// @route   GET /api/v1/players/:id
// @access  Public
exports.getPlayer = asyncHandler(async (req, res, next) => {
  const player = await Player.findById(req.params.id);

  if (!player || player.isDeleted) {
    return res.status(404).json({
      success: false,
      message: 'Player not found'
    });
  }

  res.status(200).json({
    success: true,
    data: player
  });
});

// @desc    Add a new football player
// @route   POST /api/v1/players
// @access  Private/Admin
exports.createPlayer = asyncHandler(async (req, res, next) => {
  const player = await Player.create(req.body);
  res.status(201).json({
    success: true,
    data: player
  });
});
