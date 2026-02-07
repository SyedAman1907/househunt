const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true,
    enum: [
      'USER_REGISTERED',
      'OWNER_APPROVED',
      'OWNER_REJECTED',
      'PROPERTY_CREATED',
      'PROPERTY_APPROVED',
      'PROPERTY_REJECTED',
      'PROPERTY_DELETED',
      'USER_DELETED',
      'SUBADMIN_CREATED'
    ]
  },
  performedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  targetType: { 
    type: String, 
    enum: ['User', 'Property'],
    required: true 
  },
  targetId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  details: { 
    type: String 
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

// Index for efficient querying
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ performedBy: 1 });
activityLogSchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
