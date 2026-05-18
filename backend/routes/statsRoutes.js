const express = require('express');
const {
  getPlayerStats,
  getPositionDistribution
} = require('../controllers/statsController');

const router = express.Router();

router.get('/players', getPlayerStats);
router.get('/positions', getPositionDistribution);

module.exports = router;
