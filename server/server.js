import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import coursesRouter from './routes/courses.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import admissionsRouter from './routes/admissions.js';
import resultsRouter from './routes/results.js';
import newsRouter from './routes/news.js';
import studentPortalRouter from './routes/student-portal.js';
import studentsRouter from './routes/students.js';
import teachersRouter from './routes/teachers.js';
import videoLecturesRouter from './routes/video-lectures.js';
import attendanceRouter from './routes/attendance.js';
import notificationsRouter from './routes/notifications.js';
import admissionNotificationRouter from './routes/admissionNotification.js';
import settingsRouter from './routes/settings.js';

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
// CORS Configuration - Restrict origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression - Reduces response size by ~70%
app.use(compression());

// Security Enhancements
// 1. Set Security HTTP Headers
app.use(helmet());

// 2. Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// 3. Data Sanitization against XSS
app.use(xss());

// 4. Prevent Parameter Pollution
app.use(hpp());

// 5. Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per 10 mins
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 10 minutes.'
  }
});
app.use('/api', limiter);

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
app.use('/api/teachers', teachersRouter);
app.use('/api/video-lectures', videoLecturesRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admission-notification', admissionNotificationRouter);
app.use('/api/settings', settingsRouter);

// Serve static files from React build (Production)
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// API Root endpoint
app.get('/api', (req, res) => {
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

// Handle React routing - send all non-API requests to index.html (Production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

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
