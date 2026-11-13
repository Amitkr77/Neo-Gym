import express from 'express';
import {
    createPayment, getAllPayment, getPaymentsForMember, getPaymentById, getMyPayments,
} from '../controllers/paymentController.js';
import { requireAdmin, requireMember } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validate.js';

const router = express.Router();

router.get('/me', requireMember, getMyPayments);

router.post('/', requireAdmin, createPayment);
router.get('/', requireAdmin, getAllPayment);
router.get('/member/:memberId', requireAdmin, validateObjectId('memberId'), getPaymentsForMember);
router.get('/:id', requireAdmin, validateObjectId(), getPaymentById);

export default router;
