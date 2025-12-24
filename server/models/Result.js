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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Result = mongoose.model('Result', ResultSchema);
export default Result;
