const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Worker = require('../models/Worker');
const { authUser } = require('../middleware/auth');

const router = express.Router();

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private (User only)
router.put('/profile', authUser, [
  body('name').optional().trim(),
  body('phone').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = ['name', 'phone', 'address', 'preferences'];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/save-worker/:workerId
// @desc    Save/unsave a worker to favorites
// @access  Private (User only)
router.post('/save-worker/:workerId', authUser, async (req, res) => {
  try {
    const { workerId } = req.params;

    // Check if worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const user = await User.findById(req.user._id);
    const isAlreadySaved = user.savedWorkers.includes(workerId);

    if (isAlreadySaved) {
      // Remove from saved workers
      user.savedWorkers = user.savedWorkers.filter(
        id => id.toString() !== workerId
      );
      await user.save();
      
      res.json({
        message: 'Worker removed from favorites',
        saved: false
      });
    } else {
      // Add to saved workers
      user.savedWorkers.push(workerId);
      await user.save();
      
      res.json({
        message: 'Worker added to favorites',
        saved: true
      });
    }
  } catch (error) {
    console.error('Save worker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/saved-workers
// @desc    Get user's saved workers
// @access  Private (User only)
router.get('/saved-workers', authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedWorkers',
        select: '-password -documents',
        match: { isActive: true }
      });

    res.json({
      savedWorkers: user.savedWorkers || []
    });
  } catch (error) {
    console.error('Get saved workers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/dashboard/stats
// @desc    Get user dashboard statistics
// @access  Private (User only)
router.get('/dashboard/stats', authUser, async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    
    const userId = req.user._id;
    
    // Get booking statistics
    const totalBookings = await Booking.countDocuments({ user: userId });
    const completedBookings = await Booking.countDocuments({ 
      user: userId, 
      status: 'completed' 
    });
    const pendingBookings = await Booking.countDocuments({ 
      user: userId, 
      status: 'pending' 
    });
    const upcomingBookings = await Booking.countDocuments({ 
      user: userId, 
      status: 'accepted',
      scheduledDate: { $gte: new Date() }
    });
    
    // Get total spent this month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlySpent = await Booking.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'completed',
          completedAt: { $gte: currentMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payment.amount' }
        }
      }
    ]);
    
    // Get favorite services
    const favoriteServices = await Booking.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 3
      }
    ]);

    res.json({
      totalBookings,
      completedBookings,
      pendingBookings,
      upcomingBookings,
      monthlySpent: monthlySpent[0]?.total || 0,
      savedWorkersCount: req.user.savedWorkers?.length || 0,
      favoriteServices: favoriteServices.map(service => ({
        service: service._id,
        count: service.count
      }))
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/booking-history
// @desc    Get user's booking history with filters
// @access  Private (User only)
router.get('/booking-history', authUser, async (req, res) => {
  try {
    const { service, status, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user._id };
    
    if (service) {
      query.service = service;
    }
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('worker', 'name phone services rating avatar')
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
    console.error('Get booking history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;