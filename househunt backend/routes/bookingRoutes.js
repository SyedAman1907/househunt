const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);
router.get('/owner-bookings', authMiddleware, bookingController.getOwnerBookings);
router.put('/:id', authMiddleware, bookingController.updateBookingStatus);

module.exports = router;
