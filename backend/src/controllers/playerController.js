const Player = require('../models/Player');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Fetch all football player records (with advanced filtering, sorting, pagination)
// @route   GET /api/v1/players
// @access  Public
exports.getPlayers = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'q', 'minovr'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Handle search
  const search = req.query.q || req.query.search;
  let findQuery = { isDeleted: { $ne: true } };

  if (search) {
    findQuery.$or = [
      { Name: { $regex: search, $options: 'i' } },
      { Team: { $regex: search, $options: 'i' } },
      { Nation: { $regex: search, $options: 'i' } },
      { League: { $regex: search, $options: 'i' } }
    ];
  }

  // Handle other filters (mapping lowercase frontend filters to uppercase DB fields)
  if (reqQuery.position) findQuery.Position = reqQuery.position;
  if (reqQuery.team) findQuery.Team = { $regex: reqQuery.team, $options: 'i' };
  if (reqQuery.nation) findQuery.Nation = { $regex: reqQuery.nation, $options: 'i' };
  if (reqQuery.gender) findQuery.GENDER = reqQuery.gender;

  // Handle minovr filter
  if (req.query.minovr) {
    // Since OVR is a string, we use $expr with $toDouble for numeric comparison
    findQuery.$expr = {
      $gte: [{ $toDouble: "$OVR" }, parseFloat(req.query.minovr)]
    };
  }

  // Finding resource
  query = Player.find(findQuery);

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
    // Enable numeric ordering for string fields like OVR and Rank
    query = query.sort('-OVR').collation({ locale: 'en', numericOrdering: true }); 
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const total = await Player.countDocuments(findQuery);

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const players = await query;

  res.status(200).json({
    success: true,
    message: 'Players fetched successfully',
    count: players.length,
    total,
    data: players
  });
});

// @desc    Fetch single player details
// @route   GET /api/v1/players/:id
// @access  Public
exports.getPlayer = asyncHandler(async (req, res, next) => {
  const player = await Player.findById(req.params.id);

  if (!player || player.isDeleted === true) {
    return res.status(404).json({
      success: false,
      message: 'Player not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Player details fetched successfully',
    data: player
  });
});

// @desc    Add a new football player
// @route   POST /api/v1/players
// @access  Private/Admin
exports.createPlayer = asyncHandler(async (req, res, next) => {
  // Map frontend fields to DB fields
  const playerData = {
    Name: req.body.name,
    Rank: req.body.rank,
    OVR: req.body.ovr,
    Position: req.body.position,
    Team: req.body.team,
    Nation: req.body.nation,
    League: req.body.league,
    GENDER: req.body.gender,
    PAC: req.body.pace,
    SHO: req.body.shooting,
    PAS: req.body.passing,
    DRI: req.body.dribbling,
    DEF: req.body.defending,
    PHY: req.body.physical
  };

  const player = await Player.create(playerData);
  res.status(201).json({
    success: true,
    message: 'Player created successfully',
    data: player
  });
});

// @desc    Update player details
// @route   PUT /api/v1/players/:id
// @access  Private/Admin
exports.updatePlayer = asyncHandler(async (req, res, next) => {
  let player = await Player.findById(req.params.id);

  if (!player || player.isDeleted === true) {
    return res.status(404).json({
      success: false,
      message: 'Player not found'
    });
  }

  const updateData = {
    Name: req.body.name,
    Rank: req.body.rank,
    OVR: req.body.ovr,
    Position: req.body.position,
    Team: req.body.team,
    Nation: req.body.nation,
    League: req.body.league,
    GENDER: req.body.gender,
    PAC: req.body.pace,
    SHO: req.body.shooting,
    PAS: req.body.passing,
    DRI: req.body.dribbling,
    DEF: req.body.defending,
    PHY: req.body.physical
  };

  player = await Player.findByIdAndUpdate(req.params.id, updateData, {
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

  if (!player || player.isDeleted === true) {
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
