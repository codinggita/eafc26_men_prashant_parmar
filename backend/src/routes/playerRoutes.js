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
  getTrendingPlayers,
  getTopYoungsters,
  getDreamTeam,
  getPlayerPerformance,
  bulkUpdatePlayers,
  bulkDeletePlayers,
  getTopFinishers,
  getRandomPlayer
} = require('../controllers/playerController');

const { comparePlayers } = require('../controllers/statsController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

// HEAD and OPTIONS support for the main players collection
router.route('/')
  .get(getPlayers)
  .post(protect, authorize('admin'), createPlayer)
  .head((req, res) => res.status(200).end())
  .options((req, res) => {
    res.setHeader('Allow', 'GET, POST, HEAD, OPTIONS');
    res.status(200).end();
  });

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
router.route('/top-finishers').get(getTopFinishers);
router.route('/top-youngsters').get(getTopYoungsters);
router.route('/recent').get(getRecentPlayers);
router.route('/trending').get(getTrendingPlayers);
router.route('/random').get(getRandomPlayer);
router.route('/dream-team').get(getDreamTeam);
router.route('/performance/:id').get(getPlayerPerformance);
router.route('/stats/:id').get(getPlayerPerformance); // Alias for stats

router.route('/skill-moves/:value').get((req, res, next) => {
  req.query.skillMoves = req.params.value;
  getPlayers(req, res, next);
});

router.route('/weak-foot/:value').get((req, res, next) => {
  req.query.weakFoot = req.params.value;
  getPlayers(req, res, next);
});

router.route('/compare/:p1/:p2').get(comparePlayers);

router.route('/bulk-create')
  .post(protect, authorize('admin'), bulkCreatePlayers);

router.route('/bulk-update')
  .patch(protect, authorize('admin'), bulkUpdatePlayers);

router.route('/bulk-delete')
  .delete(protect, authorize('admin'), bulkDeletePlayers);

// HEAD and OPTIONS for single player resource
router.route('/:id')
  .get(getPlayer)
  .put(protect, authorize('admin'), updatePlayer)
  .patch(protect, authorize('admin'), patchPlayer)
  .delete(protect, authorize('admin'), deletePlayer)
  .head((req, res) => res.status(200).end())
  .options((req, res) => {
    res.setHeader('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.status(200).end();
  });

module.exports = router;
