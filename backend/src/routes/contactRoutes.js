import express from 'express'
import { submitContactForm, getContactForms } from '../controllers/contactController.js';
import { requireAdmin } from '../middleware/auth.js';
import { rateLimit } from '../middleware/validate.js';

const router = express.Router();
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: () => Number(process.env.CONTACT_RATE_LIMIT) || 10 });

router.post("/contact", contactLimiter, submitContactForm); // public enquiry form
router.get("/contact", requireAdmin, getContactForms);    // enquiries contain PII: admin only
export default router
