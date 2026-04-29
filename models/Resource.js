const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A resource must have a title'],
    trim: true,
    maxlength: [100, 'A resource title must have less or equal then 100 characters']
  },
  description: {
    type: String,
    required: [true, 'A resource must have a description']
  },
  category: {
    type: String,
    required: [true, 'A resource must belong to a category'],
    enum: [
      'Notes',
      'PYQs',
      'Lab Manuals',
      'Placement Preparation',
      'Resume Templates',
      'Coding Sheets',
      'Interview Experiences',
      'Projects'
    ]
  },
  fileUrl: {
    type: String,
    required: [true, 'A resource must have an attached file']
  },
  uploader: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A resource must belong to a user']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  downloads: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
