import Task from "../model/taskSchema.js";
import { sendError } from "../utils/httpError.js";

// All task operations are scoped to the logged-in member (req.auth.id).
// Previously tasks were global: any member could see and delete everyone's tasks.
const own = (req, extra = {}) => ({ owner: req.auth.id, ...extra });

export const createTask = async (req, res) => {
  const { taskDesc, taskStatus } = req.body || {};
  if (typeof taskDesc !== 'string' || typeof taskStatus !== 'string') {
    return res.status(400).json({ message: 'Both task description and status are required.' });
  }
  try {
    const newTask = await Task.create(own(req, { taskDesc, taskStatus }));
    res.status(201).json(newTask);
  } catch (error) {
    sendError(res, error, 'Failed to create task');
  }
};

export const getTasks = async (req, res) => {
  try {
    res.status(200).json(await Task.find(own(req)).sort({ createdAt: -1 }));
  } catch (error) {
    sendError(res, error, 'Failed to fetch tasks');
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne(own(req, { _id: req.params.id }));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    sendError(res, error, 'Failed to fetch task');
  }
};

export const updateTask = async (req, res) => {
  const update = {};
  if (typeof req.body?.taskDesc === 'string') update.taskDesc = req.body.taskDesc;
  if (typeof req.body?.taskStatus === 'string') update.taskStatus = req.body.taskStatus;
  try {
    const task = await Task.findOneAndUpdate(own(req, { _id: req.params.id }), update, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    sendError(res, error, 'Failed to update task');
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete(own(req, { _id: req.params.id }));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    sendError(res, error, 'Failed to delete task');
  }
};
