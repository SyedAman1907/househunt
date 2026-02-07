const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/approve-owner/:id', authMiddleware, adminController.approveOwner);
router.get('/pending-owners', authMiddleware, adminController.getPendingOwners);
router.get('/users', authMiddleware, adminController.getAllUsers);

router.get('/properties', authMiddleware, adminController.getAllProperties);
router.delete('/properties/:id', authMiddleware, adminController.deleteProperty);

module.exports = router;
