import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // Owning member. Not `required` so that legacy, owner-less tasks still load; the
    // controller always sets it and scopes every query by it.
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', index: true },
    taskDesc: {
      type: String,
      required: [true, 'Task description is required'],
      minlength: [5, 'Task description must be at least 5 characters long'],
      maxlength: [300, 'Task description must be at most 300 characters long'],
      trim: true,
    },
    taskStatus: {
      type: String,
      enum: ['In Progress', 'Pending'],
      required: [true, 'Task status is required'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
