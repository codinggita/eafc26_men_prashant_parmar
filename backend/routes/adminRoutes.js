const express = require('express');
const { getAdminStats, getHealth } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/health', getHealth);
router.get('/stats', protect, authorize('admin'), getAdminStats);

module.exports = router;
