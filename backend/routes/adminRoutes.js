const express = require('express');
const { 
  getAdminStats, 
  getHealth, 
  getUsers, 
  getUser, 
  createUser,
  updateUser, 
  deleteUser 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/health', getHealth);

// All routes below are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
