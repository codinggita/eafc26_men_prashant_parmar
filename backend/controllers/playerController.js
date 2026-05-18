const Player = require('../models/Player');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Fetch all football player records (with filtering, sorting, pagination)
// @route   GET /api/v1/players
// @access  Public
exports.getPlayers = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Player.find(JSON.parse(queryStr)).where({ isDeleted: false });

  // Search by keyword
  if (req.query.search) {
    const search = req.query.search;
    query = query.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { team: { $regex: search, $options: 'i' } },
        { league: { $regex: search, $options: 'i' } },
        { nation: { $regex: search, $options: 'i' } }
      ]
    });
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Player.countDocuments({ isDeleted: false });

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const players = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: players.length,
    pagination,
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

// @desc    Update player details (Replace complete record)
// @route   PUT /api/v1/players/:id
// @access  Private/Admin
exports.updatePlayer = asyncHandler(async (req, res, next) => {
  let player = await Player.findById(req.params.id);

  if (!player || player.isDeleted) {
    return res.status(404).json({
      success: false,
      message: 'Player not found'
    });
  }

  player = await Player.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: player
  });
});

// @desc    Update specific player fields
// @route   PATCH /api/v1/players/:id
// @access  Private/Admin
exports.patchPlayer = asyncHandler(async (req, res, next) => {
  let player = await Player.findById(req.params.id);

  if (!player || player.isDeleted) {
    return res.status(404).json({
      success: false,
      message: 'Player not found'
    });
  }

  player = await Player.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: player
  });
});

// @desc    Delete player record (Soft Delete)
// @route   DELETE /api/v1/players/:id
// @access  Private/Admin
exports.deletePlayer = asyncHandler(async (req, res, next) => {
  const player = await Player.findById(req.params.id);

  if (!player || player.isDeleted) {
    return res.status(404).json({
      success: false,
      message: 'Player not found'
    });
  }

  // Soft delete
  player.isDeleted = true;
  await player.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Bulk create players
// @route   POST /api/v1/players/bulk-create
// @access  Private/Admin
exports.bulkCreatePlayers = asyncHandler(async (req, res, next) => {
  const players = await Player.insertMany(req.body);
  res.status(201).json({
    success: true,
    count: players.length,
    data: players
  });
});
