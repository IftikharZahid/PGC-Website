import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: [true, 'Course ID is required'],
        unique: true,
        trim: true
    },
    courseName: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    semesters: {
        type: Number,
        default: 4,
        min: 1,
        max: 8
    },
    subjects: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
