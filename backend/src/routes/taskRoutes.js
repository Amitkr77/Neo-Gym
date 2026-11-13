import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';
import { requireMember } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validate.js';

const router = express.Router();

// Personal to-do list: every route is scoped to the logged-in member.
router.use(requireMember);
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', validateObjectId(), getTaskById);
router.put('/:id', validateObjectId(), updateTask);
router.delete('/:id', validateObjectId(), deleteTask);

export default router;
