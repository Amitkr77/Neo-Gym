import express from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validate.js';
import {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
} from '../controllers/staffController.js';

const staffRouter = express.Router();
staffRouter.use(requireAdmin); // staff records are admin-only

// Create a new staff member
staffRouter.post('/', createStaff);

// Get all staff members
staffRouter.get('/', getAllStaff);

// Get a staff member by ID
staffRouter.get('/:id', validateObjectId(), getStaffById);

// Update a staff member by ID
staffRouter.put('/:id', validateObjectId(), updateStaff);

// Delete a staff member by ID
staffRouter.delete('/:id', validateObjectId(), deleteStaff);

export default staffRouter;
