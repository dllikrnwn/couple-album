import express from 'express';
import { 
  createMilestone, 
  getAllMilestones, 
  updateMilestone, 
  deleteMilestone 
} from '../controllers/milestoneController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createMilestone);
router.get('/', getAllMilestones);
router.put('/:id', protect, updateMilestone);
router.delete('/:id', protect, deleteMilestone);

export default router;
