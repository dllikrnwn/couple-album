import express from 'express';
import { 
  createNote, 
  getMyNotes, 
  getPartnerNotes, 
  unlockNotes,
  deleteNote,
  getMonthlyNotes,
  getNoteAssets
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createNote);
router.get('/my-notes', protect, getMyNotes);
router.get('/partner-notes', protect, getPartnerNotes);
router.get('/monthly', getMonthlyNotes);
router.get('/assets', getNoteAssets);
router.post('/unlock', protect, unlockNotes);
router.post('/unlock-cron', (req, res, next) => {
  const secret = req.headers['x-cron-secret'];
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}, unlockNotes);
router.delete('/:id', protect, deleteNote);

export default router;
