const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  deadlineDate: {
    type: Date,
    required: true
  },
  deadlineType: {
    type: String,
    required: true,
    enum: ['Court Filing', 'Contract Expiry', 'Compliance Deadline', 'Response Required', 'Hearing', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    required: true,
    enum: ['Upcoming', 'Due Soon', 'Overdue', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    default: null
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  assignedTo: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  reminderDate: {
    type: Date,
    default: null
  },
  completedDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
deadlineSchema.index({ deadlineDate: 1 });
deadlineSchema.index({ status: 1 });
deadlineSchema.index({ caseId: 1 });
deadlineSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('Deadline', deadlineSchema);

