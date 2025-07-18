const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth, authUser, authWorker } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (User only)
router.post('/', authUser, [
  body('workerId').notEmpty().withMessage('Worker ID is required'),
  body('service').notEmpty().withMessage('Service is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('scheduledTime.start').notEmpty().withMessage('Start time is required'),
  body('scheduledTime.end').notEmpty().withMessage('End time is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('address').notEmpty().withMessage('Address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      workerId,
      service,
      scheduledDate,
      scheduledTime,
      duration,
      description,
      address
    } = req.body;

    // Check if worker exists and provides the service
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (!worker.services.includes(service)) {
      return res.status(400).json({ message: 'Worker does not provide this service' });
    }

    // Check if worker is available at the scheduled time
    const dayOfWeek = new Date(scheduledDate).toLocaleDateString('en', { weekday: 'lowercase' });
    const dayAvailability = worker.availability[dayOfWeek];
    
    if (!dayAvailability || !dayAvailability.available) {
      return res.status(400).json({ message: 'Worker is not available on this day' });
    }

    // Check if there's a conflicting booking
    const conflictingBooking = await Booking.findOne({
      worker: workerId,
      scheduledDate: new Date(scheduledDate),
      status: { $in: ['pending', 'accepted', 'in-progress'] },
      $or: [
        {
          'scheduledTime.start': { $lt: scheduledTime.end },
          'scheduledTime.end': { $gt: scheduledTime.start }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Worker is already booked during this time' });
    }

    // Calculate payment amount
    const amount = worker.hourlyRate * duration;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      worker: workerId,
      service,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      duration,
      description,
      address,
      payment: {
        amount
      }
    });

    await booking.save();

    // Populate booking with user and worker details
    await booking.populate([
      { path: 'user', select: 'name phone email' },
      { path: 'worker', select: 'name phone services rating' }
    ]);

    // Send notification to worker
    const io = req.app.get('io');
    await Notification.createAndSend({
      recipient: workerId,
      recipientType: 'Worker',
      type: 'booking_request',
      title: 'New Booking Request',
      message: `You have a new booking request for ${service} on ${new Date(scheduledDate).toLocaleDateString()}`,
      data: {
        bookingId: booking._id,
        userId: req.user._id,
        service,
        amount
      }
    }, io);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get user/worker bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (req.userType === 'user') {
      query.user = req.user._id;
    } else {
      query.worker = req.user._id;
    }
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name phone email')
      .populate('worker', 'name phone services rating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name phone email address')
      .populate('worker', 'name phone services rating address');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    const hasAccess = (req.userType === 'user' && booking.user._id.toString() === req.user._id.toString()) ||
                     (req.userType === 'worker' && booking.worker._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/accept
// @desc    Worker accepts a booking
// @access  Private (Worker only)
router.put('/:id/accept', authWorker, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking cannot be accepted' });
    }

    booking.status = 'accepted';
    await booking.save();

    await booking.populate([
      { path: 'user', select: 'name phone' },
      { path: 'worker', select: 'name phone' }
    ]);

    // Send notification to user
    const io = req.app.get('io');
    await Notification.createAndSend({
      recipient: booking.user._id,
      recipientType: 'User',
      type: 'booking_accepted',
      title: 'Booking Accepted',
      message: `${booking.worker.name} has accepted your booking for ${booking.service}`,
      data: {
        bookingId: booking._id,
        workerId: booking.worker._id
      }
    }, io);

    res.json({
      message: 'Booking accepted successfully',
      booking
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/reject
// @desc    Worker rejects a booking
// @access  Private (Worker only)
router.put('/:id/reject', authWorker, [
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking cannot be rejected' });
    }

    booking.status = 'rejected';
    if (req.body.reason) {
      booking.cancellation = {
        cancelledBy: 'worker',
        reason: req.body.reason,
        cancelledAt: new Date()
      };
    }
    await booking.save();

    await booking.populate([
      { path: 'user', select: 'name phone' },
      { path: 'worker', select: 'name phone' }
    ]);

    // Send notification to user
    const io = req.app.get('io');
    await Notification.createAndSend({
      recipient: booking.user._id,
      recipientType: 'User',
      type: 'booking_rejected',
      title: 'Booking Rejected',
      message: `${booking.worker.name} has rejected your booking for ${booking.service}`,
      data: {
        bookingId: booking._id,
        workerId: booking.worker._id
      }
    }, io);

    res.json({
      message: 'Booking rejected successfully',
      booking
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/complete
// @desc    Mark booking as completed
// @access  Private (Worker only)
router.put('/:id/complete', authWorker, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!['accepted', 'in-progress'].includes(booking.status)) {
      return res.status(400).json({ message: 'Booking cannot be completed' });
    }

    booking.status = 'completed';
    booking.completedAt = new Date();
    booking.payment.status = 'paid'; // Mark as paid for cash payments
    await booking.save();

    // Update worker statistics
    await Worker.findByIdAndUpdate(booking.worker, {
      $inc: {
        completedJobs: 1,
        totalEarnings: booking.payment.amount
      }
    });

    await booking.populate([
      { path: 'user', select: 'name phone' },
      { path: 'worker', select: 'name phone' }
    ]);

    // Send notification to user
    const io = req.app.get('io');
    await Notification.createAndSend({
      recipient: booking.user._id,
      recipientType: 'User',
      type: 'booking_completed',
      title: 'Booking Completed',
      message: `Your booking for ${booking.service} has been completed by ${booking.worker.name}`,
      data: {
        bookingId: booking._id,
        workerId: booking.worker._id,
        amount: booking.payment.amount
      }
    }, io);

    res.json({
      message: 'Booking completed successfully',
      booking
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', auth, [
  body('reason').notEmpty().withMessage('Cancellation reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to cancel this booking
    const hasAccess = (req.userType === 'user' && booking.user.toString() === req.user._id.toString()) ||
                     (req.userType === 'worker' && booking.worker.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({ message: 'Booking cannot be cancelled at this time' });
    }

    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy: req.userType,
      reason: req.body.reason,
      cancelledAt: new Date()
    };
    await booking.save();

    await booking.populate([
      { path: 'user', select: 'name phone' },
      { path: 'worker', select: 'name phone' }
    ]);

    // Send notification to the other party
    const recipientId = req.userType === 'user' ? booking.worker._id : booking.user._id;
    const recipientType = req.userType === 'user' ? 'Worker' : 'User';
    const canceller = req.userType === 'user' ? booking.user.name : booking.worker.name;

    const io = req.app.get('io');
    await Notification.createAndSend({
      recipient: recipientId,
      recipientType,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.service} has been cancelled by ${canceller}`,
      data: {
        bookingId: booking._id,
        reason: req.body.reason
      }
    }, io);

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings/:id/rate
// @desc    Rate a completed booking
// @access  Private
router.post('/:id/rate', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed bookings' });
    }

    const { rating, review } = req.body;

    if (req.userType === 'user') {
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (booking.rating.userRating.rating) {
        return res.status(400).json({ message: 'You have already rated this booking' });
      }

      booking.rating.userRating = {
        rating,
        review,
        createdAt: new Date()
      };

      // Update worker's overall rating
      const worker = await Worker.findById(booking.worker);
      const newCount = worker.rating.count + 1;
      const newAverage = ((worker.rating.average * worker.rating.count) + rating) / newCount;
      
      worker.rating.average = newAverage;
      worker.rating.count = newCount;
      await worker.save();

    } else {
      if (booking.worker.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (booking.rating.workerRating.rating) {
        return res.status(400).json({ message: 'You have already rated this booking' });
      }

      booking.rating.workerRating = {
        rating,
        review,
        createdAt: new Date()
      };
    }

    await booking.save();

    res.json({
      message: 'Rating submitted successfully',
      rating: req.userType === 'user' ? booking.rating.userRating : booking.rating.workerRating
    });
  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;