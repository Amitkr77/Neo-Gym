import Member from '../model/Member.js';
import { pick } from '../middleware/validate.js';
import { hashPassword } from '../utils/password.js';
import { sendError } from '../utils/httpError.js';

// Fields an admin may set when creating or editing a member.
const ADMIN_EDITABLE = [
    'fullName', 'username', 'gender', 'contactNumber', 'address', 'dateOfRegistration',
    'amount', 'chosenService', 'plan', 'status', 'attendanceCount', 'initialWeight',
    'currentWeight', 'initialBodyType', 'currentBodyType', 'progressDate', 'reminder', 'paidDate',
];

// Fields a member may change on their own profile. Plan, status, amount, attendance and
// progress are gym-controlled and cannot be self-edited.
const SELF_EDITABLE = ['fullName', 'username', 'contactNumber', 'address'];

// Empty strings from HTML forms ("" for an unset number/date) are treated as "not provided".
const dropEmpty = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v !== null));

// ---------- Admin endpoints ----------

export const createUser = async (req, res) => {
    try {
        const body = req.body || {};
        const data = dropEmpty(pick(body, [...ADMIN_EDITABLE, 'password']));
        // The admin entry form sends the registration date as `dor`.
        if (!data.dateOfRegistration && body.dor) data.dateOfRegistration = body.dor;

        const newUser = await Member.create(data); // password hashed in pre-save hook
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        sendError(res, error, 'Error creating user');
    }
};

export const getAllUsers = async (_req, res) => {
    try {
        const users = await Member.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        sendError(res, error, 'Error retrieving users');
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await Member.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        sendError(res, error, 'Error retrieving user');
    }
};

export const updateUserById = async (req, res) => {
    try {
        const update = pick(req.body || {}, ADMIN_EDITABLE);
        // Admins may reset a member's password; it is always stored hashed.
        if (typeof req.body?.password === 'string' && req.body.password.length > 0) {
            if (req.body.password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }
            update.password = await hashPassword(req.body.password);
        }
        const updatedUser = await Member.findByIdAndUpdate(req.params.id, update, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        sendError(res, error, 'Error updating user');
    }
};

// Payments are intentionally kept: they are financial records. They retain `memberName`
// and the UI shows them as belonging to a deleted member.
export const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await Member.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        sendError(res, error, 'Error deleting user');
    }
};

export const setReminder = async (req, res) => {
    const { reminder } = req.body || {};
    if (typeof reminder !== 'boolean') {
        return res.status(400).json({ message: '`reminder` must be true or false' });
    }
    try {
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, { reminder }, { new: true });
        if (!updatedMember) return res.status(404).json({ message: 'Member not found' });
        res.status(200).json(updatedMember);
    } catch (error) {
        sendError(res, error, 'Error updating reminder');
    }
};

// ---------- Member self-service endpoints ----------

export const getMe = async (req, res) => {
    try {
        const me = await Member.findById(req.auth.id);
        if (!me) return res.status(404).json({ message: 'Account not found' });
        res.status(200).json(me);
    } catch (error) {
        sendError(res, error);
    }
};

export const updateMe = async (req, res) => {
    try {
        const update = pick(req.body || {}, SELF_EDITABLE);
        const me = await Member.findByIdAndUpdate(req.auth.id, update, { new: true, runValidators: true });
        if (!me) return res.status(404).json({ message: 'Account not found' });
        res.status(200).json({ message: 'Profile updated successfully', user: me });
    } catch (error) {
        sendError(res, error, 'Error updating profile');
    }
};

// A member may dismiss (turn off) their own reminder, but not turn reminders on.
export const dismissMyReminder = async (req, res) => {
    try {
        const me = await Member.findByIdAndUpdate(req.auth.id, { reminder: false }, { new: true });
        if (!me) return res.status(404).json({ message: 'Account not found' });
        res.status(200).json(me);
    } catch (error) {
        sendError(res, error);
    }
};
