import mongoose from 'mongoose';

const admissionNotificationSchema = new mongoose.Schema({
    session: {
        type: String,
        trim: true,
        default: 'Session 2025-2027'
    },
    requirements: {
        type: [String],
        default: [
            'Matriculation / O-Level Result Card',
            'Character Certificate',
            'CNIC / B-Form of Student',
            'CNIC of Father/Guardian',
            'Recent Photographs (Passport size)'
        ]
    },
    importantNote: {
        type: String,
        trim: true,
        default: 'Please bring original documents along with photocopies to the admission office.'
    },
    buttonText: {
        type: String,
        trim: true,
        default: 'Continue to Application'
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

admissionNotificationSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

const AdmissionNotification = mongoose.model('AdmissionNotification', admissionNotificationSchema);

export default AdmissionNotification;
