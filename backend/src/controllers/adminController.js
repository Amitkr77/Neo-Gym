import { Admin } from '../model/AdminModel.js';
import { signToken, ROLES } from '../middleware/auth.js';
import { verifyPassword, hashPassword } from '../utils/password.js';
import { sendError } from '../utils/httpError.js';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

// Create a new admin.
// Route-level guard: open only while no admin exists (first-run bootstrap); afterwards an
// authenticated admin is required (see routes/adminRoutes.js).
export const createAdmin = async (req, res) => {
    const { fullname, email, password } = req.body || {};

    if (![fullname, email, password].every(isNonEmptyString)) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Admin password must be at least 8 characters long' });
    }

    try {
        if (await Admin.exists({ email: email.trim().toLowerCase() })) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const newAdmin = await Admin.create({
            fullname,
            email,
            password: await hashPassword(password),
        });

        res.status(201).json({
            message: 'Admin created successfully',
            admin: { id: newAdmin._id, fullname: newAdmin.fullname, email: newAdmin.email },
        });
    } catch (error) {
        sendError(res, error, 'Server error');
    }
};

// Admin login. Returns an admin-scoped JWT. The same message is used for an unknown email
// and a wrong password, so the response does not reveal which accounts exist.
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body || {};

    if (!isNonEmptyString(email) || typeof password !== 'string') {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    try {
        const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select('+password');
        const { ok, legacy } = await verifyPassword(password, admin?.password);
        if (!admin || !ok) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Legacy plaintext admin passwords are hashed transparently on first successful login.
        if (legacy) {
            await Admin.updateOne({ _id: admin._id }, { password: await hashPassword(password) });
        }

        res.status(200).json({
            message: 'Login successful',
            token: signToken(admin._id, ROLES.ADMIN),
            admin: { id: admin._id, fullname: admin.fullname, email: admin.email },
        });
    } catch (error) {
        sendError(res, error, 'Server error');
    }
};

// Current admin profile (used by the admin UI to validate a stored session).
export const getCurrentAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.auth.id);
        if (!admin) return res.status(401).json({ message: 'Session is no longer valid' });
        res.status(200).json({ admin: { id: admin._id, fullname: admin.fullname, email: admin.email } });
    } catch (error) {
        sendError(res, error);
    }
};

// Whether the first-run admin registration is still open (lets the UI hide the sign-up link).
export const getSetupStatus = async (_req, res) => {
    try {
        res.status(200).json({ registrationOpen: (await Admin.estimatedDocumentCount()) === 0 });
    } catch (error) {
        sendError(res, error);
    }
};
