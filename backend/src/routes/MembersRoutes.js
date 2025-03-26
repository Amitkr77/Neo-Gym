import express from 'express';
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/UserConroller.js'; 
import Member from '../model/Member.js';

const MembersRouter = express.Router();

// Routes
MembersRouter.post('/users', createUser);
MembersRouter.get('/users', getAllUsers);
MembersRouter.get('/users/:id', getUserById);
MembersRouter.put('/users/:id', updateUserById);
MembersRouter.delete('/users/:id', deleteUserById);

// PUT route to toggle reminder
MembersRouter.put("/users/:id/reminder", async (req, res) => {
    const { id } = req.params;
    const { reminder } = req.body;
  
    try {
      // Find the member by ID and update the reminder field
      const updatedMember = await Member.findByIdAndUpdate(
        id,
        { reminder }, // Update the reminder field
        { new: true }  // Return the updated member document
      );
  
      // If member is not found, return an error
      if (!updatedMember) {
        return res.status(404).json({ message: "Member not found" });
      }
  
      // Successfully updated
      return res.status(200).json(updatedMember);
    } catch (error) {
      // Log the full error message for debugging purposes
      console.error("Error details:", error);
      return res.status(500).json({
        message: "Error updating reminder",
        error: error.message, // Return the actual error message
      });
    }
  });
  

export default MembersRouter;
