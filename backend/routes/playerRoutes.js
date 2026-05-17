const express = require('express');
const {
  getPlayers,
  getPlayer,
  createPlayer
} = require('../controllers/playerController');

const router = express.Router();

router.route('/')
  .get(getPlayers)
  .post(createPlayer);

router.route('/:id')
  .get(getPlayer);

module.exports = router;
