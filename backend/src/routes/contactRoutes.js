// routes/contactRoutes.js
import express from 'express'
import { submitContactForm, getContactForms } from '../controllers/contactController.js';
const router = express.Router();
// POST route to submit contact form data
router.post("/contact", submitContactForm);
router.get("/contact", getContactForms)
export default router

