const express = require('express');
const {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/playerController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

// Main routes
router.route('/')
  .get(getPlayers)
  .post(protect, authorize('admin'), createPlayer);

router.route('/:id')
  .get(getPlayer)
  .put(protect, authorize('admin'), updatePlayer)
  .delete(protect, authorize('admin'), deletePlayer);

module.exports = router;
