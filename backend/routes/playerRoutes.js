const express = require('express');
const {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  patchPlayer,
  deletePlayer,
  bulkCreatePlayers,
  getTopRated,
  getTopPaced,
  getPlayersByTeam,
  getPlayersByNation
} = require('../controllers/playerController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(getPlayers)
  .post(protect, authorize('admin'), createPlayer);

router.route('/top-rated').get(getTopRated);
router.route('/top-paced').get(getTopPaced);
router.route('/team/:team').get(getPlayersByTeam);
router.route('/nation/:nation').get(getPlayersByNation);


router.route('/bulk-create')
  .post(protect, authorize('admin'), bulkCreatePlayers);

router.route('/:id')
  .get(getPlayer)
  .put(protect, authorize('admin'), updatePlayer)
  .patch(protect, authorize('admin'), patchPlayer)
  .delete(protect, authorize('admin'), deletePlayer);

module.exports = router;
