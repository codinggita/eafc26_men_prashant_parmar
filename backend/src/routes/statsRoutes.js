const express = require('express');
const {
  getPlayerStats,
  getPositionDistribution,
  getTopTeams,
  getPlaystyleDistribution,
  comparePlayers,
  getYoungestPlayers,
  getOldestPlayers,
  getSkillDistribution,
  getFootDistribution,
  getNationAnalytics,
  getCategoryCounts
} = require('../controllers/statsController');

const {
  getTopRated,
  getTopFinishers,
  getTopPassers,
  getTopDribblers,
  getTopDefenders,
  getTopPhysical
} = require('../controllers/playerController');

const router = express.Router();

router.get('/players', getPlayerStats);
router.get('/players/count', getPlayerStats);
router.get('/players/average-rating', getPlayerStats);
router.get('/positions', getPositionDistribution);
router.get('/top-teams', getTopTeams);
router.get('/playstyles', getPlaystyleDistribution);
router.get('/compare/:p1/:p2', comparePlayers);

// Analytics aliases
router.get('/analytics/players/top-rated', getTopRated);
router.get('/analytics/players/youngest', getYoungestPlayers);
router.get('/analytics/players/oldest', getOldestPlayers);
router.get('/analytics/players/top-scorers', getTopFinishers);
router.get('/analytics/players/top-assisters', getTopPassers);
router.get('/analytics/players/top-dribblers', getTopDribblers);
router.get('/analytics/players/top-defenders', getTopDefenders);
router.get('/analytics/players/top-physical', getTopPhysical);

router.get('/analytics/skills', getSkillDistribution);
router.get('/analytics/foot', getFootDistribution);
router.get('/analytics/nations', getNationAnalytics);
router.get('/:category/count', getCategoryCounts);


module.exports = router;
