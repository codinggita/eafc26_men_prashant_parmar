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
  getPlayersByNation,
  checkPlayerExists,
  getPlayerByName,
  getPlayerByRank,
  getPlayersByLeague,
  getPlayersByPosition,
  getPlayersByAge,
  getPlayersByGender,
  getPlayersByPlaystyle,
  getPlayersByFoot,
  getPlayersByAltPosition,
  getTopDribblers,
  getTopPassers,
  getTopDefenders,
  getTopPhysical,
  getRecentPlayers,
  getPlayerPerformance
} = require('../controllers/playerController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(getPlayers)
  .post(protect, authorize('admin'), createPlayer);

router.route('/exists/:id').get(checkPlayerExists);
router.route('/name/:name').get(getPlayerByName);
router.route('/rank/:rank').get(getPlayerByRank);
router.route('/league/:league').get(getPlayersByLeague);
router.route('/position/:position').get(getPlayersByPosition);
router.route('/age/:age').get(getPlayersByAge);
router.route('/gender/:gender').get(getPlayersByGender);
router.route('/nation/:nation').get(getPlayersByNation);
router.route('/team/:team').get(getPlayersByTeam);
router.route('/playstyle/:style').get(getPlayersByPlaystyle);
router.route('/preferred-foot/:foot').get(getPlayersByFoot);
router.route('/alternative-position/:position').get(getPlayersByAltPosition);

router.route('/top-rated').get(getTopRated);
router.route('/top-paced').get(getTopPaced);
router.route('/top-dribblers').get(getTopDribblers);
router.route('/top-passers').get(getTopPassers);
router.route('/top-defenders').get(getTopDefenders);
router.route('/top-physical').get(getTopPhysical);
router.route('/recent').get(getRecentPlayers);
router.route('/performance/:id').get(getPlayerPerformance);


router.route('/bulk-create')
  .post(protect, authorize('admin'), bulkCreatePlayers);

router.route('/:id')
  .get(getPlayer)
  .put(protect, authorize('admin'), updatePlayer)
  .patch(protect, authorize('admin'), patchPlayer)
  .delete(protect, authorize('admin'), deletePlayer);

module.exports = router;
