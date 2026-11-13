import mongoose from "mongoose";

const db = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.CONNECTION_STRING}`);
    console.log(`Database connected : ${connection.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export default db;
