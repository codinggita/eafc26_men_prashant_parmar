const express = require('express');
const {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  patchPlayer,
  deletePlayer,
  bulkCreatePlayers
} = require('../controllers/playerController');

const router = express.Router();

router.route('/')
  .get(getPlayers)
  .post(createPlayer);

router.route('/bulk-create')
  .post(bulkCreatePlayers);

router.route('/:id')
  .get(getPlayer)
  .put(updatePlayer)
  .patch(patchPlayer)
  .delete(deletePlayer);

module.exports = router;
