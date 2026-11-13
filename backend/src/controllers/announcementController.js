// controllers/announcementController.js
import Announcement from '../model/Announcement.js';
import { sendError } from '../utils/httpError.js';

// Create a new Announcement
export const createAnnouncement = async (req, res) => {
    try {
        const { message, appliedDate } = req.body || {};
        if (typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Announcement message is required' });
        }
        
        // An empty date from the form means "today" (the schema default), not "invalid".
        const newAnnouncement = new Announcement({ message, appliedDate: appliedDate || undefined });

        await newAnnouncement.save();
        
        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: newAnnouncement,
        });
    } catch (error) {
        sendError(res, error);
    }
};

// Get all Announcements
export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ appliedDate: -1 });
        
        res.status(200).json({
            success: true,
            data: announcements,
        });
    } catch (error) {
        sendError(res, error);
    }
};

// Delete an Announcement by ID
export const deleteAnnouncement = async (req, res) => {
    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
        
        if (!deletedAnnouncement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully',
        });
    } catch (error) {
        sendError(res, error);
    }
};
