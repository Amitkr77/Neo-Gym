import express from 'express';
import { createAnnouncement, getAllAnnouncements, deleteAnnouncement } from '../controllers/announcementController.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getAllAnnouncements); // public notices
router.post('/', requireAdmin, createAnnouncement);
router.delete('/:id', requireAdmin, validateObjectId(), deleteAnnouncement);

export default router;
