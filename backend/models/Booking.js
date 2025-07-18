const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  service: {
    type: String,
    enum: ['plumber', 'electrician', 'maid', 'gardener', 'carpenter', 'painter', 'cook', 'driver', 'cleaner', 'mechanic'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    start: {
      type: String,
      required: true // "09:00"
    },
    end: {
      type: String,
      required: true // "12:00"
    }
  },
  duration: {
    type: Number,
    required: true // hours
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
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
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      enum: ['cash', 'online', 'upi'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
  rating: {
    userRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      createdAt: Date
    },
    workerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      createdAt: Date
    }
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['user', 'worker']
    },
    reason: String,
    cancelledAt: Date
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const scheduledDateTime = new Date(this.scheduledDate);
  const timeDifference = scheduledDateTime - now;
  
  // Can cancel if more than 2 hours before scheduled time
  return timeDifference > (2 * 60 * 60 * 1000) && 
         ['pending', 'accepted'].includes(this.status);
};

// Method to calculate total amount including any fees
bookingSchema.methods.calculateTotalAmount = function() {
  const baseAmount = this.payment.amount;
  const serviceFee = baseAmount * 0.05; // 5% service fee
  return baseAmount + serviceFee;
};

module.exports = mongoose.model('Booking', bookingSchema);