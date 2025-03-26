import express from "express";
import dotenv from "dotenv";
import db from "./src/database/database.js";
import staffRouter from "./src/routes/staffRoutes.js";
import MembersRouter from './src/routes/MembersRoutes.js';
import announcementRoutes from './src/routes/announcementRoutes.js';
import equipementRoutes from './src/routes/equipmentRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import config from "./src/config/config.js";
import authRoutes from './src/routes/authRoutes.js';
import cors from "cors";
import adminRoutes from './src/routes/adminRoutes.js'
import contactRoutes from './src/routes/contactRoutes.js'

dotenv.config({ path: "./.env" });

const app = express();

// Ensure required environment variables are set
if (!process.env.PORT || !process.env.CONNECTION_STRING) {
  console.error("Missing required environment variables");
  process.exit(1);
}

// Database connection (ensure async/await handling)
const connectDatabase = async () => {
  try {
    await db(); // Assuming db() is async
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit if DB connection fails
  }
};

connectDatabase();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/member', MembersRouter);
app.use('/api/staff', staffRouter);
app.use('/api/announcement', announcementRoutes);
app.use('/api/equipment', equipementRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', contactRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Global Error Handler (catching unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = config.PORT || 7001; // Use the configured port or fallback

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
