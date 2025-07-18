const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  services: [{
    type: String,
    enum: ['plumber', 'electrician', 'maid', 'gardener', 'carpenter', 'painter', 'cook', 'driver', 'cleaner', 'mechanic'],
    required: true
  }],
  experience: {
    type: Number,
    required: true,
    min: 0 // years
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  availability: {
    monday: {
      available: { type: Boolean, default: true },
      timeSlots: [{
        start: String, // "09:00"
        end: String    // "17:00"
      }]
    },
    tuesday: {
      available: { type: Boolean, default: true },
      timeSlots: [{
        start: String,
        end: String
      }]
    },
    wednesday: {
      available: { type: Boolean, default: true },
      timeSlots: [{
        start: String,
        end: String
      }]
    },
    thursday: {
      available: { type: Boolean, default: true },
      timeSlots: [{
        start: String,
        end: String
      }]
    },
    friday: {
      available: { type: Boolean, default: true },
      timeSlots: [{
        start: String,
        end: String
      }]
    },
    saturday: {
      available: { type: Boolean, default: true },
      timeSlots: [{
        start: String,
        end: String
      }]
    },
    sunday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        start: String,
        end: String
      }]
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  description: {
    type: String,
    maxlength: 500
  },
  avatar: String,
  documents: {
    idProof: String,
    addressProof: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
workerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
workerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if worker is available on a specific day and time
workerSchema.methods.isAvailableAt = function(day, time) {
  const dayAvailability = this.availability[day.toLowerCase()];
  if (!dayAvailability || !dayAvailability.available) {
    return false;
  }
  
  if (dayAvailability.timeSlots.length === 0) {
    return true; // Available all day
  }
  
  return dayAvailability.timeSlots.some(slot => {
    return time >= slot.start && time <= slot.end;
  });
};

module.exports = mongoose.model('Worker', workerSchema);