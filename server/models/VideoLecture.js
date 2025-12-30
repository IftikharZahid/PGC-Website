import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    lessonId: {
        type: Number
    },
    title: {
        type: String,
        trim: true
    },
    videoId: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        default: '0:00'
    },
    description: {
        type: String,
        default: ''
    }
}, { _id: false });

const videoLectureSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    lessons: {
        type: [lessonSchema],
        default: []
    },
    order: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const VideoLecture = mongoose.model('VideoLecture', videoLectureSchema);

export default VideoLecture;
