import express from 'express';
import { createAdmin, loginAdmin, getCurrentAdmin, getSetupStatus } from '../controllers/adminController.js';
import { Admin } from '../model/AdminModel.js';
import { requireAdmin } from '../middleware/auth.js';
import { rateLimit } from '../middleware/validate.js';

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: () => Number(process.env.LOGIN_RATE_LIMIT) || 10,
    message: 'Too many login attempts. Please wait 15 minutes and try again.',
});

// Registration is open only for the very first admin (initial setup). Once an admin exists,
// only a logged-in admin can create further admins.
const bootstrapOrAdmin = async (req, res, next) => {
    try {
        if ((await Admin.estimatedDocumentCount()) === 0) return next();
    } catch (error) {
        return next(error);
    }
    const [auth, role] = requireAdmin;
    return auth(req, res, () => role(req, res, next));
};

router.get('/setup-status', getSetupStatus);
router.post('/register', bootstrapOrAdmin, createAdmin);
router.post('/login', loginLimiter, loginAdmin);
router.get('/me', requireAdmin, getCurrentAdmin);

export default router;
