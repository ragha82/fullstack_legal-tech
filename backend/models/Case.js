const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  caseType: {
    type: String,
    required: true,
    enum: ['Criminal', 'Civil', 'Corporate', 'Family', 'Intellectual Property', 'Employment', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'On Hold', 'Closed', 'Archived'],
    default: 'Open'
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  assignedLawyer: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expectedEndDate: {
    type: Date,
    default: null
  },
  actualEndDate: {
    type: Date,
    default: null
  },
  description: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  estimatedHours: {
    type: Number,
    default: 0
  },
  billedHours: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
caseSchema.index({ status: 1 });
caseSchema.index({ caseType: 1 });
caseSchema.index({ clientName: 1 });
caseSchema.index({ assignedLawyer: 1 });

module.exports = mongoose.model('Case', caseSchema);

