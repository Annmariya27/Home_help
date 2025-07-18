const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Worker = require('../models/Worker');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register/user
// @desc    Register a new user
// @access  Public
router.post('/register/user', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if worker exists with same email
    let existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return res.status(400).json({ message: 'Worker already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      address
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, 'user');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: 'user'
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register/worker
// @desc    Register a new worker
// @access  Public
router.post('/register/worker', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('services').isArray({ min: 1 }).withMessage('At least one service is required'),
  body('experience').isNumeric().withMessage('Experience must be a number'),
  body('hourlyRate').isNumeric().withMessage('Hourly rate must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, services, experience, hourlyRate, address, description } = req.body;

    // Check if worker already exists
    let existingWorker = await Worker.findOne({ email });
    if (existingWorker) {
      return res.status(400).json({ message: 'Worker already exists with this email' });
    }

    // Check if user exists with same email
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new worker with default availability
    const defaultAvailability = {
      monday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      tuesday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      wednesday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      thursday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      friday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      saturday: { available: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
      sunday: { available: false, timeSlots: [] }
    };

    const worker = new Worker({
      name,
      email,
      password,
      phone,
      services,
      experience,
      hourlyRate,
      address,
      description,
      availability: defaultAvailability
    });

    await worker.save();

    // Generate token
    const token = generateToken(worker._id, 'worker');

    res.status(201).json({
      message: 'Worker registered successfully',
      token,
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        services: worker.services,
        type: 'worker'
      }
    });
  } catch (error) {
    console.error('Worker registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user or worker
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check for user first
    let user = await User.findOne({ email });
    let userType = 'user';

    // If not found as user, check as worker
    if (!user) {
      user = await Worker.findOne({ email });
      userType = 'worker';
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, userType);

    const responseData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      type: userType
    };

    if (userType === 'worker') {
      responseData.services = user.services;
      responseData.isVerified = user.isVerified;
    }

    res.json({
      message: 'Login successful',
      token,
      user: responseData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user/worker profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      type: req.userType,
      address: req.user.address,
      createdAt: req.user.createdAt
    };

    if (req.userType === 'worker') {
      userData.services = req.user.services;
      userData.experience = req.user.experience;
      userData.hourlyRate = req.user.hourlyRate;
      userData.rating = req.user.rating;
      userData.isVerified = req.user.isVerified;
      userData.availability = req.user.availability;
      userData.description = req.user.description;
      userData.completedJobs = req.user.completedJobs;
      userData.totalEarnings = req.user.totalEarnings;
    } else {
      userData.preferences = req.user.preferences;
      userData.savedWorkers = req.user.savedWorkers;
    }

    res.json(userData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;