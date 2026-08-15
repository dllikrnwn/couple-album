import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import { verifyEmailConfig } from './services/emailService.js';
import { initCronJobs } from './jobs/noteJobs.js';
import fs from 'fs';
import path from 'path';

// Import routes
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if not exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Create public assets directory if not exists
const assetsDir = path.join(process.cwd(), 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Serve static assets (themes, frames, stickers)
app.use('/assets', express.static(path.join(process.cwd(), 'public', 'assets')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start server
const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('⚠️  Database connection failed. Please check your .env file');
      process.exit(1);
    }

    // Verify email configuration (optional - won't stop server if fails)
    await verifyEmailConfig();

    // Initialize cron jobs for note unlocking & reminders
    initCronJobs();

    app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log('🚀 Server running on port', PORT);
      console.log('📝 Environment:', process.env.NODE_ENV || 'development');
      console.log('🌐 Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:5173');
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
