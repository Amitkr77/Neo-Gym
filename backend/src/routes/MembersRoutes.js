import express from 'express';
import {
    createUser, getAllUsers, getUserById, updateUserById, deleteUserById, setReminder,
    getMe, updateMe, dismissMyReminder,
} from '../controllers/UserConroller.js';
import { requireAdmin, requireMember } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validate.js';

const MembersRouter = express.Router();

// Member self-service (identity comes from the token, never from the URL).
MembersRouter.get('/me', requireMember, getMe);
MembersRouter.put('/me', requireMember, updateMe);
MembersRouter.put('/me/reminder/dismiss', requireMember, dismissMyReminder);

// Admin management.
MembersRouter.post('/users', requireAdmin, createUser);
MembersRouter.get('/users', requireAdmin, getAllUsers);
MembersRouter.get('/users/:id', requireAdmin, validateObjectId(), getUserById);
MembersRouter.put('/users/:id', requireAdmin, validateObjectId(), updateUserById);
MembersRouter.delete('/users/:id', requireAdmin, validateObjectId(), deleteUserById);
MembersRouter.put('/users/:id/reminder', requireAdmin, validateObjectId(), setReminder);

export default MembersRouter;
