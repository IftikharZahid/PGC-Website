import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true // Add index for faster search
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: false,
    trim: true
  },
  class: {
    type: String,
    required: true
  },
  session: {
    type: String,
    required: true
  },
  marks: {
    type: Map,
    of: Number,
    required: true
  },
  maxMarks: {
    type: Map,
    of: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  obtainedMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true // Index for filtering published results
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update timestamp on save
// Update timestamp on save
ResultSchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

const Result = mongoose.model('Result', ResultSchema);
export default Result;
