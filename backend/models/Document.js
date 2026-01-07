const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: [
        'Contract',
        'Agreement',
        'Legal Brief',
        'Court Filing',
        'Compliance Report',
        'Passport',
        'ID Card',
        'PAN Card',
        'Aadhaar Card',
      'Driving License',
        'Other',
      ],
      default: 'Other',
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Review', 'Approved', 'Rejected', 'Archived'],
      default: 'Pending',
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      default: null,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedDate: {
      type: Date,
      default: Date.now,
    },
    reviewDate: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    description: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      default: '',
    },
    // Smart upload metadata
    documentCategory: {
      type: String,
      default: 'General',
    },
    uploadedByEmail: {
      type: String,
      trim: true,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Expired', 'Invalid', 'Unknown'],
      default: 'Pending',
    },
    verificationDetails: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
documentSchema.index({ status: 1 });
documentSchema.index({ caseId: 1 });
documentSchema.index({ clientName: 1 });

module.exports = mongoose.model('Document', documentSchema);

