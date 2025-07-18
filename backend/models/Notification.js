const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientType'
  },
  recipientType: {
    type: String,
    required: true,
    enum: ['User', 'Worker']
  },
  type: {
    type: String,
    required: true,
    enum: [
      'booking_request',
      'booking_accepted',
      'booking_rejected',
      'booking_cancelled',
      'booking_completed',
      'payment_received',
      'rating_received',
      'profile_verified',
      'reminder'
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker'
    },
    amount: Number,
    rating: Number
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

// Static method to create and send notification
notificationSchema.statics.createAndSend = async function(notificationData, io) {
  try {
    const notification = await this.create(notificationData);
    
    // Send real-time notification via Socket.IO
    if (io) {
      io.to(notificationData.recipient.toString()).emit('new_notification', {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        createdAt: notification.createdAt
      });
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

module.exports = mongoose.model('Notification', notificationSchema);