import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: false
  },
  session: {
    type: String,
    required: false
  },
  marks: {
    type: Map,
    of: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Result = mongoose.model('Result', ResultSchema);
export default Result;
