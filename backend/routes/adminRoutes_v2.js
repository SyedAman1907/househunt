const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController_v2');
const authMiddleware = require('../middleware/authMiddleware');

// Owner Management
router.get('/pending-owners', authMiddleware, adminController.getPendingOwners);
router.put('/approve-owner/:id', authMiddleware, adminController.approveOwner);

// User Management
router.get('/users', authMiddleware, adminController.getAllUsers);
router.delete('/users/:id', authMiddleware, adminController.deleteUser);

// Property Management
router.get('/properties', authMiddleware, adminController.getAllProperties);
router.get('/pending-properties', authMiddleware, adminController.getPendingProperties);
router.put('/approve-property/:id', authMiddleware, adminController.approveProperty);
router.delete('/properties/:id', authMiddleware, adminController.deleteProperty);

// Sub-admin Management
router.post('/create-subadmin', authMiddleware, adminController.createSubadmin);

// Activity Logs
router.get('/activity-logs', authMiddleware, adminController.getActivityLogs);

module.exports = router;
