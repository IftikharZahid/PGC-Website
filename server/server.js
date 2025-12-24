import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import coursesRouter from './routes/courses.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import admissionsRouter from './routes/admissions.js';
import resultsRouter from './routes/results.js';
import newsRouter from './routes/news.js';
import studentPortalRouter from './routes/student-portal.js';
import studentsRouter from './routes/students.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (async, but don't wait)
let isDbConnected = false;
connectDB().then(() => {
  isDbConnected = true;
}).catch((err) => {
  console.error('⚠️  Server started WITHOUT database connection');
  console.error('🔧 Login and data operations will fail until database connects');
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection Check Middleware (for API routes only)
app.use('/api', (req, res, next) => {
  // Check if mongoose is connected
  if (mongoose.connection.readyState !== 1) {
    console.error(`❌ Database not connected - Request to ${req.url} failed`);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again in a moment.',
      error: 'MongoDB is not connected. Check server logs for connection details.'
    });
  }
  next();
});

// Routes
app.use('/api/courses', coursesRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/admissions', admissionsRouter);
app.use('/api/results', resultsRouter);
app.use('/api/news', newsRouter);
app.use('/api/student-portal', studentPortalRouter);
app.use('/api/students', studentsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to College Management API',
    version: '1.0.0',
    endpoints: {
      courses: '/api/courses',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login'
      },
      admissions: 'POST /api/admissions'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
