const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Worker = require('../models/Worker');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's a user or worker
    let user = null;
    if (decoded.type === 'user') {
      user = await User.findById(decoded.id).select('-password');
    } else if (decoded.type === 'worker') {
      user = await Worker.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    req.user = user;
    req.userType = decoded.type;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is a specific type
const authUser = async (req, res, next) => {
  await auth(req, res, () => {
    if (req.userType !== 'user') {
      return res.status(403).json({ message: 'Access denied. Users only.' });
    }
    next();
  });
};

const authWorker = async (req, res, next) => {
  await auth(req, res, () => {
    if (req.userType !== 'worker') {
      return res.status(403).json({ message: 'Access denied. Workers only.' });
    }
    next();
  });
};

module.exports = { auth, authUser, authWorker };