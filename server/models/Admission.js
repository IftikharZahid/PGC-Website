import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  academic: {
    previousSchool: { type: String, required: true },
    graduationYear: { type: String, required: true },
    gpa: { type: String, required: true }
  },
  program: {
    desiredCourse: { type: String, required: true },
    preferredTerm: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'accepted', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate application ID before saving
// Auto-generate application ID before saving
admissionSchema.pre('save', async function() {
  if (this.isNew && !this.applicationId) {
    const year = new Date().getFullYear();
    const randomId = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    this.applicationId = `ADM-${year}-${randomId}`;
  }
});

// Remove __v from JSON output
admissionSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Admission = mongoose.model('Admission', admissionSchema);

export default Admission;
