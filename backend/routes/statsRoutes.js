const express = require('express');
const {
  getPlayerStats,
  getPositionDistribution,
  getTopTeams,
  getPlaystyleDistribution
} = require('../controllers/statsController');

const router = express.Router();

router.get('/players', getPlayerStats);
router.get('/positions', getPositionDistribution);
router.get('/top-teams', getTopTeams);
router.get('/playstyles', getPlaystyleDistribution);


module.exports = router;
