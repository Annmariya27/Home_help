const express = require('express');
const { body, validationResult } = require('express-validator');
const Worker = require('../models/Worker');
const { auth, authWorker } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/workers
// @desc    Search workers by service, location, etc.
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      service, 
      city, 
      sortBy = 'rating', 
      page = 1, 
      limit = 10,
      minRating,
      maxRate,
      search 
    } = req.query;
    
    let query = { isActive: true };
    
    // Filter by service
    if (service && service !== '') {
      query.services = { $in: [service] };
    }
    
    // Filter by city (case-insensitive)
    if (city && city !== '') {
      query['address.city'] = new RegExp(city, 'i');
    }
    
    // Filter by minimum rating
    if (minRating && minRating !== '') {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }
    
    // Filter by maximum hourly rate
    if (maxRate && maxRate !== '') {
      query.hourlyRate = { $lte: parseFloat(maxRate) };
    }
    
    // Search by name, description, or services
    if (search && search !== '') {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { services: { $in: [searchRegex] } },
        { 'address.city': searchRegex },
        { 'address.state': searchRegex }
      ];
    }
    
    // Sorting options
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'experience':
        sortOptions = { experience: -1 };
        break;
      case 'rate_low':
        sortOptions = { hourlyRate: 1 };
        break;
      case 'rate_high':
        sortOptions = { hourlyRate: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { 'rating.average': -1, createdAt: -1 };
    }
    
    // Execute query with pagination
    const workers = await Worker.find(query)
      .select('-password -documents')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    // Get total count for pagination
    const total = await Worker.countDocuments(query);
    
    // Add some additional computed fields
    const workersWithDetails = workers.map(worker => {
      const workerObj = worker.toObject();
      
      // Calculate availability status
      const now = new Date();
      const dayOfWeek = now.toLocaleDateString('en', { weekday: 'lowercase' });
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      
      const todayAvailability = workerObj.availability[dayOfWeek];
      let isAvailableNow = false;
      
      if (todayAvailability && todayAvailability.available) {
        if (todayAvailability.timeSlots.length === 0) {
          isAvailableNow = true; // Available all day
        } else {
          isAvailableNow = todayAvailability.timeSlots.some(slot => {
            return currentTime >= slot.start && currentTime <= slot.end;
          });
        }
      }
      
      workerObj.isAvailableNow = isAvailableNow;
      
      return workerObj;
    });
    
    res.json({
      workers: workersWithDetails,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
      hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1
    });
  } catch (error) {
    console.error('Search workers error:', error);
    res.status(500).json({ message: 'Server error while searching workers' });
  }
});

// @route   GET /api/workers/:id
// @desc    Get worker profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .select('-password -documents');
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    
    // Add availability status for today
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayAvailability = worker.availability[dayOfWeek];
    let isAvailableNow = false;
    
    if (todayAvailability && todayAvailability.available) {
      if (todayAvailability.timeSlots.length === 0) {
        isAvailableNow = true;
      } else {
        isAvailableNow = todayAvailability.timeSlots.some(slot => {
          return currentTime >= slot.start && currentTime <= slot.end;
        });
      }
    }
    
    const workerObj = worker.toObject();
    workerObj.isAvailableNow = isAvailableNow;
    
    res.json(workerObj);
  } catch (error) {
    console.error('Get worker error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid worker ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/workers/profile
// @desc    Update worker profile
// @access  Private (Worker only)
router.put('/profile', authWorker, [
  body('name').optional().trim(),
  body('phone').optional().trim(),
  body('services').optional().isArray(),
  body('experience').optional().isNumeric(),
  body('hourlyRate').optional().isNumeric(),
  body('description').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = [
      'name', 'phone', 'services', 'experience', 
      'hourlyRate', 'description', 'address'
    ];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const worker = await Worker.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -documents');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      worker
    });
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/workers/availability
// @desc    Update worker availability
// @access  Private (Worker only)
router.put('/availability', authWorker, async (req, res) => {
  try {
    const { availability } = req.body;
    
    if (!availability) {
      return res.status(400).json({ message: 'Availability data is required' });
    }

    const worker = await Worker.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true, runValidators: true }
    ).select('-password -documents');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json({
      message: 'Availability updated successfully',
      availability: worker.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/workers/availability/:id
// @desc    Get worker availability
// @access  Public
router.get('/availability/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .select('availability name services');
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    
    res.json({
      workerId: worker._id,
      name: worker.name,
      services: worker.services,
      availability: worker.availability
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/workers/available/:service
// @desc    Get available workers for a specific service and time
// @access  Public
router.get('/available/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const { date, time, city } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required' });
    }
    
    const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'lowercase' });
    
    let query = {
      isActive: true,
      services: { $in: [service] },
      [`availability.${dayOfWeek}.available`]: true
    };
    
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    
    const workers = await Worker.find(query)
      .select('-password -documents');
    
    // Filter workers who are available at the specific time
    const availableWorkers = workers.filter(worker => {
      const dayAvailability = worker.availability[dayOfWeek];
      if (dayAvailability.timeSlots.length === 0) {
        return true; // Available all day
      }
      
      return dayAvailability.timeSlots.some(slot => {
        return time >= slot.start && time <= slot.end;
      });
    });
    
    res.json({
      service,
      date,
      time,
      workers: availableWorkers,
      count: availableWorkers.length
    });
  } catch (error) {
    console.error('Get available workers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/workers/dashboard/stats
// @desc    Get worker dashboard statistics
// @access  Private (Worker only)
router.get('/dashboard/stats', authWorker, async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    
    const workerId = req.user._id;
    
    // Get booking statistics
    const totalBookings = await Booking.countDocuments({ worker: workerId });
    const completedBookings = await Booking.countDocuments({ 
      worker: workerId, 
      status: 'completed' 
    });
    const pendingBookings = await Booking.countDocuments({ 
      worker: workerId, 
      status: 'pending' 
    });
    
    // Get earnings this month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlyEarnings = await Booking.aggregate([
      {
        $match: {
          worker: req.user._id,
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
    
    res.json({
      totalBookings,
      completedBookings,
      pendingBookings,
      monthlyEarnings: monthlyEarnings[0]?.total || 0,
      totalEarnings: req.user.totalEarnings,
      rating: req.user.rating,
      isVerified: req.user.isVerified
    });
  } catch (error) {
    console.error('Get worker stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;