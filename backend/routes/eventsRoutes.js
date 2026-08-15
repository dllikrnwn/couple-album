import express from 'express';
import {
  getMonthEvents,
  getDayEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  checkRemindersCron,
} from '../controllers/eventsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/month', protect, getMonthEvents);
router.get('/', protect, getDayEvents);
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/check-reminders-cron', (req, res, next) => {
  const secret = req.headers['x-cron-secret'];
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}, checkRemindersCron);

export default router;
