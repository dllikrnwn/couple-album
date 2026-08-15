import express from 'express';
import { 
  uploadMedia, 
  getAllMedia, 
  getApprovedMedia, 
  getPendingMedia,
  updateMediaStatus, 
  deleteMedia,
  updateMediaVisibility,
  getMonthlyMedia,
  getAvailableMonths
} from '../controllers/mediaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/upload', protect, uploadMedia);
router.get('/all', protect, getAllMedia);
router.get('/approved', getApprovedMedia);
router.get('/monthly', getMonthlyMedia);
router.get('/available-months', getAvailableMonths);
router.get('/pending', protect, getPendingMedia);
router.patch('/:id/status', protect, updateMediaStatus);
router.patch('/:id/visibility', protect, updateMediaVisibility);
router.delete('/:id', protect, deleteMedia);

export default router;
