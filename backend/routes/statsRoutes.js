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

const router = express.Router();

router.get('/players', getPlayerStats);
router.get('/positions', getPositionDistribution);
router.get('/top-teams', getTopTeams);
router.get('/playstyles', getPlaystyleDistribution);
router.get('/compare/:p1/:p2', comparePlayers);
router.get('/analytics/youngest', getYoungestPlayers);
router.get('/analytics/oldest', getOldestPlayers);
router.get('/analytics/skills', getSkillDistribution);
router.get('/analytics/foot', getFootDistribution);
router.get('/analytics/nations', getNationAnalytics);
router.get('/:category/count', getCategoryCounts);


module.exports = router;
