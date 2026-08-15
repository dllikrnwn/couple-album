import dotenv from 'dotenv';
import app from './app.js';
import { testConnection } from './config/db.js';
import { verifyEmailConfig } from './services/emailService.js';
import { initCronJobs } from './jobs/noteJobs.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('⚠️  Database connection failed. Please check your .env file');
      process.exit(1);
    }

    await verifyEmailConfig();
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
