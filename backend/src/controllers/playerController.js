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
  const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'q'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Handle specialized numeric filters (ovr, pace, shooting, etc)
  const numericFilters = ['ovr', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical', 'age', 'skillMoves', 'weakFoot'];
  
  numericFilters.forEach(filter => {
    if (reqQuery[filter]) {
      // If it's just a number, convert to numeric
      if (!isNaN(reqQuery[filter])) {
        reqQuery[filter] = Number(reqQuery[filter]);
      }
    }
    
    // Handle min/max filters (e.g., minPace=90)
    const minFilter = `min${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
    if (req.query[minFilter]) {
      reqQuery[filter] = { ...reqQuery[filter], $gte: Number(req.query[minFilter]) };
    }
  });

  // Create query string for operators ($gt, $gte, etc)
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Player.find(JSON.parse(queryStr)).where({ isDeleted: false });

  // Search by keyword (q or search param)
  const search = req.query.q || req.query.search;
  if (search) {
    query = query.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { team: { $regex: search, $options: 'i' } },
        { league: { $regex: search, $options: 'i' } },
        { nation: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { playstyles: { $regex: search, $options: 'i' } }
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
    query = query.sort('-ovr'); // Default sort by highest rating
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Player.countDocuments({ isDeleted: false, ...JSON.parse(queryStr) });

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const players = await query;

  // Pagination result
  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json({
    success: true,
    message: 'Players fetched successfully',
    count: players.length,
    total,
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
    message: 'Player details fetched successfully',
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
    message: 'Player created successfully',
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

// @desc    Fetch highest rated players
// @route   GET /api/v1/players/top-rated
// @access  Public
exports.getTopRated = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false })
    .sort('-ovr')
    .limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch fastest players
// @route   GET /api/v1/players/top-paced
// @access  Public
exports.getTopPaced = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false })
    .sort('-pace')
    .limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch players by team
// @route   GET /api/v1/players/team/:team
// @access  Public
exports.getPlayersByTeam = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ team: req.params.team, isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Check whether player exists or not
// @route   GET /api/v1/players/exists/:id
// @access  Public
exports.checkPlayerExists = asyncHandler(async (req, res, next) => {
  const exists = await Player.exists({ _id: req.params.id, isDeleted: false });
  res.status(200).json({ success: true, exists: !!exists });
});

// @desc    Fetch player details using player name
// @route   GET /api/v1/players/name/:name
// @access  Public
exports.getPlayerByName = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ name: { $regex: req.params.name, $options: 'i' }, isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch player using global rank
// @route   GET /api/v1/players/rank/:rank
// @access  Public
exports.getPlayerByRank = asyncHandler(async (req, res, next) => {
  const player = await Player.findOne({ rank: req.params.rank, isDeleted: false });
  if (!player) return res.status(404).json({ success: false, message: 'Player with this rank not found' });
  res.status(200).json({ success: true, data: player });
});

// @desc    Fetch players by league
// @route   GET /api/v1/players/league/:league
// @access  Public
exports.getPlayersByLeague = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ league: { $regex: req.params.league, $options: 'i' }, isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch players using playing position
// @route   GET /api/v1/players/position/:position
// @access  Public
exports.getPlayersByPosition = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ position: req.params.position.toUpperCase(), isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch players using age
// @route   GET /api/v1/players/age/:age
// @access  Public
exports.getPlayersByAge = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ age: req.params.age, isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch players using gender
// @route   GET /api/v1/players/gender/:gender
// @access  Public
exports.getPlayersByGender = asyncHandler(async (req, res, next) => {
  const gender = req.params.gender.charAt(0).toUpperCase() + req.params.gender.slice(1).toLowerCase();
  const players = await Player.find({ gender, isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch players by nation
// @route   GET /api/v1/players/nation/:nation
// @access  Public
exports.getPlayersByNation = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ nation: req.params.nation, isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch players by play style
// @route   GET /api/v1/players/playstyle/:style
// @access  Public
exports.getPlayersByPlaystyle = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ playstyles: { $regex: req.params.style, $options: 'i' }, isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch players by preferred foot
// @route   GET /api/v1/players/preferred-foot/:foot
// @access  Public
exports.getPlayersByFoot = asyncHandler(async (req, res, next) => {
  const foot = req.params.foot.charAt(0).toUpperCase() + req.params.foot.slice(1).toLowerCase();
  const players = await Player.find({ preferredFoot: foot, isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch players by alternative positions
// @route   GET /api/v1/players/alternative-position/:position
// @access  Public
exports.getPlayersByAltPosition = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ alternativePositions: req.params.position.toUpperCase(), isDeleted: false });
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch recently added player records
// @route   GET /api/v1/players/recent
// @access  Public
exports.getRecentPlayers = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false }).sort('-createdAt').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch trending football players (most popular/recent high rated)
// @route   GET /api/v1/players/trending
// @access  Public
exports.getTrendingPlayers = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false, ovr: { $gte: 85 } }).sort('-createdAt').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch highest rated young players
// @route   GET /api/v1/players/top-youngsters
// @access  Public
exports.getTopYoungsters = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false, age: { $lte: 23 } }).sort('-ovr').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Generate best possible dream team (Top rated per position)
// @route   GET /api/v1/players/dream-team
// @access  Public
exports.getDreamTeam = asyncHandler(async (req, res, next) => {
  const positions = ['GK', 'LB', 'CB', 'RB', 'LM', 'CM', 'RM', 'LW', 'ST', 'RW'];
  const dreamTeam = await Promise.all(positions.map(async pos => {
    return await Player.findOne({ position: pos, isDeleted: false }).sort('-ovr');
  }));

  res.status(200).json({
    success: true,
    data: dreamTeam.filter(p => p !== null)
  });
});

// @desc    Fetch best dribbling players
// @route   GET /api/v1/players/top-dribblers
// @access  Public
exports.getTopDribblers = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false }).sort('-dribbling').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch best passing players
// @route   GET /api/v1/players/top-passers
// @access  Public
exports.getTopPassers = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false }).sort('-passing').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch best defenders
// @route   GET /api/v1/players/top-defenders
// @access  Public
exports.getTopDefenders = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false }).sort('-defending').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch strongest physical players
// @route   GET /api/v1/players/top-physical
// @access  Public
exports.getTopPhysical = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false }).sort('-physical').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Bulk update players
// @route   PATCH /api/v1/players/bulk-update
// @access  Private/Admin
exports.bulkUpdatePlayers = asyncHandler(async (req, res, next) => {
  const { ids, data } = req.body;
  const players = await Player.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    { $set: data },
    { runValidators: true }
  );
  res.status(200).json({ success: true, count: players.modifiedCount });
});

// @desc    Bulk delete players (Soft Delete)
// @route   DELETE /api/v1/players/bulk-delete
// @access  Private/Admin
exports.bulkDeletePlayers = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;
  await Player.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } }
  );
  res.status(200).json({ success: true, message: 'Players deleted successfully' });
});

// @desc    Fetch best finishing players
// @route   GET /api/v1/players/top-finishers
// @access  Public
exports.getTopFinishers = asyncHandler(async (req, res, next) => {
  const players = await Player.find({ isDeleted: false }).sort('-shooting').limit(10);
  res.status(200).json({ success: true, count: players.length, data: players });
});

// @desc    Fetch random football player record
// @route   GET /api/v1/players/random
// @access  Public
exports.getRandomPlayer = asyncHandler(async (req, res, next) => {
  const count = await Player.countDocuments({ isDeleted: false });
  const random = Math.floor(Math.random() * count);
  const player = await Player.findOne({ isDeleted: false }).skip(random);
  res.status(200).json({ success: true, data: player });
});

// @desc    Fetch player performance analytics
// @route   GET /api/v1/players/performance/:id
// @access  Public
exports.getPlayerPerformance = asyncHandler(async (req, res, next) => {
  const player = await Player.findById(req.params.id);

  if (!player || player.isDeleted) {
    return res.status(404).json({ success: false, message: 'Player not found' });
  }

  // Calculate some basic performance metrics for demonstration
  const performance = {
    attackingScore: (player.shooting + player.pace + player.dribbling) / 3,
    defendingScore: (player.defending + player.physical) / 2,
    playmakingScore: (player.passing + player.dribbling) / 2
  };

  res.status(200).json({
    success: true,
    data: {
      player: { name: player.name, ovr: player.ovr },
      performance
    }
  });
});

