import express from "express";
import { requireAdmin } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validate.js';
import { getAllEquipment, createEquipment, deleteEquipment, updateEquipment } from "../controllers/equipmentController.js"

const router = express.Router();
router.use(requireAdmin); // equipment inventory is admin-only

// Route to get all equipment
router.get("/", getAllEquipment);

// Route to create new equipment
router.post("/", createEquipment);

// Route to update equipment by ID
router.put("/:id", validateObjectId(), updateEquipment);

// Route to delete equipment by ID
router.delete("/:id", validateObjectId(), deleteEquipment);

export default router
