import express from 'express';
import { 
  getSettings, 
  updateSettings, 
  getRelationshipDays,
  downloadAlbum,
  getPublicGallery,
  sendTestEmail
} from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, updateSettings);
router.get('/relationship-days', getRelationshipDays);
router.post('/download-album', protect, downloadAlbum);
router.get('/public/:token', getPublicGallery);
router.post('/test-email', protect, sendTestEmail);

export default router;
