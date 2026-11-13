import Staff from "../model/Staff.js";
import { sendError } from "../utils/httpError.js";

// Create a new staff member
export const createStaff = async (req, res) => {
    try {
        const staff = new Staff(req.body);
        await staff.save();
        res.status(201).json(staff);
    } catch (error) {
        sendError(res, error);
    }
};

// Get all staff members
export const getAllStaff = async (req, res) => {
    try {
        const staffMembers = await Staff.find();
        res.status(200).json(staffMembers);
    } catch (error) {
        sendError(res, error);
    }
};

// Get a staff member by ID
export const getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });
        res.status(200).json(staff);
    } catch (error) {
        sendError(res, error);
    }
};

// Update a staff member by ID
export const updateStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!staff) return res.status(404).json({ message: 'Staff not found' });
        res.status(200).json(staff);
    } catch (error) {
        sendError(res, error);
    }
};

// Delete a staff member by ID
export const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });
        res.status(204).send(); // No content to send back
    } catch (error) {
        sendError(res, error);
    }
};
