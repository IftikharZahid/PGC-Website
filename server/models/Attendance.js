import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        trim: true
    },
    class: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Leave'],
        default: 'Present'
    },
    markedBy: {
        type: String,
        default: 'admin'
    },
    remarks: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient queries
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });
attendanceSchema.index({ class: 1, date: 1 });
attendanceSchema.index({ date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
