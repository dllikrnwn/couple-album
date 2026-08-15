import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/events', eventsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
