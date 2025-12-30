import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        minlength: 6,
        select: false // Don't return password by default
    },
    phone: {
        type: String,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    qualification: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    subjects: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive']
    },
    image: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'teacher'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
teacherSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
teacherSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
teacherSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;

