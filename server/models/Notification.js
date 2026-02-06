import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'Admissions Open'
    },
    session: {
        type: String,
        trim: true,
        default: 'Fall 2026 Session'
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    buttonText: {
        type: String,
        trim: true,
        default: 'Apply Now'
    },
    buttonLink: {
        type: String,
        trim: true,
        default: '/admissions'
    },
    imageUrl: {
        type: String,
        trim: true,
        default: ''
    },
    enabled: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on every save
notificationSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
